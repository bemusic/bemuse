import React from 'react'
import query from 'bemuse/utils/query'
import { sceneRoot } from 'bemuse/utils/main-element'

const availablePlaygrounds = (function (context) {
  const playgrounds = {}
  for (const key of context.keys()) {
    const name = key.match(/\w[^.]+/)[0]
    playgrounds[name] = context(key)
  }
  return playgrounds
})(require.context('./playgrounds', false, /\.[jt]sx?$/))

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
