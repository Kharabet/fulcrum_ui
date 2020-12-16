import { BigNumber } from '@0x/utils'
import React from 'react'
import { ReactComponent as IconArrow } from '../assets/images/icon-tx-arrow.svg'
import { Asset } from '../domain/Asset'

export interface IParamRowProps {
  principal: Asset
  collateral: Asset
  platform: string
  loanId: string
  etherscanAddressUrl: string
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
        <a
          href={props.etherscanAddressUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="table-row-param__hash">
          <IconArrow />
          <span className="table-row-param__from-address">{getShortHash(props.loanId, 12)}</span>
        </a>
        <div className="table-row-param__value">{props.maintenanceMargin.toFixed()}</div>
        <div className="table-row-param__value">{props.initialMargin.toFixed()}</div>
        <div className="table-row-param__value">{props.liquidationPenalty.toFixed()}</div>
      </div>
    </React.Fragment>
  )
}

export default React.memo(ParamRow)
