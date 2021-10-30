/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

const CompLibrary = require('../../core/CompLibrary.js')
const Container = CompLibrary.Container

const content = `
<style>
  @media (min-width: 720px) {
    .artists-list {
      column-count: 2;
    }
  }
  @media (min-width: 1024px) {
    .artists-list {
      column-count: 3;
    }
  }
  #artists {
    margin: 1.5em 0 3em;
  }
  #artists ul.artists-list {
    display: block;
    padding: 0;
  }
  #artists ul.artists-list > li {
    break-inside: avoid-column;
    list-style: none;
    -webkit-column-break-inside: avoid;
  }
  #artists ul.artists-list > li > ul {
    list-style: outside circle;
  }
  #artists .message {
    padding: 1em;
    border: 1px solid #E9A8BB;
    background: #FFF;
  }
</style>

<div id="artists">
  <div v-if="loading" class="message">
    (Loading song list...)
  </div>
  <div v-if="error" class="message">
    (Error: {{error}})
  </div>
  <div v-if="songs">
    <ul class="artists-list">
      <li v-for="artist in artists">
        <a :href="artist.url"><strong>{{artist.name}}</strong></a>
        <ul>
          <li v-for="song in artist.songs">
            <span v-if="!songUrl(song)">{{song.title}}</span>
            <a v-if="songUrl(song)" :href="songUrl(song)">{{song.title}}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</div>

<script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
<script>
  const artistAliases = {
    'BEMUSE SOUND TEAM': 'flicknote',
    'flicknote vs Dekdekbaloo feat. MindaRyn': 'flicknote',
    'Larimar': 'Dachs',
    'Ｎｅｇｏ＿ｔｉａｔｏｒ/映像：Fiz': 'Nego_tiator',
    'Ym1024 feat. lamie*': 'Ym1024',
  }
  const artistSortKeys = {
    'ああああ': 'aaaa',
    'すてらべえ': 'stellabee',
    '葵': 'aoi',
  }
  new Vue({
    el: '#artists',
    data: {
      loading: true,
      error: false,
      songs: null
    },
    methods: {
      songUrl (song) {
        return song.song_url || song.long_url || song.bms_url
      }
    },
    computed: {
      artists () {
        if (!this.songs) return [ ]
        const result = [ ]
        const map = { }
        for (const song of this.songs) {
          const artistName = song.alias_of || artistAliases[song.artist] || song.artist
          if (!map[artistName]) {
            map[artistName] = {
              name: artistName,
              sortKey: (artistSortKeys[artistName] || artistName).toLowerCase(),
              url: song.artist_url,
              songs: [ ]
            }
            result.push(map[artistName])
          }
          map[artistName].songs.push(song)
        }
        return result.sort((a, b) => {
          return a.sortKey < b.sortKey ? -1 : 1
        })
      }
    },
    created () {
      fetch('https://music4.bemuse.ninja/server/index.json')
        .then(r => {
          if (r.ok) {
            return r.json()
          } else {
            throw new Error('Fetching music list failed with HTTP status ' + r.status)
          }
        })
        .then(d => {
          this.loading = false
          this.songs = d.songs
        })
        .catch(e => {
          this.loading = false
          this.error = e.toString()
        })
    }
  })
</script>
`

class Music extends React.Component {
  render() {
    return (
      <div className='docMainWrapper wrapper'>
        <Container className='mainContainer documentContainer postContainer'>
          <div className='post'>
            <header className='postHeader'>
              <h1 className='postHeaderTitle'>Artists Showcase</h1>
              <p>
                We'd like to thank the following artists for letting us use
                their songs in the game.
              </p>
            </header>
          </div>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Container>
      </div>
    )
  }
}

module.exports = Music
