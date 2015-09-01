
import './options-input-scratch.scss'
import React from 'react'
import c     from 'classnames'

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],
  render() {
    return <div
        className={c('OptionsInputScratch',
            { 'is-editing': this.props.isEditing })}
        onClick={this.handleClick}>
      <svg viewBox="-100 -100 200 200">
        <path d={star()} className="OptionsInputScratchのstar" />
      </svg>
      <div className="OptionsInputScratchのtext">
        <div className={this.renderKeyClass(0)}>{this.props.text[0]}</div>
        <div className="OptionsInputScratchのkeySeparator">or</div>
        <div className={this.renderKeyClass(1)}>{this.props.text[1]}</div>
      </div>
    </div>
  },
  renderKeyClass(index) {
    return c('OptionsInputScratchのkey', {
      'is-editing': this.props.editIndex === index
    })
  },
  handleClick() {
    this.props.onEdit('SC')
  },
})

function star() {
  let out = ''
  for (let i = 0; i < 10; i++) {
    let r = i % 2 === 0 ? 40 : 90
    let θ = i * Math.PI / 5
    let x = Math.sin(θ) * r
    let y = Math.cos(θ) * r
    out += (i === 0 ? 'M' : ' L') + x + ',' + y
  }
  return out
}
