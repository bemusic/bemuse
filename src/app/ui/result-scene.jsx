
import './result-scene.scss'
import React            from 'react'
import Scene            from 'bemuse/ui/scene'
import SceneHeading     from 'bemuse/ui/scene-heading'
import SceneToolbar     from 'bemuse/ui/scene-toolbar'
import MusicChartInfo   from './music-chart-info'
import MusicChartSelectorItem from './music-chart-selector-item'
import ResultTable      from './result-table'
import ResultGrade      from './result-grade'
import RankingTableContainer  from './ranking-table-container'

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
          <RankingTableContainer />
        </div>
        <div className="result-scene--information-footer">
          <div className="result-scene--exit" onClick={this.props.onExit}>
            Continue
          </div>
        </div>
      </div>
      <div className="result-scene--mode">
        {this.props.gameMode === 'KB' ? 'Keyboard' : 'BMS'} Mode
      </div>
      <SceneToolbar>
        <SceneToolbar.Spacer />
        <a onClick={this.props.onExit} href="javascript://">Continue</a>
      </SceneToolbar>
    </Scene>
  },
  noop() {
  },
})
