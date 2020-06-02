import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
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
import siteConfig from "../config/SiteConfig.json";

import { LeverageSelector } from "./LeverageSelector";
import { PositionTypeMarker } from "./PositionTypeMarker";
import { Preloader } from "./Preloader";
import { RequestTask } from "../domain/RequestTask";
import { RequestStatus } from "../domain/RequestStatus";


export interface ITradeTokenGridRowProps {

  asset: Asset;
  defaultUnitOfAccount: Asset;
  positionType: PositionType;
  defaultLeverage: number;
  defaultTokenizeNeeded: boolean;

  onTrade: (request: TradeRequest) => void;
  changeLoadingTransaction: (isLoadingTransaction: boolean, request: TradeRequest | undefined, resultTx: boolean) => void;
}

interface ITradeTokenGridRowState {
  assetDetails: AssetDetails | null;
  leverage: number;
  version: number;

  latestPriceDataPoint: IPriceDataPoint;
  interestRate: BigNumber;
  balance: BigNumber;
  isLoading: boolean;
  isLoadingTransaction: boolean;
  request: TradeRequest | undefined;
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
      isLoadingTransaction: false,
      request: undefined,
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
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
    const interestRate = new BigNumber(0); // await FulcrumProvider.Instance.getTradeTokenInterestRate(tradeTokenKey);
    const balance = new BigNumber(0); // await FulcrumProvider.Instance.getPTokenBalanceOfUser(tradeTokenKey);

    this._isMounted && this.setState({
      ...this.state,
      latestPriceDataPoint: latestPriceDataPoint,
      interestRate: interestRate,
      balance: balance,
      version: version,
      isLoading: latestPriceDataPoint.price !== 0 ? false : this.state.isLoading
    });
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

  private onAskToOpenProgressDlg = (taskId: number) => {
    if (!this.state.request || taskId !== this.state.request.id) return;
    this.setState({ ...this.state, isLoadingTransaction: true });
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, true);
  }
  private onAskToCloseProgressDlg = (task: RequestTask) => {
    if (!this.state.request || task.request.id !== this.state.request.id) return;
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        FulcrumProvider.Instance.onTaskCancel(task);
        this.setState({ ...this.state, isLoadingTransaction: false, request: undefined })
        this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, false)
      }, 5000)
      return;
    }
    this.setState({ ...this.state, isLoadingTransaction: false, request: undefined });
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, false)
  }

  public componentWillUnmount(): void {
    this._isMounted = false;

    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
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
    if (prevState.leverage !== this.state.leverage) {
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

    return (
      <div className={`trade-token-grid-row `}>
        <div className="trade-token-grid-row__col-token-name">
          <div className="trade-token-grid-row__col-token-name--inner">
            {this.state.assetDetails.displayName}
            <PositionTypeMarkerAlt assetDetails={this.state.assetDetails} value={this.props.positionType} />
          </div>
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
            <Preloader width="74px" />
          }
        </div>
        <div title={`$${bnLiquidationPrice.toFixed(18)}`} className="trade-token-grid-row__col-price">
          {
            !this.state.isLoading ?
              <React.Fragment>
                <span className="fw-normal">$</span>{bnLiquidationPrice.toFixed(2)}
              </React.Fragment>
              :
              <Preloader width="74px" />
          }
        </div>
        <div title={this.state.interestRate.gt(0) ? `${this.state.interestRate.toFixed(18)}%` : ``} className="trade-token-grid-row__col-profit">
          {this.state.interestRate.gt(0) && !this.state.isLoading ?
            <React.Fragment>
              {this.state.interestRate.toFixed(4)}
              <span className="fw-normal">%</span>
            </React.Fragment>
            :
            <Preloader width="74px" />
          }
        </div>
        <div className="trade-token-grid-row__col-action">
          <button className="trade-token-grid-row__button trade-token-grid-row__buy-button trade-token-grid-row__button--size-half" disabled={siteConfig.TradeBuyDisabled} onClick={this.onBuyClick}>
            {TradeType.BUY}
          </button>
        </div>
      </div>
    );
  }

  public onLeverageSelect = (value: number) => {
    const key = this.getTradeTokenGridRowSelectionKey(value);

    this._isMounted && this.setState({ ...this.state, leverage: value, version: key.version, isLoading: true });
  };

  public onBuyClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const request = new TradeRequest(
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      TradeType.BUY,
      this.props.asset,
      this.props.defaultUnitOfAccount, // TODO: depends on which one they own
      Asset.ETH,
      this.props.positionType,
      this.state.leverage,
      new BigNumber(0)
    );
    await this.setState({ ...this.state, request: request });
    this.props.onTrade(request);
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request, true)
  };
}
