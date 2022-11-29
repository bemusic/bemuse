import './ChangelogPanel.scss'

import Markdown from 'bemuse/ui/Markdown'
import Panel from 'bemuse/ui/Panel'
import React, { useEffect, useState } from 'react'

type Status =
  | { state: 'loading' }
  | { state: 'error' }
  | { state: 'completed'; changelog: string }

const getMarkdown = (status: Status) => {
  const releasesPage =
    '[releases page on GitHub](https://github.com/bemusic/bemuse/releases)'
  if (status.state === 'loading') {
    return 'Omachi kudasai…'
  }
  if (status.state === 'error') {
    return (
      '__Unable to load the change log :(__\n\n' +
      'You can view the change log at the ' +
      releasesPage
    )
  }
  const changelog = status.changelog
  const seeMore =
    '# Older Versions\n\n' +
    'The change log for older versions are available at the ' +
    releasesPage
  return changelog + '\n\n' + seeMore
}

const ChangelogPanel = () => {
  const [status, setStatus] = useState<Status>({ state: 'loading' })
  useEffect(() => {
    // @ts-ignore
    const promise = import('../../../../CHANGELOG.md').then((m) => m.default)
    promise.then(
      (changelog) => setStatus({ state: 'completed', changelog }),
      () => setStatus({ state: 'error' })
    )
  }, [])

  return (
    <Panel className='ChangelogPanel' title='What’s New'>
      <div className='ChangelogPanelのcontent'>
        <Markdown source={getMarkdown(status)} safe />
      </div>
    </Panel>
  )
}

export default ChangelogPanel
