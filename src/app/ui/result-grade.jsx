
import './result-grade.scss'
import React from 'react'

export default React.createClass({
  render() {
    return <div className="result-grade">
      <div className="result-grade--label">GRADE</div>
      <div className="result-grade--grade">{this.props.grade}</div>
    </div>
  }
})
