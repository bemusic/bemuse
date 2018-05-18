import * as fs from 'fs'
import toc from 'markdown-toc'
import { danger, warn, fail } from 'danger'
import { CLIEngine } from 'eslint'

// No PR is too small to include a description of why you made a change
if (danger.github.pr.body.length < 10) {
  warn('Please include a description of your PR changes.')
}

// ESLint
const cli = new CLIEngine({} as any)
const filesToLint = danger.git.created_files
  .concat(danger.git.modified_files)
  .filter(path => !cli.isPathIgnored(path))
const report = cli.executeOnFiles(filesToLint)
report.results.forEach(result => {
  const { filePath } = result
  result.messages.forEach(msg => {
    const { line, message, ruleId } = msg
    const rule = ruleId || 'N/A'
    const messageText = `${filePath} line ${line} – ${message} (${rule})`
    if (msg.severity === 1) {
      warn(messageText)
    } else if (msg.severity === 1) {
      fail(messageText)
    }
  })
})

// Readme
const readme = fs.readFileSync('README.md', 'utf8')
if (toc.insert(readme) !== readme) {
  fail(
    'Please update README file with up-to-date table of contents: `yarn readme:toc`'
  )
}
