import React, { Component } from 'react'
import Asset from 'bzx-common/src/assets/Asset'

import { TokenGridTab } from '../domain/TokenGridTab'
import { IMarketPair } from '../pages/TradePage'
import '../styles/components/token-grid-tabs.scss'
import { DropdownSelect, IDropDownSelectOption, IDropdownSelectProps } from './DropdownSelect'
import { OpenPositionsButton } from './OpenPositionsButton'

export interface ITokenGridTabsProps {
  tradePairs: { baseToken: Asset; quoteToken: Asset }[]
  selectedMarket: IMarketPair
  isMobile: boolean
  baseTokens: Asset[]
  quoteTokens: Asset[]
  activeTokenGridTab: TokenGridTab
  openedPositionsCount: number

  onMarketSelect: (baseToken: Asset, quoteToken: Asset) => void
  onTokenGridTabChange: (value: TokenGridTab) => void
}

interface ITokenGridTabsState {
  //  isPro: boolean;
  isShowMyTokensOnly: boolean
  isShowHistory: boolean
}

export class TokenGridTabs extends Component<ITokenGridTabsProps, ITokenGridTabsState> {
  constructor(props: ITokenGridTabsProps, context?: any) {
    super(props, context)
    // this.state = {
    // isPro: false
    // }
    // this.onSwitchPro = this.onSwitchPro.bind(this);
  }

  // private renderAsset = (asset: Asset) => {
  //   const assetDetails = AssetsDictionary.assets.get(asset);
  //   if (!assetDetails) return;

  //   const isActiveClassName = asset === this.props.selectedTabAsset && !this.state.isShowMyTokensOnly
  //     ? "trade-token-grid-tab-item--active"
  //     : "";

  //   const classNamePrefix = "trade-token-grid-tab-item";

  //   return (
  //     <div key={`${assetDetails.displayName}`}
  //       className={`${classNamePrefix} ${isActiveClassName} ${asset.toLowerCase()}-tab`}
  //       onClick={(e) => { this.onSelectClick(e, asset) }}
  //     >
  //       <div className={`${classNamePrefix}__col-token-image`}>
  //         {assetDetails.reactLogoSvg.render()}
  //         {!this.props.isMobile ? <span >{assetDetails.displayName}</span> : null}
  //       </div>
  //     </div>
  //   );
  // }

  // private async onSelectClick(event: React.MouseEvent<HTMLElement>, asset: Asset) {
  //   event.stopPropagation();

  //   await this.setState({ ...this.state, isShowMyTokensOnly: false })
  //   await this.props.onShowMyTokensOnlyChange(false);
  //   await this.props.onMarketSelect(asset);
  // };

  private async onDropdownSelect(baseTokenString: string, quoteTokenString: string) {
    this.props.onTokenGridTabChange(TokenGridTab.Chart)
    const baseToken = baseTokenString as Asset
    const quoteToken = quoteTokenString as Asset
    this.props.onMarketSelect(baseToken, quoteToken)
  }

  public render() {
    return (
      <div className={`trade-token-grid-tab`}>
        <div className="trade-token-grid-tab__container">
          <div className="trade-token-grid-tab__items">
            <div className="trade-token-grid-tab__selector">
              <DropdownSelect {...this.getDropdownProps()} />
            </div>
            <div
              className={`tab ${
                this.props.activeTokenGridTab === TokenGridTab.Chart ? `active` : ``
              }`}
              onClick={this.showChart}>
              {TokenGridTab.Chart}
            </div>
            <OpenPositionsButton {...this.props} />
            {process.env.REACT_APP_ETH_NETWORK !== 'bsc' && (
              <div
                className={`tab ${
                  this.props.activeTokenGridTab === TokenGridTab.History ? `active` : ``
                }`}
                onClick={this.showTradeHistory}>
                {TokenGridTab.History}
              </div>
            )}
            <div
              className={`tab ${
                this.props.activeTokenGridTab === TokenGridTab.Stats ? `active` : ``
              }`}
              onClick={this.showStats}>
              {TokenGridTab.Stats}
            </div>
          </div>

          {/* <div className="pro-switch-wrapper">
            <div className="pro-switch"></div>
          </div> */}
          {/* {!this.props.isMobile
            ? <React.Fragment>
              <div className="pro-switch-wrapper">
                <label className={`pro-switch ${this.state.isPro ? `active` : ``}`}>
                  <input type="checkbox" id="checkbox" onChange={this.onSwitchPro} />
                  <div className="slider round"></div>
                </label>
              </div>
            </React.Fragment>
            : null
          } */}
        </div>
      </div>
    )
  }

  public showChart = async () => {
    await this.onDropdownSelect(
      this.props.selectedMarket.baseToken,
      this.props.selectedMarket.quoteToken
    )
  }

  public showTradeHistory = () => {
    this.props.onTokenGridTabChange(TokenGridTab.History)
  }

  public showStats = () => {
    this.props.onTokenGridTabChange(TokenGridTab.Stats)
  }

  private getDropdownProps(): IDropdownSelectProps {
    let dropDownSelectOptions: IDropDownSelectOption[] = []
    if (this.props.tradePairs.length > 0) {
      dropDownSelectOptions = this.props.tradePairs
    } else {
      this.props.baseTokens.forEach((baseToken) => {
        if (baseToken === Asset.DAI) {
          dropDownSelectOptions.push({
            baseToken: baseToken,
            quoteToken: Asset.USDC,
          })
          dropDownSelectOptions.push({
            baseToken: baseToken,
            quoteToken: Asset.USDT,
          })
          return
        }
        this.props.quoteTokens.forEach(
          (stablecoin) =>
            baseToken !== stablecoin &&
            stablecoin !== Asset.WBTC &&
            dropDownSelectOptions.push({
              baseToken: baseToken,
              quoteToken: stablecoin,
            })
        )
        if (baseToken === Asset.ETH) {
          dropDownSelectOptions.push({
            baseToken: baseToken,
            quoteToken: Asset.WBTC,
          })
        }
      })
    }

    const activeDropDownOption = dropDownSelectOptions.find(
      (option) =>
        option.baseToken === this.props.selectedMarket.baseToken &&
        option.quoteToken === this.props.selectedMarket.quoteToken
    )

    return {
      options: dropDownSelectOptions,
      selectedOption: activeDropDownOption || dropDownSelectOptions[0],
      onDropdownSelect: this.onDropdownSelect.bind(this),
    }
  }

  // private onSwitchPro() {
  //   this.setState({ ...this.state, isPro: !this.state.isPro });
  // }
}
