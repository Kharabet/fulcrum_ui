import React from 'react'
import ReactTooltip from 'react-tooltip'
import { ReactComponent as IconInfo } from '../assets/images/icon_info.svg'
import Asset from 'bzx-common/src/assets/Asset'

import '../styles/components/tooltip.scss'
import { PositionType } from '../domain/PositionType'

export interface IInnerOwnTokenGridHeaderProps {
  asset?: Asset
  quoteToken?: Asset
  loader: boolean
  isLoadingTransaction: boolean
  positionType: PositionType
}

const InnerOwnTokenGridHeader = (props: IInnerOwnTokenGridHeaderProps) => {
  const insertProfitTooltip =
    props.positionType === PositionType.LONG
      ? `<ul class="tooltip__info__profit__ul"><li>Left: value of traded asset</li><li>Right: value of total position profit including collateral change </li></ul><p class="ta-c">${props.asset}/${props.quoteToken} pair for example</p><div class="tooltip__info__profit__table"><div class="short-label">Profit in ${props.asset}</div><div>Profit in ${props.quoteToken} + the change of your ${props.asset} collateral</div></div>`
      : `<ul class="tooltip__info__profit__ul"><li>Left: value of total position profit including collateral change </li><li>Right: value of traded asset</li></ul><p class="ta-c">${props.asset}/${props.quoteToken} pair for example</p><div class="tooltip__info__profit__table"><div>Profit in ${props.asset} + the change of your ${props.quoteToken} collateral</div><div class="short-label">Profit in ${props.quoteToken}</div></div>`
  const profitTooltip = `<p class="tooltip__info__profit__title">Profit is displayed in two ways:</p>${insertProfitTooltip}`

  return (
    <div className="inner-own-token-grid-header">
      <div
        className={`inner-own-token-grid-header__col-token-image ${
          props.isLoadingTransaction && props.loader ? `opacity` : `opacityIn`
        }`}>
        <span className="inner-own-token-grid-header__text"></span>
      </div>

      <div
        className={`inner-own-token-grid-header__col-asset-price ${
          props.isLoadingTransaction && props.loader ? `opacity` : `opacityIn`
        }`}>
        <span className="inner-own-token-grid-header__text">
          Position Value <label className="text-asset">{props.quoteToken}</label>
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
          Profit
          <IconInfo
            className="tooltip__icon"
            data-tip={profitTooltip}
            data-multiline="true"
            data-html={true}
            data-for="profit-tooltip"
          />
          <ReactTooltip
            id="profit-tooltip"
            className="tooltip__info tooltip__info__profit"
            place="top"
            effect="solid"
          />
        </span>
      </div>
    </div>
  )
}

export default React.memo(InnerOwnTokenGridHeader)
