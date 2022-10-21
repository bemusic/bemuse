import fs from 'fs'
import stripJsonComments from 'strip-json-comments'

const rushJson = JSON.parse(
  stripJsonComments(fs.readFileSync('rush.json', 'utf8'))
)

const { peerDependencies } = JSON.parse(
  fs.readFileSync('packages/eslint-config-bemuse/package.json', 'utf8')
)

const warnings = []

for (const project of rushJson.projects) {
  const packageJsonPath = `${project.projectFolder}/package.json`
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  // Verify that the project has the correct dependencies.
  for (const [name, version] of Object.entries(peerDependencies)) {
    if (packageJson.devDependencies?.[name] !== version) {
      warnings.push(
        `${packageJsonPath}: Missing dev dependency ${name}@${version}`
      )
    }
  }
}

for (const warning of warnings) {
  console.warn(warning)
}
