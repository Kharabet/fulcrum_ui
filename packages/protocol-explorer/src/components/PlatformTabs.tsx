import React from 'react'
import { Platform } from '../domain/Platform'

export interface IPlatformTabsProps {
  activePlatform: Platform
  onPlatformChange: (value: Platform) => void
}

export const PlatformTabs = (props: IPlatformTabsProps) => {
  const changePlatform = (platform: Platform) => {
    props.onPlatformChange(platform)
  }

  return (
    <div className={`platform-tab`}>
      <div className="platform-tab__container">
        <div className="platform-tab__items">
          <div
            className={`tab ${props.activePlatform === Platform.Fulcrum ? `active` : ``}`}
            onClick={() => changePlatform(Platform.Fulcrum)}>
            {Platform.Fulcrum}
          </div>
          <div
            className={`tab ${props.activePlatform === Platform.Torque ? `active` : ``}`}
            onClick={() => changePlatform(Platform.Torque)}>
            {Platform.Torque}
          </div>
        </div>
      </div>
    </div>
  )
}
