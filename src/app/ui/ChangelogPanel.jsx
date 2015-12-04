
import './ChangelogPanel.scss'
import React    from 'react'
import $        from 'jquery'
import _        from 'lodash'
import Panel    from 'bemuse/ui/Panel'
import Markdown from 'bemuse/ui/Markdown'

export const ChangelogPanel = React.createClass({
  getInitialState () {
    return { data: { status: 'loading' } }
  },
  componentDidMount () {
    const promise = Promise.resolve($.get('https://api.github.com/repos/bemusic/bemuse/releases'))
    promise.then(
      releases => this.setState({ data: { status: 'completed', releases } }),
      ()       => this.setState({ data: { status: 'error' } }),
    )
  },
  render () {
    return (
      <Panel className="ChangelogPanel" title="What’s New">
        <div className="ChangelogPanelのcontent">
          <Markdown source={this.getMarkdown()} safe />
        </div>
      </Panel>
    )
  },
  getMarkdown () {
    if (this.state.data.status === 'loading') {
      return 'Omachi kudasai…'
    }
    if (this.state.data.status === 'error') {
      return 'Unable to load changelog :('
    }
    const releases = (_(this.state.data.releases || [ ])
      .reject('draft')
      .sortBy('created_at')
      .reverse()
      .take(10)
      .value()
    )
    const changelog = (releases
      .map(release => `# ${release.tag_name}` + '\n\n' + release.body)
      .join('\n\n')
    )
    const seeMore = (
      '# Older Versions\n\n' +
      'The change log for older versions are available on [GitHub](https://github.com/bemusic/bemuse/releases)'
    )
    return changelog + '\n\n' + seeMore
  },
})

export default ChangelogPanel
