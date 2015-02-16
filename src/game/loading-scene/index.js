
import View from 'bemuse/view!./view.jade'
import './style.scss'

export default function LoadingScene() {
  return function(container) {
    let data = {
      song: {
        title: 'BY☆MY☆SIDE',
        subtitle: [
          '[TUTORIAL]',
        ],
        artist: 'iaht',
        genre: 'Trance Core',
      },
      items: [
        {
          text: 'Loading game engine',
          width: '20%',
        },
        {
          text: 'Loading skin',
          width: '50%',
        },
        {
          text: 'Loading packages (3/5)',
          width: '60%',
        },
        {
          text: 'Loading sounds (853/1293)',
          width: '66%',
        },
        {
          text: 'Decoded KICK.ogg',
          width: '32%',
        },
        {
          text: 'Loading BGA (0/1)',
          width: '0%',
        },
      ],
    }
    new View({ el: container, data })
  }
}
