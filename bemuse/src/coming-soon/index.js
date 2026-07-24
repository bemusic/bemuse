import './style.scss'

export function main() {
  const div = document.createElement('div')
  div.className = 'coming-soon'
  div.innerHTML = `<p>BEAT☆MUSIC☆SEQUENCE</p><h1>Coming Soon</h1><ul><li><a href="https://github.com/bemusic/bemuse">GitHub Project</a></li><li><a href="/badgeboard/">Badgeboard</a></li><li><a href="https://gitter.im/bemusic/bemuse">Gitter Chat</a></li><li><a class="coming-soon--demo" href="#">Loading Demo</a></li></ul>`

  import(/* webpackChunkName: 'comingSoonDemo' */ './demo').then(
    (loadedModule) => {
      const button = div.querySelector('.coming-soon--demo')
      loadedModule.main(button)
    }
  )

  document.body.appendChild(div)
}
