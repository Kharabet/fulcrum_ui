import { BigNumber } from '@0x/utils'
import React from 'react'
import NumberEasing from 'react-number-easing'

interface IWalletBalanceProps {
  variant: 'green' | ''
  className?: string
  balance: BigNumber
  link?: string
  name: string
  tokenLogo: React.ReactNode
}

export function WalletBalance(props: IWalletBalanceProps) {
  let cssClass = props.variant ? `st-asset-balance--${props.variant}` : 'st-asset-balance'
  if (props.className) {
    cssClass += ` ${props.className}`
  }

  return (
    <div className={cssClass}>
      <a href={props.link} target="_blank" rel="noopener noreferrer">
        <span className="icon">{props.tokenLogo}</span>
      </a>
      <span title={props.balance.toFixed(18, 1)} className="value">
        <NumberEasing
          value={props.balance.toNumber()}
          decimals={0}
          ease='quintInOut' />
        {/* {props.balance.toFixed(2, 1)} */}
      </span>
      <div className="token-label">{props.name}</div>
    </div>
  )
}

WalletBalance.defaultProps = {
  variant: ''
}

export default React.memo(WalletBalance)
