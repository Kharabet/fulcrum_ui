import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { PositionType } from "../domain/PositionType";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { ReactComponent as WalletSvg } from "../assets/images/wallet-icon.svg";

export interface ITokenGridTabsProps {
  selectedKey: TradeTokenKey;
  isMobile: boolean;
  assets: Asset[];

  isShowMyTokensOnly: boolean;
  defaultLeverageShort: number;
  defaultLeverageLong: number;
  isLong: boolean;
  onSelect: (key: TradeTokenKey) => void;

  onTabSelect: (key: Asset) => void;
  onShowMyTokensOnlyChange: (value: boolean) => void;
}

interface ITokenGridTabsState {
  leverage: number;
  positionType: PositionType;

  defaultUnitOfAccount: Asset;
  isShowMyTokensOnly: boolean;
}

export class TokenGridTabs extends Component<ITokenGridTabsProps, ITokenGridTabsState> {
  constructor(props: ITokenGridTabsProps, context?: any) {
    super(props, context);
    this.state = {
      defaultUnitOfAccount: process.env.REACT_APP_ETH_NETWORK === "kovan" ?
        Asset.SAI :
        Asset.DAI,
      positionType: props.isLong ? PositionType.SHORT : PositionType.SHORT,
      leverage: props.isLong ? props.defaultLeverageLong : props.defaultLeverageShort,
      isShowMyTokensOnly: props.isShowMyTokensOnly
    };

  }


  private renderAsset = (asset: Asset) => {
    const assetDetails = AssetsDictionary.assets.get(asset);
    if (!assetDetails) return;

    const isActiveClassName = asset === this.props.selectedKey.asset && !this.state.isShowMyTokensOnly
      ? "trade-token-grid-tab-item--active"
      : "";

    const classNamePrefix = "trade-token-grid-tab-item";


    return (
      <div key={`${assetDetails.displayName}`}
        className={`${classNamePrefix} ${isActiveClassName} ${asset.toLowerCase()}-tab`}
        onClick={(e) => { this.onSelectClick(e, asset) }}
      >
        <div className={`${classNamePrefix}__col-token-image`}>
          {assetDetails.reactLogoSvg.render()}
          <span style={{ color: assetDetails.textColor }}>{assetDetails.displayName}</span>
        </div>
      </div>
    );
  }


  private async onSelectClick(event: React.MouseEvent<HTMLElement>, asset: Asset) {
    event.stopPropagation();

    await this.setState({ ...this.state, isShowMyTokensOnly: false })
    await this.props.onShowMyTokensOnlyChange(false);
    await this.props.onSelect(this.getTradeTokenGridRowSelectionKey(asset));
  };


  public render() {
    var selectedAsset = AssetsDictionary.assets.get(this.props.selectedKey.asset);
    var displayName = !!selectedAsset ? selectedAsset.displayName : "manage"

    return (
      <div className={`trade-token-grid-tab ${displayName && !this.state.isShowMyTokensOnly ? displayName.toLowerCase() : "manage"}`} >
        <div className="trade-token-grid-tab__container">
          {this.props.assets.map(asset => (this.renderAsset(asset)))}
          <div className={`trade-token-grid-tab-item ${this.state.isShowMyTokensOnly ? "trade-token-grid-tab-item--active" : ""}`} onClick={this.showMyTokensOnlyChange}>
            <div className={`trade-token-grid-tab-item__col-token-image wallet-img-div`} >
              {<WalletSvg />}
              <span style={{ color: "#ffffff" }}>Manage</span>
            </div>
          </div>

        </div>
      </div>
    )
  }

  public showMyTokensOnlyChange = async () => {
    await this.props.onShowMyTokensOnlyChange(true);
    await this.setState({ ...this.state, isShowMyTokensOnly: true })
  }

  private getTradeTokenGridRowSelectionKeyRaw(asset: Asset) {
    const key = new TradeTokenKey(asset, this.state.defaultUnitOfAccount, this.state.positionType, this.state.leverage, true, 2);

    // check for version 2, and revert back to version if not found
    if (key.erc20Address === "") {
      key.setVersion(1);
    }

    return key;
  }

  private getTradeTokenGridRowSelectionKey(asset: Asset) {
    return this.getTradeTokenGridRowSelectionKeyRaw(asset);
  }

}
