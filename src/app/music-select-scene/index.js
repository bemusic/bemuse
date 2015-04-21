
import './music-select-scene.scss'
import MusicSelectSceneTemplate from './music-select-scene.view.jade'

import _ from 'lodash'
import $ from 'jquery'
import * as GameLauncher from '../game-launcher'

export function MusicSelectScene() {

  return function(container) {

    let server = { url: '/music' }

    let view = new MusicSelectSceneTemplate({
      el: container,
      data: {
        isChartSelected(chart) {
          return chart.md5 === this.get('chart.md5')
        },
        joinsubs(array) {
          return (array || []).join(' · ')
        },
      },
      selectChart(chart) {
        if (chart.md5 === this.get('chart.md5')) {
          this.startGame()
        } else {
          this.set('chart', chart)
        }
      },
      startGame() {
        this.fire('start', this.get('song'), this.get('chart'))
      },
      components: {
        Scene:        require('bemuse/ui/scene'),
        SceneHeading: require('bemuse/ui/scene-heading'),
        MusicList:    require('./music-list')
      },
    })

    view.on({
      start(song, chart) {
        GameLauncher.launch({ server, song, chart }).done()
      },
      ['MusicList.selectSong'](event) {
        let song = this.get('songs')[event.index.song]
        this.set('song', song)
        this.set('chart', song.charts[0])
      },
    })

    view.set('loading', true)
    view.set('server', server)

    Promise.resolve($.get(server.url + '/index.json'))
    .then(function(songs) {
      songs = _.sortBy(songs, song => song.tutorial ? 0 : 1)
      view.set('songs', songs)
      view.set('song', songs[0])
      view.set('chart', songs[0].charts[0])
    })
    .finally(function() {
      view.set('loading', false)
    })
    .done()

    return {
      teardown() {
      }
    }
  }

}

export default MusicSelectScene
