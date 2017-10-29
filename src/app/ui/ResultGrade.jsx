
import './ResultGrade.scss'
import React from 'react'
import PropTypes from 'prop-types'

const ResultGrade = ({ grade }) => (
  <div className="ResultGrade">
    <div className="ResultGradeのlabel">GRADE</div>
    <div className="ResultGradeのgrade">{grade}</div>
  </div>
)

ResultGrade.propTypes = {
  grade: PropTypes.string.isRequired
}

export default ResultGrade
