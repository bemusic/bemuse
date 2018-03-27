/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

const CompLibrary = require('../../core/CompLibrary.js')
const Container = CompLibrary.Container

const siteConfig = require(process.cwd() + '/siteConfig.js')

class Music extends React.Component {
  render () {
    if ((siteConfig.artists || []).length === 0) {
      return null
    }
    const showcase = siteConfig.artists.map((artist, i) => {
      return (
        <a href={artist.url} key={i}>
          {artist.name}
        </a>
      )
    })

    return (
      <div className='mainContainer'>
        <Container padding={['bottom', 'top']}>
          <div className='showcaseSection'>
            <div className='prose'>
              <h1>Artists Showcase</h1>
              <p>We'd like to thank the following artists for letting us use their songs in the game.</p>
            </div>
            <div className='logos'>{showcase}</div>
          </div>
        </Container>
      </div>
    )
  }
}

module.exports = Music
