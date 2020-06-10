import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { Preloader } from "./Preloader";
import { ReactComponent as OpenManageCollateral } from "../assets/images/openManageCollateral.svg";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { RequestStatus } from "../domain/RequestStatus";
import { RequestTask } from "../domain/RequestTask";
import { CircleLoader } from "./CircleLoader";
import { TradeTxLoaderStep } from "./TradeTxLoaderStep";

export interface IOwnTokenGridRowProps {
  loan: IBorrowedFundsState;
  loanId?: string;
  tradeAsset: Asset;
  collateralAsset: Asset;
  leverage: number;
  positionType: PositionType;
  isTxCompleted: boolean;
  tradeType: TradeType,
  onTrade: (request: TradeRequest) => void;
  onManageCollateralOpen: (request: ManageCollateralRequest) => void;
  changeLoadingTransaction: (isLoadingTransaction: boolean, request: TradeRequest | undefined, isTxCompleted: boolean, resultTx: boolean) => void;
}

interface IOwnTokenGridRowState {
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
  resultTx: boolean;
}

export class OwnTokenGridRow extends Component<IOwnTokenGridRowProps, IOwnTokenGridRowState> {
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
      collateralToPrincipal: new BigNumber(0),
      resultTx: false
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
    // FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
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

  private onAskToOpenProgressDlg = (taskId: number) => {
    if (!this.state.request || taskId !== this.state.request.id) return;
    this.setState({ ...this.state, isLoadingTransaction: true, resultTx: true })
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, false, this.state.resultTx);
  }
  private onAskToCloseProgressDlg = (task: RequestTask) => {
    if (!this.state.request || task.request.id !== this.state.request.id) return;
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        FulcrumProvider.Instance.onTaskCancel(task);
        this.setState({ ...this.state, isLoadingTransaction: false, request: undefined, resultTx: false });
        this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, true, this.state.resultTx);
      }, 5000)
      return;
    }
    this.setState({ ...this.state, isLoadingTransaction: false, request: undefined, resultTx: true });
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, true, this.state.resultTx);
  }

  // private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
  //   if (event.key.toString() === this.props.currentKey.toString()) {
  //     await this.derivedUpdate();
  //   }
  // };

  public componentWillUnmount(): void {
    this._isMounted = false;

    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
    // FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }
  public componentWillMount(): void {
    this.derivedUpdate();
  }

  public componentDidMount(): void {
    this._isMounted = true;

    this.derivedUpdate();
  }

  public render() {
    return (this.state.isLoadingTransaction && this.state.request
      ? <React.Fragment>
        <div className="token-selector-item__image">
          <CircleLoader></CircleLoader>
          <TradeTxLoaderStep taskId={this.state.request.id} />
        </div>
      </React.Fragment>
      : this.state.resultTx && this.props.loanId === this.props.loan.loanId
        ? <div className="close-tab-tx"></div>
        : <div className={`own-token-grid-row ${this.props.isTxCompleted ? `completed` : ``}`}>
          <div className="own-token-grid-row__col-token-name  opacityIn">
            {`${this.props.tradeAsset.toUpperCase()}`}
          </div>
          <div className="own-token-grid-row__col-position-type opacityIn">
            <span className="position-type-marker">
              {`${this.props.leverage}x ${this.props.positionType}`}
            </span>
          </div>
          <div title={this.props.collateralAsset} className="own-token-grid-row__col-asset-unit opacityIn">
            {this.props.collateralAsset}
          </div>
          <div title={this.state.positionValue.toFixed(18)} className="own-token-grid-row__col-position  opacityIn">
            {this.state.positionValue.toFixed(4)}
          </div>
          <div title={this.state.openPrice.toFixed(18)} className="own-token-grid-row__col-asset-price  opacityIn">
            {!this.state.isLoading
            ? <React.Fragment>
              <span className="sign-currency">$</span>{this.state.openPrice.toFixed(2)}
            </React.Fragment>
              : <Preloader width="74px" />
            }
          </div>
          <div title={this.state.liquidationPrice.toFixed(18)} className="own-token-grid-row__col-liquidation-price opacityIn">
            {!this.state.isLoading
              ? <React.Fragment>
                <span className="sign-currency">$</span>{this.state.liquidationPrice.toFixed(2)}
              </React.Fragment>
              : <Preloader width="74px" />
            }
          </div>
          <div className="own-token-grid-row__col-collateral opacityIn">
            <div title={this.state.collateral.toFixed(18)} className="own-token-grid-row__col-collateral-wrapper">
              {!this.state.isLoading
                ? <React.Fragment>
                  <span><span className="sign-currency">$</span>{this.state.collateral.toFixed(2)}</span>
                  <span className="own-token-grid-row__col-asset-collateral-small">{this.props.loan.collateralizedPercent.multipliedBy(100).plus(100).toFixed(2)}%</span>
                </React.Fragment>
                : <Preloader width="74px" />
              }
            </div>
            <div className="own-token-grid-row__open-manage-collateral" onClick={this.onManageClick}>
              <OpenManageCollateral />
            </div>
          </div>
          <div title={this.state.value.toFixed(18)} className="own-token-grid-row__col-position-value opacityIn">
            {!this.state.isLoading
              ? this.state.value
                ? <React.Fragment>
                  <span className="sign-currency">$</span>{this.state.value.toFixed(2)}
                </React.Fragment>
                : '$0.00'
              : <Preloader width="74px" />
            }
          </div>
          <div title={this.state.profit.toFixed(18)} className="own-token-grid-row__col-profit opacityIn">
            {!this.state.isLoading
              ? this.state.profit
                ? <React.Fragment>
                  <span><span className="sign-currency">$</span>{this.state.profit.toFixed(2)}</span>
                </React.Fragment>
                : '$0.00'
              : <Preloader width="74px" />
            }
          </div>
          <div className="own-token-grid-row__col-action opacityIn rightIn">
            <button className="own-token-grid-row_button own-token-grid-row__sell-button own-token-grid-row__button--size-half" onClick={this.onSellClick}>
              {TradeType.SELL}
            </button>
          </div>
        </div>
    )
  }

  public onDetailsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    // this.props.onDetails(this.props.currentKey);
  };

  public onManageClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    this.props.onManageCollateralOpen(
      new ManageCollateralRequest(
        this.props.loan.loanId,
        this.props.tradeAsset,
        this.props.collateralAsset,
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
      this.props.tradeAsset,
      Asset.UNKNOWN,
      this.props.collateralAsset,
      this.props.positionType,
      this.props.leverage,
      new BigNumber(0)
    )
    await this.setState({ ...this.state, request: request });
    this.props.onTrade(request);
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request, false, true);
  };
}
