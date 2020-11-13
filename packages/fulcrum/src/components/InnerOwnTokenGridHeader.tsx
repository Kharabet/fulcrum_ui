import React, { Component } from 'react'
import { Asset } from '../domain/Asset'
import ReactTooltip from 'react-tooltip'
import { ReactComponent as IconInfo } from '../assets/images/icon_info.svg'
import '../styles/components/tooltip.scss'

export interface IInnerOwnTokenGridHeaderProps {
  asset?: Asset
  quoteToken?: Asset
  loader: boolean
  isLoadingTransaction: boolean
}

export class InnerOwnTokenGridHeader extends Component<IInnerOwnTokenGridHeaderProps> {
  public render() {
    return (
      <div className="inner-own-token-grid-header">
        <div
          className={`inner-own-token-grid-header__col-token-image ${
            this.props.isLoadingTransaction && this.props.loader ? `opacity` : `opacityIn`
          }`}>
          <span className="inner-own-token-grid-header__text">Position <label className="text-asset">{this.props.asset}/{this.props.quoteToken}</label></span>
        </div>
        <div
          className={`inner-own-token-grid-header__col-asset-type ${
            this.props.isLoadingTransaction && this.props.loader ? `opacity` : `opacityIn`
          }`}>
          <span className="inner-own-token-grid-header__text">Type</span>
        </div>
        <div
          className={`inner-own-token-grid-header__col-asset-price ${
            this.props.isLoadingTransaction && this.props.loader ? `opacity` : `opacityIn`
          }`}>
          <span className="inner-own-token-grid-header__text">Value <label className="text-asset">{this.props.quoteToken}</label></span>
        </div>
        <div
          className={`inner-own-token-grid-header__col-asset-collateral ${
            this.props.isLoadingTransaction && this.props.loader ? `opacity` : `opacityIn`
          }`}>
          <span className="inner-own-token-grid-header__text">Collateral <label className="text-asset">{this.props.asset}</label></span>
        </div>
        <div
          className={`inner-own-token-grid-header__col-position-value ${
            this.props.isLoadingTransaction && this.props.loader ? `opacity` : `opacityIn`
          }`}>
          <span className="inner-own-token-grid-header__text">Open Price <label className="text-asset">{this.props.quoteToken}</label></span>
        </div>
        <div
          className={`inner-own-token-grid-header__col-liquidation-price ${
            this.props.isLoadingTransaction && this.props.loader ? `opacity` : `opacityIn`
          }`}>
          <span className="inner-own-token-grid-header__text">Liquidation Price <label className="text-asset">{this.props.quoteToken}</label></span>
        </div>
        <div
          className={`inner-own-token-grid-header__col-profit ${
            this.props.isLoadingTransaction && this.props.loader ? `opacity` : `opacityIn`
          }`}>
          <span className="inner-own-token-grid-header__text">Profit <label className="text-asset">{this.props.asset}/{this.props.quoteToken}</label>
          <IconInfo className="tooltip__icon" data-tip={`Hello world`} />
          <ReactTooltip className="tooltip__info" place="top" effect="solid" /></span>
        </div>
      </div>
    )
  }
}
