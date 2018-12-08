import { danger, warn, fail, message } from 'danger'
import { CLIEngine } from 'eslint'
import { readFileSync } from 'fs'
import { insert } from 'markdown-toc'
import { getFileInfo, resolveConfig, check, format } from 'prettier'
import minimatch = require('minimatch')

/* eslint no-undef: off */
/* REASON: not compatible with import = require() syntax. */

// No PR is too small to include a description of why you made a change
if (danger.github) {
  if (danger.github.pr.body.length < 10) {
    warn('Please include a description of your PR changes.')
  }
}

const filesToCheck = danger.git.created_files.concat(danger.git.modified_files)

// ESLint
const cli = new CLIEngine({})
const filesToLint = filesToCheck.filter(path => !cli.isPathIgnored(path))
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

// Prettier
let prettierFailed = false
const prettierPattern = '*.{js,jsx,ts,tsx,json,scss,css,yml}'
filesToCheck.forEach(filePath => {
  const matchesPattern = minimatch(filePath, prettierPattern, {
    matchBase: true,
  })
  if (!matchesPattern) return
  const fileInfo = getFileInfo.sync(filePath)
  if (fileInfo.ignored) return
  if (!fileInfo.inferredParser) return
  const source = readFileSync(filePath, 'utf8')
  const config = resolveConfig.sync(filePath)
  const options = { ...config, parser: fileInfo.inferredParser }
  if (!check(source, options)) {
    fail(`${filePath} is not formatted using Prettier`)
    prettierFailed = true
  }
})
if (prettierFailed) {
  message(
    'You can run `yarn style:fix` to automatically format all files using Prettier.'
  )
}

// Readme
const readme = readFileSync('README.md', 'utf8')
const formattedReadme = format(insert(readme), {
  parser: 'markdown',
})
if (formattedReadme !== readme) {
  fail(
    'Please format the README and update its table of contents using `yarn readme:update`.'
  )
}
