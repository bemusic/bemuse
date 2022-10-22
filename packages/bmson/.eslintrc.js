// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('eslint-config-bemuse/patch/modern-module-resolution')

module.exports = {
  extends: ['bemuse'],
  parserOptions: { tsconfigRootDir: __dirname },
}
