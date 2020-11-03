import React from 'react'
import { TokenGridTab } from '../domain/TokenGridTab'

export interface IOpenPositionsButtonProps {
  openedPositionsCount: number
  activeTokenGridTab: string
  onTokenGridTabChange: (value: TokenGridTab) => void
}

export const OpenPositionsButton = (props: IOpenPositionsButtonProps) => {
  const showOpenPositions = () => {
    props.onTokenGridTabChange(TokenGridTab.Open)
  }
  return (
    <div
      className={`tab ${props.activeTokenGridTab === TokenGridTab.Open ? `active` : ``}`}
      onClick={showOpenPositions}>
      <div className="manage-tab">
        <div className={`trade-token-grid-tab-item__col-token-image`}>
          <span>{TokenGridTab.Open}</span>
          <span className="opened-positions-count">{props.openedPositionsCount}</span>
        </div>
      </div>{' '}
    </div>
  )
}
