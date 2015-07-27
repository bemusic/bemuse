
import './result-scene.scss'
import React            from 'react'
import Scene            from 'bemuse/ui/scene'
import SceneHeading     from 'bemuse/ui/scene-heading'
import SceneToolbar     from 'bemuse/ui/scene-toolbar'
import MusicChartInfo   from './music-chart-info'
import MusicChartSelectorItem from './music-chart-selector-item'
import ResultTable      from './result-table'
import ResultGrade      from './result-grade'
import RankingContainer from './ranking-container'
import Flex             from 'bemuse/ui/flex'

export default React.createClass({
  render() {
    return <Scene className="result-scene">
      <SceneHeading>
        Play Result
      </SceneHeading>
      <div className="result-scene--report">
        <ResultTable result={this.props.result} />
      </div>
      <ResultGrade grade={this.props.result.grade} />
      <div className="result-scene--information">
        <div className="result-scene--information-header">
          <div className="result-scene--chart">
            <MusicChartSelectorItem chart={this.props.chart}
              onChartClick={this.noop} />
          </div>
          <MusicChartInfo info={this.props.chart.info} />
        </div>
        <div className="result-scene--information-body">
          <RankingContainer
              result={this.props.result}
              chart={this.props.chart}
              playMode={this.props.playMode} />
        </div>
        <div className="result-scene--information-footer">
          <a href={this.getTweetLink()} className="result-scene--tweet" onClick={this.onTweet}>
            <i className="fa fa-twitter" />
          </a>
          <Flex grow={1} />
          <div className="result-scene--exit" onClick={this.props.onExit}>
            Continue
          </div>
        </div>
      </div>
      <div className="result-scene--mode">
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
    if (!/^[\[\(]/.test(subtitle)) subtitle = `[${subtitle}]`
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
