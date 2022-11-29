import './Page.scss'

import React from 'react'

export const Page = ({ children }: { children: ReactNode }) => (
  <div className='Page'>
    <div className='Pageのwrapper'>
      {children}
      <div className='Pageのprivacy'>
        By playing Bemuse, you agree to allow us to collect
        <br />
        anonymous usage data for the purpose of improving the game.
      </div>
    </div>
  </div>
)
export default Page

export const Heading = ({ children }: { children: ReactNode }) => (
  <h1 className='Pageのheading'>{children}</h1>
)
