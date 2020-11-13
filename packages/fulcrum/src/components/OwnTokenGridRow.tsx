import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import { Asset } from '../domain/Asset'
import { ManageCollateralRequest } from '../domain/ManageCollateralRequest'
import { PositionType } from '../domain/PositionType'
import { TradeRequest } from '../domain/TradeRequest'
import { TradeType } from '../domain/TradeType'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { ProviderChangedEvent } from '../services/events/ProviderChangedEvent'
import { FulcrumProvider } from '../services/FulcrumProvider'
import { TasksQueue } from '../services/TasksQueue'
import { Preloader } from './Preloader'
import { ReactComponent as OpenManageCollateral } from '../assets/images/openManageCollateral.svg'
import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { RequestStatus } from '../domain/RequestStatus'
import { RequestTask } from '../domain/RequestTask'
import { CircleLoader } from './CircleLoader'
import { TradeTxLoaderStep } from './TradeTxLoaderStep'

export interface IOwnTokenGridRowProps {
  loan: IBorrowedFundsState
  baseToken: Asset
  quoteToken: Asset
  leverage: number
  positionType: PositionType
  positionValue: BigNumber
  value: BigNumber
  collateral: BigNumber
  openPrice: BigNumber
  liquidationPrice: BigNumber
  profitCollateralToken: BigNumber
  profitLoanToken: BigNumber
  profitUSD: BigNumber
  maintenanceMargin: BigNumber
  isTxCompleted: boolean
  onTrade: (request: TradeRequest) => void
  onManageCollateralOpen: (request: ManageCollateralRequest) => void
  changeLoadingTransaction: (
    isLoadingTransaction: boolean,
    request: TradeRequest | ManageCollateralRequest | undefined,
    isTxCompleted: boolean,
    resultTx: boolean
  ) => void
}

interface IOwnTokenGridRowState {
  isLoading: boolean
  isLoadingTransaction: boolean
  request: TradeRequest | ManageCollateralRequest | undefined
  resultTx: boolean
}

export class OwnTokenGridRow extends Component<IOwnTokenGridRowProps, IOwnTokenGridRowState> {
  constructor(props: IOwnTokenGridRowProps, context?: any) {
    super(props, context)

    this._isMounted = false

    this.state = {
      isLoading: true,
      isLoadingTransaction: false,
      request: undefined,
      resultTx: false
    }

    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.ProviderAvailable,
      this.onProviderAvailable
    )
    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.AskToOpenProgressDlg,
      this.onAskToOpenProgressDlg
    )
    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.AskToCloseProgressDlg,
      this.onAskToCloseProgressDlg
    )
    // FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private _isMounted: boolean

  private async derivedUpdate() {
    this._isMounted &&
      this.setState({
        ...this.state,
        isLoading: false
      })
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate()
  }

  private onProviderChanged = async () => {
    await this.derivedUpdate()
  }

  private onAskToOpenProgressDlg = (taskId: string) => {
    if (!this.state.request || taskId !== this.state.request.loanId) return
    this.setState({ ...this.state, isLoadingTransaction: true, resultTx: true })
    this.props.changeLoadingTransaction(
      this.state.isLoadingTransaction,
      this.state.request,
      false,
      this.state.resultTx
    )
  }
  private onAskToCloseProgressDlg = (task: RequestTask) => {
    if (!this.state.request || task.request.loanId !== this.state.request.loanId) return
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        FulcrumProvider.Instance.onTaskCancel(task)
        this.setState({
          ...this.state,
          isLoadingTransaction: false,
          request: undefined,
          resultTx: false
        })
        this.props.changeLoadingTransaction(
          this.state.isLoadingTransaction,
          this.state.request,
          false,
          this.state.resultTx
        )
      }, 5000)
      return
    }
    this.setState({ ...this.state, resultTx: true })
    this.props.changeLoadingTransaction(
      this.state.isLoadingTransaction,
      this.state.request,
      true,
      this.state.resultTx
    )
  }

  // private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
  //   if (event.key.toString() === this.props.currentKey.toString()) {
  //     await this.derivedUpdate();
  //   }
  // };

  public componentWillUnmount(): void {
    this._isMounted = false

    FulcrumProvider.Instance.eventEmitter.off(
      FulcrumProviderEvents.ProviderAvailable,
      this.onProviderAvailable
    )
    FulcrumProvider.Instance.eventEmitter.off(
      FulcrumProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
    FulcrumProvider.Instance.eventEmitter.off(
      FulcrumProviderEvents.AskToOpenProgressDlg,
      this.onAskToOpenProgressDlg
    )
    FulcrumProvider.Instance.eventEmitter.off(
      FulcrumProviderEvents.AskToCloseProgressDlg,
      this.onAskToCloseProgressDlg
    )
    // FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public async componentDidMount() {
    this._isMounted = true
    const task = await TasksQueue.Instance.getTasksList().find(
      (t) => t.request.loanId === this.props.loan.loanId
    )
    const isLoadingTransaction = task && task.error ? true : false
    const request = task ? (task.request as TradeRequest | ManageCollateralRequest) : undefined
    this.setState({ ...this.state, resultTx: true, isLoadingTransaction, request })
    this.derivedUpdate()
  }

  public componentDidUpdate(
    prevProps: Readonly<IOwnTokenGridRowProps>,
    prevState: Readonly<IOwnTokenGridRowState>,
    snapshot?: any
  ): void {
    if (this.props.isTxCompleted && prevProps.isTxCompleted !== this.props.isTxCompleted) {
      if (this.state.isLoadingTransaction) {
        this.setState({ ...this.state, isLoadingTransaction: false, request: undefined })
        this.props.changeLoadingTransaction(
          this.state.isLoadingTransaction,
          this.state.request,
          false,
          this.state.resultTx
        )
      }
    }
  }

  public render() {
    let profitTitle = ''
    let profitValue;
    if (this.props.profitUSD.eq(0)) {
      profitTitle =
        this.props.positionType === PositionType.LONG
          ? `${this.props.profitCollateralToken.toFixed()}/${this.props.profitLoanToken.toFixed()}`
          : `${this.props.profitLoanToken.toFixed()}/${this.props.profitCollateralToken.toFixed()}`
      profitValue =
        this.props.positionType === PositionType.LONG
          ? `${this.props.profitCollateralToken.toFixed(2)}/${this.props.profitLoanToken.toFixed(
              2
            )}`
          : `${this.props.profitLoanToken.toFixed(2)}/${this.props.profitCollateralToken.toFixed(
              2
            )}`
    } else {
      profitTitle = `$${this.props.profitUSD.toFixed()}`
      profitValue = <React.Fragment>{this.props.profitUSD.toFixed(2)}</React.Fragment>
    }
    return this.state.isLoadingTransaction && this.state.request ? (
      <React.Fragment>
        <div className="token-selector-item__image">
          <CircleLoader></CircleLoader>
          <TradeTxLoaderStep taskId={this.state.request.id} />
        </div>
      </React.Fragment>
    ) : (
      <div className={`own-token-grid-row ${this.props.isTxCompleted ? `completed` : ``}`}>
        <div className="own-token-grid-row__col-token-name  opacityIn">
          <span className="own-token-grid-row__body-header">Pair</span>
          {`${this.props.baseToken.toUpperCase()}-${this.props.quoteToken.toUpperCase()}`}
        </div>
        <div className="own-token-grid-row__col-position-type opacityIn">
          <span className="own-token-grid-row__body-header">Type</span>

          <span className="position-type-marker">{`${this.props.leverage}x ${this.props.positionType}`}</span>
        </div>
        <div
          title={this.props.positionValue.toFixed(18)}
          className="own-token-grid-row__col-position  opacityIn">
          <span className="own-token-grid-row__body-header">
            Position({this.props.baseToken}/{this.props.quoteToken})
          </span>
          {this.props.positionValue.toFixed(4)}
        </div>
        <div
          title={this.props.openPrice.toFixed(18)}
          className="own-token-grid-row__col-asset-price  opacityIn">
          <span className="own-token-grid-row__body-header">Mid Market Price</span>
          {!this.state.isLoading ? (
            <React.Fragment>
              
              {this.props.openPrice.toFixed(2)}
            </React.Fragment>
          ) : (
            <Preloader width="74px" />
          )}
        </div>
        <div
          title={this.props.liquidationPrice.toFixed(18)}
          className="own-token-grid-row__col-liquidation-price opacityIn">
          <span className="own-token-grid-row__body-header">Liq. Price</span>
          {!this.state.isLoading ? (
            <React.Fragment>
              
              {this.props.liquidationPrice.toFixed(2)}
            </React.Fragment>
          ) : (
            <Preloader width="74px" />
          )}
        </div>
        <div className="own-token-grid-row__col-collateral opacityIn">
          <span className="own-token-grid-row__body-header">Collateral</span>
          <div
            title={this.props.collateral.toFixed(18)}
            className="own-token-grid-row__col-collateral-wrapper">
            {!this.state.isLoading ? (
              <React.Fragment>
                <span>
                  
                  {this.props.collateral.toFixed(2)}
                </span>
                <span
                  className={`own-token-grid-row__col-asset-collateral-small ${
                    this.props.loan.collateralizedPercent.lte(this.props.maintenanceMargin.plus(0.1)) ? 'danger' : ''
                  }`}>
                  {this.props.loan.collateralizedPercent
                    .multipliedBy(100)
                    .toFixed(2)}
                  %
                </span>
              </React.Fragment>
            ) : (
              <Preloader width="74px" />
            )}
          </div>
          <div
            className={`own-token-grid-row__open-manage-collateral ${
              this.props.loan.collateralizedPercent.lte(this.props.maintenanceMargin) ? 'danger' : ''
            }`}
            onClick={this.onManageClick}>
            <OpenManageCollateral />
          </div>
        </div>
        <div
          title={this.props.value.toFixed(18)}
          className="own-token-grid-row__col-position-value opacityIn">
          <span className="own-token-grid-row__body-header">Value</span>
          {!this.state.isLoading ? (
            this.props.value ? (
              <React.Fragment>
                
                {this.props.value.toFixed(2)}
              </React.Fragment>
            ) : (
              '$0.00'
            )
          ) : (
            <Preloader width="74px" />
          )}
        </div>
        <div
          title={profitTitle}
          className="own-token-grid-row__col-profit opacityIn">
          <span className="own-token-grid-row__body-header">Profit</span>
          {!this.state.isLoading ? profitValue : <Preloader width="74px" />}
        </div>
        <div className="own-token-grid-row__col-action opacityIn rightIn">
          <button
            className="own-token-grid-row_button own-token-grid-row__sell-button own-token-grid-row__button--size-half"
            onClick={this.onSellClick}
            disabled={this.props.loan.collateralizedPercent.lte(0.15)}>
            {TradeType.SELL}
          </button>
        </div>
      </div>
    )
  }

  public onDetailsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    // this.props.onDetails(this.props.currentKey);
  }

  public onManageClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    const request = new ManageCollateralRequest(
      this.props.loan.loanId,
      this.props.loan.loanAsset,
      this.props.loan.collateralAsset,
      this.props.loan.collateralAmount,
      false
    )

    await this.setState({ ...this.state, request: request })
    this.props.changeLoadingTransaction(
      this.state.isLoadingTransaction,
      request,
      false,
      this.state.resultTx
    )
    this.props.onManageCollateralOpen(request)
  }

  public onSellClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
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
    await this.setState({ ...this.state, request: request })
    this.props.onTrade(request)
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request, false, true)
  }
}
