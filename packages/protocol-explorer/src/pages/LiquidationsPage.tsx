import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2'
import ReactModal from 'react-modal'
import LiquidationForm from '../components/LiquidationForm'
import { LoanGrid } from '../components/LoanGrid'
import { Search } from '../components/Search'
import { TxGrid } from '../components/TxGrid'
import { ITxRowProps } from '../components/TxRow'
import { UnhealthyChart } from '../components/UnhealthyChart'
import Asset from 'bzx-common/src/assets/Asset'
import { LiquidationEvent } from 'bzx-common/src/domain/events'
import { LiquidationRequest } from '../domain/LiquidationRequest'
import { Header } from '../layout/Header'
import { ExplorerProviderEvents } from '../services/events/ExplorerProviderEvents'
import { ExplorerProvider } from '../services/ExplorerProvider'
import { NavService } from '../services/NavService'

import { Loader } from '../components/Loader'
import { IActiveLoanData } from '../domain/IActiveLoanData'
import { ILoanRowProps } from '../components/LoanRow'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { RolloversGrid } from '../components/RolloversGrid'
import { IRolloverRowProps } from '../components/RolloverRow'
import { IRolloverData } from '../domain/IRolloverData'

interface ILiquidationsPageProps {
  doNetworkConnect: () => void
  isMobileMedia: boolean
}

interface ILiquidationsPageState {
  volume30d: BigNumber
  transactionsCount30d: number
  events: ITxRowProps[]
  unhealthyLoans: ILoanRowProps[]
  rollovers: IRolloverRowProps[]
  unhealthyLoansUsd: BigNumber
  healthyLoansUsd: BigNumber
  barChartDatasets: Array<{
    label: Asset
    backgroundColor: string
    data: Array<{ x: string; y: number }>
  }>
  isDataLoading: boolean
  request: LiquidationRequest | null
  isModalOpen: boolean
}
export class LiquidationsPage extends Component<ILiquidationsPageProps, ILiquidationsPageState> {
  private _isMounted: boolean

  private readonly stablecoins: Asset[] = [Asset.DAI, Asset.USDC, Asset.USDT]
  private readonly assetsShown: Asset[]

  constructor(props: any) {
    super(props)
    if (process.env.REACT_APP_ETH_NETWORK === 'kovan') {
      this.assetsShown = [Asset.USDC, Asset.fWETH, Asset.WBTC]
    } else {
      this.assetsShown = [
        Asset.ETH,
        Asset.DAI,
        Asset.USDC,
        Asset.USDT,
        Asset.WBTC,
        Asset.LINK,
        Asset.YFI,
        Asset.BZRX,
        Asset.MKR,
        Asset.LEND,
        Asset.KNC,
        Asset.UNI,
        Asset.AAVE,
        Asset.LRC,
        Asset.COMP
      ]
    }

    this.state = {
      volume30d: new BigNumber(0),
      transactionsCount30d: 0,
      unhealthyLoansUsd: new BigNumber(0),
      healthyLoansUsd: new BigNumber(0),
      events: [],
      unhealthyLoans: [],
      rollovers: [],
      barChartDatasets: [] as Array<{
        label: Asset
        backgroundColor: string
        data: Array<{ x: string; y: number }>
      }>,
      request: null,
      isDataLoading: true,
      isModalOpen: false
    }

    this._isMounted = false
    ExplorerProvider.Instance.eventEmitter.on(
      ExplorerProviderEvents.ProviderAvailable,
      this.onProviderAvailable
    )
    ExplorerProvider.Instance.eventEmitter.on(
      ExplorerProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  public getChartData = (events: Array<{ event: LiquidationEvent; repayAmountUsd: BigNumber }>) => {
    const groupBy = (
      xs: Array<{ event: LiquidationEvent; repayAmountUsd: BigNumber }>,
      key: any
    ) => {
      return xs.reduce((rv: any, x: any) => {
        ;(rv[x[key]] = rv[x[key]] || []).push(x)
        return rv
      }, {})
    }
    const eventsWithDay = events.map(
      (e: { event: LiquidationEvent; repayAmountUsd: BigNumber }) => ({
        ...e,
        day: Math.floor(e.event.timeStamp!.getTime() / (1000 * 60 * 60 * 24))
      })
    )
    const eventsWithDayByDay = groupBy(eventsWithDay, 'day')
    const datasets: Array<{
      label: Asset
      backgroundColor: string
      data: Array<{ x: string; y: number }>
    }> = this.assetsShown
      .filter((e: Asset) => !!AssetsDictionary.assets.get(e))
      .map((e: Asset) => ({
        label: e,
        data: [] as Array<{ x: string; y: number }>,
        backgroundColor: AssetsDictionary.assets.get(e)!.bgBrightColor
      }))
    Object.keys(eventsWithDayByDay).forEach((day: string) => {
      for (const assetShown of this.assetsShown) {
        const token: Asset = assetShown
        if (!eventsWithDayByDay[day]) continue
        const eventsWithDayByAsset: Array<{
          event: LiquidationEvent
          repayAmountUsd: BigNumber
        }> = eventsWithDayByDay[day].filter(
          (e: { event: LiquidationEvent; repayAmountUsd: BigNumber }) => e.event.loanToken === token
        )
        if (eventsWithDayByAsset.length === 0) {
          datasets
            .find((e) => e.label === token)!
            .data.push({
              // @ts-ignore
              x: new Date(day * 1000 * 60 * 60 * 24).toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }),
              y: 0
            })
          continue
        }

        const repayAmountUsd = eventsWithDayByAsset.reduce(
          (a, b) => a.plus(b.repayAmountUsd),
          new BigNumber(0)
        )

        datasets
          .find((e) => e.label === token)!
          .data.push({
            // @ts-ignore
            x: new Date(day * 1000 * 60 * 60 * 24).toLocaleDateString('en-US', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }),
            y: repayAmountUsd.dp(4, BigNumber.ROUND_CEIL).toNumber()
          })
      }
    })

    this.setState({
      ...this.state,
      barChartDatasets: datasets
    })
  }

  private async derivedUpdate() {
    this._isMounted &&
      this.setState({
        ...this.state,
        isDataLoading: true
      })

    if (ExplorerProvider.Instance.unsupportedNetwork) {
      this._isMounted &&
        this.setState({
          events: [],
          isDataLoading: false
        })
      return
    }

    let volume30d = new BigNumber(0)
    const liquidationEventsWithUsd: Array<{
      event: LiquidationEvent
      repayAmountUsd: BigNumber
    }> = []
    const liquidationEvents = await ExplorerProvider.Instance.getLiquidationHistoryWithTimestamps()
    const unhealthyLoansData = await ExplorerProvider.Instance.getBzxLoans(0, 500, true)
    const healthyLoansData = await ExplorerProvider.Instance.getBzxLoans(0, 500, false)
    const rolloversData = await ExplorerProvider.Instance.getRollovers(0, 500)
    const unhealthyLoansUsd = unhealthyLoansData.reduce(
      (a, b) => a.plus(b.maxLiquidatableUsd),
      new BigNumber(0)
    )
    const healthyLoansUsd = healthyLoansData.reduce(
      (a, b) => a.plus(b.amountOwedUsd),
      new BigNumber(0)
    )
    const liqudiations30d = liquidationEvents.filter(
      (e: LiquidationEvent) =>
        e.timeStamp!.getTime() > new Date().setDate(new Date().getDate() - 30)
    )
    const transactionsCount30d = liqudiations30d.length

    for (const assetShown of this.assetsShown) {
      const tokenLiqudiations30d = liqudiations30d.filter((e: LiquidationEvent) => {
        return e.loanToken === assetShown
      })

      for (const e of tokenLiqudiations30d) {
        const loanAssetDecimals = AssetsDictionary.assets.get(e.loanToken)!.decimals || 18
        const collateralAssetDecimals =
          AssetsDictionary.assets.get(e.collateralToken)!.decimals || 18

        let swapToUSDPrice = this.stablecoins.includes(e.loanToken)
          ? new BigNumber(1)
          : new BigNumber(10 ** 18)
              .div(e.collateralToLoanRate)
              .div(10 ** (collateralAssetDecimals - loanAssetDecimals))

        if (
          !this.stablecoins.includes(e.loanToken) &&
          !this.stablecoins.includes(e.collateralToken)
        ) {
          const swapToUsdHistoryRateRequest = await fetch(
            `https://api.bzx.network/v1/asset-history-price?asset=${
              e.loanToken === Asset.fWETH ? 'eth' : e.loanToken.toLowerCase()
            }&date=${e.timeStamp!.getTime()}`
          )
          const swapToUsdHistoryRateResponse = (await swapToUsdHistoryRateRequest.json()).data
          if (!swapToUsdHistoryRateResponse) continue
          swapToUSDPrice = swapToUsdHistoryRateResponse.swapToUSDPrice
        }
        const repayAmountUsd = e.repayAmount.div(10 ** loanAssetDecimals).times(swapToUSDPrice)
        volume30d = volume30d.plus(repayAmountUsd)
        liquidationEventsWithUsd.push({ event: e, repayAmountUsd: repayAmountUsd })
      }
    }

    this.getChartData(liquidationEventsWithUsd)
    const unhealthyLoans = unhealthyLoansData.map((e: IActiveLoanData) => ({
      loanId: e.loanData.loanId,
      payOffAmount: e.maxLiquidatable,
      seizeAmount: e.maxSeizable,
      loanToken: e.loanAsset,
      collateralToken: e.collateralAsset,
      onLiquidationUpdated: this.derivedUpdate.bind(this),
      onLiquidationRequested: this.onLiquidationRequested,
      doNetworkConnect: this.props.doNetworkConnect
    }))

    const rollovers = rolloversData.map((e: IRolloverData) => ({
      loanId: e.loanData.loanId,
      rebateAsset: e.rebateAsset,
      gasRebate: e.gasRebate,
      onRolloverUpdated: this.derivedUpdate.bind(this),
      doNetworkConnect: this.props.doNetworkConnect
    }))

    await this.setState({
      ...this.state,
      volume30d,
      transactionsCount30d,
      events: ExplorerProvider.Instance.getGridItems(liquidationEvents),
      unhealthyLoans,
      isDataLoading: false,
      unhealthyLoansUsd,
      healthyLoansUsd,
      rollovers
    })
  }

  private numberWithCommas = (x: number | string) => {
    const parts = x.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }

  private onProviderChanged = () => {
    // this.derivedUpdate()
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate()
  }

  public componentWillUnmount(): void {
    this._isMounted = false
    ExplorerProvider.Instance.eventEmitter.removeListener(
      ExplorerProviderEvents.ProviderAvailable,
      this.onProviderAvailable
    )
    ExplorerProvider.Instance.eventEmitter.removeListener(
      ExplorerProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  public async componentDidMount() {
    this._isMounted = true
    ReactModal.setAppElement('body')
    this._isMounted &&
      this.setState({
        ...this.state,
        isDataLoading: true
      })

    await this.derivedUpdate()
  }

  private onSearch = (filter: string) => {
    if (filter === '') {
      return
    }
    NavService.Instance.History.push(`/search/${filter}`)
  }

  public render() {
    const getData = (_canvas: any) => {
      return {
        datasets: this.state.barChartDatasets
      }
    }

    const canvas = document.createElement('canvas')
    const chartData = getData(canvas)
    const options = {
      scales: {
        xAxes: [
          {
            display: true,
            position: 'bottom',
            stacked: true,
            offset: true,
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                quarter: 'MMM D'
              }
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              source: 'data'
            }
          }
        ],
        yAxes: [
          {
            stacked: true,
            gridLines: {
              drawBorder: false,
              zeroLineWidth: 1,
              zeroLineColor: '#E9F4FF',
              color: '#E9F4FF'
            },
            ticks: {
              display: false
            }
          }
        ]
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
        mode: 'index',
        custom: this.customTooltips,
        callbacks: {
          label: (tooltipItems: any, data: any) => {
            const bgColor = data.datasets[tooltipItems.datasetIndex].backgroundColor
            return {
              value: tooltipItems.yLabel,
              bgColor: bgColor,
              label: data.datasets[tooltipItems.datasetIndex].label
            }
          }
        }
      }
    }
    return (
      <React.Fragment>
        <Header
          isMobileMedia={this.props.isMobileMedia}
          doNetworkConnect={this.props.doNetworkConnect}
        />
        <main className="flex fd-c ac-c jc-c">
          {!ExplorerProvider.Instance.unsupportedNetwork ? (
            <React.Fragment>
              {this.state.isDataLoading ? (
                <section className="pt-90 pb-45">
                  <div className="container">
                    <Loader
                      quantityDots={5}
                      sizeDots={'large'}
                      title={'Loading'}
                      isOverlay={false}
                    />
                  </div>
                </section>
              ) : (
                <React.Fragment>
                  <section>
                    <div className="container">
                      <div className="flex jc-sb fd-md-c al-c mb-30">
                        <h1>Liquidations</h1>
                        <div className="flex fw-w mt-md-30">
                          <div className="liquidation-data">
                            <div className="liquidation-data-title">30-days Volume</div>
                            <div
                              title={this.state.volume30d.toFixed(18)}
                              className="liquidation-data-value">
                              <span className="sign sign-currency">$</span>
                              {this.numberWithCommas(this.state.volume30d.toFixed(2))}
                            </div>
                          </div>
                          <div className="liquidation-data">
                            <div className="liquidation-data-title">30-days Transactions Count</div>
                            <div className="liquidation-data-value">
                              {this.state.transactionsCount30d}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="container">
                      <div className="wrapper-chartjs-bar">
                        <div id="chartjs-bar">
                          {chartData && <Bar data={chartData} options={options} height={100} />}
                        </div>
                        <div id="chartjs-bar-tooltip">
                          <table />
                        </div>
                      </div>
                      <div className="flex jc-c labels-container">
                        {this.assetsShown.map((e: Asset) => {
                          const assetDetails = AssetsDictionary.assets.get(e)
                          return (
                            assetDetails && (
                              <div key={assetDetails.bgBrightColor} className="label-chart">
                                <span style={{ backgroundColor: assetDetails.bgBrightColor }} />
                                {e}
                              </div>
                            )
                          )
                        })}
                      </div>
                    </div>
                  </section>
                  <section className="search-container pt-45">
                    <Search onSearch={this.onSearch} />
                  </section>
                  <section className="pt-90 pt-sm-30">
                    <div className="container">
                      <TxGrid events={this.state.events} quantityTx={10} />
                    </div>
                  </section>
                  <section className="pt-75">
                    <div className="container">
                      <h2 className="h1 mb-60">Unhealthy Loans</h2>
                      <div className="flex fw-w ai-c">
                        <div className="unhealthy-chart-wrapper">
                          <UnhealthyChart
                            unhealthyLoansUsd={this.state.unhealthyLoansUsd}
                            healthyLoansUsd={this.state.healthyLoansUsd}
                          />
                        </div>
                        <div className="unhealthy-data-wrapper flex fd-c ai-c">
                          <div className="flex w-100 mb-15">
                            <div className="unhealthy">
                              Unhealthy&nbsp;<span className="sign sign-currency">$</span>&nbsp;
                            </div>
                            <span
                              title={this.state.unhealthyLoansUsd.toFixed(2)}
                              className="unhealthy-value unhealthy-color">
                              {this.state.unhealthyLoansUsd.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex w-100">
                            <div className="healthy">
                              Healthy&nbsp;<span className="sign sign-currency">$</span>&nbsp;
                            </div>
                            <span
                              title={this.state.healthyLoansUsd.toFixed(2)}
                              className="healthy-value healthy-color">
                              {this.state.healthyLoansUsd.div(10 ** 6).toFixed(2)}m
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-75">
                        <LoanGrid events={this.state.unhealthyLoans} />
                      </div>
                    </div>
                  </section>
                  {this.state.rollovers.length > 0 && (
                    <section className="pt-75">
                      <div className="container">
                        <h2 className="h1">Rollovers</h2>
                        <div className="pt-45">
                          <RolloversGrid events={this.state.rollovers} />
                        </div>
                      </div>
                    </section>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <section className="pt-75">
              <div style={{ textAlign: `center`, fontSize: `2rem`, paddingBottom: `1.5rem` }}>
                <div style={{ cursor: `pointer` }}>You are connected to the wrong network.</div>
              </div>
            </section>
          )}
          <ReactModal
            isOpen={this.state.isModalOpen}
            onRequestClose={this.onFormDecline}
            className="modal-content-div"
            overlayClassName="modal-overlay-div">
            {this.state.request && (
              <LiquidationForm
                request={this.state.request}
                onSubmit={this.onFormSubmit}
                onClose={this.onFormDecline}
              />
            )}
          </ReactModal>
        </main>
      </React.Fragment>
    )
  }
  public customTooltips = (tooltip: any) => {
    let tooltipEl = document.getElementById('chartjs-bar-tooltip')
    const paddingX = 25
    if (!tooltipEl) {
      tooltipEl = document.createElement('div')
      tooltipEl.id = 'chartjs-bar-tooltip'
      tooltipEl.innerHTML = '<div></div>'
      document.body.appendChild(tooltipEl)
    }
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = '0'
      tooltipEl.style.left = -tooltip.width + 'px'
      return
    }
    function getBody(bodyItem: any) {
      return bodyItem.lines[0]
    }
    if (tooltip.body) {
      const bodyLines = tooltip.body.map(getBody)
      let innerHtml = `<tbody style="padding: 20px ${paddingX}px;">`
      bodyLines.forEach((body: any) => {
        if (body.value === 0) {
          return
        }
        innerHtml += `<tr><td class="chartjs-bar-tooltip-value"><span class="circle" style="background-color: ${body.bgColor}"></span><span><span class="sign sign-currency">$</span>${body.value}</span></td></tr>`
      })
      innerHtml += '</tbody>'
      const _tableRoot = tooltipEl.querySelector('table') as HTMLElement
      _tableRoot.innerHTML = innerHtml
    }

    const tableRoot = tooltipEl.querySelector('table tbody') as HTMLElement

    tooltipEl.style.opacity = '1'
    tooltipEl.style.position = 'absolute'
    tooltipEl.style.left = tooltip.caretX - tableRoot.offsetWidth / 2 + 'px'
    tooltipEl.style.top = 0 + 'px'
  }
  private onFormSubmit = async (request: LiquidationRequest) => {
    this.setState({ ...this.state, isModalOpen: false })
  }

  private onFormDecline = async () => {
    this.setState({ ...this.state, isModalOpen: false })
  }

  private onLiquidationRequested = (request: LiquidationRequest) => {
    if (
      !ExplorerProvider.Instance.contractsSource ||
      !ExplorerProvider.Instance.contractsSource.canWrite ||
      ExplorerProvider.Instance.unsupportedNetwork
    ) {
      this.props.doNetworkConnect()
      return
    }
    this.setState({ ...this.state, request, isModalOpen: true })
  }
}
