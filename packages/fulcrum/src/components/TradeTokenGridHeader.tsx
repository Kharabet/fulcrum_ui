import React from 'react'
import ReactTooltip from 'react-tooltip'
import { ReactComponent as IconInfo } from '../assets/images/icon_info.svg'
import { Asset } from '../domain/Asset'
import '../styles/components/tooltip.scss'

export interface ITradeTokenGridHeaderProps {
  quoteToken: Asset | null
}

const TradeTokenGridHeader = (props: ITradeTokenGridHeaderProps) => {
  const midMarketTooltip =
    'Price feeds are provided securely via Chainlink, trades are executed via Kyber. This can result in minor price variations when opening and closing positions.'
  const liqPriceTooltip =
    "An opened positions liquidation point will vary slightly from the displayed estimate depending on it's collateral ratio and exact entry price."
  return (
    <div className="trade-token-grid-header">
      <div className="trade-token-grid-header__col-token-name">
        <span className="trade-token-grid-header__text">Asset</span>
      </div>
      <div className="trade-token-grid-header__col-position-type">
        <span className="trade-token-grid-header__text">&nbsp;</span>
      </div>
      <div className="trade-token-grid-header__col-leverage">
        <span className="trade-token-grid-header__text">Leverage</span>
      </div>
      <div className="trade-token-grid-header__col-price">
        <span className="trade-token-grid-header__text">
          Mid Market Price{' '}
          <label className="trade-token-grid-header__text-asset">{props.quoteToken}</label>
          <IconInfo
            className="tooltip__icon"
            data-tip={midMarketTooltip}
            data-for="mid-market-price-tooltip"
          />
          <ReactTooltip
            id="mid-market-price-tooltip"
            className="tooltip__info"
            place="top"
            effect="solid"
          />
        </span>
      </div>
      <div className="trade-token-grid-header__col-liquidation">
        <span className="trade-token-grid-header__text">
          Liquidation Price{' '}
          <label className="trade-token-grid-header__text-asset">{props.quoteToken}</label>
          <IconInfo
            className="tooltip__icon"
            data-tip={liqPriceTooltip}
            data-for="liq-price-tooltip"
          />
          <ReactTooltip
            id="liq-price-tooltip"
            className="tooltip__info"
            place="top"
            effect="solid"
          />
        </span>
      </div>
      <div className="trade-token-grid-header__col-profit">
        <span className="trade-token-grid-header__text">Est. Yield, vBZRX</span>
      </div>
    </div>
  )
}

export default React.memo(TradeTokenGridHeader)