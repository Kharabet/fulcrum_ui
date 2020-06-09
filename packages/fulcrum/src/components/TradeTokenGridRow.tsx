import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
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
  isTxCompleted: boolean;
  onTrade: (request: TradeRequest) => void;
  changeLoadingTransaction: (isLoadingTransaction: boolean, request: TradeRequest | undefined, isTxcolmpleted: boolean, resultTx: boolean) => void;
}

interface ITradeTokenGridRowState {
  assetDetails: AssetDetails | null;
  leverage: number;
  version: number;

  tradeAssetPrice: BigNumber;
  liquidationPrice: BigNumber;

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
      tradeAssetPrice: new BigNumber(0),
      liquidationPrice: new BigNumber(0),
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
  }

  private _isMounted: boolean;

  private async derivedUpdate() {

    const tradeAssetPrice = await FulcrumProvider.Instance.getSwapToUsdRate(this.props.asset);

    const collateralToPrincipalRate = this.props.positionType === PositionType.LONG
      ? await FulcrumProvider.Instance.getSwapRate(this.props.asset, this.props.defaultUnitOfAccount)
      : await FulcrumProvider.Instance.getSwapRate(this.props.defaultUnitOfAccount, this.props.asset);
    
    console.log("collateralToPrincipalRate " + collateralToPrincipalRate.toFixed());
      let leverage = new BigNumber(0);
    if (this.props.positionType === PositionType.LONG) {
      switch (this.state.leverage) {
        case 2:
          leverage = new BigNumber(100).times(10 ** 18);
        case 3:
          leverage = new BigNumber(50).times(10 ** 18);
        case 4:
          leverage = new BigNumber("33333333333333333333");
        case 5:
          leverage = new BigNumber(25).times(10 ** 18);
      }

    } else {
      switch (this.state.leverage) {
        case 1:
          leverage = new BigNumber(100).times(10 ** 18);
        case 2:
          leverage = new BigNumber(50).times(10 ** 18);
        case 3:
          leverage = new BigNumber("33333333333333333333");
        case 4:
          leverage = new BigNumber(25).times(10 ** 18);
        case 5:
          leverage = new BigNumber(20).times(10 ** 18);
      }
    }
    // liq_price_before_trade = (15000000000000000000 * collateralToLoanRate / 10^20) + collateralToLoanRate) / ((10^20 + current_margin) / 10^20
    //if it's a SHORT then -> 10^36 / above
    console.log(leverage);
    const currentMargin = new BigNumber(1).div(leverage);
    console.log(currentMargin.toFixed());
    const liquidationPriceBeforeTrade = ((new BigNumber("15000000000000000000").times(collateralToPrincipalRate).div(10 ** 20)).plus(collateralToPrincipalRate)).div((new BigNumber(10 ** 20).plus(leverage)).div(10 ** 20))
    const liquidationPrice = this.props.positionType === PositionType.LONG
      ? liquidationPriceBeforeTrade.div(10**18)
      : new BigNumber(10 ** 36).div(liquidationPriceBeforeTrade).div(10**18);
    console.log("liquidationPrice " + liquidationPrice.toFixed());

    const interestRate = await FulcrumProvider.Instance.getBorrowInterestRate(this.props.asset);
    const balance = new BigNumber(0);

    this._isMounted && this.setState({
      ...this.state,
      tradeAssetPrice,
      interestRate: interestRate,
      balance: balance,
      liquidationPrice,
      isLoading: false
    });
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };

  private onProviderChanged = async () => {
    await this.derivedUpdate();
  };

  private onAskToOpenProgressDlg = (taskId: number) => {
    if (!this.state.request || taskId !== this.state.request.id) return;
    this.setState({ ...this.state, isLoadingTransaction: true });
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, false, true);
  }
  private onAskToCloseProgressDlg = (task: RequestTask) => {
    if (!this.state.request || task.request.id !== this.state.request.id) return;
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        FulcrumProvider.Instance.onTaskCancel(task);
        this.setState({ ...this.state, isLoadingTransaction: false, request: undefined })
        this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, true, false)
      }, 5000)
      return;
    }
    this.setState({ ...this.state, isLoadingTransaction: false, request: undefined });
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, true, true)
  }

  public componentWillUnmount(): void {
    this._isMounted = false;

    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
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
    if (prevState.leverage !== this.state.leverage || prevProps.isTxCompleted !== this.props.isTxCompleted) {
      this.derivedUpdate();
    }
  }

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }
    return (
      <div className={`trade-token-grid-row`}>
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
        <div title={`$${this.state.tradeAssetPrice.toFixed(18)}`} className="trade-token-grid-row__col-price">
          {!this.state.isLoading ?
            <React.Fragment>
              <span className="fw-normal">$</span>{this.state.tradeAssetPrice.toFixed(2)}
            </React.Fragment>
            :
            <Preloader width="74px" />
          }
        </div>
        <div title={`$${this.state.liquidationPrice.toFixed(18)}`} className="trade-token-grid-row__col-price">
          {
            !this.state.isLoading ?
              <React.Fragment>
                <span className="fw-normal">$</span>{this.state.liquidationPrice.toFixed(2)}
              </React.Fragment>
              :
              <Preloader width="74px" />
          }
        </div>
        <div title={this.state.interestRate.gt(0) ? `${this.state.interestRate.toFixed(18)}%` : ``} className="trade-token-grid-row__col-profit">
          {/*this.state.interestRate.gt(0) &&*/ !this.state.isLoading ?
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

    this._isMounted && this.setState({ ...this.state, leverage: value, isLoading: true });
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
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request, false, true)
  };
}
