import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import pug from 'pug'
import peg from 'pegjs'

const src = path.resolve(__dirname, 'src')

// Resolve node-polyfills shim entry points to absolute paths. The plugin
// injects `import ... from 'vite-plugin-node-polyfills/shims/<x>'` into every
// module that references Buffer/process/global — including linked workspace
// packages (packages/bemuse-notechart etc.) whose own node_modules can't
// resolve the shim under pnpm. Aliasing to absolute paths fixes resolution.
const require = createRequire(import.meta.url)
const polyfillShimAlias = ['buffer', 'global', 'process'].map((name) => ({
  find: `vite-plugin-node-polyfills/shims/${name}`,
  replacement: require.resolve(`vite-plugin-node-polyfills/shims/${name}`),
}))

// ---------------------------------------------------------------------------
// Build config (reimplements bemuse/config/buildConfig.js as define values)
// ---------------------------------------------------------------------------
function computeBuildConfig() {
  let name = 'Bemuse'
  const pkg = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
  )
  let version = pkg.version.replace(/\.0$/, '').replace(/\.0$/, '')
  const gitRevision = () => {
    try {
      return execSync('git rev-parse --short HEAD').toString().trim()
    } catch {
      return 'unknown'
    }
  }
  if (process.env.CONTEXT === 'deploy-preview') {
    name += 'DevMode'
    if (process.env.DEPLOY_PRIME_URL) {
      const m = process.env.DEPLOY_PRIME_URL.match(/\/\/(.*?)--/)
      if (m) version += `[${m[1]}]`
    }
    version += '@' + gitRevision()
  } else if (process.env.CONTEXT === 'production') {
    name += 'DevMode'
    version += '+next[staging]@' + gitRevision()
  } else if (!process.env.CI) {
    name += 'DevMode'
    version += '+local'
  }
  return { name, version }
}

const buildConfig = computeBuildConfig()

// ---------------------------------------------------------------------------
// Plugin: compile .jade (pug) templates to callable JS functions
// ---------------------------------------------------------------------------
function pugTemplatePlugin() {
  return {
    name: 'bemuse-pug-template',
    transform(code: string, id: string) {
      if (!id.endsWith('.jade') && !id.endsWith('.pug')) return
      const fn = pug.compileClient(code, {
        compileDebug: false,
        filename: id,
      })
      return {
        code: `${fn}\nexport default template;`,
        map: null,
      }
    },
  }
}

// ---------------------------------------------------------------------------
// Plugin: compile .pegjs grammars to an ESM parser module
// ---------------------------------------------------------------------------
function pegjsPlugin() {
  return {
    name: 'bemuse-pegjs',
    transform(code: string, id: string) {
      if (!id.endsWith('.pegjs')) return
      const source = peg.generate(code, {
        output: 'source',
        format: 'bare',
      } as any)
      return {
        code: `export default ${source}`,
        map: null,
      }
    },
  }
}

// ---------------------------------------------------------------------------
// Plugin: allow JSX syntax inside `.js` files (the codebase authored JSX in
// plain .js files, which webpack's ts-loader accepted but Vite's esbuild
// treats as plain JS by default).
// ---------------------------------------------------------------------------
function jsAsJsxPlugin() {
  return {
    name: 'bemuse-js-as-jsx',
    async transform(code: string, id: string) {
      const [file] = id.split('?')
      if (!/\/src\/.*\.js$/.test(file)) return null
      if (/\/vendor\//.test(file)) return null
      return transformWithEsbuild(code, id, {
        loader: 'jsx',
        jsx: 'automatic',
      })
    },
  }
}

// ---------------------------------------------------------------------------
// Plugin: SSI include + boot-script handling for index.html
// Resolves <!--#include file="includes/x.inc"--> against public/ dir.
// ---------------------------------------------------------------------------
function ssiIncludePlugin() {
  return {
    name: 'bemuse-ssi-include',
    transformIndexHtml: {
      order: 'pre' as const,
      handler(html: string) {
        return html.replace(
          /<!--\s*#include file="([^"]+)"\s*-->/g,
          (_m, file) => {
            const p = path.resolve(__dirname, 'public', file)
            try {
              return fs.readFileSync(p, 'utf-8')
            } catch {
              return ''
            }
          }
        )
      },
    },
  }
}

export default defineConfig(({ command }) => ({
  root: __dirname,
  base: '/',
  publicDir: path.resolve(__dirname, 'public'),
  resolve: {
    alias: [
      ...polyfillShimAlias,
      // CSS url(~bemuse/...) and any residual ~bemuse imports
      { find: /^~bemuse\//, replacement: src + '/' },
      { find: /^bemuse\//, replacement: src + '/' },
    ],
    extensions: ['.web.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  define: {
    __BEMUSE_VERSION__: JSON.stringify(buildConfig.version),
    __BEMUSE_NAME__: JSON.stringify(buildConfig.name),
    __SCOREBOARD_SERVER__: JSON.stringify(process.env.SCOREBOARD_SERVER || ''),
    // Provide a webpack-like process.env for the small number of references
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || (command === 'build' ? 'production' : 'development')
    ),
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        loadPaths: [src],
        // silence deprecation noise from @import etc.
        quietDeps: true,
        silenceDeprecations: [
          'import',
          'legacy-js-api',
          'global-builtin',
          'color-functions',
          'mixed-decls',
        ],
      },
    },
  },
  worker: {
    format: 'es',
  },
  plugins: [
    jsAsJsxPlugin(),
    pugTemplatePlugin(),
    pegjsPlugin(),
    ssiIncludePlugin(),
    react(),
    nodePolyfills({
      include: [
        'assert',
        'buffer',
        'crypto',
        'events',
        'path',
        'stream',
        'util',
      ],
      globals: {
        Buffer: true,
        process: true,
        global: true,
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,woff,woff2,ttf,ogg}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        // The original webpack ServiceWorkerPlugin left navigateFallback
        // disabled. Keep it disabled so the SW does not hijack navigations to
        // the separate /project/ Docusaurus site (served statically).
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: /^.*\.bemuse$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'bemuse-song-assets',
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: /^.*\.(bms|bme|bml|bmson)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'bemuse-song-charts',
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: /^.*\/index\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'bemuse-servers',
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: /^.*\/metadata\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'bemuse-song-assets',
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: /^\/skins\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'bemuse-skin',
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: /^\/res\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'bemuse-res',
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
  ],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 5000,
    sourcemap: false,
    commonjsOptions: {
      // Linked workspace packages (bms, monetizer, bemuse-notechart, ...) are
      // CommonJS but live under packages/ (not node_modules/), so the default
      // commonjs interop skips them and their named exports are invisible.
      include: [/node_modules/, /packages\//],
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    // Force pre-bundling of the linked CJS workspace packages so their named
    // exports resolve. (bemuse-types is intentionally excluded — it is a
    // types-only package with no runtime entry.)
    include: [
      'bms',
      'bmson',
      'monetizer',
      'bemuse-indexer',
      'bemuse-notechart',
    ],
    esbuildOptions: {
      // The dep-scanner esbuild pass (dev server) does not run the
      // js-as-jsx Vite plugin, so tell it directly that `.js` may contain JSX.
      loader: { '.js': 'jsx' },
    },
  },
  server: {
    port: 8080,
    fs: {
      // Allow importing repo-root CHANGELOG.md (outside the bemuse/ root)
      allow: [path.resolve(__dirname, '..'), __dirname],
    },
  },
}))
