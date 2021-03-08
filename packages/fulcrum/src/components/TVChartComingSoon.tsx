import React from 'react'
import { ReactComponent as GreenCharacterImage } from '../assets/images/geen_character.svg'

export interface ITVChartComingSoonProps {}

function TVChartComingSoon() {
  return (
    <div className="chart-coming-soon-container">
      <div>
        <GreenCharacterImage className="chart-placeholder__mascot" />
      </div>
      <span className="chart-placeholder__text">Chart Coming Soon</span>
    </div>
  )
}

export default React.memo(TVChartComingSoon)
