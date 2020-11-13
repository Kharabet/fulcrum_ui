import React from 'react'
import ReactTooltip from 'react-tooltip'
import { ReactComponent as IconInfo } from '../assets/images/icon_info.svg'
import { Asset } from '../domain/Asset'
import '../styles/components/tooltip.scss'

export interface ITradeTokenGridHeaderProps{
  quoteToken: Asset|null
}
 
export const TradeTokenGridHeader = (props:ITradeTokenGridHeaderProps) => {
  const info =
    'Price feeds are provided securely via Chainlink, trades are executed via Kyber. This can result in minor price variations when opening and closing positions.'

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
          Mid Market Price <strong>{props.quoteToken}</strong>
          <IconInfo className="tooltip__icon" data-tip={info} />
          <ReactTooltip className="tooltip__info" place="top" effect="solid" />
        </span>
      </div>
      <div className="trade-token-grid-header__col-liquidation">
        <span className="trade-token-grid-header__text">Liquidation Price <strong>{props.quoteToken}</strong></span>
      </div>
      <div className="trade-token-grid-header__col-profit">
        <span className="trade-token-grid-header__text">Est. Yield, vBZRX</span>
      </div>
    </div>
  )
}
