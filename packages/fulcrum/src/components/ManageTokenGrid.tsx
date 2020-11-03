import React from 'react'

import { Asset } from '../domain/Asset'
import { IHistoryEvents } from '../domain/IHistoryEvents'
import { HistoryTokenGrid } from './HistoryTokenGrid'
import { IHistoryTokenGridRowProps } from './HistoryTokenGridRow'
import { OwnTokenGrid } from './OwnTokenGrid'
import { IOwnTokenGridRowProps } from './OwnTokenGridRow'

export interface IManageTokenGridProps {
  isMobileMedia: boolean
  isShowHistory: boolean
  ownRowsData: IOwnTokenGridRowProps[]
  historyRowsData: IHistoryTokenGridRowProps[]
  historyEvents: IHistoryEvents | undefined
  stablecoins: Asset[]
  baseTokens: Asset[]
  quoteTokens: Asset[]
  openedPositionsLoaded: boolean
  updateHistoryRowsData: (data: IHistoryTokenGridRowProps[]) => void
}

export const ManageTokenGrid = (props: IManageTokenGridProps) => {
  return (
    <div className="manage-token-grid">
      {props.isShowHistory ? (
        <HistoryTokenGrid
          historyEvents={props.historyEvents}
          historyRowsData={props.historyRowsData}
          isMobileMedia={props.isMobileMedia}
          stablecoins={props.stablecoins}
          baseTokens={props.baseTokens}
          quoteTokens={props.quoteTokens}
          updateHistoryRowsData={props.updateHistoryRowsData}
        />
      ) : (
        <OwnTokenGrid
          ownRowsData={props.ownRowsData}
          isMobileMedia={props.isMobileMedia}         
        />
      )}
    </div>
  )
}
