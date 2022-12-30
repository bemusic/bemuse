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
const { updateChangelog } = require('./lib/changelog')

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
      const currentVersion = JSON.parse(
        fs.readFileSync('bemuse/package.json', 'utf8')
      ).version
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

      const writeOutput = (key, value) => {
        console.log(`Output: ${key}=${value}`)
        if (process.env.GITHUB_OUTPUT) {
          fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`)
        }
      }
      writeOutput('version', targetVersion)
    }
  )
  .command('release', 'Release a new version of Bemuse', {}, async () => {
    await run('git fetch')
    await run('git checkout origin/master')
    await run('git branch -d master || true')
    await run('git checkout -b master')
    await run('node build-scripts release:changelog')
    const version = (
      await exec('node build-scripts release:get-next-version')
    ).trim()
    await exec(
      `node build-scripts release:write-version --newVersion '${version}'`
    )
    await run(`git commit -a -m ':bookmark: v${version}' || true`)
    await run(`git tag "v${version}"`)
    await run(`git push --follow-tags --set-upstream origin master`)
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
    'release:write-version',
    'Sets the version of Bemuse project',
    { newVersion: { type: 'string', demand: true } },
    async (args) => {
      const contents = fs.readFileSync('bemuse/package.json', 'utf8')
      const newContents = contents.replace(
        /"version":\s*"([^"]+)"/,
        `"version": "${args.newVersion}"`
      )
      fs.writeFileSync('bemuse/package.json', newContents, 'utf8')
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
