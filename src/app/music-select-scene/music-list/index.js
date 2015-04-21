import './music-list.scss'
export default require('./music-list.view.jade').extend({
  components: {
    MusicListItem: require('../music-list-item')
  }
})
