let name = 'Bemuse'
let version = require('../package.json')
  .version.replace(/\.0$/, '')
  .replace(/\.0$/, '')

function gitRevision () {
  return require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim()
}

if (process.env.CONTEXT === 'deploy-preview') {
  name += 'DevMode'
  if (process.env.DEPLOY_PRIME_URL) {
    const m = process.env.DEPLOY_PRIME_URL.match(/\/\/(.*?)--/)[1]
    version += `[${m[1]}]`
  }
  version += '@' + gitRevision()
}

if (process.env.CONTEXT === 'production') {
  name += 'DevMode'
  version += '+next[staging]@' + gitRevision()
}

module.exports = { name, version }
