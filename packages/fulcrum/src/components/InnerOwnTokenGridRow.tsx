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
import { TasksQueue } from "../services/TasksQueue";
import { Preloader } from "./Preloader";
import { ReactComponent as OpenManageCollateral } from "../assets/images/openManageCollateral.svg";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { RequestTask } from "../domain/RequestTask";
import { CircleLoader } from "./CircleLoader";
import { TradeTxLoaderStep } from "./TradeTxLoaderStep";
import { RequestStatus } from "../domain/RequestStatus";
import { AssetsDictionary } from "../domain/AssetsDictionary";

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
  changeLoadingTransaction: (isLoadingTransaction: boolean, request: TradeRequest | ManageCollateralRequest | undefined, isTxCompleted: boolean, resultTx: boolean) => void;

}

interface IInnerOwnTokenGridRowState {
  isLoading: boolean;
  isLoadingTransaction: boolean;
  request: TradeRequest | ManageCollateralRequest | undefined;
  valueChange: BigNumber;
  resultTx: boolean;
}

export class InnerOwnTokenGridRow extends Component<IInnerOwnTokenGridRowProps, IInnerOwnTokenGridRowState> {
  constructor(props: IInnerOwnTokenGridRowProps, context?: any) {
    super(props, context);

    this._isMounted = false;

    this.state = {
      isLoading: true,
      isLoadingTransaction: false,
      request: undefined,
      resultTx: false,
      valueChange: new BigNumber(0),
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
    // FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private _isMounted: boolean;

  private async derivedUpdate() {
    let openValue = new BigNumber(0);
    let valueChange = new BigNumber(0);


    if (this.props.positionType === PositionType.LONG) {
      const collateralAssetDecimals = AssetsDictionary.assets.get(this.props.loan.collateralAsset)!.decimals || 18;
      openValue = this.props.loan.loanData!.collateral.times(10 ** (18 - collateralAssetDecimals)).div(10 ** 18).times(this.props.openPrice);
      valueChange = (this.props.value.minus(openValue)).div(openValue).times(100);
    }
    else {
      const loanAssetDecimals = AssetsDictionary.assets.get(this.props.loan.loanAsset)!.decimals || 18;
      openValue = this.props.loan.loanData!.principal.times(10 ** (18 - loanAssetDecimals)).div(10 ** 18).times(this.props.openPrice);
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

  public componentDidUpdate(prevProps: Readonly<IInnerOwnTokenGridRowProps>, prevState: Readonly<IInnerOwnTokenGridRowState>, snapshot?: any): void {
    if (this.props.isTxCompleted && prevProps.isTxCompleted !== this.props.isTxCompleted) {
      this.derivedUpdate();
      if (this.state.isLoadingTransaction) {
        this.setState({ ...this.state, isLoadingTransaction: false, request: undefined });
        this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, false, this.state.resultTx)
      }
    }
  }

  public async componentDidMount() {
    this._isMounted = true;

    const task = await TasksQueue.Instance.getTasksList().find(t => t.request.loanId === this.props.loan.loanId);
    const isLoadingTransaction = task && !task.error ? true : false;
    const request = task ? task.request as TradeRequest | ManageCollateralRequest : undefined;
    this.setState({
      ...this.state,
      isLoadingTransaction,
      request
    });

    this.derivedUpdate();
  }

  public render() {
    const collateralizedPercent = this.props.loan!.collateralizedPercent.multipliedBy(100).plus(100);

    return (
      <React.Fragment>
        {this.state.isLoadingTransaction && this.state.request
          ? <React.Fragment>
            <div className="token-selector-item__image">
              <CircleLoader></CircleLoader>
              <TradeTxLoaderStep taskId={this.state.request.id} />
            </div>
          </React.Fragment>
          : <div className={`inner-own-token-grid-row`}>
            <div title={this.props.positionValue.toFixed(18)} className="inner-own-token-grid-row__col-token-name-full opacityIn">
              <span className="inner-own-token-grid-row__body-header">Position({this.props.baseToken}/{this.props.quoteToken})</span>
              {this.props.positionValue.toFixed(4)}
            </div>
            <div title={this.props.loan!.loanId} className="inner-own-token-grid-row__col-asset-type">

              <span className="position-type-marker">{`${this.props.leverage}x`}&nbsp; {this.props.positionType}</span>
            </div>
            <div title={`$${this.props.value.toFixed(18)}`} className="inner-own-token-grid-row__col-asset-price">
              <span className="inner-own-token-grid-row__body-header">Value</span>
              {!this.state.isLoading
                ? <React.Fragment>
                  <span className="value-currency">
                    <span className="sign-currency">$</span>

                    {this.props.value.toFixed(2)}
                    <span title={this.state.valueChange.toFixed(18)} className="inner-own-token-grid-row__col-asset-price-small">{this.state.valueChange.toFixed(2)}%</span>
                  </span>
                </React.Fragment>
                : <Preloader width="74px" />
              }
            </div>
            <div className="inner-own-token-grid-row__col-asset-collateral">
              <span className="inner-own-token-grid-row__body-header">Collateral</span>

              {!this.state.isLoading
                ? <React.Fragment>
                  <span className="value-currency">
                    <span title={this.props.collateral.toFixed(18)}>
                      <span className="sign-currency">$</span>

                      {this.props.collateral.toFixed(2)}
                    </span>

                    <span className={`inner-own-token-grid-row__col-asset-collateral-small ${this.props.loan.collateralizedPercent.lte(.25) ? "danger" : ""}`} title={collateralizedPercent.toFixed(18)}>{collateralizedPercent.toFixed(2)}%</span>
                    <div className={`inner-own-token-grid-row__open-manage-collateral ${this.props.loan.collateralizedPercent.lte(.15) ? "danger" : ""}`} onClick={this.onManageClick}>
                      <OpenManageCollateral />
                    </div>
                  </span>
                </React.Fragment>
                : <Preloader width="74px" />
              }

            </div>
            <div title={this.props.openPrice.toFixed(18)} className="inner-own-token-grid-row__col-position-value opacityIn">
              <span className="inner-own-token-grid-row__body-header">Open Price</span>

              {!this.state.isLoading
                ? this.props.openPrice
                  ? <React.Fragment><span className="sign-currency">$</span>{this.props.openPrice.toFixed(2)}</React.Fragment>
                  : '$0.00'
                : <Preloader width="74px" />
              }
            </div>
            <div title={`$${this.props.liquidationPrice.toFixed(18)}`} className="inner-own-token-grid-row__col-liquidation-price opacityIn">
              <span className="inner-own-token-grid-row__body-header">Liquidation Price</span>

              {!this.state.isLoading
                ? <React.Fragment><span className="sign-currency">$</span>{this.props.liquidationPrice.toFixed(2)}</React.Fragment>
                : <Preloader width="74px" />
              }
            </div>
            <div title={this.props.profit.toFixed(18)} className="inner-own-token-grid-row__col-profit opacityIn">
              <span className="inner-own-token-grid-row__body-header">Profit</span>

              {!this.state.isLoading
                ? this.props.profit
                  ? <React.Fragment><span className="sign-currency">$</span>{this.props.profit.toFixed(2)}</React.Fragment>
                  : '$0.00'
                : <Preloader width="74px" />
              }
            </div>
            <div className="inner-own-token-grid-row__col-action opacityIn rightIn">
              <button className="inner-own-token-grid-row_button inner-own-token-grid-row__sell-button inner-own-token-grid-row__button--size-half" onClick={this.onSellClick} disabled={this.props.loan.collateralizedPercent.lte(.15)}>
                {TradeType.SELL}
              </button>
            </div>
          </div>
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
      this.props.baseToken,
      this.props.quoteToken,
      this.props.loan.collateralAmount,
      false
    );

    await this.setState({ ...this.state, request: request });

    this.props.onManageCollateralOpen(request);
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request, false, this.state.resultTx);
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
