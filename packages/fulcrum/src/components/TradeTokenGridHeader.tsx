import React from 'react'
import ReactTooltip from 'react-tooltip'
import { ReactComponent as IconInfo } from '../assets/images/icon_info.svg'
import Asset from 'bzx-common/src/assets/Asset'

import '../styles/components/tooltip.scss'

export interface ITradeTokenGridHeaderProps {
  quoteToken: Asset | null
}

const TradeTokenGridHeader = (props: ITradeTokenGridHeaderProps) => {
  const midMarketTooltip = `<p>The price displayed is based on swapping 1 ETH into the selected asset via Kybers swap rate</p><a href='https://developer.kyber.network/docs/Integrations-PriceFeedSecurity/' target="_blank" rel="noopener noreferrer" class='tooltip__link'>(Learn More)</a>`
  const liqPriceTooltip =
    'The liquidation price will vary slight depending on entry price and the value of your positions collateral.'
  const aprTooltip = 'The % interest paid per year on your position.'
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
            data-multiline="true"
            data-html={true}
            data-tip={midMarketTooltip}
            data-for="mid-market-price-tooltip"
          />
          <ReactTooltip
            id="mid-market-price-tooltip"
            className="tooltip__info"
            place="top"
            effect="solid"
            delayHide={500}
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
        <span className="trade-token-grid-header__text">
          Interest APR
          <IconInfo className="tooltip__icon" data-tip={aprTooltip} data-for="apr-tooltip" />
          <ReactTooltip id="apr-tooltip" className="tooltip__info" place="top" effect="solid" />
        </span>
      </div>
    </div>
  )
}

export default React.memo(TradeTokenGridHeader)
