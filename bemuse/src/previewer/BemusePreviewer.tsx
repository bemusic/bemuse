import './BemusePreviewer.scss'
import React from 'react'
import { PreviewCanvas } from './PreviewCanvas'

export const BemusePreviewer = () => {
  return (
    <div className='BemusePreviewer'>
      <h1>Bemuse BMS previewer</h1>
      <PreviewCanvas />
    </div>
  )
}
