/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Container } from '../components/container'
import { GridBlock } from '../components/grid-block'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import React from 'react'
import { docUrl } from '../lib/url'

const pageContent = (
  <>
    Bemuse is a free and open-source game, licensed under AGPLv3. It is
    developed by{' '}
    <Link to='https://github.com/bemusic/bemuse/graphs/contributors'>
      many contributors
    </Link>{' '}
    in their spare time, and your contribution helps us deliver new features and
    bug fixes quickly. Thank you for helping us make this game better!
  </>
)

export const Help = () => {
  const supportLinks = [
    {
      content: (
        <>
          Follow the{' '}
          <Link to={docUrl('developer-guide.html')}>
            developer documentation
          </Link>{' '}
          to get started. Don't forget to read our{' '}
          <Link to='https://github.com/bemusic/bemuse/blob/master/CONTRIBUTING.md'>
            coding guidelines
          </Link>{' '}
          as well.
        </>
      ),
      title: 'Read the docs',
    },
    {
      content: (
        <>
          Read through our{' '}
          <Link to='https://github.com/bemusic/bemuse/issues'>
            issues thread
          </Link>{' '}
          and pick an issue. If you're confused, we recommend starting out with{' '}
          <Link to='https://github.com/bemusic/bemuse/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22'>
            these issues
          </Link>
          .
        </>
      ),
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
          {pageContent}
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
