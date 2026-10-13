import React from 'react'
import query from 'bemuse/utils/query'
import { sceneRoot } from 'bemuse/utils/main-element'

const availablePlaygrounds = (function () {
  const modules = import.meta.glob('./playgrounds/*.{js,jsx,ts,tsx}', {
    eager: true,
  })
  const playgrounds = {}
  for (const key of Object.keys(modules)) {
    const name = key.replace(/^.*\//, '').replace(/\.[jt]sx?$/, '')
    playgrounds[name] = modules[key]
  }
  return playgrounds
})()

class DefaultPlayground extends React.Component {
  static main() {
    sceneRoot.render(<DefaultPlayground />)
  }

  render() {
    const linkStyle = { color: '#abc' }
    return (
      <div>
        <h1>Bemuse Playground</h1>
        <p>Please select a playground</p>
        <ul>
          {Object.keys(availablePlaygrounds).map((key) => (
            <li key={key}>
              <a style={linkStyle} href={'?mode=playground&playground=' + key}>
                {key}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export function main() {
  ;(availablePlaygrounds[query.playground] || DefaultPlayground).main()
}
