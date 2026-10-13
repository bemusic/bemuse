// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('eslint-config-bemuse/patch/modern-module-resolution')

module.exports = {
  extends: ['bemuse', './.eslintrc.config.import.js'],
  parserOptions: { tsconfigRootDir: __dirname },
  // Build-time constants injected via Vite `define` (see vite.config.ts).
  globals: {
    __BEMUSE_VERSION__: 'readonly',
    __BEMUSE_NAME__: 'readonly',
    __SCOREBOARD_SERVER__: 'readonly',
  },
}
