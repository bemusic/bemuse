/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl
    return baseUrl + 'docs/' + (language ? language + '/' : '') + doc
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl
    return baseUrl + (language ? language + '/' : '') + doc
  }

  render() {
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
            <a href={this.docUrl('user-guide.html', this.props.language)}>
              User Documentation
            </a>
            <a href={this.docUrl('developer-guide.html', this.props.language)}>
              Developer Documentation
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a href='https://discord.gg/aB6ucmx'>Discord Community</a>
            <a href='https://faq.bemuse.ninja'>Community FAQ</a>
            <a href={this.props.config.repoUrl}>GitHub Project</a>
          </div>
          <div>
            <h5>Social</h5>
            <a href='https://twitter.com/bemusegame' target='_blank'>
              Twitter @bemusegame
            </a>
          </div>
        </section>

        <section className='copyright'>{this.props.config.copyright}</section>
      </footer>
    )
  }
}

module.exports = Footer
