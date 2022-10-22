// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('./patch/modern-module-resolution')

module.exports = {
  extends: ['./index.js'],
}
