import React from 'react'
import ReactTooltip from 'react-tooltip'
import { ReactComponent as IconInfo } from '../assets/images/icon_info.svg'

const OwnTokenGridHeader = () => {
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
          data-tip="Profit is shown in two values, the left is asset amount, the right is in stablecoin value."
          data-for="profit-tooltip"
        />
        <ReactTooltip id="profit-tooltip" className="tooltip__info" place="top" effect="solid" />
      </div>
    </div>
  )
}

export default React.memo(OwnTokenGridHeader)