import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { PositionTypeMarkerAlt } from "./PositionTypeMarkerAlt";
import siteConfig from "../config/SiteConfig.json";

import { LeverageSelector } from "./LeverageSelector";
import { Preloader } from "./Preloader";
import { ITradeTokenGridRowProps } from "./TradeTokenGridRow";
import { RequestStatus } from "../domain/RequestStatus";
import { RequestTask } from "../domain/RequestTask";

import "../styles/components/trade-token-card-mobile.scss";

export interface ITradeTokenCardMobileProps extends ITradeTokenGridRowProps {
  changeGridPositionType: (activePositionType: PositionType) => void;
}

interface ITradeTokenCardMobileState {
  assetDetails: AssetDetails | null;
  leverage: number;
  version: number;

  tradeAssetPrice: BigNumber;
  liquidationPrice: BigNumber;

  latestPriceDataPoint: IPriceDataPoint;
  interestRate: BigNumber;
  balance: BigNumber;
  isLoading: boolean;
  isLoadingTransaction: boolean;
  request: TradeRequest | undefined;
}

export class TradeTokenCardMobile extends Component<ITradeTokenCardMobileProps, ITradeTokenCardMobileState> {

  constructor(props: ITradeTokenCardMobileProps, context?: any) {
    super(props, context);

    const assetDetails = AssetsDictionary.assets.get(props.asset);
    this._isMounted = false;
    this.state = {
      leverage: this.props.positionType === PositionType.SHORT ? 1 : 2,
      assetDetails: assetDetails || null,
      latestPriceDataPoint: FulcrumProvider.Instance.getPriceDefaultDataPoint(),
      interestRate: new BigNumber(0),
      balance: new BigNumber(0),
      tradeAssetPrice: new BigNumber(0),
      liquidationPrice: new BigNumber(0),
      version: 2,
      isLoading: true,
      isLoadingTransaction: false,
      request: undefined,
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
    //FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private _isMounted: boolean;

  private async derivedUpdate() {
    const tradeAssetPrice = await FulcrumProvider.Instance.getSwapToUsdRate(this.props.asset);

    const interestRate = await FulcrumProvider.Instance.getBorrowInterestRate(this.props.asset);

    const collateralToPrincipalRate = this.props.positionType === PositionType.LONG
      ? await FulcrumProvider.Instance.getSwapRate(this.props.asset, this.props.defaultUnitOfAccount)
      : await FulcrumProvider.Instance.getSwapRate(this.props.defaultUnitOfAccount, this.props.asset);

    let initialMargin = this.props.positionType === PositionType.LONG
      ? new BigNumber(10 ** 38).div(new BigNumber(this.state.leverage - 1).times(10 ** 18))
      : new BigNumber(10 ** 38).div(new BigNumber(this.state.leverage).times(10 ** 18))
    // liq_price_before_trade = (15000000000000000000 * collateralToLoanRate / 10^20) + collateralToLoanRate) / ((10^20 + current_margin) / 10^20
    //if it's a SHORT then -> 10^36 / above
    const liquidationPriceBeforeTrade = ((new BigNumber("15000000000000000000").times(collateralToPrincipalRate.times(10 ** 18)).div(10 ** 20)).plus(collateralToPrincipalRate.times(10 ** 18))).div((new BigNumber(10 ** 20).plus(initialMargin)).div(10 ** 20))
    const liquidationPrice = this.props.positionType === PositionType.LONG
      ? liquidationPriceBeforeTrade.div(10 ** 18)
      : new BigNumber(10 ** 36).div(liquidationPriceBeforeTrade).div(10 ** 18);


    this._isMounted && this.setState({
      ...this.state,
      tradeAssetPrice,
      interestRate: interestRate,
      isLoading: false,
      liquidationPrice
    });
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };

  private onProviderChanged = async () => {
    await this.derivedUpdate();
  };

  /*private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    if (event.key.toString() === this.getTradeTokenGridRowSelectionKey().toString()) {
      await this.derivedUpdate();
    }
  };*/

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
    //FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public componentDidMount(): void {
    this._isMounted = true;

    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<ITradeTokenCardMobileProps>,
    prevState: Readonly<ITradeTokenCardMobileState>,
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

    return (
      <div className="trade-token-card-mobile">
        <div className="trade-token-card-mobile__header">
          <div className="asset-name">
            <span>{this.state.assetDetails.displayName}&nbsp;</span>
            <PositionTypeMarkerAlt assetDetails={this.state.assetDetails} value={this.props.positionType} />
          </div>
          <div className="poisition-type-switch">
            <button className={"" + (this.props.positionType === PositionType.LONG ? 'btn-active' : '')} onClick={() => this.props.changeGridPositionType(PositionType.LONG)}>
              Long
          </button>
            <button className={"" + (this.props.positionType === PositionType.SHORT ? 'btn-active' : '')} onClick={() => this.props.changeGridPositionType(PositionType.SHORT)}>
              Short
          </button>
          </div>
        </div>
        <div className="trade-token-card-mobile__body">
          <div className="trade-token-card-mobile__body-row">
            <div className="trade-token-card-mobile__leverage">
              <LeverageSelector
                asset={this.props.asset}
                value={this.state.leverage}
                minValue={this.props.positionType === PositionType.SHORT ? 1 : 2}
                maxValue={5}
                onChange={this.onLeverageSelect}
              />
            </div>
            <div className="trade-token-card-mobile__action">
              <button className="trade-token-card-mobile____buy-button" disabled={siteConfig.TradeBuyDisabled} onClick={this.onBuyClick}>
                {TradeType.BUY}
              </button>
            </div>
          </div>
          <div className="trade-token-card-mobile__body-row">
            <div title={this.state.tradeAssetPrice.toFixed(18)} className="trade-token-card-mobile__price">
              <span>Asset Price</span>
              <span>
                {this.state.tradeAssetPrice.gt(0) && !this.state.isLoading ?
                  <React.Fragment><span className="fw-normal">$</span>{this.state.tradeAssetPrice.toFixed(2)}</React.Fragment>
                  : <Preloader width="74px" />
                }
              </span>
            </div>
            <div title={`$${this.state.liquidationPrice.toFixed(18)}`} className="trade-token-card-mobile__price">
              <span>Liquidation Price</span>
              <span>
                {this.state.liquidationPrice.gt(0) && !this.state.isLoading ?
                  <React.Fragment><span className="fw-normal">$</span>{this.state.liquidationPrice.toFixed(2)}</React.Fragment>
                  : <Preloader width="74px" />
                }
              </span>
            </div>
            <div title={this.state.interestRate.gt(0) ? `${this.state.interestRate.toFixed(18)}%` : ``} className="trade-token-card-mobile__profit">
              <span>Interest APR</span>
              <span>
                {this.state.interestRate.gt(0) && !this.state.isLoading
                  ? <React.Fragment>{this.state.interestRate.toFixed(4)}<span className="fw-normal">%</span></React.Fragment>
                  : <Preloader width="74px" />
                }
              </span>
            </div>
          </div>
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
    )
    await this.setState({ ...this.state, request: request });
    this.props.onTrade(request);
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request, false, true)
  };
}
