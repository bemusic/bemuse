import './ResultGrade.scss'

import React from 'react'

const ResultGrade = ({ grade }: { grade: string }) => (
  <div className='ResultGrade'>
    <div className='ResultGradeのlabel'>GRADE</div>
    <div className='ResultGradeのgrade'>{grade}</div>
  </div>
)

export default ResultGrade
