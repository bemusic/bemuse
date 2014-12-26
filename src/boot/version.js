
// This module is quite special, as it is run in compile time.
// It fetches the current version from `package.json` and export the version!
//

module.exports = 'module.exports=' + JSON.stringify(
  require('../../package.json').version)
