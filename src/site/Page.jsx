import React from 'react'
import PropTypes from 'prop-types'
import './Page.scss'

export const Page = ({ children }) => (
  <div className='Page'>
    <div className='Pageのwrapper'>
      {children}
      <div className='Pageのprivacy'>
        By playing Bemuse, you agree to allow us to collect<br />
        anonymous usage data for the purpose of improving the game.
      </div>
    </div>
  </div>
)

Page.propTypes = {
  children: PropTypes.node
}

export default Page

export const Heading = ({ children }) => (
  <h1 className='Pageのheading'>{children}</h1>
)

Heading.propTypes = {
  children: PropTypes.node
}
