import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TradeTransactionMinedEvent } from "../services/events/TradeTransactionMinedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { PositionTypeMarker } from "./PositionTypeMarker";
import { PositionTypeMarkerAlt } from "./PositionTypeMarkerAlt";
// import { Change24HMarker, Change24HMarkerSize } from "./Change24HMarker";
import { Preloader } from "./Preloader";


export interface IOwnTokenCardMobileProps {
  selectedKey: TradeTokenKey;
  currentKey: TradeTokenKey;

  // onDetails: (key: TradeTokenKey) => void;
  // onManageCollateral: (request: ManageCollateralRequest) => void;
  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
}

interface IOwnTokenCardMobileState {
  assetDetails: AssetDetails | null;

  latestAssetPriceDataPoint: IPriceDataPoint;
  assetBalance: BigNumber | null;
  profit: BigNumber | null;
  pTokenAddress: string;
  isLoading: boolean;
}

export class OwnTokenCardMobile extends Component<IOwnTokenCardMobileProps, IOwnTokenCardMobileState> {
  constructor(props: IOwnTokenCardMobileProps, context?: any) {
    super(props, context);

    const assetDetails = AssetsDictionary.assets.get(props.currentKey.asset);

    this._isMounted = false;
    this.state = {
      assetDetails: assetDetails || null,
      latestAssetPriceDataPoint: FulcrumProvider.Instance.getPriceDefaultDataPoint(),
      assetBalance: new BigNumber(0),
      profit: new BigNumber(0),
      pTokenAddress: "",
      isLoading: true
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private _isMounted: boolean;

  private getTradeTokenGridRowSelectionKeyRaw(props: IOwnTokenCardMobileProps, leverage: number = this.props.currentKey.leverage) {
    return new TradeTokenKey(this.props.currentKey.asset, this.props.currentKey.unitOfAccount, this.props.currentKey.positionType, leverage, this.props.currentKey.isTokenized, this.props.currentKey.version);
  }

  private getTradeTokenGridRowSelectionKey(leverage: number = this.props.currentKey.leverage) {
    return this.getTradeTokenGridRowSelectionKeyRaw(this.props, leverage);
  }

  private async derivedUpdate() {
    const tradeTokenKey = new TradeTokenKey(
      this.props.currentKey.asset,
      this.props.currentKey.unitOfAccount,
      this.props.currentKey.positionType,
      this.props.currentKey.leverage,
      this.props.currentKey.isTokenized,
      this.props.currentKey.version
    );
    const latestAssetPriceDataPoint = await FulcrumProvider.Instance.getTradeTokenAssetLatestDataPoint(tradeTokenKey);

    const data: [BigNumber | null, BigNumber | null] = await FulcrumProvider.Instance.getTradeBalanceAndProfit(tradeTokenKey);
    const assetBalance = data[0];
    const profit = data[1];

    const address = FulcrumProvider.Instance.contractsSource ?
      await FulcrumProvider.Instance.contractsSource.getPTokenErc20Address(tradeTokenKey) || "" :
      "";

    // const precision = AssetsDictionary.assets.get(this.props.selectedKey.loanAsset)!.decimals || 18;
    // const balanceString = this.props.balance.dividedBy(10 ** precision).toFixed();

    this._isMounted && this.setState(p => ({
      ...this.state,
      latestAssetPriceDataPoint: latestAssetPriceDataPoint,
      assetBalance: assetBalance,
      profit: profit,
      pTokenAddress: address,
      isLoading: latestAssetPriceDataPoint.price !== 0 ? false : p.isLoading
    }));
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    if (event.key.toString() === this.props.currentKey.toString()) {
      await this.derivedUpdate();
    }
  };

  public componentWillUnmount(): void {
    this._isMounted = false;

    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public componentDidMount(): void {
    this._isMounted = true;

    this.derivedUpdate();
  }

  /*public componentDidUpdate(
    prevProps: Readonly<IOwnTokenGridRowProps>,
    prevState: Readonly<IOwnTokenGridRowState>,
    snapshot?: any
  ): void {
    if (
      prevProps.currentKey.leverage !== this.props.currentKey.leverage ||
      (prevProps.selectedKey.toString() === prevProps.currentKey.toString()) !==
        (this.props.selectedKey.toString() === this.props.currentKey.toString())
    ) {
      this.derivedUpdate();
    }
  }*/

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const bnPrice = new BigNumber(this.state.latestAssetPriceDataPoint.price);
    const bnLiquidationPrice = new BigNumber(this.state.latestAssetPriceDataPoint.liquidationPrice);
    /*if (this.props.currentKey.positionType === PositionType.SHORT) {
      bnPrice = bnPrice.div(1000);
      bnLiquidationPrice = bnLiquidationPrice.div(1000);
    }*/
    return (
      <div className="own-token-card-mobile">
        <div className="own-token-card-mobile__body">
          <div className="own-token-card-mobile__body-row">
            <div className="asset-name">
              {this.state.pTokenAddress &&
                FulcrumProvider.Instance.web3ProviderSettings &&
                FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
                  <a
                    className="own-token-card-mobile__token-name-full"
                    style={{ cursor: `pointer`, textDecoration: `none` }}
                    rel="noopener noreferrer"
                  >
                    {this.state.assetDetails.displayName}&nbsp;
              <PositionTypeMarkerAlt assetDetails={this.state.assetDetails} value={this.props.currentKey.positionType} />&nbsp;
              {`${this.props.currentKey.leverage}x`}
                  </a>
                ) : (
                  <div className="own-token-card-mobile__token-name-full">{`${this.state.assetDetails.displayName}`}&nbsp;
            <PositionTypeMarkerAlt assetDetails={this.state.assetDetails} value={this.props.currentKey.positionType} />&nbsp;
            {`${this.props.currentKey.leverage}x`}
                  </div>)}
            </div>
            <div className="own-token-card-mobile__position-type">
              <PositionTypeMarker value={this.props.currentKey.positionType} />
            </div>
            <div className="own-token-card-mobile__action" style={{ textAlign: `right` }}>
              <button className="own-token-card-mobile__sell-button own-token-card-mobile__button--size-half" onClick={this.onSellClick}>
                {TradeType.SELL}
              </button>
            </div>

          </div>
          <div className="own-token-card-mobile__body-row">
            <div title={this.props.currentKey.unitOfAccount} className="own-token-card-mobile__unit-of-account">
              <span>Unit of Account</span>
              <span>{this.props.currentKey.unitOfAccount}</span>
            </div>

            <div title={`$${bnPrice.toFixed(18)}`} className="own-token-card-mobile__price">
              <span>Asset Price</span>
              <span>
                {!this.state.isLoading ?
                  <React.Fragment><span className="fw-normal">$</span>{bnPrice.toFixed(2)}</React.Fragment>
                  : <Preloader width="74px"/>
                }
              </span>
            </div>
            <div title={`$${bnLiquidationPrice.toFixed(18)}`} className="own-token-card-mobile__price">
              <span>Liquidation Price</span>
              <span>
                {!this.state.isLoading ?
                  <React.Fragment><span className="fw-normal">$</span>{bnLiquidationPrice.toFixed(2)}</React.Fragment>
                  : <Preloader width="74px"/>
                }
              </span>
            </div>
          </div>
          <div className="own-token-card-mobile__body-row">

            <div className="own-token-card-mobile__empty">
            </div>
            <div title={this.state.assetBalance ? `$${this.state.assetBalance.toFixed(18)}` : ``} className="own-token-card-mobile__position-value">
              <span>Position Value</span>
              <span>
                {!this.state.isLoading ?
                  this.state.assetBalance ?
                    <React.Fragment><span className="fw-normal">$</span>{this.state.assetBalance.toFixed(2)}</React.Fragment> :
                    <React.Fragment><span className="fw-normal">$</span>0.00</React.Fragment> :
                  <Preloader width="74px"/>
                }
              </span>
            </div>
            <div title={this.state.profit ? `$${this.state.profit.toFixed(18)}` : ``} className="own-token-card-mobile__profit">
              <span>Profit</span>
              <span>
                {!this.state.isLoading ?
                  this.state.profit ?
                    <React.Fragment><span className="fw-normal">$</span>{this.state.profit.toFixed(2)}</React.Fragment> :
                    <React.Fragment><span className="fw-normal">$</span>0.0000</React.Fragment> :
                  <Preloader width="74px"/>
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  public onSelectClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onSelect(this.getTradeTokenGridRowSelectionKey());
  };

  public onDetailsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    // this.props.onDetails(this.props.currentKey);
  };

  public onManageClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    // this.props.onManageCollateral(new ManageCollateralRequest(new BigNumber(0)));
  };

  public onSellClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onTrade(
      new TradeRequest(
        TradeType.SELL,
        this.props.currentKey.asset,
        this.props.currentKey.unitOfAccount,
        this.props.currentKey.positionType === PositionType.SHORT ? this.props.currentKey.asset : Asset.USDC,
        this.props.currentKey.positionType,
        this.props.currentKey.leverage,
        new BigNumber(0),
        this.props.currentKey.isTokenized,
        this.props.currentKey.version
      )
    );
  };
}
