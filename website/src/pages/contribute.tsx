/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Container } from '../components/container'
import { GridBlock } from '../components/grid-block'
import Layout from '@theme/Layout'
import { MarkdownBlock } from '../components/markdown-block'
import React from 'react'
import { docUrl } from '../lib/url'

const pageContent = `
Bemuse is a free and open-source game, licensed under AGPLv3. It is developed by
[many contributors](https://github.com/bemusic/bemuse/graphs/contributors) in their spare time,
and your contribution helps us deliver new features and bug fixes quickly.

Thank you for helping us make this game better!
`

export const Help = () => {
  const supportLinks = [
    {
      content: `Follow the [developer documentation](${docUrl(
        'developer-guide.html'
      )}) to get started. Don't forget to read our [coding guidelines](https://github.com/bemusic/bemuse/blob/master/CONTRIBUTING.md) as well.`,
      title: 'Read the docs',
    },
    {
      content:
        "Read through our [issues thread](https://github.com/bemusic/bemuse/issues) and pick an issue. If you're confused, we recommend starting out with [these issues](https://github.com/bemusic/bemuse/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).",
      title: 'Pick an issue',
    },
  ]

  return (
    <div className='docMainWrapper wrapper'>
      <Container className='mainContainer documentContainer postContainer'>
        <div className='post'>
          <header className='postHeader'>
            <h1 className='postHeaderTitle'>Contribute</h1>
          </header>
          <MarkdownBlock>{pageContent}</MarkdownBlock>
          <GridBlock contents={supportLinks} layout='threeColumn' />
        </div>
      </Container>
    </div>
  )
}

export default () => (
  <Layout>
    <Help />
  </Layout>
)
