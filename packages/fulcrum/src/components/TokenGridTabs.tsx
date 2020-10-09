import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { ManageTokenGridHeader } from "./ManageTokenGridHeader";
import { IDropDownSelectOption, DropdownSelect, IDropdownSelectProps } from "./DropdownSelect";
import { IMarketPair } from "../pages/TradePage";
import "../styles/components/token-grid-tabs.scss";
import { ManageButton } from "./ManageButton";

export interface ITokenGridTabsProps {
  selectedMarket: IMarketPair;
  isMobile: boolean;
  baseTokens: Asset[];
  quoteTokens: Asset[];
  isShowMyTokensOnly: boolean;
  isShowHistory: boolean;
  openedPositionsCount: number;

  onMarketSelect: (baseToken: Asset, quoteToken: Asset) => void;
  onShowMyTokensOnlyChange: (value: boolean) => void;
  onShowHistory: (value: boolean) => void;
}

interface ITokenGridTabsState {
  //  isPro: boolean;
  isShowMyTokensOnly: boolean;
  isShowHistory: boolean;
}

export class TokenGridTabs extends Component<ITokenGridTabsProps, ITokenGridTabsState> {
  constructor(props: ITokenGridTabsProps, context?: any) {
    super(props, context);
    this.state = {
      isShowMyTokensOnly: props.isShowMyTokensOnly,
      isShowHistory: props.isShowHistory,
      // isPro: false
    };
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
    // if (value === "manage") {
    //   this.showMyTokensOnlyChange();
    //   return;
    // }
    const baseToken = baseTokenString as Asset;
    const quoteToken = quoteTokenString as Asset;

    await this.setState({ ...this.state, isShowMyTokensOnly: false })
    await this.props.onShowMyTokensOnlyChange(false);
    await this.props.onMarketSelect(baseToken, quoteToken);
  }


  public render() {
    // var selectedAsset = AssetsDictionary.assets.get(this.props.selectedTabAsset);
    // var displayName = !!selectedAsset ? selectedAsset.displayName : "manage";

    return (
      <div className={`trade-token-grid-tab`} >
        <div className="trade-token-grid-tab__container">
          <div className="trade-token-grid-tab__selector">
            <DropdownSelect {...this.getDropdownProps()} />
          </div>
          <div className="trade-token-grid-tab__items">
            {/* {this.props.assets.map(asset => (this.renderAsset(asset)))} */}
            <ManageTokenGridHeader
              {...this.props}
              isShowHistory={this.state.isShowHistory}
              updateStateisShowHistory={this.updateStateisShowHistory} />

            <ManageButton {...this.props} isShowMyTokensOnly={this.state.isShowMyTokensOnly} />
          </div>

          <div className="pro-switch-wrapper">
            <div className="pro-switch"></div>
          </div>
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
    await this.props.onShowMyTokensOnlyChange(true);
    await this.setState({ ...this.state, isShowMyTokensOnly: true })
  }

  public updateStateisShowHistory = async (updatedState: boolean) => {
    this.showMyTokensOnlyChange();
    await this.props.onShowHistory(updatedState);
    await this.setState({ isShowHistory: updatedState })
  }

  private getDropdownProps(): IDropdownSelectProps {

    let dropDownSelectOptions: IDropDownSelectOption[] = [];
    this.props.baseTokens.forEach(baseToken => {

      this.props.quoteTokens.forEach(stablecoin =>
        baseToken != stablecoin && dropDownSelectOptions.push({
          baseToken: baseToken,
          quoteToken: stablecoin
        })
      );

    });

    // dropDownSelectOptions.push({
    //   value: "manage",
    //   displayName: "Manage"
    // });

    let activeDropDownOption = dropDownSelectOptions.find(option =>
      option.baseToken === this.props.selectedMarket.baseToken &&
      option.quoteToken === this.props.selectedMarket.quoteToken
    );

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
