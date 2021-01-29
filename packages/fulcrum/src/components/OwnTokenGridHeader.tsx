import React from 'react'
import ReactTooltip from 'react-tooltip'
import { ReactComponent as IconInfo } from '../assets/images/icon_info.svg'

const OwnTokenGridHeader = () => {
  const tooltipProfit =
    '<p class="tooltip__info__profit__title">Profit is displayed in two ways:</p><ul class="tooltip__info__profit__ul"><li>Left: value of traded asset</li><li>Right: value of total position profit including collateral change </li></ul>'
  return (
    <div className="own-token-grid-header">
      <div className="own-token-grid-header__col-token-name">
        <span className="own-token-grid-header__text">Pair</span>
      </div>
      {/* <div className="own-token-grid-header__col-position-type">
        <span className="own-token-grid-header__text">Type</span>
      </div> */}
      <div className="own-token-grid-header__col-position">
        <span className="own-token-grid-header__text">Position</span>
      </div>
      <div className="own-token-grid-header__col-asset-price">
        <span className="own-token-grid-header__text">Open Price</span>
      </div>
      <div className="own-token-grid-header__col-liquidation-price">
        <span className="own-token-grid-header__text">Liq. Price</span>
      </div>
      <div className="own-token-grid-header__col-collateral">
        <span className="own-token-grid-header__text">Collateral</span>
      </div>
      <div className="own-token-grid-header__col-position-value">
        <span className="own-token-grid-header__text">Value</span>
      </div>
      <div className="own-token-grid-header__col-profit">
        <span className="own-token-grid-header__text">Profit</span>
        <IconInfo
          className="tooltip__icon"
          data-tip={tooltipProfit}
          data-multiline="true"
          data-html={true}
          data-for="profit-tooltip"
        />
        <ReactTooltip id="profit-tooltip" className="tooltip__info" place="top" effect="solid" />
      </div>
    </div>
  )
}

export default React.memo(OwnTokenGridHeader)
