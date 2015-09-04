
import './ResultGrade.scss'
import React from 'react'

export default React.createClass({
  render() {
    return <div className="ResultGrade">
      <div className="ResultGradeのlabel">GRADE</div>
      <div className="ResultGradeのgrade">{this.props.grade}</div>
    </div>
  }
})
