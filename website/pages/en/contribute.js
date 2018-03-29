/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

const CompLibrary = require('../../core/CompLibrary.js')
const MarkdownBlock = CompLibrary.MarkdownBlock
const Container = CompLibrary.Container
const GridBlock = CompLibrary.GridBlock

const siteConfig = require(process.cwd() + '/siteConfig.js')

function docUrl (doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc
}

function pageUrl (page, language) { // eslint-disable-line
  return siteConfig.baseUrl + (language ? language + '/' : '') + page
}

const pageContent = `
Bemuse is a free and open-source game, licensed under AGPLv3. It is developed by
[many contributors](https://github.com/bemusic/bemuse/graphs/contributors) in their spare time,
and your contribution helps us deliver new features and bug fixes quickly.

Contributions are always welcome! Thank you for helping us make this game better!
`

class Help extends React.Component {
  render () {
    const supportLinks = [
      {
        content:
          `Follow the [developer documentation](${docUrl('getting-started.html')}) to get started.`,
        title: 'Read the docs'
      },
      {
        content: 'Read through our [issues thread](https://github.com/bemusic/bemuse/issues) and pick an issue.\n\nWe recommend starting out with [these issues](https://github.com/bemusic/bemuse/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).',
        title: 'Pick an issue'
      },
      {
        content: "We have a [Waffle board](https://waffle.io/bemusic/bemuse) which we use to track this project's development progress.",
        title: 'Track progress'
      }
    ]

    return (
      <div className='docMainWrapper wrapper'>
        <Container className='mainContainer documentContainer postContainer'>
          <div className='post'>
            <header className='postHeader'>
              <h2>Contribute</h2>
            </header>
            <MarkdownBlock>{pageContent}</MarkdownBlock>
            <GridBlock contents={supportLinks} layout='threeColumn' />
          </div>
        </Container>
      </div>
    )
  }
}

module.exports = Help
