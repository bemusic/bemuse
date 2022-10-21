'use strict'

module.exports = {
  extends: ['plugin:import/errors'],
  plugins: ['import'],
  rules: {
    'import/no-unresolved': ['error', { ignore: ['!'] }],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: require.resolve('./tsconfig.json'),
      },
    },
    'import/ignore': [
      'node_modules',
      '\\.(jade|scss|pegjs)$',
      'version\\.js$',
      'worker\\.js$',
      'config\\.js$',
      '/config/',
      '/tasks/',
    ],
  },
}
