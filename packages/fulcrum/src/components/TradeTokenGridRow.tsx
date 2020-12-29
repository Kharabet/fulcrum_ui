import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import siteConfig from '../config/SiteConfig.json'
import { Asset } from '../domain/Asset'
import { PositionType } from '../domain/PositionType'
import { TradeRequest } from '../domain/TradeRequest'
import { TradeType } from '../domain/TradeType'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { FulcrumProvider } from '../services/FulcrumProvider'
import { TasksQueue } from '../services/TasksQueue'
import { PositionTypeMarkerAlt } from './PositionTypeMarkerAlt'

import { RequestStatus } from '../domain/RequestStatus'
import { RequestTask } from '../domain/RequestTask'
import { LeverageSelector } from './LeverageSelector'
import { PositionTypeMarker } from './PositionTypeMarker'
import { Preloader } from './Preloader'

import { CircleLoader } from './CircleLoader'
import { TradeTxLoaderStep } from './TradeTxLoaderStep'

import ReactTooltip from 'react-tooltip'
import { ReactComponent as IconInfo } from '../assets/images/icon_info.svg'
import '../styles/components/tooltip.scss'

export interface ITradeTokenGridRowProps {
  isMobileMedia: boolean
  baseToken: Asset
  quoteToken: Asset
  positionType: PositionType
  defaultLeverage: number
  isTxCompleted: boolean
  maintenanceMargin: BigNumber
  yieldApr: BigNumber
  onTrade: (request: TradeRequest) => void
  changeLoadingTransaction: (
    isLoadingTransaction: boolean,
    request: TradeRequest | undefined
  ) => void
  onTransactionsCompleted: () => void
  changeGridPositionType: (activePositionType: PositionType) => void
}

interface ITradeTokenGridRowState {
  leverage: number

  baseTokenPrice: BigNumber
  liquidationPrice: BigNumber

  interestRate: BigNumber
  isLoading: boolean
  isLoadingTransaction: boolean
  request: TradeRequest | undefined
  resultTx: boolean
}

export class TradeTokenGridRow extends Component<ITradeTokenGridRowProps, ITradeTokenGridRowState> {
  constructor(props: ITradeTokenGridRowProps, context?: any) {
    super(props, context)

    this._isMounted = false
    this.state = {
      leverage: this.props.defaultLeverage,
      baseTokenPrice: new BigNumber(0),
      liquidationPrice: new BigNumber(0),
      interestRate: new BigNumber(0),
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
  }

  private _isMounted: boolean

  private async derivedUpdate() {
    const collateralToPrincipalRate =
      this.props.positionType === PositionType.LONG
        ? await FulcrumProvider.Instance.getSwapRate(this.props.baseToken, this.props.quoteToken)
        : await FulcrumProvider.Instance.getSwapRate(this.props.quoteToken, this.props.baseToken)

    const baseTokenPrice =
      this.props.positionType === PositionType.LONG
        ? collateralToPrincipalRate
        : new BigNumber(1).div(collateralToPrincipalRate)

    const initialMargin =
      this.props.positionType === PositionType.LONG
        ? new BigNumber(10 ** 38).div(new BigNumber(this.state.leverage - 1).times(10 ** 18))
        : new BigNumber(10 ** 38).div(new BigNumber(this.state.leverage).times(10 ** 18))

    const maintenanceMargin = this.props.maintenanceMargin
    // liq_price_before_trade = (maintenance_margin * collateralToLoanRate / 10^20) + collateralToLoanRate) / ((10^20 + current_margin) / 10^20
    // if it's a SHORT then -> 10^36 / above
    const liquidationPriceBeforeTrade = maintenanceMargin
      .times(collateralToPrincipalRate.times(10 ** 18))
      .div(10 ** 20)
      .plus(collateralToPrincipalRate.times(10 ** 18))
      .div(new BigNumber(10 ** 20).plus(initialMargin).div(10 ** 20))
    let liquidationPrice = new BigNumber(0)
    if (liquidationPriceBeforeTrade.gt(0)) {
      liquidationPrice =
        this.props.positionType === PositionType.LONG
          ? liquidationPriceBeforeTrade.div(10 ** 18)
          : new BigNumber(10 ** 36).div(liquidationPriceBeforeTrade).div(10 ** 18)
    }

    const interestRate = await FulcrumProvider.Instance.getBorrowInterestRate(
      this.props.positionType === PositionType.LONG ? this.props.quoteToken : this.props.baseToken
    )

    this._isMounted &&
      this.setState({
        ...this.state,
        baseTokenPrice,
        interestRate,
        liquidationPrice,
        isLoading: false
      })
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate()
  }
  private onProviderChanged = async () => {
    await this.derivedUpdate()
  }

  private onAskToOpenProgressDlg = (taskId: number) => {
    if (!this.state.request || taskId !== this.state.request.id) return
    this._isMounted && this.setState({ ...this.state, isLoadingTransaction: true })
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request)
  }
  private onAskToCloseProgressDlg = (task: RequestTask) => {
    if (!this.state.request || task.request.id !== this.state.request.id) return
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
  }

  public async componentDidMount() {
    this._isMounted = true

    const task = TasksQueue.Instance.getTasksList().find(
      (t) =>
        t.request instanceof TradeRequest &&
        t.request.loanId === '0x0000000000000000000000000000000000000000000000000000000000000000' &&
        t.request.asset === this.props.baseToken &&
        t.request.quoteToken === this.props.quoteToken &&
        t.request.positionType === this.props.positionType
    )
    const isLoadingTransaction = task && !task.error ? true : false
    const request = task ? (task.request as TradeRequest) : undefined

    this._isMounted &&
      this.setState({ ...this.state, resultTx: true, isLoadingTransaction, request })
    await this.derivedUpdate()
  }

  public async componentDidUpdate(
    prevProps: Readonly<ITradeTokenGridRowProps>,
    prevState: Readonly<ITradeTokenGridRowState>,
    snapshot?: any
  ) {
    if (
      prevState.leverage !== this.state.leverage ||
      prevProps.isTxCompleted !== this.props.isTxCompleted
    ) {
      await this.derivedUpdate()
      if (this.state.isLoadingTransaction) {
        this._isMounted &&
          this.setState({ ...this.state, isLoadingTransaction: false, request: undefined }, () => {
            this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request)
          })
      }
    }
  }

  public render() {
    return (
      <React.Fragment>
        {this.props.isMobileMedia && (
          <div className={`trade-token-grid-first-row`}>
            <div className="trade-token-grid-row__col-token-name">
              <div className="trade-token-grid-row__col-token-name--inner">
                {this.props.baseToken}
                <PositionTypeMarkerAlt value={this.props.positionType} />
              </div>
            </div>
            <div className="poisition-type-switch">
              <button
                className={'' + (this.props.positionType === PositionType.LONG ? 'btn-active' : '')}
                onClick={() => this.props.changeGridPositionType(PositionType.LONG)}>
                Long
              </button>
              <button
                className={
                  '' + (this.props.positionType === PositionType.SHORT ? 'btn-active' : '')
                }
                onClick={() => this.props.changeGridPositionType(PositionType.SHORT)}>
                Short
              </button>
            </div>
          </div>
        )}
        <div className={`trade-token-grid-row`}>
          {!this.props.isMobileMedia && (
            <div className="trade-token-grid-row__col-token-name">
              <div className="trade-token-grid-row__col-token-name--inner">
                {this.props.baseToken}
                <PositionTypeMarkerAlt value={this.props.positionType} />
              </div>
            </div>
          )}
          {!this.props.isMobileMedia && (
            <div className="trade-token-grid-row__col-position-type">
              <PositionTypeMarker value={this.props.positionType} />
            </div>
          )}
          <div className="trade-token-grid-row__col-leverage">
            <div className="leverage-selector__wrapper">
              <LeverageSelector
                asset={this.props.baseToken}
                value={this.state.leverage}
                minValue={this.props.positionType === PositionType.SHORT ? 1 : 2}
                maxValue={5}
                onChange={this.onLeverageSelect}
              />
            </div>
          </div>
          <div className="trade-token-grid-row__col-price">
            {this.props.isMobileMedia && (
              <React.Fragment>
                <span className="trade-token-grid-row__title">
                  Mid Market Price
                  <IconInfo
                    className="tooltip__icon"
                    data-tip={
                      'Price feeds are provided securely via Chainlink, trades are executed via Kyber. This can result in minor price variations when opening and closing positions.'
                    }
                  />
                  <ReactTooltip className="tooltip__info" place="top" effect="solid" />
                </span>
              </React.Fragment>
            )}
            {this.state.baseTokenPrice.gt(0) &&
            this.state.baseTokenPrice.toFixed() !== 'Infinity' &&
            !this.state.isLoading ? (
              <React.Fragment>
                <div title={`$${this.state.baseTokenPrice.toFixed(18)}`}>
                  {this.state.baseTokenPrice.toFixed(2)}
                </div>
              </React.Fragment>
            ) : (
              <Preloader width="74px" />
            )}
          </div>
          <div
            title={`$${this.state.liquidationPrice.toFixed(18)}`}
            className="trade-token-grid-row__col-liquidation">
            {this.props.isMobileMedia && (
              <span className="trade-token-grid-row__title">Liquidation Price</span>
            )}
            {this.state.liquidationPrice.gt(0) && !this.state.isLoading ? (
              <React.Fragment>{this.state.liquidationPrice.toFixed(2)}</React.Fragment>
            ) : (
              <Preloader width="74px" />
            )}
          </div>
          <div
            title={this.props.yieldApr.gt(0) ? `${this.props.yieldApr.toFixed(18)}%` : ``}
            className="trade-token-grid-row__col-profit">
            {this.props.isMobileMedia && (
              <div className="trade-token-grid-row__title">Est. Yield, vBZRX</div>
            )}

            {this.props.yieldApr.gt(0) && !this.state.isLoading ? (
              <React.Fragment>
                {this.props.yieldApr.toFixed(0)}
                <span className="fw-sign">%</span>
                <span
                  title={this.state.interestRate.toFixed(18)}
                  className="trade-token-grid-row__yield">
                  APR <span>{this.state.interestRate.toFixed(2)}%</span>
                </span>
              </React.Fragment>
            ) : (
              <Preloader width="74px" />
            )}
          </div>
          <div className="trade-token-grid-row__col-action">
            <button
              className="trade-token-grid-row__button trade-token-grid-row__buy-button trade-token-grid-row__button--size-half"
              disabled={siteConfig.TradeBuyDisabled || this.state.isLoadingTransaction}
              onClick={this.onBuyClick}>
              {this.props.positionType}
            </button>
          </div>
        </div>
        {this.state.isLoadingTransaction &&
        this.state.request &&
        this.props.positionType === this.state.request.positionType &&
        this.state.request.tradeType === TradeType.BUY ? (
          <div className={`token-selector-item__image open-tab-tx`}>
            <CircleLoader />
            <TradeTxLoaderStep taskId={this.state.request.id} />
          </div>
        ) : (
          !this.state.resultTx &&
          this.state.request &&
          this.props.positionType === this.state.request.positionType &&
          this.state.request.tradeType === TradeType.BUY && <div className="close-tab-tx" />
        )}
      </React.Fragment>
    )
  }

  public onLeverageSelect = (value: number) => {
    this._isMounted && this.setState({ ...this.state, leverage: value, isLoading: true })
  }

  public onBuyClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    const request = new TradeRequest(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      TradeType.BUY,
      this.props.baseToken,
      this.props.quoteToken, // TODO: depends on which one they own
      Asset.ETH,
      this.props.positionType,
      this.state.leverage,
      new BigNumber(0)
    )
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request)
    this.props.onTrade(request)
    this._isMounted && this.setState({ ...this.state, request: request })
  }
}
