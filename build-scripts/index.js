const yargs = require('yargs')
const execa = require('execa')
const vfs = require('vinyl-fs')
const fs = require('fs')
const merge = require('merge-stream')
const rename = require('gulp-rename')
const ghpages = require('gh-pages')
const { z } = require('zod')
const glob = require('glob')
const matter = require('gray-matter')
const semverInc = require('semver/functions/inc')
const semverGt = require('semver/functions/gt')
const tempWrite = require('temp-write')
const { updateChangelog, getReleaseChangelog } = require('./lib/changelog')

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

      // Builds inside CircleCI sees 36 cores. This causes the build to fail
      // due to out-of-memory error because Rush tries to build everything at
      // once. We limit the parallelism to 2 to avoid this.
      const parallel = process.env.CIRCLE_BUILD_NUM ? ' --parallelism 2' : ''

      await run(
        `node common/scripts/install-run-rush.js build --to bemuse --to bemuse-docs${parallel}`
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
        vfs.src('website/build/**').pipe(
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
    check('Boot script inlined', () => data.includes('Bootのcontent'))
    check('Google Analytics inlined', () => /GoogleAnalyticsObject/.test(data))
    check('Index file size is less than 200 KB', () => data.length < 200e3)

    function check(title, condition) {
      if (condition()) {
        console.log('[OK!!]', title)
      } else {
        console.log('[FAIL]', title)
        throw new Error('Pre-deploy check error: ' + title)
      }
    }
  })
  .command(
    'update-version',
    'Consumes the unreleased changelogs and update the version',
    {
      confirm: {
        alias: 'f',
        type: 'boolean',
        default: false,
        description: 'Updates the files',
      },
    },
    async (argv) => {
      const currentVersion = getCurrentVersion()
      console.log(`Current version: ${currentVersion}`)
      let targetVersion = semverInc(currentVersion, 'patch')

      const entrySchema = z.object({
        category: z.enum(['feature', 'internals', 'bugfix', 'improvement']),
        pr: z.union([
          z.string(),
          z.number(),
          z.array(z.union([z.string(), z.number()])),
        ]),
        author: z.union([z.string(), z.array(z.string())]),
        type: z.enum(['patch', 'minor', 'major']).optional(),
      })
      const categoryMapping = {
        feature: 'New stuff',
        internals: 'Internals',
        bugfix: 'Bug fixes',
        improvement: 'Improvements',
      }
      const files = glob.sync('changelog/*.md', {
        ignore: 'changelog/README.md',
      })
      console.log()
      console.log('Found %s changelog files.', files.length)
      for (const file of files) {
        console.log('- %s', file)
      }

      const entries = []
      const filesToDelete = []
      console.log()
      for (const file of files) {
        console.log('Processing %s...', file)
        const data = fs.readFileSync(file, 'utf8')
        const { content, data: frontmatter } = matter(data)
        const entry = entrySchema.parse(frontmatter)
        const proposedVersion = semverInc(currentVersion, entry.type || 'patch')
        if (semverGt(proposedVersion, targetVersion)) {
          targetVersion = proposedVersion
        }
        entries.push({
          ...entry,
          content,
          category: categoryMapping[entry.category],
        })
        filesToDelete.push(file)
      }
      console.log(`Proposed version: ${targetVersion}`)

      const currentChangelog = fs
        .readFileSync('CHANGELOG.md', 'utf8')
        .replace(/\r\n|\r/g, '\n')
      const newChangelog = updateChangelog(
        currentChangelog,
        entries,
        targetVersion
      )

      if (argv.confirm) {
        console.log('Updating files...')
        fs.writeFileSync('CHANGELOG.md', newChangelog)
        fs.writeFileSync(
          'bemuse/package.json',
          fs
            .readFileSync('bemuse/package.json', 'utf8')
            .replace(/"version":\s*"([^"]+)"/, `"version": "${targetVersion}"`)
        )
        for (const file of filesToDelete) {
          fs.unlinkSync(file)
        }
      }
      writeOutput('version', targetVersion)
    }
  )
  .command(
    'release',
    'Create GitHub Release',
    {
      confirm: {
        alias: 'f',
        type: 'boolean',
        default: false,
        description: 'Creates the release',
      },
    },
    async (argv) => {
      const sha = await exec('git rev-parse HEAD')
      const currentVersion = getCurrentVersion()
      console.log(`Current version: ${currentVersion}`)

      const gitTag = `v${currentVersion}`
      const exitCode = await check(`gh release view ${gitTag}`)
      if (exitCode === 0) {
        console.log('Release already exists.')
        return
      }

      const changelog = fs.readFileSync('CHANGELOG.md', 'utf8')
      const releaseNotes =
        getReleaseChangelog(changelog, currentVersion) ||
        '(Release notes not found)'
      const isPreRelease = currentVersion.includes('-')
      const date = new Date().toISOString().split('T')[0]
      const releaseName = `Bemuse v${currentVersion} (${date})`
      const notesFile = tempWrite.sync(releaseNotes)
      const releaseCommand = `gh release create ${gitTag} --title "${releaseName}" --notes-file ${notesFile} ${
        isPreRelease ? '--prerelease' : ''
      } --target "${sha}"`
      if (argv.confirm) {
        await run(releaseCommand)
      } else {
        console.log('Dry-run: %s', releaseCommand)
      }

      const uploadCommand = `gh release upload ${gitTag} dist.tar.gz`
      if (argv.confirm) {
        await run(uploadCommand)
      } else {
        console.log('Dry-run: %s', uploadCommand)
      }

      writeOutput('tag', gitTag)
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

function getCurrentVersion() {
  return JSON.parse(fs.readFileSync('bemuse/package.json', 'utf8')).version
}

async function run(shellCommand) {
  console.error(`Running: "${shellCommand}"`)
  await execa(shellCommand, {
    shell: true,
    stdio: 'inherit',
  })
}

async function check(shellCommand) {
  console.error(`Running: "${shellCommand}"`)
  const result = await execa(shellCommand, {
    shell: true,
    stdio: 'inherit',
    reject: false,
  })
  return result.exitCode
}

async function exec(shellCommand) {
  console.error(`Running: "${shellCommand}"`)
  const result = await execa(shellCommand, {
    shell: true,
  })
  return result.stdout
}

function writeOutput(key, value) {
  console.log(`Output: ${key}=${value}`)
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`)
  }
}
