import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import TagManager from "react-gtm-module";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TradeTransactionMinedEvent } from "../services/events/TradeTransactionMinedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import configProviders from "./../config/providers.json";
// import { Change24HMarker, Change24HMarkerSize } from "./Change24HMarker";
import { LeverageSelector } from "./LeverageSelector";
import { PositionTypeMarker } from "./PositionTypeMarker";
// const tagManagerArgs = {
//     gtmId: configProviders.Google_TrackingID
// }
// TagManager.initialize(tagManagerArgs)

import walletSvg from "../assets/images/wallet-icon.svg";

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
  // version: number;
  // asset:Asset;
  // latestPriceDataPoint: IPriceDataPoint;
  // interestRate: BigNumber;
  // balance: BigNumber;
  // isLoading: boolean;
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

    const isActiveClassName =
      asset === this.props.selectedKey.asset && !this.state.isShowMyTokensOnly ?
        this.props.isMobile ? "trade-footer-grid--active" : "trade-token-grid-head-item--active"
        : "";

    const classNamePrefix = this.props.isMobile ? "trade-token-grid-row" : "trade-token-grid-head-item";
    // const onSelectClick = (event: React.MouseEvent<HTMLElement>) => {
    //   event.stopPropagation();

    //   this.props.onTabSelect(asset);
    // };

    const onSelectClick = async (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      
      await this.setState({...this.state, isShowMyTokensOnly: false})
      await this.props.onShowMyTokensOnlyChange(false);
      await this.props.onSelect(this.getTradeTokenGridRowSelectionKey(asset));
    };

    return (
      <div className={`${this.props.isMobile ? "trade-footer-grid" : classNamePrefix} ${isActiveClassName}`} onClick={onSelectClick}>
        <div
          className={`${classNamePrefix}__col-token-image`}
          style={{ backgroundColor: assetDetails.bgColor, borderLeftColor: assetDetails.bgColor }}
        >
          <img src={assetDetails.logoSvg} alt={assetDetails.displayName} />
        </div>
      </div>
    );
  }


  public render() {
    return (
      <div className="trade-token-grid-head">
        <div className="trade-token-grid-head__container">
          {this.props.assets.map(asset => (this.renderAsset(asset)))}
          <div className={`trade-token-grid-head-item ${this.state.isShowMyTokensOnly ? "trade-token-grid-head-item--active" : ""}`} onClick={this.showMyTokensOnlyChange}>
            <div
              className={`trade-token-grid-head-item__col-token-image wallet-img-div`} >
              <img className={`wallet-img`} src={walletSvg} />
            </div>
          </div>

        </div>
      </div>
    )
  }

  public showMyTokensOnlyChange = async () => {
    await this.props.onShowMyTokensOnlyChange(true);
    await this.setState({...this.state, isShowMyTokensOnly: true})
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
