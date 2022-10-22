import fs from 'fs'
import stripJsonComments from 'strip-json-comments'

const rushJson = JSON.parse(
  stripJsonComments(fs.readFileSync('rush.json', 'utf8'))
)

const ourPackageJson = JSON.parse(
  fs.readFileSync('packages/eslint-config-bemuse/package.json', 'utf8')
)
const expectedPeerDependencies = {
  ...ourPackageJson.peerDependencies,
  'eslint-config-bemuse': '^' + ourPackageJson.version,
}

const eslintrcJs = `// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('eslint-config-bemuse/patch/modern-module-resolution')

module.exports = {
  extends: ['bemuse'],
  parserOptions: { tsconfigRootDir: __dirname },
}
`

const eslintignore = `**/node_modules/**/*
**/vendor/**/*
**/lib/**/*
**/dist/**/*
**/build/**/*
**/coverage/**/*
**/common/scripts/**/*
**/temp/**/*
**/tmp/**/*
**/.yarn/**/*
`

const warnings = []

for (const project of rushJson.projects) {
  const packageJsonPath = `${project.projectFolder}/package.json`
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  // Verify that the project has the correct dependencies.
  for (const [name, version] of Object.entries(expectedPeerDependencies)) {
    if (name === packageJson.name) {
      continue
    }
    if (packageJson.devDependencies?.[name] !== version) {
      warnings.push(
        `${packageJsonPath}: Missing dev dependency ${name}@${version}`
      )
    }
  }

  // Verify that the project has a "lint" script.
  const expectedLintScript = 'eslint --ext .js,.jsx,.ts,.tsx .'
  if (packageJson.scripts?.lint !== expectedLintScript) {
    warnings.push(
      `${packageJsonPath}: Missing "lint" script (expected "${expectedLintScript}")`
    )
  }

  // .eslintrc
  const eslintrcJsPath = `${project.projectFolder}/.eslintrc.js`
  if (!fs.existsSync(eslintrcJsPath)) {
    fs.writeFileSync(eslintrcJsPath, eslintrcJs)
  }

  // .eslintignore
  const eslintignorePath = `${project.projectFolder}/.eslintignore`
  fs.writeFileSync(eslintignorePath, eslintignore)
}

for (const warning of warnings) {
  console.warn(warning)
}
