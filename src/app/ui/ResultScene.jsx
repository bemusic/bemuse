
import './ResultScene.scss'
import React            from 'react'
import Scene            from 'bemuse/ui/Scene'
import SceneHeading     from 'bemuse/ui/SceneHeading'
import SceneToolbar     from 'bemuse/ui/SceneToolbar'
import MusicChartInfo   from './MusicChartInfo'
import MusicChartSelectorItem from './MusicChartSelectorItem'
import ResultTable      from './ResultTable'
import ResultGrade      from './ResultGrade'
import RankingContainer from './RankingContainer'
import Flex             from 'bemuse/ui/Flex'

export default React.createClass({
  render() {
    return <Scene className="ResultScene">
      <SceneHeading>
        Play Result
      </SceneHeading>
      <div className="ResultSceneのreport">
        <ResultTable result={this.props.result} />
      </div>
      <ResultGrade grade={this.props.result.grade} />
      <div className="ResultSceneのinformation">
        <div className="ResultSceneのinformationHeader">
          <div className="ResultSceneのchart">
            <MusicChartSelectorItem chart={this.props.chart}
              onChartClick={this.noop} />
          </div>
          <MusicChartInfo info={this.props.chart.info} />
        </div>
        <div className="ResultSceneのinformationBody">
          <RankingContainer
              result={this.props.result}
              chart={this.props.chart}
              playMode={this.props.playMode} />
        </div>
        <div className="ResultSceneのinformationFooter">
          <a href={this.getTweetLink()} className="ResultSceneのtweet" onClick={this.onTweet}>
            <i className="fa fa-twitter" />
          </a>
          <Flex grow={1} />
          <div className="ResultSceneのexit" onClick={this.props.onExit}>
            Continue
          </div>
        </div>
      </div>
      <div className="ResultSceneのmode">
        {this.props.playMode === 'KB' ? 'Keyboard' : 'BMS'} Mode
      </div>
      <SceneToolbar>
        <SceneToolbar.Spacer />
        <a onClick={this.props.onExit} href="javascript://">Continue</a>
      </SceneToolbar>
    </Scene>
  },
  getTweetLink() {
    let title = this.props.chart.info.title
    let subtitle = this.props.chart.info.subtitles[0] || ''
    let score = this.props.result.score
    if (subtitle === '') {
      let match = this.props.chart.info.genre.match(/\[([^\]]+)\]$/)
      if (match) subtitle = match[1]
    }
    subtitle = subtitle.trim()
    if (subtitle !== '' && !/^[\[\(]/.test(subtitle)) subtitle = `[${subtitle}]`
    if (subtitle !== '') subtitle = ` ${subtitle}`
    let text = `Played:「 ${title}${subtitle} 」on #Bemuse (Score:${score})` + '\n' + `→ https://bemuse.ninja/`
    return 'https://twitter.com/intent/tweet?related=bemusegame&text=' + encodeURIComponent(text)
  },
  onTweet(e) {
    e.preventDefault()
    e.stopPropagation()
    window.open(this.getTweetLink(), 'intent', 'width=550,height=420')
  },
  noop() {
  },
})
