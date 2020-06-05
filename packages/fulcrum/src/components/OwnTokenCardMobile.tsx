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

import "../styles/components/own-token-card-mobile.scss";
import { RequestTask } from "../domain/RequestTask";
import { RequestStatus } from "../domain/RequestStatus";
import { CircleLoader } from "./CircleLoader";
import { TradeTxLoaderStep } from "./TradeTxLoaderStep";
import { IOwnTokenGridRowProps } from "./OwnTokenGridRow";


interface IOwnTokenCardMobileState {
  value: BigNumber;
  positionType: PositionType;
  positionValue: BigNumber;
  collateral: BigNumber;
  liquidationPrice: BigNumber;
  openPrice: BigNumber;
  profit: BigNumber;
  isLoading: boolean;
  isLoadingTransaction: boolean;
  request: TradeRequest | undefined;
  collateralToPrincipal: BigNumber;
}

export class OwnTokenCardMobile extends Component<IOwnTokenGridRowProps, IOwnTokenCardMobileState> {
  constructor(props: IOwnTokenGridRowProps, context?: any) {
    super(props, context);

    this._isMounted = false;
    this.state = {
      positionValue: new BigNumber(0),
      positionType: props.loan.collateralAsset === Asset.ETH
        ? PositionType.LONG
        : PositionType.SHORT,
      value: new BigNumber(0),
      collateral: new BigNumber(0),
      openPrice: new BigNumber(0),
      liquidationPrice: new BigNumber(0),
      profit: new BigNumber(0),
      isLoading: true,
      isLoadingTransaction: false,
      request: undefined,
      collateralToPrincipal: new BigNumber(0)
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
    //FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private _isMounted: boolean;

  private async derivedUpdate() {
    const collateralToPrincipalRate = await FulcrumProvider.Instance.getSwapRate(this.props.loan.collateralAsset, this.props.loan.loanAsset);
    let positionValue = new BigNumber(0);
    let value = new BigNumber(0);
    let collateral = new BigNumber(0);
    let openPrice = new BigNumber(0);
    //liquidation_collateralToLoanRate = ((15000000000000000000 * principal / 10^20) + principal) / collateral * 10^18
    //If SHORT -> 10^36 / liquidation_collateralToLoanRate
    const liquidation_collateralToLoanRate = (new BigNumber("15000000000000000000").times(this.props.loan.loanData!.principal).div(10 ** 20)).plus(this.props.loan.loanData!.principal).div(this.props.loan.loanData!.collateral).times(10 ** 18);
    let liquidationPrice = new BigNumber(0);
    let profit = new BigNumber(0);
    if (this.state.positionType === PositionType.LONG) {
      positionValue = this.props.loan.loanData!.collateral.div(10 ** 18);
      value = this.props.loan.loanData!.collateral.div(10 ** 18).times(this.state.collateralToPrincipal);
      collateral = ((this.props.loan.loanData!.collateral.times(this.state.collateralToPrincipal).div(10 ** 18)).minus(this.props.loan.loanData!.principal.div(10 ** 18)));
      openPrice = this.props.loan.loanData!.startRate.div(10 ** 18);
      liquidationPrice = liquidation_collateralToLoanRate.div(10 ** 18);
      profit = this.state.collateralToPrincipal.minus(openPrice).times(positionValue);
    }
    else {
      positionValue = this.props.loan.loanData!.principal.div(10 ** 18);
      value = this.props.loan.loanData!.collateral.div(10 ** 18);
      collateral = ((this.props.loan.loanData!.collateral.div(10 ** 18)).minus(this.props.loan.loanData!.principal.div(this.state.collateralToPrincipal).div(10 ** 18)));
      openPrice = new BigNumber(10 ** 36).div(this.props.loan.loanData!.startRate).div(10 ** 18);
      liquidationPrice = new BigNumber(10 ** 36).div(liquidation_collateralToLoanRate).div(10 ** 18);
      profit = openPrice.minus(this.state.collateralToPrincipal).times(positionValue);
    }
    this._isMounted && this.setState(p => ({
      ...this.state,
      liquidationPrice,
      collateral,
      value,
      positionValue,
      openPrice,
      profit,
      isLoading: collateralToPrincipalRate.gt(0) ? false : p.isLoading,
      collateralToPrincipal: collateralToPrincipalRate
    }));
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };

  private onProviderChanged = async () => {
    await this.derivedUpdate();
  };

  /*private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    if (event.key.toString() === this.props.currentKey.toString()) {
      await this.derivedUpdate();
    }
  };*/

  private onAskToOpenProgressDlg = (taskId: number) => {
    if (!this.state.request || taskId !== this.state.request.id) return;
    this.setState({ ...this.state, isLoadingTransaction: true, })
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, false, true);
  }
  private onAskToCloseProgressDlg = (task: RequestTask) => {
    if (!this.state.request || task.request.id !== this.state.request.id) return;
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        FulcrumProvider.Instance.onTaskCancel(task);
        this.setState({ ...this.state, isLoadingTransaction: false, request: undefined });
        this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, true, false);
      }, 5000)
      return;
    }
    this.setState({ ...this.state, isLoadingTransaction: false, request: undefined });
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, true, true);
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
  public render() {
    return (
      <React.Fragment>
        {this.state.isLoadingTransaction && this.state.request
          ? <React.Fragment>
            <div className="token-selector-item__image">
              <CircleLoader></CircleLoader>
              <TradeTxLoaderStep taskId={this.state.request.id} />
            </div>
          </React.Fragment>
          :
          <div className="own-token-card-mobile">
            <div className="own-token-card-mobile__body">
              <div className="own-token-card-mobile__body-header">
                <span className="own-token-card-mobile__asset-name">Asset</span>
                <span className="own-token-card-mobile__position-type">Type</span>
                <span className="own-token-card-mobile__unit-of-account">Unit of Account</span>
              </div>
              <div className="own-token-card-mobile__body-row">
                <div className="own-token-card-mobile__asset-name">
                  <span className="own-token-card-mobile__value">
                    {`${this.props.tradeAsset.toUpperCase()}`}
                  </span>
                </div>
                <div className="own-token-card-mobile__position-type">
                  <span className="position-type-marker">{`${this.props.leverage}x`}&nbsp;{this.props.positionType}</span>
                </div>
                <div title={this.props.collateralAsset} className="own-token-card-mobile__unit-of-account">
                  <span className="own-token-card-mobile__value">{this.props.collateralAsset}</span>
                </div>
                <div className="own-token-card-mobile__action">
                  <button className="own-token-card-mobile__sell-button own-token-card-mobile__button--size-half" onClick={this.onSellClick}>
                    {TradeType.SELL}
                  </button>
                </div>
              </div>
              <div className="own-token-card-mobile__body-row">
                <div title={this.state.positionValue.toFixed(18)} className="own-token-card-mobile__position">
                  <span className="own-token-card-mobile__body-header">Position({this.props.tradeAsset})</span>
                  <span className="own-token-card-mobile__value">
                    {!this.state.isLoading ?
                      <React.Fragment><span className="sign-currency"></span>{this.state.positionValue.toFixed(4)}</React.Fragment>
                      : <Preloader width="74px" />
                    }
                  </span>
                </div>
                <div title={this.state.value.toFixed(18)} className="own-token-card-mobile__price">
                  <span className="own-token-card-mobile__body-header">Asset Price</span>
                  <span className="own-token-card-mobile__value">
                    {!this.state.isLoading ?
                      <React.Fragment><span className="sign-currency">$</span>{this.state.value.toFixed(2)}</React.Fragment>
                      : <Preloader width="74px" />
                    }
                  </span>
                </div>
                <div title={this.state.liquidationPrice.toFixed(18)} className="own-token-card-mobile__liquidation-price">
                  <span className="own-token-card-mobile__body-header">Liq. Price</span>
                  <span className="own-token-card-mobile__value">
                    {!this.state.isLoading ?
                      <React.Fragment><span className="sign-currency">$</span>{this.state.liquidationPrice.toFixed(2)}</React.Fragment>
                      : <Preloader width="74px" />
                    }
                  </span>
                </div>
              </div>
              <div className="own-token-card-mobile__body-row">
                <div className="own-token-card-mobile__collateral">
                  <span className="own-token-card-mobile__body-header">Collateral</span>
                  <div className="own-token-card-mobile__col-collateral-wrapper">
                    <span className="own-token-card-mobile__value"><span className="sign-currency">$</span>{this.state.collateral.toFixed(2)}</span>
                    <span className="own-token-card-mobile__col-asset-collateral-small">16.5%</span>
                  </div>
                  <div className="own-token-card-mobile__open-manage-collateral" onClick={this.onManageClick}>
                    <OpenManageCollateral />
                  </div>
                </div>
                <div title={this.state.value.toFixed(18)} className="own-token-card-mobile__position-value">
                  <span className="own-token-card-mobile__body-header">Value</span>
                  <span className="own-token-card-mobile__value">
                    {!this.state.isLoading ?
                      <React.Fragment><span className="sign-currency">$</span>{this.state.value.toFixed(2)}</React.Fragment> :
                      <Preloader width="74px" />
                    }
                  </span>
                </div>
                <div title={this.state.profit.toFixed(18)} className="own-token-card-mobile__profit">
                  <span className="own-token-card-mobile__body-header">Profit</span>
                  <span className="own-token-card-mobile__value">
                    {!this.state.isLoading ?
                      this.state.profit ?
                        <React.Fragment><span className="sign-currency">$</span>{this.state.profit.toFixed(2)}</React.Fragment> :
                        <React.Fragment><span className="sign-currency">$</span>0.0000</React.Fragment> :
                      <Preloader width="74px" />
                    }
                  </span>
                  {/*>>>>>>> kovan_development*/}
                </div >
              </div >
            </div >
          </div >
        }
      </React.Fragment>
    );
  }

  public onDetailsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  public onManageClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const request = new ManageCollateralRequest(
      this.props.loan.loanId,
      this.props.tradeAsset,
      this.props.collateralAsset,
      this.props.loan.collateralAmount,
      this.props.positionType,
      this.props.leverage,
      false
    );

    //await this.setState({...this.state, request: request });
    this.props.onManageCollateralOpen(request);
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, false, true)

  };

  public onSellClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const request = new TradeRequest(
      this.props.loan.loanId,
      TradeType.SELL,
      this.props.tradeAsset,
      Asset.UNKNOWN,
      this.props.collateralAsset,
      this.props.positionType,
      this.props.leverage,
      new BigNumber(0)
    )
    await this.setState({ ...this.state, request: request });
    this.props.onTrade(request);
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request, false, true)
  }
}
