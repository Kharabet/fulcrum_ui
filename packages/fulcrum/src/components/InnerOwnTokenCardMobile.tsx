import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

import { Preloader } from "./Preloader";
import { ReactComponent as OpenManageCollateral } from "../assets/images/openManageCollateral.svg";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";

import "../styles/components/inner-own-token-card-mobile.scss";

import { RequestStatus } from "../domain/RequestStatus";
import { RequestTask } from "../domain/RequestTask";
import { CircleLoader } from "./CircleLoader";
import { TradeTxLoaderStep } from "./TradeTxLoaderStep";
import { IOwnTokenGridRowProps } from "./OwnTokenGridRow";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";


export interface IInnerOwnTokenGridRowProps {
  loan: IBorrowedFundsState;
  baseToken: Asset;
  quoteToken: Asset;
  leverage: number;
  positionType: PositionType;
  positionValue: BigNumber;
  value: BigNumber;
  collateral: BigNumber;
  openPrice: BigNumber;
  liquidationPrice: BigNumber;
  profit: BigNumber;
  isTxCompleted: boolean;
  onTrade: (request: TradeRequest) => void;
  onManageCollateralOpen: (request: ManageCollateralRequest) => void;
  changeLoadingTransaction: (isLoadingTransaction: boolean, request: TradeRequest | undefined, isTxCompleted: boolean, resultTx: boolean) => void;

}

interface IInnerOwnTokenCardMobileState {
  isLoading: boolean;
  isLoadingTransaction: boolean;
  request: TradeRequest | undefined;
  valueChange: BigNumber;
  resultTx: boolean;
}

export class InnerOwnTokenCardMobile extends Component<IOwnTokenGridRowProps, IInnerOwnTokenCardMobileState> {
  constructor(props: IOwnTokenGridRowProps, context?: any) {
    super(props, context);

    this._isMounted = false;

    this.state = {
      isLoading: true,
      isLoadingTransaction: false,
      request: undefined,
      valueChange: new BigNumber(0),
      resultTx: false
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
    //FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private _isMounted: boolean;

  private async derivedUpdate() {
    this._isMounted && this.setState({
      isLoading: true
    });
    let openValue = new BigNumber(0);
    let valueChange = new BigNumber(0);
    if (this.props.positionType === PositionType.LONG) {
      openValue = this.props.loan.loanData!.collateral.div(10 ** 18).times(this.props.openPrice);
      valueChange = (this.props.value.minus(openValue)).div(openValue).times(100);
    }
    else {
      openValue = this.props.loan.loanData!.principal.div(10 ** 18).times(this.props.openPrice);
      valueChange = (this.props.value.minus(openValue)).div(openValue).times(100);
    }
    this._isMounted && this.setState({
      ...this.state,
      valueChange,
      isLoading: false
    });
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };

  private onProviderChanged = async () => {
    await this.derivedUpdate();
  };

  private onAskToOpenProgressDlg = (taskId: string) => {
    if (!this.state.request || taskId !== this.state.request.loanId) return;
    this.setState({ ...this.state, isLoadingTransaction: true, resultTx: true })
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, false, this.state.resultTx)

  }
  private onAskToCloseProgressDlg = (task: RequestTask) => {
    if (!this.state.request || task.request.loanId !== this.state.request.loanId) return;
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        FulcrumProvider.Instance.onTaskCancel(task);
        this.setState({ ...this.state, isLoadingTransaction: false, request: undefined, resultTx: false })
        this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, false, this.state.resultTx)
      }, 5000)
      return;
    }
    this.setState({ ...this.state, resultTx: true });
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, true, this.state.resultTx);
  }

  /*private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    if (event.key.toString() === this.props.currentKey.toString()) {
      await this.derivedUpdate();
    }
  };*/

  public componentWillUnmount(): void {
    this._isMounted = false;

    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidUpdate(prevProps: Readonly<IInnerOwnTokenGridRowProps>, prevState: Readonly<IInnerOwnTokenCardMobileState>, snapshot?: any): void {
    if (this.props.isTxCompleted && prevProps.isTxCompleted !== this.props.isTxCompleted
    ) {
      this.derivedUpdate();
      if (this.state.isLoadingTransaction) {
        this.setState({ ...this.state, isLoadingTransaction: false, request: undefined });
        this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, false, this.state.resultTx)
      }
    }
  }

  public componentDidMount(): void {
    this._isMounted = true;

    this.derivedUpdate();
  }

  public render() {
    return (
      <React.Fragment>
        {this.state.isLoadingTransaction && this.state.request
          ? <React.Fragment>
            <div className="token-selector-item__image">
              <CircleLoader></CircleLoader>
              <TradeTxLoaderStep taskId={this.state.request.loanId} />
            </div>
          </React.Fragment>
          : <div className="inner-own-token-card-mobile">
            <div className="inner-own-token-card-mobile__body-row">
              <div title={this.props.positionValue.toFixed(18)} className="inner-own-token-card-mobile__col-token-name-full">
                <span className="inner-own-token-header">{`Position (${this.props.baseToken.toUpperCase()}/DAI)`}</span>
                {this.props.positionValue.toFixed(4)}

              </div>
              <div title={this.props.quoteToken} className="inner-own-token-card-mobile__col-asset-type">
                <span className="position-type-marker">{`${this.props.leverage}x`}&nbsp; {this.props.positionType}</span>
              </div>
              <div className="inner-own-token-card-mobile__col-action">
                <button className="inner-own-token-card-mobile_button inner-own-token-card-mobile__sell-button inner-own-token-card-mobile__button--size-half" onClick={this.onSellClick}>
                  {TradeType.SELL}
                </button>
              </div>
            </div>
            <div className="inner-own-token-card-mobile__body-row">
              <div title={this.props.value.toFixed(18)} className="inner-own-token-card-mobile__col-asset-price">
                <span className="inner-own-token-header">Value</span>
                {!this.state.isLoading
                  ? <React.Fragment>
                    <span className="sign-currency">$</span>{this.props.value.toFixed(2)}
                    <span className="inner-own-token-card-mobile__col-asset-price-small">{this.state.valueChange.toFixed(2)}%</span>
                  </React.Fragment>
                  : <Preloader width="74px" />
                }
              </div>
              <div className="inner-own-token-card-mobile__col-asset-collateral">
                <span className="inner-own-token-header">Collateral</span>
                <React.Fragment>
                  <span className="sign-currency">$</span>{this.props.collateral.toFixed(2)}
                  <span className={`inner-own-token-card-mobile__col-asset-collateral-small ${this.props.loan.collateralizedPercent.lte(.25) ? "danger" : ""}`}>{this.props.loan.collateralizedPercent.multipliedBy(100).plus(100).toFixed(2)}%</span>
                </React.Fragment>
                <div className="inner-own-token-card-mobile__open-manage-collateral" onClick={this.onManageClick}>
                  <OpenManageCollateral />
                </div>
              </div>
            </div>
            <div className="inner-own-token-card-mobile__body-row">
              <div title={this.props.openPrice.toFixed(18)} className="inner-own-token-card-mobile__col-position-value">
                <span className="inner-own-token-header">Open Price</span>
                {!this.state.isLoading
                  ? this.props.openPrice
                    ? <React.Fragment><span className="sign-currency">$</span>{this.props.openPrice.toFixed(2)}</React.Fragment>
                    : '$0.00'
                  : <Preloader width="74px" />
                }
              </div>
              <div title={this.props.liquidationPrice.toFixed(18)} className="inner-own-token-card-mobile__col-liquidation-price">
                <span className="inner-own-token-header">Liquidation Price</span>
                {!this.state.isLoading
                  ? <React.Fragment><span className="sign-currency">$</span>{this.props.liquidationPrice.toFixed(2)}</React.Fragment>
                  : <Preloader width="74px" />
                }
              </div>
              <div title={this.props.profit.toFixed(18)} className="inner-own-token-card-mobile__col-profit">
                <span className="inner-own-token-header">Profit</span>
                {!this.state.isLoading ?
                  this.props.profit
                    ? <React.Fragment><span className="sign-currency">$</span>{this.props.profit.toFixed(2)}</React.Fragment>
                    : '$0.00'
                  : <Preloader width="74px" />
                }
              </div>
            </div>
          </div>
        }
      </React.Fragment>)
  }

  public onDetailsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  public onManageClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const request = new TradeRequest(
      this.props.loan.loanId,
      TradeType.SELL,
      this.props.baseToken,
      this.props.quoteToken,
      Asset.UNKNOWN,
      this.props.positionType,
      this.props.leverage,
      new BigNumber(0)
    )

    await this.setState({ ...this.state, request: request });
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request, false, this.state.resultTx)

    this.props.onManageCollateralOpen(
      new ManageCollateralRequest(
        this.props.loan.loanId,
        this.props.baseToken,
        this.props.quoteToken,
        this.props.loan.collateralAmount,
        false
      )
    );
  };

  public onSellClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const request = new TradeRequest(
      this.props.loan.loanId,
      TradeType.SELL,
      this.props.baseToken,
      this.props.quoteToken,
      Asset.UNKNOWN,
      this.props.positionType,
      this.props.leverage,
      new BigNumber(0)
    )
    await this.setState({ ...this.state, request: request });
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request, false, this.state.resultTx)
    this.props.onTrade(request);
  };
}