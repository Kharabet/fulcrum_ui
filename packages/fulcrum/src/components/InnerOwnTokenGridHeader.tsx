import React from 'react'
import ReactTooltip from 'react-tooltip'
import { ReactComponent as IconInfo } from '../assets/images/icon_info.svg'
import Asset from 'bzx-common/src/assets/Asset'

import '../styles/components/tooltip.scss'

export interface IInnerOwnTokenGridHeaderProps {
  asset?: Asset
  quoteToken?: Asset
  loader: boolean
  isLoadingTransaction: boolean
}

const InnerOwnTokenGridHeader = (props: IInnerOwnTokenGridHeaderProps) => {
  return (
    <div className="inner-own-token-grid-header">
      <div
        className={`inner-own-token-grid-header__col-token-image ${
          props.isLoadingTransaction && props.loader ? `opacity` : `opacityIn`
        }`}>
        <span className="inner-own-token-grid-header__text">
          Position <label className="text-asset">{props.asset}</label>
        </span>
      </div>
      <div
        className={`inner-own-token-grid-header__col-asset-type ${
          props.isLoadingTransaction && props.loader ? `opacity` : `opacityIn`
        }`}>
        <span className="inner-own-token-grid-header__text">Type</span>
      </div>
      <div
        className={`inner-own-token-grid-header__col-asset-price ${
          props.isLoadingTransaction && props.loader ? `opacity` : `opacityIn`
        }`}>
        <span className="inner-own-token-grid-header__text">
          Value <label className="text-asset">{props.quoteToken}</label>
        </span>
      </div>
      <div
        className={`inner-own-token-grid-header__col-asset-collateral ${
          props.isLoadingTransaction && props.loader ? `opacity` : `opacityIn`
        }`}>
        <span className="inner-own-token-grid-header__text">
          Collateral <label className="text-asset">{props.asset}</label>
        </span>
      </div>
      <div
        className={`inner-own-token-grid-header__col-position-value ${
          props.isLoadingTransaction && props.loader ? `opacity` : `opacityIn`
        }`}>
        <span className="inner-own-token-grid-header__text">
          Open Price <label className="text-asset">{props.quoteToken}</label>
        </span>
      </div>
      <div
        className={`inner-own-token-grid-header__col-liquidation-price ${
          props.isLoadingTransaction && props.loader ? `opacity` : `opacityIn`
        }`}>
        <span className="inner-own-token-grid-header__text">
          Liquidation Price <label className="text-asset">{props.quoteToken}</label>
        </span>
      </div>
      <div
        className={`inner-own-token-grid-header__col-profit ${
          props.isLoadingTransaction && props.loader ? `opacity` : `opacityIn`
        }`}>
        <span className="inner-own-token-grid-header__text">
          Profit{' '}
          <label className="text-asset">
            {props.asset} | {props.quoteToken}
          </label>
          <IconInfo
            className="tooltip__icon"
            data-tip="Profit is shown in two values, the left is asset amount, the right is in stablecoin value."
            data-for="profit-tooltip"
          />
          <ReactTooltip id="profit-tooltip" className="tooltip__info" place="top" effect="solid" />
        </span>
      </div>
    </div>
  )
}

export default React.memo(InnerOwnTokenGridHeader)
