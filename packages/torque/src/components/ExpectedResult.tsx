import { BigNumber } from '@0x/utils'
import React from 'react'
import Asset from 'bzx-common/src/assets/Asset'
import { ReactComponent as IconInfo } from '../assets/images/icon_info.svg'
import ReactTooltip from 'react-tooltip'
import { ChiSwitch } from './ChiSwitch'

export interface IExpectedResultProps {
  collaterizationPercents: string
  liquidationPrice: BigNumber
  estimatedFee: BigNumber
  quoteToken: Asset
  loanStatus: string
}

function ExpectedResult(props: IExpectedResultProps) {
  const precisionDigits = props.quoteToken === Asset.WBTC ? 4 : 2
  const estimatedFeeChi = props.estimatedFee.times(0.4)

  function formatPrecision(output: BigNumber): string {
    const outputNumber = Number(output)
    const n = Math.log(outputNumber) / Math.LN10
    let x = 2 - n
    if (x < 0) x = 0
    if (x > 5) x = 5
    const result = Number(outputNumber.toFixed(x)).toString()
    return result
  }

  return (
    <div className="expected-result">
      <div className="expected-result__column">
        <div className="expected-result__column-row">
          <div className="expected-result__column-title">Collateralized</div>

          <div className="expected-result__column-value">
            <div>
              <span className={`value ${props.loanStatus}`}>
                {props.collaterizationPercents}
              </span>
              %
            </div>
          </div>
        </div>
        <div className="expected-result__column-row">
          <div className="expected-result__column-title">Liquidation Price</div>
          <div
            title={`${props.liquidationPrice.toFixed(18)}`}
            className="expected-result__column-value">
            <div>
              <span className={`value ${props.loanStatus}`}>
                {props.liquidationPrice.toFixed(precisionDigits)}
              </span>
              &nbsp;{props.quoteToken}
            </div>
          </div>
        </div>
      </div>

      <div className="expected-result__column">
        <div className="expected-result__column-row">
          <div className="expected-result__column-title">
            Gas Fees
            <IconInfo
              className="tooltip__icon"
              data-tip="Please note our system overestimates gas limits to ensure transactions are processed. They will rarely exceed 90% of the stated cost."
              data-for="fee-estimated"
            />
            <ReactTooltip id="fee-estimated" className="tooltip__info" place="top" effect="solid" />
          </div>
          <div
            title={`${props.estimatedFee.toFixed(18)}`}
            className="expected-result__column-value">
            {props.estimatedFee.eq(0) ? (
              <span className="expected-result__fee">-</span>
            ) : (
              <span className="expected-result__fee" title={props.estimatedFee.toFixed()}>
                ~$<span className="value">{formatPrecision(props.estimatedFee)}</span>
              </span>
            )}
          </div>
        </div>
        <div className="expected-result__column-row">
          <div className="expected-result__column-title">
            Save&nbsp;
            <span className="value" title={estimatedFeeChi.toFixed()}>
              {props.estimatedFee.eq(0) ? '' : `${formatPrecision(estimatedFeeChi)}$ `}
            </span>
            with CHI
            <IconInfo
              className="tooltip__icon"
              data-multiline="true"
              data-html={true}
              data-tip="<p>Use CHI token to save on gas fees. 
            CHI will be burned from your wallet, saving you up to 50% on all transaction fees.</p>
            <a href='https://app.uniswap.org/#/swap?inputCurrency=0x0000000000004946c0e9f43f4dee607b0ef1fa1c' class='tooltip__button' target='blank'>Buy CHI</a>
            <a href='https://1inch-exchange.medium.com/everything-you-wanted-to-know-about-chi-gastoken-a1ba0ea55bf3' class='tooltip__button' target='blank'>Learn More</a>"
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
          <div className="expected-result__column-value">
            <span className="expected-result__chi">CHI enabled</span>
            <ChiSwitch noLabel={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default React.memo(ExpectedResult)
