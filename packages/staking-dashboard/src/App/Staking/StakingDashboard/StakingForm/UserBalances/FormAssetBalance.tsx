import { BigNumber } from '@0x/utils'
import React from 'react'

interface IFormAssetBalanceProps {
  balance: BigNumber
  link: string
  name: string
  tokenLogo: React.ReactNode
}

export function FormAssetBalance(props: IFormAssetBalanceProps) {
  return (
    <div className="row-container">
      <div className="row-body">
        <a href={props.link} target="_blank" rel="noopener noreferrer">
          <span className="icon">{props.tokenLogo}</span>
        </a>
        <span title={props.balance.toFixed(18, 1)} className="value">
          {props.balance.toFixed(2, 1)}
        </span>
        <div className="row-token">{props.name}</div>
      </div>
    </div>
  )
}

export default React.memo(FormAssetBalance)
