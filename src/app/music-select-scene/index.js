
import R from 'ramda'
import $ from 'jquery'
import View from 'bemuse/view!./view.jade'
import './style.scss'
import * as GameLauncher from '../game-launcher'

export function MusicSelectScene() {

  return function(container) {

    let server = { url: '/music' }

    let view = new View({
      el: container,
      data: {
        isSongSelected(song) {
          return song.dir === this.get('song.dir')
        },
        isChartSelected(chart) {
          return chart.md5 === this.get('chart.md5')
        },
        joinsubs(array) {
          return (array || []).join(' · ')
        },
      },
      selectSong(song) {
        this.set('song', song)
        this.set('chart', song.charts[0])
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
    })

    view.on('start', function(song, chart) {
      GameLauncher.launch({ server, song, chart }).done()
    })

    container.classList.add('music-select-scene')
    view.set('loading', true)
    view.set('server', server)

    Promise.resolve($.get(server.url + '/index.json'))
    .then(function(songs) {
      songs = R.sortBy(song => song.tutorial ? 0 : 1, songs)
      view.set('songs', songs)
      view.set('song', songs[0])
      view.set('chart', songs[0].charts[0])
    })
    .finally(function() {
      view.set('loading', false)
    })
    .done()

    return function() {
    }
  }

}

export default MusicSelectScene
