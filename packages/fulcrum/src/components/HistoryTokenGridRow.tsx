import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import { Asset } from '../domain/Asset'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { FulcrumProvider } from '../services/FulcrumProvider'
import { Preloader } from './Preloader'
import { PositionEventsGroup } from '../domain/PositionEventsGroup'
import { PositionHistoryData } from '../domain/PositionHistoryData'
import { DepositCollateralEvent } from '../domain/events/DepositCollateralEvent'
import { RolloverEvent } from '../domain/events/RolloverEvent'
import { WithdrawCollateralEvent } from '../domain/events/WithdrawCollateralEvent'
import { AssetsDictionary } from '../domain/AssetsDictionary'

export interface IHistoryTokenGridRowProps {
  eventsGroup: PositionEventsGroup
  stablecoins: Asset[]
  isHidden: boolean
  getAssetUSDRate: (asset: Asset, date: Date) => Promise<BigNumber>
}

interface IHistoryTokenGridRowState {
  assetBalance: BigNumber | null
  isLoading: boolean
  isLoadedRate: boolean
  isShowCollapse: boolean
  latestEvent: PositionHistoryData | null
  otherEvents: PositionHistoryData[]
}

export class HistoryTokenGridRow extends Component<
  IHistoryTokenGridRowProps,
  IHistoryTokenGridRowState
> {
  private etherscanUrl = FulcrumProvider.Instance.web3ProviderSettings.etherscanURL

  constructor(props: IHistoryTokenGridRowProps, context?: any) {
    super(props, context)

    this._isMounted = false

    this.state = {
      assetBalance: new BigNumber(0),
      isLoading: false,
      isLoadedRate: false,
      isShowCollapse: false,
      latestEvent: null,
      otherEvents: []
    }

    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.ProviderAvailable,
      this.onProviderAvailable
    )
    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  private _isMounted: boolean

  private async derivedUpdate() {
    // if (this.state.isLoadedRate) return

    this._isMounted &&
      this.setState({
        ...this.state,
        isLoading: true
      })
    const latestEvent = {
      ...this.props.eventsGroup.events[this.props.eventsGroup.events.length - 1]
    }
    try {
      if (
        latestEvent.payTradingFeeEvent &&
        !this.props.stablecoins.includes(latestEvent.payTradingFeeEvent.token)
      ) {
        const token =
          latestEvent.payTradingFeeEvent.token === Asset.WETH ||
          latestEvent.payTradingFeeEvent.token === Asset.fWETH
            ? Asset.ETH
            : latestEvent.payTradingFeeEvent.token
        const feeAssetUsdRate = await this.props.getAssetUSDRate(
          token,
          latestEvent.payTradingFeeEvent.timeStamp
        )
        latestEvent.payTradingFeeEvent = { ...latestEvent.payTradingFeeEvent! } //deep copy
        latestEvent.payTradingFeeEvent.amount = latestEvent.payTradingFeeEvent.amount.times(
          feeAssetUsdRate
        )
      }
      // if (!this.props.stablecoins.includes(latestEvent.quoteToken)) {
      //   const assetUsdRate = await this.props.getAssetUSDRate(latestEvent.quoteToken, latestEvent.date)
      //   latestEvent.tradePrice = latestEvent.tradePrice.times(assetUsdRate)
      //   latestEvent.value = latestEvent.value.times(assetUsdRate)
      //   if (latestEvent.profit instanceof BigNumber) {
      //     latestEvent.profit = latestEvent.profit.times(assetUsdRate)
      //   }
      // }
    } finally {
      this._isMounted &&
        this.setState({
          ...this.state,
          latestEvent,
          isLoading: false
          // isLoadedRate: true
        })
    }
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate()
  }

  private onProviderChanged = async () => {
    await this.derivedUpdate()
  }

  public componentWillUnmount(): void {
    this._isMounted = false

    FulcrumProvider.Instance.eventEmitter.removeListener(
      FulcrumProviderEvents.ProviderAvailable,
      this.onProviderAvailable
    )
    FulcrumProvider.Instance.eventEmitter.removeListener(
      FulcrumProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  public componentDidMount(): void {
    this._isMounted = true
    if (!this.props.isHidden) this.derivedUpdate()
  }

  public componentDidUpdate(prevProps: IHistoryTokenGridRowProps): void {
    if (
      this.props.eventsGroup.loanId !== prevProps.eventsGroup.loanId ||
      this.props.eventsGroup !== prevProps.eventsGroup
    ) {
      this.derivedUpdate()
    }
  }

  private getSwappedEvents = async () => {
    const croppedEvent = this.props.eventsGroup.events.slice(0, -1).reverse()

    if (this.state.otherEvents.length) return

    const swappedEvents = await Promise.all(
      croppedEvent.map(async (swappedEvent) => {
        const event = { ...swappedEvent }
        if (
          event.payTradingFeeEvent &&
          !this.props.stablecoins.includes(event.payTradingFeeEvent.token)
        ) {
          const token =
            event.payTradingFeeEvent.token === Asset.WETH ||
            event.payTradingFeeEvent.token === Asset.fWETH
              ? Asset.ETH
              : event.payTradingFeeEvent.token
          const feeAssetUsdRate = await this.props.getAssetUSDRate(
            token,
            event.payTradingFeeEvent.timeStamp
          )
          event.payTradingFeeEvent = { ...swappedEvent.payTradingFeeEvent! } //deep copy
          event.payTradingFeeEvent.amount = event.payTradingFeeEvent.amount.times(feeAssetUsdRate)
        }

        // if (!this.props.stablecoins.includes(event.quoteToken)) {
        //   const assetUsdRate = await this.props.getAssetUSDRate(event.quoteToken, event.date)
        //   event.tradePrice = event.tradePrice.times(assetUsdRate)
        //   event.value = event.value.times(assetUsdRate)
        //   if (event.profit instanceof BigNumber) {
        //     event.profit = event.profit.times(assetUsdRate)
        //   }
        // }
        return event
      })
    )

    this.setState({ ...this.state, otherEvents: swappedEvents })
  }

  public renderOtherEvents = () => {    
    const quoteToken = AssetsDictionary.assets.get(this.props.eventsGroup.quoteToken)!
    const baseToken = AssetsDictionary.assets.get(this.props.eventsGroup.baseToken)!
    const numberDigits = this.props.eventsGroup.quoteToken === Asset.WBTC ? 4 : 2

    return (
      this.state.otherEvents &&
      this.state.otherEvents.map((event, i) => {
        return (
          <div key={i} className="history-token-grid-row history-token-grid-row-inner">
            <div className="history-token-grid-row-inner__col history-token-grid-row-inner__col-token-date">
              <span className="label">Date</span>
              <a
                title={event.txHash}
                href={`${this.etherscanUrl}tx/${event.txHash}`}
                target="blank">
                {event.date.toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </a>
            </div>

            <div className="history-token-grid-row-inner__col history-token-grid-row-inner__col-result">
              <span className="label">Result</span>
              <span>{event.action.replace(event.loanId, '')}</span>
            </div>
            <div
              title={event.positionValue.toFixed()}
              className="history-token-grid-row-inner__col history-token-grid-row-inner__col-position">
              <span className="label">Position</span>
              {event.positionValue.gt(0) ? (
              <React.Fragment>
                {baseToken.reactLogoSvg.render()}&nbsp;
                {event.positionValue.toFixed(4)}
              </React.Fragment>
            ) : '-'}
            </div>
            <div className="history-token-grid-row-inner__col history-token-grid-row-inner__col-asset-price">
              <span className="label">Trade Price</span>
              {!this.state.isLoading ? (
                event.action === 'Deposited' ||
                event.action === 'Withdrew' ||
                event.action === 'Rollovered' ? (
                  '-'
                ) : (
                  <React.Fragment>
                    {quoteToken.reactLogoSvg.render()}&nbsp;
                    {event.tradePrice.toFixed(numberDigits)}
                  </React.Fragment>
                )
              ) : (
                <Preloader width="74px" />
              )}
            </div>
            <div
              title={event.value.toFixed(18)}
              className="history-token-grid-row-inner__col history-token-grid-row-inner__col-position-value">
              <span className="label">Value</span>
              {!this.state.isLoading ? (
                event.action === 'Deposited' ||
                event.action === 'Withdrew' ||
                event.action === 'Rollovered' ? (
                  '-'
                ) : (
                  <React.Fragment>
                    {quoteToken.reactLogoSvg.render()}&nbsp;
                    {event.value.toFixed(numberDigits)}
                  </React.Fragment>
                )
              ) : (
                <Preloader width="74px" />
              )}
            </div>

            <div
              title={
                event.payTradingFeeEvent &&
                event.earnRewardEvent &&
                `${event.payTradingFeeEvent.amount.toFixed(
                  18
                )} / ${event.earnRewardEvent.amount.toFixed(18)}`
              }
              className="history-token-grid-row-inner__col history-token-grid-row__col-fee-reward">
              <span className="label">
                Fee / Rewards <span className="bzrx">BZRX</span>
              </span>
              {!this.state.isLoading ? (
                event.payTradingFeeEvent && event.earnRewardEvent ? (
                  <React.Fragment>
                    <span className="sign-currency">$</span>
                    {event.payTradingFeeEvent.amount.toFixed(4)} /{' '}
                    {event.earnRewardEvent.amount.toFixed(2)}
                  </React.Fragment>
                ) : (
                  '-'
                )
              ) : (
                <Preloader width="74px" />
              )}
            </div>
            <div
              title={event.profit instanceof BigNumber ? event.profit.toFixed(18) : '-'}
              className="history-token-grid-row-inner__col history-token-grid-row-inner__col-profit">
              <span className="label">Profit</span>
              {event.profit instanceof BigNumber ? (<React.Fragment>
                  {quoteToken.reactLogoSvg.render()}&nbsp;
                  {event.profit.toFixed(3)}
                </React.Fragment>) : '-'}
            </div>
          </div>
        )
      })
    )
  }

  public render() {
    // if (this.props.isHidden) return null

    const latestEvent =
      this.state.latestEvent ??
      this.props.eventsGroup.events[this.props.eventsGroup.events.length - 1]
    // const profitSum = this.props.eventsGroup.events.reduce((a: BigNumber, b: PositionHistoryData) => a.plus(b.profit instanceof BigNumber ? b.profit : new BigNumber(0) || 0), new BigNumber(0));
    const quoteToken = AssetsDictionary.assets.get(this.props.eventsGroup.quoteToken)!
    const baseToken = AssetsDictionary.assets.get(this.props.eventsGroup.baseToken)!
    const numberDigits = this.props.eventsGroup.quoteToken === Asset.WBTC ? 4 : 2
    return (
      <div>
        <div className="history-token-grid-row">
          <div className="history-token-grid-row__col history-token-grid-row__col-token-date">
            <span className="label">Date</span>
            <a
              title={latestEvent.txHash}
              href={`${this.etherscanUrl}tx/${latestEvent.txHash}`}
              target="blank">
              {latestEvent.date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </a>
          </div>
          <div
            title={this.props.eventsGroup.loanId}
            className="history-token-grid-row__col history-token-grid-row__col-token-asset">
            <span className="label">Pair</span>
            {this.props.eventsGroup.baseToken}/{this.props.eventsGroup.quoteToken}
          </div>
          <div className="history-token-grid-row__col history-token-grid-row__col-type">
            <span className="label">Type</span>
            <div className="position-type-marker">
              {`${this.props.eventsGroup.leverage}x ${this.props.eventsGroup.positionType}`}
            </div>
          </div>
          {/* <div className="history-token-grid-row__col-asset-unit">
            {this.props.eventsGroup.quoteToken}
          </div> */}
          <div
            title={latestEvent.positionValue.toFixed(18)}
            className="history-token-grid-row__col history-token-grid-row__col-position">
            <span className="label">Position</span>
            {latestEvent.positionValue.gt(0) ? (
              <React.Fragment>
                {baseToken.reactLogoSvg.render()}&nbsp;
                {latestEvent.positionValue.toFixed(4)}
              </React.Fragment>
            ) : (
              '-'
            )}
          </div>
          <div
            title={latestEvent.tradePrice.toFixed(18)}
            className="history-token-grid-row__col history-token-grid-row__col-asset-price">
            <span className="label">Trade Price</span>
            {!this.state.isLoading ? (
              latestEvent.action === 'Deposited' ||
              latestEvent.action === 'Withdrew' ||
              latestEvent.action === 'Rollovered' ? (
                '-'
              ) : (
                <React.Fragment>
                  {quoteToken.reactLogoSvg.render()}&nbsp;
                  {latestEvent.tradePrice.toFixed(numberDigits)}
                </React.Fragment>
              )
            ) : (
              <Preloader width="74px" />
            )}
          </div>
          {/* <div className="history-token-grid-row__col-liquidation-price">
        {!this.state.isLoading
          ? this.state.assetBalance
            ? <React.Fragment>
              <span className="sign-currency">$</span>{new BigNumber(0).toFixed(2)}
            </React.Fragment>
            : '$0.00'
          : <Preloader width="74px" />
        }
      </div> */}
          <div
            title={latestEvent.value.toFixed(18)}
            className="history-token-grid-row__col history-token-grid-row__col-position-value">
            <span className="label">Value</span>
            {!this.state.isLoading ? (
              latestEvent.action === 'Deposited' ||
              latestEvent.action === 'Withdrew' ||
              latestEvent.action === 'Rollovered' ? (
                '-'
              ) : (
                <React.Fragment>
                  {quoteToken.reactLogoSvg.render()}&nbsp;
                  {latestEvent.value.toFixed(numberDigits)}
                </React.Fragment>
              )
            ) : (
              <Preloader width="74px" />
            )}
          </div>
          <div
            title={
              latestEvent.payTradingFeeEvent &&
              latestEvent.earnRewardEvent &&
              `${latestEvent.payTradingFeeEvent.amount.toFixed()} / ${latestEvent.earnRewardEvent.amount.toFixed()}`
            }
            className="history-token-grid-row__col history-token-grid-row__col-fee-reward">
            <span className="label">
              Fee / Rewards <span className="bzrx">BZRX</span>
            </span>
            {!this.state.isLoading ? (
              latestEvent.payTradingFeeEvent && latestEvent.earnRewardEvent ? (
                <React.Fragment>
                  <span className="sign-currency">$</span>
                  {latestEvent.payTradingFeeEvent.amount.toFixed(4)} /{' '}
                  {latestEvent.earnRewardEvent.amount.toFixed(2)}
                </React.Fragment>
              ) : (
                '-'
              )
            ) : (
              <Preloader width="74px" />
            )}
          </div>
          {/* <div title={!this.state.isShowCollapse ? profitSum.toFixed(18) : latestEvent.profit instanceof BigNumber ? latestEvent.profit.toFixed(18) : "-"} className="history-token-grid-row__col history-token-grid-row__col-profit"> */}
          <div
            title={latestEvent.profit instanceof BigNumber ? latestEvent.profit.toFixed(18) : '-'}
            className="history-token-grid-row__col history-token-grid-row__col-profit">
            <span className="label">Profit</span>
            {!this.state.isLoading ? (
              latestEvent.profit instanceof BigNumber ? (
                // ? <React.Fragment><span className="sign-currency">$</span>{!this.state.isShowCollapse ? profitSum.toFixed(3) : latestEvent.profit.toFixed(3)}</React.Fragment>
                <React.Fragment>
                  {quoteToken.reactLogoSvg.render()}&nbsp;
                  {latestEvent.profit.toFixed(3)}
                </React.Fragment>
              ) : (
                '-'
              )
            ) : (
              <Preloader width="74px" />
            )}
          </div>
          <div
            className={`history-token-grid-row__col history-token-grid-row__col-result ${
              this.props.eventsGroup.events.length - 1 ? `toggle-collapse` : ``
            }  ${this.state.isShowCollapse ? `opened-collapse` : ``}`}
            onClick={this.toggleCollapse}>
            <span className="label">Last event</span>
            <span>{latestEvent.action}</span>
          </div>
        </div>
        <div className={`collapse ${this.state.isShowCollapse ? `show` : `hide`}`}>
          {this.renderOtherEvents()}
        </div>
      </div>
    )
  }

  public toggleCollapse = () => {
    if (!this.state.isShowCollapse) {
      this.getSwappedEvents()
    }
    this.setState({ ...this.state, isShowCollapse: !this.state.isShowCollapse })
  }
}
