// @ts-check
const indent = require('indent-string')
const prettier = require('prettier')
const _ = require('lodash')

/**
 * @param {string} existingChangelog
 * @param {{ content: string; category: string; pr: number | number[]; author: string | string[] }[]} entries
 */
function updateChangelog(existingChangelog, entries, version = 'UNRELEASED') {
  const userListRegExp = /((?:\[@\w+\]: https.+\n)+)/
  const userList = existingChangelog.match(userListRegExp)
  if (!userList) {
    throw new Error('Cannot find user list in changelog')
  }

  const existingUsers = new Set()
  userList[1].replace(/@(\w+)/g, (a, id) => {
    existingUsers.add(id.toLowerCase())
    return a
  })

  /** @type {Map<number, { html_url: string }>} */
  const pullMap = new Map()
  const newUsers = new Map()
  const registerUser = u => {
    if (!existingUsers.has(u.toLowerCase())) newUsers.set(u.toLowerCase(), u)
    return `[@${u}]`
  }
  const bullets = entries
    .map(x => {
      const prs = Array.isArray(x.pr) ? x.pr : [x.pr]
      const prsText = prs.map(pr => {
        pullMap.set(pr, { html_url: `https://github.com/bemusic/bemuse/pull/${pr}` })
        return `[#${pr}]`
      }).join(', ')
      const authors = Array.isArray(x.author) ? x.author : [x.author]
      const authorsText = authors.map(registerUser).join(', ')
      const text = x.content.trim().replace(/\[@([^\]\s]+)\]/, (a, id) => {
        return registerUser(id)
      })
      return {
        text: `- ${indent(text, 2).substr(2)} [${prsText}], by ${authorsText}`,
        category: x.category,
      }
    })
  const bulletPoints = _.chain(bullets)
    .groupBy(b => b.category)
    .map((v, k) => {
      return {
        text: `### ${k}\n\n` + v.map(b => b.text).join('\n'),
        order: (['New stuff'].indexOf(k) + 1) || 999999,
      }
    })
    .sortBy(b => b.order)
    .value()
    .map(c => c.text)
    .join('\n\n')
  const pullRefs = [...pullMap].map(([number, pull]) => `[#${number}]: ${pull.html_url}`).join('\n')
  const newUserRefs = [...newUsers].map(([k, u]) => `[@${k}]: https://github.com/${u}`).join('\n')
  const newMarkdown = `## ${version}\n\n${bulletPoints}\n\n${pullRefs}`
  let markdown = existingChangelog
    .replace(userListRegExp, a => {
      return a + newUserRefs + '\n'
    })
    .replace(/## /, a => {
      return newMarkdown + '\n\n' + a
    })
  const prettierConfig = JSON.parse(require('fs').readFileSync('.prettierrc', 'utf8'))
  return prettier.format(markdown, { ...prettierConfig, parser: 'markdown' })
}
exports.updateChangelog = updateChangelog