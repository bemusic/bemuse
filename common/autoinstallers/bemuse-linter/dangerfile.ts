import { CLIEngine } from 'eslint'
import { readFileSync } from 'fs'
import { insert } from 'markdown-toc'
import { format } from 'prettier'
import minimatch = require('minimatch')

declare global {
  const danger: typeof import('danger').danger
  const warn: typeof import('danger').warn
  const fail: typeof import('danger').fail
  const message: typeof import('danger').message
}

/* eslint no-undef: off */
/* REASON: not compatible with import = require() syntax. */

// No PR is too small to include a description of why you made a change
if (danger.github) {
  if (danger.github.pr.body.length < 10) {
    warn('Please include a description of your PR changes.')
  }
}

const cli = new CLIEngine({} as any)
const filesToCheck = danger.git.created_files
  .concat(danger.git.modified_files)
  .filter((path) => !!path && !cli.isPathIgnored(path))

// ESLint
const eslintPattern = '*.{js,jsx,ts,tsx}'
const filesToLint = filesToCheck.filter((path) =>
  minimatch(path, eslintPattern, { matchBase: true })
)
const report = cli.executeOnFiles(filesToLint)
report.results.forEach((result) => {
  const { filePath } = result
  result.messages.forEach((msg) => {
    const { line, message, ruleId } = msg
    const rule = ruleId || 'N/A'
    const messageText = `${filePath} line ${line} – ${message} (${rule})`
    if (msg.severity === 1) {
      warn(messageText)
    } else if (msg.severity === 2) {
      fail(messageText)
    }
  })
})

// Readme
const readme = readFileSync('README.md', 'utf8')
const formattedReadme = format(insert(readme, {}), {
  parser: 'markdown',
})
if (formattedReadme !== readme) {
  fail(
    'Please format the README and update its table of contents using `rush format-readme`.'
  )
}
