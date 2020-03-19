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
import { PositionTypeMarkerAlt } from "./PositionTypeMarkerAlt";

import { LeverageSelector } from "./LeverageSelector";
import { PositionTypeMarker } from "./PositionTypeMarker";
import { Preloader } from "./Preloader";


export interface ITradeTokenGridRowProps {
  selectedKey: TradeTokenKey;

  asset: Asset;
  defaultUnitOfAccount: Asset;
  positionType: PositionType;
  defaultLeverage: number;
  defaultTokenizeNeeded: boolean;

  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
}



interface ITradeTokenGridRowState {
  assetDetails: AssetDetails | null;
  leverage: number;
  version: number;

  latestPriceDataPoint: IPriceDataPoint;
  interestRate: BigNumber;
  balance: BigNumber;
  isLoading: boolean;
  pTokenAddress: string;
}

export class TradeTokenGridRow extends Component<ITradeTokenGridRowProps, ITradeTokenGridRowState> {
  constructor(props: ITradeTokenGridRowProps, context?: any) {
    super(props, context);

    const assetDetails = AssetsDictionary.assets.get(props.asset);
    this._isMounted = false;
    this.state = {
      leverage: this.props.defaultLeverage,
      assetDetails: assetDetails || null,
      latestPriceDataPoint: FulcrumProvider.Instance.getPriceDefaultDataPoint(),
      interestRate: new BigNumber(0),
      balance: new BigNumber(0),
      version: 2,
      isLoading: true,
      pTokenAddress: ""
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private _isMounted: boolean;

  private getTradeTokenGridRowSelectionKeyRaw(props: ITradeTokenGridRowProps, leverage: number = this.state.leverage) {
    const key = new TradeTokenKey(props.asset, props.defaultUnitOfAccount, props.positionType, leverage, props.defaultTokenizeNeeded, 2);

    // check for version 2, and revert back to version if not found
    if (key.erc20Address === "") {
      key.setVersion(1);
    }

    return key;
  }

  private getTradeTokenGridRowSelectionKey(leverage: number = this.state.leverage) {
    return this.getTradeTokenGridRowSelectionKeyRaw(this.props, leverage);
  }

  private async derivedUpdate() {
    let version = 2;
    const tradeTokenKey = new TradeTokenKey(this.props.asset, this.props.defaultUnitOfAccount, this.props.positionType, this.state.leverage, this.props.defaultTokenizeNeeded, version);
    if (tradeTokenKey.erc20Address === "") {
      tradeTokenKey.setVersion(1);
      version = 1;
    }

    const latestPriceDataPoint = await FulcrumProvider.Instance.getTradeTokenAssetLatestDataPoint(tradeTokenKey);
    const interestRate = await FulcrumProvider.Instance.getTradeTokenInterestRate(tradeTokenKey);
    const balance = await FulcrumProvider.Instance.getPTokenBalanceOfUser(tradeTokenKey);

    const pTokenAddress = FulcrumProvider.Instance.contractsSource ?
      await FulcrumProvider.Instance.contractsSource.getPTokenErc20Address(tradeTokenKey) || "" :
      "";

    this._isMounted && this.setState(p => ({
      ...this.state,
      latestPriceDataPoint: latestPriceDataPoint,
      interestRate: interestRate,
      balance: balance,
      version: version,
      isLoading: latestPriceDataPoint.price !== 0 ? false : p.isLoading,
      pTokenAddress: pTokenAddress
    }));
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    if (event.key.toString() === this.getTradeTokenGridRowSelectionKey().toString()) {
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

  public componentDidUpdate(
    prevProps: Readonly<ITradeTokenGridRowProps>,
    prevState: Readonly<ITradeTokenGridRowState>,
    snapshot?: any
  ): void {
    const currentTradeTokenKey = this.getTradeTokenGridRowSelectionKey(this.state.leverage);
    const prevTradeTokenKey = this.getTradeTokenGridRowSelectionKeyRaw(prevProps, prevState.leverage);

    if (
      prevState.leverage !== this.state.leverage ||
      (prevProps.selectedKey.toString() === prevTradeTokenKey.toString()) !==
      (this.props.selectedKey.toString() === currentTradeTokenKey.toString())
    ) {
      this.derivedUpdate();
    }
  }

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const tradeTokenKey = this.getTradeTokenGridRowSelectionKey(this.state.leverage);
    const bnPrice = new BigNumber(this.state.latestPriceDataPoint.price);
    const bnLiquidationPrice = new BigNumber(this.state.latestPriceDataPoint.liquidationPrice);
    /*if (this.props.positionType === PositionType.SHORT) {
      bnPrice = bnPrice.div(1000);
      bnLiquidationPrice = bnLiquidationPrice.div(1000);
    }*/
    // bnPrice = bnPrice.div(1000);
    // bnLiquidationPrice = bnLiquidationPrice.div(1000);

    // const bnChange24h = new BigNumber(this.state.latestPriceDataPoint.change24h);
    const isActiveClassName =
      tradeTokenKey.toString() === this.props.selectedKey.toString() ? "trade-token-grid-row--active" : "";

    return (
      <div className={`trade-token-grid-row ${isActiveClassName}`} onClick={this.onSelectClick}>
        <div className="trade-token-grid-row__col-token-name">
          {this.state.pTokenAddress &&
            FulcrumProvider.Instance.web3ProviderSettings &&
            FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
          <a
            className="trade-token-grid-row__col-token-name--inner"
            style={{ cursor: `pointer`, textDecoration: `none`, color: `white` }}
            title={this.state.pTokenAddress}
            href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${this.state.pTokenAddress}#readContract`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {this.state.assetDetails.displayName}
            <PositionTypeMarkerAlt assetDetails={this.state.assetDetails} value={this.props.positionType} />
          </a>
        ) : (
          <div className="trade-token-grid-row__col-token-name--inner">
            {this.state.assetDetails.displayName}
            <PositionTypeMarkerAlt assetDetails={this.state.assetDetails} value={this.props.positionType} />
          </div>
        )}
        </div>
        <div className="trade-token-grid-row__col-position-type">
          <PositionTypeMarker value={this.props.positionType} />
        </div>
        <div className="trade-token-grid-row__col-leverage">
          <div className="leverage-selector__wrapper">
            <LeverageSelector
              asset={this.props.asset}
              value={this.state.leverage}
              minValue={this.props.positionType === PositionType.SHORT ? 1 : 2}
              maxValue={5}
              onChange={this.onLeverageSelect}
            />
          </div>
        </div>
        <div title={`$${bnPrice.toFixed(18)}`} className="trade-token-grid-row__col-price">
          {!this.state.isLoading ?
            <React.Fragment>
              <span className="fw-normal">$</span>{bnPrice.toFixed(2)}
            </React.Fragment>
            :
            <Preloader width="74px"/>
          }
        </div>
        <div title={`$${bnLiquidationPrice.toFixed(18)}`} className="trade-token-grid-row__col-price">
          {
            !this.state.isLoading ?
              <React.Fragment>
                <span className="fw-normal">$</span>{bnLiquidationPrice.toFixed(2)}
              </React.Fragment>
              :
              <Preloader width="74px"/>
          }
        </div>
        <div title={this.state.interestRate.gt(0) ? `${this.state.interestRate.toFixed(18)}%` : ``} className="trade-token-grid-row__col-profit">
          {this.state.interestRate.gt(0) && !this.state.isLoading ?
            <React.Fragment>
              {this.state.interestRate.toFixed(4)}
              <span className="fw-normal">%</span>
            </React.Fragment>
            :
            <Preloader width="74px"/>
          }
        </div>
        {this.renderActions(this.state.balance.eq(0))}
      </div>
    );
  }

  private renderActions = (isBuyOnly: boolean) => {
    return (
      <div className="trade-token-grid-row__col-action">
        <button className="trade-token-grid-row__buy-button trade-token-grid-row__button--size-half" onClick={this.onBuyClick}>
          {TradeType.BUY}
        </button>
      </div>
    )
  };

  public onLeverageSelect = (value: number) => {
    const key = this.getTradeTokenGridRowSelectionKey(value);

    this._isMounted && this.setState({ ...this.state, leverage: value, version: key.version, isLoading: true });

    this.props.onSelect(this.getTradeTokenGridRowSelectionKey(value));
  };

  public onSelectClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onSelect(this.getTradeTokenGridRowSelectionKey());
  };

  public onBuyClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    this.props.onTrade(
      new TradeRequest(
        TradeType.BUY,
        this.props.asset,
        this.props.defaultUnitOfAccount, // TODO: depends on which one they own
        Asset.ETH,
        this.props.positionType,
        this.state.leverage,
        new BigNumber(0),
        this.props.defaultTokenizeNeeded, // TODO: depends on which one they own
        this.state.version
      )
    );
  };

  public onSellClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onTrade(
      new TradeRequest(
        TradeType.SELL,
        this.props.asset,
        this.props.defaultUnitOfAccount, // TODO: depends on which one they own
        this.props.selectedKey.positionType === PositionType.SHORT ? this.props.selectedKey.asset : Asset.DAI,
        this.props.positionType,
        this.state.leverage,
        new BigNumber(0),
        this.props.defaultTokenizeNeeded, // TODO: depends on which one they own
        this.state.version
      )
    );
  };
}
