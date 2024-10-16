import React from 'react'
import "./LandingPage.css"
import LeftPanel from './LandingPageOptions/LeftPanel/LeftPanel'
import RightPanel from './LandingPageOptions/RightPanel/RightPanel'

const LandingPage = () => {
  return (
    <div className='LandingPageMain'>
      <div className='LandingPageLeft'>
        <LeftPanel/>
      </div>
      <div className='LandingPageRight'>
        <RightPanel/>
      </div>
    </div>
  )
}

export default LandingPage
