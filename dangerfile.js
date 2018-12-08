const { danger, warn, fail, message } = require('danger')
const { CLIEngine } = require('eslint')
const fs = require('fs')
const toc = require('markdown-toc')
const prettier = require('prettier')

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
filesToCheck.forEach(filePath => {
  const fileInfo = prettier.getFileInfo.sync(filePath)
  if (!fileInfo.ignored && fileInfo.inferredParser) {
    const source = fs.readFileSync(filePath, 'utf8')
    const options = { parser: fileInfo.inferredParser }
    if (!prettier.check(source, options)) {
      fail(`${filePath} is not formatted using Prettier`)
      prettierFailed = true
    }
  }
})
if (prettierFailed) {
  message(
    'You can run `yarn style:fix` to automatically format all files using Prettier.'
  )
}

// Readme
const readme = fs.readFileSync('README.md', 'utf8')
const formattedReadme = prettier.format(toc.insert(readme), {
  parser: 'markdown',
})
if (formattedReadme !== readme) {
  fail(
    'Please format the README and update its table of contents using `yarn readme:update`.'
  )
}
