import './ChangelogPanel.scss'
import React from 'react'
import $ from 'jquery'
import _ from 'lodash'
import Panel from 'bemuse/ui/Panel'
import Markdown from 'bemuse/ui/Markdown'

class ChangelogPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = { data: { status: 'loading' } }
  }

  componentDidMount () {
    const promise = import('!!raw-loader!../../../CHANGELOG.md').then(
      m => m.default
    )
    promise.then(
      changelog => this.setState({ data: { status: 'completed', changelog } }),
      () => this.setState({ data: { status: 'error' } })
    )
  }

  render () {
    return (
      <Panel className='ChangelogPanel' title='What’s New'>
        <div className='ChangelogPanelのcontent'>
          <Markdown source={this.getMarkdown()} safe />
        </div>
      </Panel>
    )
  }

  getMarkdown () {
    const releasesPage =
      '[releases page on GitHub](https://github.com/bemusic/bemuse/releases)'
    if (this.state.data.status === 'loading') {
      return 'Omachi kudasai…'
    }
    if (this.state.data.status === 'error') {
      return (
        '__Unable to load the change log :(__\n\n' +
        'You can view the change log at the ' +
        releasesPage
      )
    }
    const changelog = this.state.data.changelog
    const seeMore =
      '# Older Versions\n\n' +
      'The change log for older versions are available at the ' +
      releasesPage
    return changelog + '\n\n' + seeMore
  }
}

export default ChangelogPanel
