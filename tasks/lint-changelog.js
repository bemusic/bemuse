import gulp from 'gulp'
import fs from 'fs'
import path from 'path'

gulp.task('lint-changelog', async function () {
  const changelogPath = path.resolve(__dirname, '../CHANGELOG.md')
  const data = fs.readFileSync(changelogPath, 'utf8')
  const defined = new Set()
  const referenced = new Map()
  data.replace(
    /^\s*\[(?:([a-z0-9-]+)\/([a-z.0-9-]+))?#(\d+)]:\s+/gim,
    (a, owner, repo, number) => {
      const id = `${owner || 'bemusic'}:${repo || 'bemuse'}:${number}`
      defined.add(id)
    }
  )
  data.replace(
    /\[((?:([a-z0-9-]+)\/([a-z.0-9-]+))?#(\d+))]($|[^(])/gi,
    (a, tag, owner, repo, number) => {
      const id = `${owner || 'bemusic'}:${repo || 'bemuse'}:${number}`
      referenced.set(id, tag)
    }
  )
  for (const [id, ref] of referenced) {
    if (!defined.has(id)) {
      const [repo, owner, number] = id.split(':')
      console.log(
        `[${ref}]: https://github.com/${repo}/${owner}/pull/${number}`
      )
    }
  }
})
