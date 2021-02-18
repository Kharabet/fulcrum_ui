import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import { ReactComponent as OpenManageCollateral } from '../assets/images/openManageCollateral.svg'
import { ReactComponent as OpenExtendLoan } from '../assets/images/openExtendLoan.svg'
import Asset from 'bzx-common/src/assets/Asset'

import { IBorrowedFundsState } from '../domain/IBorrowedFundsState'
import { ManageCollateralRequest } from '../domain/ManageCollateralRequest'
import { ExtendLoanRequest } from '../domain/ExtendLoanRequest'
import { PositionType } from '../domain/PositionType'
import { RequestStatus } from '../domain/RequestStatus'
import { RequestTask } from '../domain/RequestTask'
import { TradeRequest } from '../domain/TradeRequest'
import { TradeType } from '../domain/TradeType'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { FulcrumProvider } from '../services/FulcrumProvider'
import { TasksQueue } from '../services/TasksQueue'
import { CircleLoader } from './CircleLoader'
import { Preloader } from './Preloader'
import { TradeTxLoaderStep } from './TradeTxLoaderStep'
import { NotificationRollover } from './NotificationRollover'
import { RolloverRequest } from '../domain/RolloverRequest'
import ReactTooltip from 'react-tooltip'
import { ReactComponent as IconInfo } from '../assets/images/icon_info.svg'

import '../styles/components/tooltip.scss'
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
  currentPrice: BigNumber
  liquidationPrice: BigNumber
  profitCollateralToken?: BigNumber
  profitLoanToken?: BigNumber
  profitUSD: BigNumber
  maintenanceMargin: BigNumber
  isTxCompleted: boolean
  onTrade: (request: TradeRequest) => void
  onManageCollateralOpen: (request: ManageCollateralRequest) => void
  onExtendLoanOpen: (request: ExtendLoanRequest) => void
  onRolloverConfirmed: (request: RolloverRequest) => void
  changeLoadingTransaction: (
    isLoadingTransaction: boolean,
    request: TradeRequest | ManageCollateralRequest | RolloverRequest | undefined
  ) => void
  onTransactionsCompleted: () => void
}

interface IOwnTokenGridRowState {
  isLoading: boolean
  isLoadingTransaction: boolean
  request: TradeRequest | ManageCollateralRequest | RolloverRequest | undefined
  resultTx: boolean
  activeTokenProfit: Asset
}

export class OwnTokenGridRow extends Component<IOwnTokenGridRowProps, IOwnTokenGridRowState> {
  constructor(props: IOwnTokenGridRowProps, context?: any) {
    super(props, context)

    this._isMounted = false

    this.state = {
      isLoading: true,
      isLoadingTransaction: false,
      request: undefined,
      resultTx: false,
      activeTokenProfit: props.baseToken
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
    this._isMounted && this.setState({ ...this.state, isLoadingTransaction: true, resultTx: true })
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request)
  }
  private onAskToCloseProgressDlg = (task: RequestTask) => {
    if (!this.state.request || task.request.loanId !== this.state.request.loanId) return
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(async () => {
        await FulcrumProvider.Instance.onTaskCancel(task)
        this._isMounted &&
          this.setState({
            ...this.state,
            isLoadingTransaction: false,
            request: undefined,
            resultTx: false
          })
        this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request)
      }, 5000)
      return
    }

    this._isMounted && this.setState({ ...this.state, resultTx: true })
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request)
    const activeTasks = TasksQueue.Instance.getTasksList().filter(
      (item) => item.status !== RequestStatus.FAILED && item.status !== RequestStatus.FAILED_SKIPGAS
    ).length
    if (activeTasks < 2) this.props.onTransactionsCompleted()
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
    const task = TasksQueue.Instance.getTasksList().find(
      (t) => t.request.loanId === this.props.loan.loanId
    )
    const isLoadingTransaction = task && task.error ? true : false
    const request = task ? (task.request as TradeRequest | ManageCollateralRequest) : undefined
    this._isMounted &&
      this.setState({ ...this.state, resultTx: true, isLoadingTransaction, request })
    await this.derivedUpdate()
  }

  public componentDidUpdate(
    prevProps: Readonly<IOwnTokenGridRowProps>,
    prevState: Readonly<IOwnTokenGridRowState>,
    snapshot?: any
  ): void {
    if (prevProps.isTxCompleted !== this.props.isTxCompleted) {
      if (this.state.isLoadingTransaction) {
        this._isMounted &&
          this.setState({ ...this.state, isLoadingTransaction: false, request: undefined })
        this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request)
      }
    }
  }

  public render() {
    const precisionDigits = this.props.quoteToken === Asset.WBTC ? 4 : 2
    const remainingDays = this.props.loan.loanData.interestDepositRemaining.div(
      this.props.loan.loanData.interestOwedPerDay
    )
    const isRollover = remainingDays.eq(0)

    let profitTitle = ''
    let profitValue
    if (
      this.props.profitUSD.eq(0) &&
      this.props.profitCollateralToken &&
      this.props.profitLoanToken
    ) {
      profitTitle =
        this.props.positionType === PositionType.LONG
          ? this.state.activeTokenProfit === this.props.baseToken
            ? `${this.props.profitCollateralToken.toFixed()}`
            : `${this.props.profitLoanToken.toFixed()}`
          : this.state.activeTokenProfit === this.props.baseToken
          ? `${this.props.profitLoanToken.toFixed()}`
          : `${this.props.profitCollateralToken.toFixed()}`
      profitValue =
        this.props.positionType === PositionType.LONG ? (
          <React.Fragment>
            {this.state.activeTokenProfit === this.props.baseToken
              ? this.props.profitCollateralToken.toFixed(2)
              : this.props.profitLoanToken.toFixed(precisionDigits)}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {this.state.activeTokenProfit === this.props.baseToken
              ? this.props.profitLoanToken.toFixed(2)
              : this.props.profitCollateralToken.toFixed(precisionDigits)}
          </React.Fragment>
        )
    }
    if (!this.props.profitUSD.eq(0)) {
      profitTitle = `$${this.props.profitUSD.toFixed()}`
      profitValue = (
        <React.Fragment>
          <span className="sign-currency">$</span>
          {this.props.profitUSD.toFixed(2)}
        </React.Fragment>
      )
    }
    if (!this.props.profitCollateralToken || !this.props.profitLoanToken || isRollover) {
      profitTitle = ''
      profitValue = '–'
    }
    const insertProfitTooltip =
      this.props.positionType === PositionType.LONG
        ? `<ul class="tooltip__info__profit__ul"><li>Left: value of traded asset</li><li>Right: value of total position profit including collateral change </li></ul><p class="ta-c">${this.props.baseToken}/${this.props.quoteToken} pair for example</p><div class="tooltip__info__profit__table"><div class="short-label">Profit in ${this.props.baseToken}</div><div>Profit in ${this.props.quoteToken} + the change of your ${this.props.baseToken} collateral</div></div>`
        : `<ul class="tooltip__info__profit__ul"><li>Left: value of total position profit including collateral change </li><li>Right: value of traded asset</li></ul><p class="ta-c">${this.props.baseToken}/${this.props.quoteToken} pair for example</p><div class="tooltip__info__profit__table"><div>Profit in ${this.props.baseToken} + the change of your ${this.props.quoteToken} collateral</div><div class="short-label">Profit in ${this.props.quoteToken}</div></div>`
    const profitTooltip = `<p class="tooltip__info__profit__title">Profit is displayed in two ways:</p>${insertProfitTooltip}`

    return this.state.isLoadingTransaction && this.state.request ? (
      <React.Fragment>
        <div className="token-selector-item__image">
          <CircleLoader />
          <TradeTxLoaderStep taskId={this.state.request.id} />
        </div>
      </React.Fragment>
    ) : (
      <div className={`own-token-grid-row ${this.props.isTxCompleted ? `completed` : ``}`}>
        <div className="own-token-grid-row__col-token-name  opacityIn">
          <span className="body-header">Pair</span>
          {`${this.props.baseToken.toUpperCase()}/${this.props.quoteToken.toUpperCase()}`}
        </div>

        <div
          title={this.props.positionValue.toFixed(18)}
          className="own-token-grid-row__col-position  opacityIn">
          <span className="body-header">Position&nbsp;</span>
          <span className="own-token-grid-row__asset">
            {this.props.baseToken} {`${this.props.leverage}x`}&nbsp; {this.props.positionType}
          </span>
          <br />
          {this.props.positionValue.toFixed(4)}
        </div>
        <div
          title={this.props.openPrice.toFixed(18)}
          className="own-token-grid-row__col-asset-price  opacityIn">
          <span className="body-header">Open Price&nbsp;</span>
          <span className="own-token-grid-row__asset">{this.props.quoteToken}</span>
          <br />
          {!this.state.isLoading ? (
            <React.Fragment>{this.props.openPrice.toFixed(precisionDigits)}</React.Fragment>
          ) : (
            <Preloader width="74px" />
          )}
        </div>
        <div
          title={this.props.currentPrice.toFixed(18)}
          className="own-token-grid-row__col-current-price  opacityIn">
          <span className="body-header">Current Price&nbsp;</span>
          <span className="own-token-grid-row__asset">{this.props.quoteToken}</span>
          <br />
          {!this.state.isLoading ? (
            <React.Fragment>{this.props.currentPrice.toFixed(precisionDigits)}</React.Fragment>
          ) : (
            <Preloader width="74px" />
          )}
        </div>
        <div
          title={this.props.liquidationPrice.toFixed(18)}
          className="own-token-grid-row__col-liquidation-price opacityIn">
          <span className="body-header">Liq. Price&nbsp;</span>
          <span className="own-token-grid-row__asset">{this.props.quoteToken}</span>
          <br />

          {!this.state.isLoading ? (
            <React.Fragment>{this.props.liquidationPrice.toFixed(precisionDigits)}</React.Fragment>
          ) : (
            <Preloader width="74px" />
          )}
        </div>
        <div className="own-token-grid-row__col-collateral opacityIn">
          <span className="body-header">Collateral&nbsp;</span>
          <span className="own-token-grid-row__asset">{this.props.baseToken}</span>
          <br />
          <div>
            <div
              title={this.props.collateral.toFixed(18)}
              className="own-token-grid-row__col-collateral-wrapper">
              {!this.state.isLoading ? (
                <React.Fragment>
                  <span className="value-currency">
                    {this.props.collateral.toFixed(2)}
                    <div
                      className={`own-token-grid-row__open-manage-collateral ${
                        this.props.loan.collateralizedPercent.lte(this.props.maintenanceMargin)
                          ? 'danger'
                          : ''
                      }`}
                      onClick={this.onManageClick}>
                      <OpenManageCollateral />
                    </div>
                    <div
                      className={`own-token-grid-row__open-extend-loan`}
                      onClick={this.onExtendLoanClick}>
                      <OpenExtendLoan />
                    </div>
                    <span
                      className={`own-token-grid-row__col-asset-collateral-small ${
                        this.props.loan.collateralizedPercent.lte(
                          this.props.maintenanceMargin.plus(0.1)
                        )
                          ? 'danger'
                          : ''
                      }`}>
                      {this.props.loan.collateralizedPercent.multipliedBy(100).toFixed(2)}%
                    </span>
                  </span>
                </React.Fragment>
              ) : (
                <Preloader width="74px" />
              )}
            </div>
          </div>
        </div>
        <div
          title={this.props.value.toFixed(18)}
          className="own-token-grid-row__col-position-value opacityIn">
          <span className="body-header">Position Value&nbsp;</span>
          <span className="own-token-grid-row__asset">{this.props.quoteToken}</span>
          <br />
          {!this.state.isLoading ? (
            this.props.value ? (
              <React.Fragment>{this.props.value.toFixed(precisionDigits)}</React.Fragment>
            ) : (
              '$0.00'
            )
          ) : (
            <Preloader width="74px" />
          )}
        </div>
        <div title={profitTitle} className="own-token-grid-row__col-profit opacityIn">
          <span className="body-header">
            Profit&nbsp;
            <IconInfo
              className="tooltip__icon"
              data-tip={profitTooltip}
              data-multiline="true"
              data-html={true}
              data-for="profit-tooltip"
            />
            <ReactTooltip
              id="profit-tooltip"
              className="tooltip__info tooltip__info__profit"
              place="right"
              effect="solid"
            />
          </span>
          {!this.state.isLoading ? profitValue : <Preloader width="74px" />}
          <div className="own-token-grid-row__col-profit-switch">
            <label
              className={`${this.props.baseToken === this.state.activeTokenProfit ? 'active' : ''}`}
              onClick={() => {
                this.setActiveTokenProfit(this.props.baseToken)
              }}>
              {this.props.baseToken}
            </label>
            <label
              className={`${
                this.props.quoteToken === this.state.activeTokenProfit ? 'active' : ''
              }`}
              onClick={() => {
                this.setActiveTokenProfit(this.props.quoteToken)
              }}>
              {this.props.quoteToken}
            </label>
          </div>
        </div>
        <div className="own-token-grid-row__col-action opacityIn rightIn">
          <button
            className={`own-token-grid-row_button own-token-grid-row__sell-button own-token-grid-row__button--size-half ${isRollover &&
              'rollover-warning'}`}
            onClick={isRollover ? this.onRolloverClick : this.onSellClick}
            disabled={this.props.loan.collateralizedPercent.lte(this.props.maintenanceMargin)}>
            {isRollover ? 'Rollover' : 'CLOSE POSITION'}
          </button>
          {remainingDays.lte(6) && (
            <NotificationRollover isRollover={isRollover} countOfDaysToRollover={remainingDays} />
          )}
        </div>
      </div>
    )
  }

  public setActiveTokenProfit = (asset: Asset) => {
    this.setState({ ...this.state, activeTokenProfit: asset })
  }

  public onDetailsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    // this.props.onDetails(this.props.currentKey);
  }

  public onManageClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    const request = new ManageCollateralRequest(
      this.props.loan.loanId,
      this.props.loan.loanAsset,
      this.props.loan.collateralAsset,
      this.props.loan.collateralAmount,
      false
    )

    this._isMounted && this.setState({ ...this.state, request: request })
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request)
    this.props.onManageCollateralOpen(request)
  }

  public onExtendLoanClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    const request = new ExtendLoanRequest(
      this.props.loan.loanAsset,
      this.props.loan.accountAddress,
      this.props.loan.loanId,
      this.props.loan.amount
    )

    this._isMounted && this.setState({ ...this.state, request: request })

    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request)
    this.props.onExtendLoanOpen(request)
  }
  public onSellClick = (event: React.MouseEvent<HTMLElement>) => {
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
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request)
    this.props.onTrade(request)
    this._isMounted && this.setState({ ...this.state, request: request })
  }

  public onRolloverClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    const rolloverRequest = new RolloverRequest(this.props.loan.loanId)
    this.props.onRolloverConfirmed(rolloverRequest)
    this.setState({ ...this.state, request: rolloverRequest, isLoadingTransaction: true })
  }
}
