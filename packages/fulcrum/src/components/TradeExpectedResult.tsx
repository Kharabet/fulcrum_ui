import { BigNumber } from '@0x/utils'
import React from 'react'
import { Preloader } from './Preloader'
import Asset from 'bzx-common/src/assets/Asset'
import { ReactComponent as IconInfo } from '../assets/images/icon_info.svg'
import ReactTooltip from 'react-tooltip'
import { ChiSwitch } from './ChiSwitch'

import '../styles/components/trade-expected-result.scss'

export interface ITradeExpectedResultProps {
  entryPrice: BigNumber
  liquidationPrice: BigNumber
  estimatedFee: BigNumber
  quoteToken: Asset
}

function TradeExpectedResult(props: ITradeExpectedResultProps) {
  const precisionDigits = props.quoteToken === Asset.WBTC ? 4 : 2
  const estimatedFeeChi = props.estimatedFee.times(0.4)

  function formatPrecision(output: BigNumber): string {
    const outputNumber = Number(output)
    const n = Math.log(outputNumber) / Math.LN10
    let x = 2 - n
    x = x < 0 ? 0 : 2
    const result = Number(outputNumber.toFixed(x)).toString()
    return result
  }

  return (
    <div className="trade-expected-result">
      <div className="trade-expected-result__column">
        <div className="trade-expected-result__column-row">
          <div className="trade-expected-result__column-title">Entry Price</div>

          <div
            title={`${props.entryPrice.toFixed(18)}`}
            className="trade-expected-result__column-value">
            <div>
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
        </div>
        <div className="trade-expected-result__column-row">
          <div className="trade-expected-result__column-title">
            Liquidation Price
            <IconInfo
              className="tooltip__icon"
              data-tip="The liquidation price will vary slightly depending on entry price and the value of your positions collateral."
              data-for="liquidation-price"
            />
            <ReactTooltip
              id="liquidation-price"
              className="tooltip__info"
              place="top"
              effect="solid"
            />
          </div>
          <div
            title={`${props.liquidationPrice.toFixed(18)}`}
            className="trade-expected-result__column-value">
            <div>
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
      </div>

      <div className="trade-expected-result__column">
        <div className="trade-expected-result__column-row">
          <div className="trade-expected-result__column-title">
            Fees (Overestimated)
            <IconInfo
              className="tooltip__icon"
              data-tip="Please note our system overestimates gas limits to ensure transactions are processed. They will rarely exceed 90% of the stated cost."
              data-for="fee-estimated"
            />
            <ReactTooltip id="fee-estimated" className="tooltip__info" place="top" effect="solid" />
          </div>
          <div
            title={`${props.estimatedFee.toFixed(18)}`}
            className="trade-expected-result__column-value">
            {props.estimatedFee.eq(0) ? (
              <Preloader width="55px" />
            ) : (
              <span className="trade-expected-result__fee" title={props.estimatedFee.toFixed()}>
                ~$<span className="value">{formatPrecision(props.estimatedFee)}</span>
              </span>
            )}
          </div>
        </div>
        <div className="trade-expected-result__column-row">
          <div className="trade-expected-result__column-title">
            Save{' '}
            <span className="value" title={estimatedFeeChi.toFixed()}>
              {formatPrecision(estimatedFeeChi)}$
            </span>{' '}
            <br />
            with CHI
            <IconInfo
              className="tooltip__icon"
              data-multiline="true"
              data-html={true}
              data-tip="<p>Use CHI token to save on gas fees. 
            CHI will be burned from your wallet, saving you up to 50% on all transaction fees.</p>
            <a href='https://app.uniswap.org/#/swap?inputCurrency=0x0000000000004946c0e9f43f4dee607b0ef1fa1c' class='tooltip__button'  target='blank' rel='noopener noreferrer'>Buy CHI</a>
            <a href='https://1inch-exchange.medium.com/everything-you-wanted-to-know-about-chi-gastoken-a1ba0ea55bf3' class='tooltip__button'  target='blank' rel='noopener noreferrer'>Learn More</a>"
              data-for="chi-estimated"
            />
            <ReactTooltip
              id="chi-estimated"
              className="tooltip__info"
              place="top"
              delayHide={500}
              effect="solid"
            />
          </div>
          <div className="trade-expected-result__column-value">
            <span className="trade-expected-result__chi">CHI enabled</span>
            <ChiSwitch />
          </div>
        </div>
      </div>
    </div>
  )
}
export default React.memo(TradeExpectedResult)
