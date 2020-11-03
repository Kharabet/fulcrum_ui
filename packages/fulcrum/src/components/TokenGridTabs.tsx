import React, { Component } from 'react'
import { Asset } from '../domain/Asset'
import { TokenGridTab } from '../domain/TokenGridTab'
import { IMarketPair } from '../pages/TradePage'
import '../styles/components/token-grid-tabs.scss'
import { DropdownSelect, IDropDownSelectOption, IDropdownSelectProps } from './DropdownSelect'
import { ManageTokenGridHeader } from './ManageTokenGridHeader'
import { OpenPositionsButton } from './OpenPositionsButton'

export interface ITokenGridTabsProps {
  selectedMarket: IMarketPair
  isMobile: boolean
  baseTokens: Asset[]
  quoteTokens: Asset[]
  isShowMyTokensOnly: boolean
  isShowHistory: boolean
  activeTokenGridTab: TokenGridTab
  openedPositionsCount: number

  onMarketSelect: (baseToken: Asset, quoteToken: Asset) => void
  onShowMyTokensOnlyChange: (value: boolean) => void
  onShowHistory: (value: boolean) => void
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
    this.state = {
      isShowMyTokensOnly: props.isShowMyTokensOnly,
      isShowHistory: props.isShowHistory
      // isPro: false
    }
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
    
    const baseToken = baseTokenString as Asset
    const quoteToken = quoteTokenString as Asset

    // this.setState({ ...this.state, isShowMyTokensOnly: false })
    // this.props.onShowMyTokensOnlyChange(false)
    this.props.onTokenGridTabChange(TokenGridTab.Chart)
    this.props.onMarketSelect(baseToken, quoteToken)
  }

  public render() {
    // var selectedAsset = AssetsDictionary.assets.get(this.props.selectedTabAsset);
    // var displayName = !!selectedAsset ? selectedAsset.displayName : "manage";

    return (
      <div className={`trade-token-grid-tab`}>
        <div className="trade-token-grid-tab__container">
          <div className="trade-token-grid-tab__selector">
            <DropdownSelect {...this.getDropdownProps()} />
          </div>
          <div className="trade-token-grid-tab__items">
            {/* <ManageTokenGridHeader
              {...this.props}
              isShowMyTokensOnly={this.state.isShowMyTokensOnly}
              isShowHistory={this.state.isShowHistory}
              updateStateisShowHistory={this.updateStateisShowHistory}
            /> */}
            <div
              className={`tab ${this.props.activeTokenGridTab === TokenGridTab.Chart ? `active` : ``}`}
              onClick={this.showChart}>
              {TokenGridTab.Chart}
            </div>            
            <OpenPositionsButton {...this.props}/> 
            <div
              className={`tab ${this.props.activeTokenGridTab === TokenGridTab.History ? `active` : ``}`}
              onClick={this.showTradeHistory}>
                {TokenGridTab.History}
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

  public showMyTokensOnlyChange = async () => {
    this.props.onShowMyTokensOnlyChange(true)
    this.setState({ ...this.state, isShowMyTokensOnly: true })
  }

  public showChart = async () => {
    await this.onDropdownSelect(this.props.selectedMarket.baseToken,this.props.selectedMarket.quoteToken)  
  }

  public showTradeHistory = async () => {
    
    this.props.onTokenGridTabChange(TokenGridTab.History)
  }

  // public updateStateisShowHistory = async (updatedState: boolean) => {
  //   await this.showMyTokensOnlyChange()
  //   this.props.onShowHistory(updatedState)
  //   this.setState({ isShowHistory: updatedState })
  // }

  private getDropdownProps(): IDropdownSelectProps {
    const dropDownSelectOptions: IDropDownSelectOption[] = []
    this.props.baseTokens.forEach((baseToken) => {
      this.props.quoteTokens.forEach(
        (stablecoin) =>
          baseToken !== stablecoin &&
          dropDownSelectOptions.push({
            baseToken: baseToken,
            quoteToken: stablecoin
          })
      )
    })

    // dropDownSelectOptions.push({
    //   value: "manage",
    //   displayName: "Manage"
    // });

    const activeDropDownOption = dropDownSelectOptions.find(
      (option) =>
        option.baseToken === this.props.selectedMarket.baseToken &&
        option.quoteToken === this.props.selectedMarket.quoteToken
    )

    return {
      options: dropDownSelectOptions,
      selectedOption: activeDropDownOption || dropDownSelectOptions[0],
      onDropdownSelect: this.onDropdownSelect.bind(this)
    }
  }

  // private onSwitchPro() {
  //   this.setState({ ...this.state, isPro: !this.state.isPro });
  // }
}
