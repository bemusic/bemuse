const yargs = require('yargs')
const execa = require('execa')
const vfs = require('vinyl-fs')
const fs = require('fs')
const merge = require('merge-stream')
const rename = require('gulp-rename')
const ghpages = require('gh-pages')

yargs
  .demandCommand()
  .strict()
  .help()
  .command(
    'build',
    'Builds Bemuse project into a distributable bundle',
    {},
    async () => {
      process.env.NODE_ENV = 'production'
      await run(
        'node common/scripts/install-run-rush.js build --to bemuse --to bemuse-docs'
      )
      await run('node build-scripts build:dist')
    }
  )
  .command(
    'build:dist',
    'Compiles built stuff from subprojects into one dist folder',
    {},
    async () => {
      const stream = merge(
        vfs.src('public/**'),
        vfs.src('bemuse/dist/**'),
        vfs.src('website/build/bemuse/**').pipe(
          rename(function (path) {
            path.dirname = 'project/' + path.dirname
          })
        )
      )
      const seen = new Set()
      const dest = stream.pipe(vfs.dest('dist'))
      dest.on('data', (file) => {
        if (file.isDirectory()) {
          return
        }
        if (seen.has(file.path)) {
          throw new Error('Duplicate file detected: ' + file.path)
        }
        seen.add(file.path)
      })
      dest.on('end', () => {
        console.log('Done copying %s files.', seen.size)
      })
    }
  )
  .command('pre-deploy', 'Performs a pre-deploy check', {}, async () => {
    const data = fs.readFileSync('dist/index.html', 'utf-8')
    check('New Relic inlined', () => /NREUM/.test(data))
    check('Boot script inlined', () => /webpackJsonp/.test(data))
    check('Google Analytics inlined', () => /GoogleAnalyticsObject/.test(data))

    function check(title, condition) {
      if (condition()) {
        console.log('[OK!!]', title)
      } else {
        console.log('[FAIL]', title)
        throw new Error('Pre-deploy check error: ' + title)
      }
    }
  })
  .command('release', 'Release a new version of Bemuse', {}, async () => {
    await run('git fetch')
    await run('git checkout origin/master')
    await run('git branch -d master || true')
    await run('git checkout -b master')
    await run('node build-scripts release:changelog')
    await run(
      "git commit -a -m 'Remove prerelease version suffixes from CHANGELOG.md' || true"
    )
    const version = await exec('node build-scripts release:get-next-version')
    await run(`yarn lerna version "${version}"`)
  })
  .command(
    'release:changelog',
    'Remove prerelease version suffixes from CHANGELOG.md',
    {},
    async () => {
      const data = fs.readFileSync('CHANGELOG.md', 'utf8')
      const date = new Date().toJSON().split('T')[0]
      fs.writeFileSync(
        'CHANGELOG.md',
        data.replace(/(## v[\d.]+?)(?:\.0)?(?:\.0)?-pre\.\d+/g, `$1 (${date})`)
      )
    }
  )
  .command(
    'release:get-next-version',
    'Prints the version of the upcoming release',
    {},
    async () => {
      const { version } = JSON.parse(
        fs.readFileSync('bemuse/package.json', 'utf8')
      )
      console.log(version.replace(/-.*/, ''))
    }
  )
  .command(
    'deploy',
    'Deploys the `dist` directory to GitHub Pages',
    {},
    async () => {
      await new Promise((resolve, reject) => {
        ghpages.publish(
          'dist',
          {
            branch: 'master',
            remote: 'www',
            message: `Update ${new Date().toJSON()}`,
          },
          function (err) {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          }
        )
      })
    }
  )
  .parse()

async function run(shellCommand) {
  console.error(`Running: "${shellCommand}"`)
  await execa(shellCommand, {
    shell: true,
    stdio: 'inherit',
  })
}

async function exec(shellCommand) {
  console.error(`Running: "${shellCommand}"`)
  const result = await execa(shellCommand, {
    shell: true,
  })
  return result.stdout
}
