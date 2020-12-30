import { BigNumber } from '@0x/utils'
import React from 'react'
import { Preloader } from './Preloader'
import Asset from 'bzx-common/src/assets/Asset'

import '../styles/components/trade-expected-result.scss'


export interface ITradeExpectedResultProps {
  entryPrice: BigNumber
  liquidationPrice: BigNumber
  quoteToken: Asset
}

function TradeExpectedResult(props: ITradeExpectedResultProps) {
  const precisionDigits = props.quoteToken === Asset.WBTC ? 4 : 2

  return (
    <div className="trade-expected-result">
      <div className="trade-expected-result__column">
        <div className="trade-expected-result__column-title">Entry Price</div>
        <div
          title={`${props.entryPrice.toFixed(18)}`}
          className="trade-expected-result__column-value">
          <span className="value">
            {props.entryPrice.eq(0) ? (
              <Preloader width="55px" />
            ) : (
              props.entryPrice.toFixed(precisionDigits)
            )}
          </span>
          &nbsp;{props.quoteToken}
        </div>
      </div>

      <div className="trade-expected-result__column">
        <div className="trade-expected-result__column-title">Liquidation Price</div>
        <div
          title={`${props.liquidationPrice.toFixed(18)}`}
          className="trade-expected-result__column-value">
          <span className="value">
            {props.liquidationPrice.eq(0) ? (
              <Preloader width="55px" />
            ) : (
              props.liquidationPrice.toFixed(precisionDigits)
            )}
          </span>
          &nbsp;{props.quoteToken}
        </div>
      </div>
    </div>
  )
}
export default React.memo(TradeExpectedResult)