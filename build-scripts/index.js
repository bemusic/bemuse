const yargs = require('yargs')
const execa = require('execa')
const vfs = require('vinyl-fs')
const fs = require('fs')
const merge = require('merge-stream')
const rename = require('gulp-rename')

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
      await run('yarn workspace bemuse build')
      await run('yarn workspace bemuse-docs build')
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
          rename(function(path) {
            path.dirname = 'project/' + path.dirname
          })
        )
      )
      const seen = new Set()
      const dest = stream.pipe(vfs.dest('dist'))
      dest.on('data', file => {
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
  .parse()

async function run(shellCommand) {
  console.error(`Running: "${shellCommand}"`)
  await execa(shellCommand, {
    shell: true,
    stdio: 'inherit',
  })
}
