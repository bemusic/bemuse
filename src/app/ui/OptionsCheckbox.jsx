
import './OptionsCheckbox.scss'
import React from 'react'
import PropTypes from 'prop-types'

const OptionsCheckbox = ({ checked, children, onToggle }) => {
  return (
    <span className="OptionsCheckbox">
      <label>
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <span className="OptionosCheckboxのレーベル">
          {' '}{children}
        </span>
      </label>
    </span>
  )
}

OptionsCheckbox.propTypes = {
  checked: PropTypes.bool,
  children: PropTypes.node,
  onToggle: PropTypes.func
}

export default OptionsCheckbox
