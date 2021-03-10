import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import Asset from 'bzx-common/src/assets/Asset'

import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { FulcrumProvider } from '../services/FulcrumProvider'
import { Preloader } from './Preloader'
import { PositionEventsGroup } from '../domain/PositionEventsGroup'
import { PositionHistoryData } from '../domain/PositionHistoryData'

import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'

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
      otherEvents: [],
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
        isLoading: true,
      })
    const latestEvent = {
      ...this.props.eventsGroup.events[this.props.eventsGroup.events.length - 1],
    }
    const otherEvents = this.props.eventsGroup.events.slice(0, -1).reverse()
    this._isMounted &&
      this.setState({
        ...this.state,
        latestEvent,
        otherEvents,
        isLoading: false,
        // isLoadedRate: true
      })
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

  public renderOtherEvents = () => {
    const quoteToken = AssetsDictionary.assets.get(this.props.eventsGroup.quoteToken)!
    const QuoteTokenIcon = quoteToken.reactLogoSvg
    const baseToken = AssetsDictionary.assets.get(this.props.eventsGroup.baseToken)!
    const BaseTokenIcon = baseToken.reactLogoSvg
    const precisionDigits = this.props.eventsGroup.quoteToken === Asset.WBTC ? 4 : 2

    return (
      this.state.otherEvents &&
      this.state.otherEvents.map((event, i) => {
        const payTradingFeeToken =
          (event.payTradingFeeEvent &&
            AssetsDictionary.assets.get(event.payTradingFeeEvent.token as Asset)!) ||
          undefined
        const PayTradingFeeTokenIcon = payTradingFeeToken?.reactLogoSvg

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
                  year: 'numeric',
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
                  <BaseTokenIcon />
                  &nbsp;
                  {event.positionValue.toFixed(4)}
                </React.Fragment>
              ) : (
                '-'
              )}
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
                    <QuoteTokenIcon />
                    &nbsp;
                    {event.tradePrice.toFixed(precisionDigits)}
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
                    <QuoteTokenIcon />
                    &nbsp;
                    {event.value.toFixed(precisionDigits)}
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
                event.payTradingFeeEvent &&
                payTradingFeeToken &&
                event.earnRewardEvent &&
                PayTradingFeeTokenIcon ? (
                  <React.Fragment>
                    <PayTradingFeeTokenIcon />
                    &nbsp;
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
              {event.profit instanceof BigNumber ? (
                <React.Fragment>
                  <QuoteTokenIcon />
                  &nbsp;
                  {event.profit.toFixed(3)}
                </React.Fragment>
              ) : (
                '-'
              )}
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
    const QuoteTokenIcon = quoteToken.reactLogoSvg
    const baseToken = AssetsDictionary.assets.get(this.props.eventsGroup.baseToken)!
    const BaseTokenIcon = baseToken.reactLogoSvg

    const payTradingFeeToken =
      (latestEvent.payTradingFeeEvent &&
        AssetsDictionary.assets.get(latestEvent.payTradingFeeEvent!.token as Asset)!) ||
      undefined

    const PayTradingFeeTokenIcon = payTradingFeeToken?.reactLogoSvg
    const precisionDigits = this.props.eventsGroup.quoteToken === Asset.WBTC ? 4 : 2
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
                year: 'numeric',
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
                <BaseTokenIcon />
                &nbsp;
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
                  <QuoteTokenIcon />
                  &nbsp;
                  {latestEvent.tradePrice.toFixed(precisionDigits)}
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
                  <QuoteTokenIcon />
                  &nbsp;
                  {latestEvent.value.toFixed(precisionDigits)}
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
              latestEvent.payTradingFeeEvent &&
              payTradingFeeToken &&
              latestEvent.earnRewardEvent &&
              PayTradingFeeTokenIcon ? (
                <React.Fragment>
                  <PayTradingFeeTokenIcon />
                  &nbsp;
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
                  <QuoteTokenIcon />
                  &nbsp;
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
    this.setState({ ...this.state, isShowCollapse: !this.state.isShowCollapse })
  }
}
