/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

class Footer extends React.Component {
  docUrl (doc, language) {
    const baseUrl = this.props.config.baseUrl
    return baseUrl + 'docs/' + (language ? language + '/' : '') + doc
  }

  pageUrl (doc, language) {
    const baseUrl = this.props.config.baseUrl
    return baseUrl + (language ? language + '/' : '') + doc
  }

  render () {
    const currentYear = new Date().getFullYear()
    return (
      <footer className='nav-footer' id='footer'>
        <section className='sitemap'>
          <a href={this.props.config.baseUrl} className='nav-home'>
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width='66'
                height='58'
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('users-gameplay.html', this.props.language)}>
              User Documentation
            </a>
            <a href={this.docUrl('developers-getting-started.html', this.props.language)}>
              Developer Documentation
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a href='https://www.facebook.com/bemusegame' target='_blank'>
              Facebook
            </a>
            <a href='https://twitter.com/bemusegame' target='_blank'>
              Twitter
            </a>
          </div>
          <div>
            <h5>Contribute</h5>
            <a href={this.props.config.repoUrl}>GitHub</a>
            <a href={this.props.config.repoUrl + '/issues'}>Issues</a>
            <a href='https://waffle.io/bemusic/bemuse' target='_blank'>
              Project Board
            </a>
          </div>
        </section>

        <a
          href='https://code.facebook.com/projects/'
          target='_blank'
          className='fbOpenSource'
        >
          <img
            src={this.props.config.baseUrl + 'img/oss_logo.png'}
            alt='Facebook Open Source'
            width='170'
            height='45'
          />
        </a>
        <section className='copyright'>
          Copyright &copy; {currentYear} Facebook Inc.
        </section>
      </footer>
    )
  }
}

module.exports = Footer
