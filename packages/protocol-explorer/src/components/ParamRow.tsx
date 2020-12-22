import { BigNumber } from '@0x/utils'
import React from 'react'
import { Asset } from '../domain/Asset'
import { Platform } from '../domain/Platform'
import CopyToClipboard from './CopyToClipboard'

export interface IParamRowProps {
  principal: Asset
  collateral: Asset
  platform: Platform
  loanId: string
  initialMargin: BigNumber
  maintenanceMargin: BigNumber
  liquidationPenalty: BigNumber
}

const ParamRow = (props: IParamRowProps) => {
  const getShortHash = (hash: string, count: number) => {
    return hash.substring(0, 8) + '...' + hash.substring(hash.length - count)
  }
  return (
    <React.Fragment>
      <div className="table-row table-row-param">
        <div className="table-row-param__pair">
          {props.principal}-{props.collateral}
        </div>
        <div title={props.loanId} className="table-row-param__hash">
          <span className="table-row-param__from-address">{getShortHash(props.loanId, 24)}</span>
          <CopyToClipboard>{props.loanId}</CopyToClipboard>
        </div>
        <div className="table-row-param__value">{props.initialMargin.toFixed()}%</div>     
        <div className="table-row-param__value">{props.maintenanceMargin.toFixed()}%</div>
        <div className="table-row-param__value">{props.liquidationPenalty.toFixed()}%</div>
      </div>
    </React.Fragment>
  )
}

export default React.memo(ParamRow)
