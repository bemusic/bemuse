import './ResultScene.scss'

import * as Analytics from '../analytics'
import * as QueryFlags from '../query-flags'

import React, { MouseEvent } from 'react'

import { Chart } from 'bemuse-types'
import FirstTimeTip from './FirstTimeTip'
import Flex from 'bemuse/ui/Flex'
import { Icon } from 'bemuse/fa'
import { MappingMode } from '../entities/Options'
import MusicChartInfo from './MusicChartInfo'
import MusicChartSelectorItem from './MusicChartSelectorItem'
import RankingContainer from './RankingContainer'
import ResultExpertInfo from './ResultExpertInfo'
import ResultGrade from './ResultGrade'
import ResultTable from './ResultTable'
import Scene from 'bemuse/ui/Scene'
import SceneHeading from 'bemuse/ui/SceneHeading'
import SceneToolbar from 'bemuse/ui/SceneToolbar'

export interface Result {
  1: number
  2: number
  3: number
  4: number
  missed: number
  totalCombo: number
  maxCombo: number
  accuracy: number
  grade: string
  score: number
  deltas: readonly number[]
  totalNotes: number
  tainted: boolean
  log: string
}

const getTweetLink = ({ chart, result }: { chart: Chart; result: Result }) => {
  const title = chart.info.title
  let subtitle = chart.info.subtitles[0] || ''
  const score = result.score
  const grade = result.grade
  if (subtitle === '') {
    const match = chart.info.genre.match(/\[([^\]]+)\]$/)
    if (match) subtitle = match[1]
  }
  subtitle = subtitle.trim()
  if (subtitle !== '' && !/^[[(]/.test(subtitle)) subtitle = `[${subtitle}]`
  if (subtitle !== '') subtitle = ` ${subtitle}`
  let url = 'https://bemuse.ninja/'
  const server = QueryFlags.getMusicServer()
  if (server) {
    url =
      (/^http:/.test(server) ? 'http' : 'https') +
      '://bemuse.ninja/?server=' +
      encodeURIComponent(server)
  }
  const text =
    `Played:「 ${title}${subtitle} 」on #Bemuse (Score:${score} [${grade}])` +
    '\n' +
    `→ ${url}`
  return (
    'https://twitter.com/intent/tweet?related=bemusegame&text=' +
    encodeURIComponent(text)
  )
}

export interface ResultSceneProps {
  result: Result
  playMode: MappingMode
  lr2Timegate: unknown[]
  chart: Chart
  onReplay: () => void
  onExit: (e: MouseEvent) => void
}

const ResultScene = ({
  result,
  playMode,
  chart,
  lr2Timegate,
  onReplay,
  onExit,
}: ResultSceneProps) => {
  const onTweet = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    e.stopPropagation()
    Analytics.send('ResultScene', 'tweet')
    window.open(
      getTweetLink({ chart, result }),
      'intent',
      'width=550,height=420'
    )
  }

  const handleExit = (e: MouseEvent<HTMLDivElement>) => {
    onExit(e)
    Analytics.send('ResultScene', 'exit')
  }

  return (
    <Scene className='ResultScene'>
      <SceneHeading>
        Play Result
        <div className='ResultSceneのmode'>
          {playMode === 'KB' ? 'Keyboard' : 'BMS'} Mode
        </div>
      </SceneHeading>
      <div className='ResultSceneのreport'>
        <ResultTable result={result} />
      </div>
      <ResultGrade grade={result.grade} />
      <div className='ResultSceneのinformation'>
        <div className='ResultSceneのinformationHeader'>
          <div className='ResultSceneのchart'>
            <FirstTimeTip tip='Play again' featureKey='replayGame'>
              <MusicChartSelectorItem
                chart={chart}
                onChartClick={onReplay}
                isReplayable
              />
            </FirstTimeTip>
          </div>
          <MusicChartInfo info={chart.info} />
        </div>
        <div className='ResultSceneのinformationBody'>
          <RankingContainer
            result={result.tainted ? undefined : result}
            chart={chart}
            playMode={playMode}
          />
        </div>
        <div className='ResultSceneのinformationFooter'>
          <a
            href={getTweetLink({ chart, result })}
            className='ResultSceneのtweet'
            onClick={onTweet}
          >
            <Icon name='twitter' />
          </a>
          <Flex grow={1} />
          <FirstTimeTip tip='Back to music selection' featureKey='finishGame'>
            <div className='ResultSceneのexit' onClick={handleExit}>
              Continue
            </div>
          </FirstTimeTip>
        </div>
      </div>
      <SceneToolbar>
        <span>
          <ResultExpertInfo deltas={result.deltas} />
        </span>
        <SceneToolbar.Spacer />
        <a onClick={onExit}>Continue</a>
      </SceneToolbar>
    </Scene>
  )
}

export default ResultScene
