
import query from 'bemuse/utils/query'
import MAIN  from 'bemuse/utils/main-element'
import React from 'react'

const availablePlaygrounds = {
  font:     require('./playgrounds/font'),
  result:   require('./playgrounds/result'),
  skin:     require('./playgrounds/skin'),
  dropBMS:  require('./playgrounds/drop-bms'),
}

const DefaultPlayground = React.createClass({
  statics: {
    main() {
      React.render(<DefaultPlayground />, MAIN)
    }
  },
  render() {
    const linkStyle = { color: '#abc' }
    return <div>
      <h1>Bemuse Playground</h1>
      <p>Please select a playground</p>
      <ul>
        {Object.keys(availablePlaygrounds)
            .map(key => <li>
              <a style={linkStyle}
                  href={'?mode=playground&playground=' + key}>{key}</a>
            </li>)}
      </ul>
    </div>
  }
})

export function main() {
  void (availablePlaygrounds[query.playground] || DefaultPlayground).main()
}
