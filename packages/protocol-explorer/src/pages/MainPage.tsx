import React, { Component } from 'react'
import { Search } from '../components/Search'
import { AssetSelector } from '../components/AssetSelector'
import { MainChart } from '../components/MainChart'
import { ReactComponent as Arrow } from '../assets/images/icon-arrow.svg'
import { GroupButton } from '../components/GroupButton'
import { Header } from '../layout/Header'
import { NavService } from '../services/NavService'
import { Tab } from '../domain/Tab'

interface IMainPageProps {
  doNetworkConnect: () => void
  isMobileMedia: boolean
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}
interface IMainPageState {
  periodChart: number
  tvl: string
  diffWithPrevPrecents: number
  labels: Array<number>
  data: Array<number>
  change24: Array<number>
}

export class MainPage extends Component<IMainPageProps, IMainPageState> {
  private apiUrl = 'https://api.bzx.network/v1'
  private _isMounted: boolean

  constructor(props: any) {
    super(props)
    this.state = {
      periodChart: 1,
      tvl: '1.2',
      diffWithPrevPrecents: 0,
      labels: [],
      data: [],
      change24: [],
    }

    this._isMounted = false
  }

  public componentWillUnmount(): void {
    this._isMounted = false
  }

  public componentDidMount(): void {
    this._isMounted = true
    this.getVaultBalanceUsd()
    this.getTvlHistory()
  }

  public componentDidUpdate(
    prevProps: Readonly<IMainPageProps>,
    prevState: Readonly<IMainPageState>,
    snapshot?: any
  ): void {
    if (this.state.periodChart !== prevState.periodChart) {
      this.getTvlHistory()
    }
  }

  onSearch = (filter: string) => {
    if (filter === '') {
      return
    }
    NavService.Instance.History.push(`/search/${filter}`)
  }

  public render() {
    const tvl = +this.state.tvl
    return (
      <React.Fragment>
        <section className="bg-gradient">
          <div className="container">
            <div className="flex fw-w jc-sb">
              <div className="flex fd-c w-md-100">
                <h1 className="mt-5 mb-30">bZx Protocol Stats</h1>
                {!this.props.isMobileMedia && <GroupButton setPeriodChart={this.setPeriodChart} />}
              </div>
              <div className="flex w-md-100 jc-fe">
                <div className="tvl">
                  TVL <span className="sign sign-currency">$ </span>
                </div>
                <div>
                  <span className="tvl-value">
                    {tvl ? this.getRoundedData(tvl) : this.state.tvl}
                  </span>
                  {this.state.diffWithPrevPrecents !== 0 && (
                    <div
                      className={`tvl-interest ${
                        this.state.diffWithPrevPrecents < 0 ? `down` : ``
                      }`}>
                      <Arrow />
                      {Math.abs(this.state.diffWithPrevPrecents).toFixed(5)}
                      <span className="sign">%</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex jc-c w-100 mb-45">
                {this.props.isMobileMedia && <GroupButton setPeriodChart={this.setPeriodChart} />}
              </div>
            </div>
          </div>
        </section>
        <section className="wrapper-chart">
          <MainChart
            labels={this.state.labels}
            data={this.state.data}
            change24={this.state.change24}
            isMobileMedia={this.props.isMobileMedia}
            isMainChart={true}
          />
          <MainChart
            labels={this.state.labels}
            data={this.state.data}
            change24={this.state.change24}
            isMobileMedia={this.props.isMobileMedia}
            isMainChart={false}
          />
        </section>
        <section className="search-container pt-75">
          <Search onSearch={this.onSearch} />
        </section>
        <section className="asset-selector-section">
          <AssetSelector setActiveTab={this.props.setActiveTab} />
        </section>
      </React.Fragment>
    )
  }

  public getVaultBalanceUsd = async () => {
    const requestUrl = `${this.apiUrl}/vault-balance-usd`
    const response = await fetch(requestUrl)
    const responseJson = await response.json()
    !responseJson.success
      ? console.error(responseJson.message)
      : this._isMounted && (await this.setState({ ...this.state, tvl: responseJson.data['all'] }))
  }
  public setPeriodChart = (period: number) => {
    this.setState({ ...this.state, periodChart: period })
  }

  public getRoundedData = (value: number) => {
    if (value > 100000) return `${(value / 1000000).toFixed(1)}m`
    if (value > 100) return `${(value / 1000).toFixed(1)}k`
    return `${value.toFixed(1)}`
  }

  public getTvlHistory = async () => {
    const startData = new Date().setDate(new Date().getDate() - this.state.periodChart)
    const endData = new Date().getTime()
    const pointsNumber = 80
    const requestUrl = `${this.apiUrl}/tvl-history?start_date=${startData}&end_date=${endData}&points_number=${pointsNumber}`
    const response = await fetch(requestUrl)
    const responseJson = await response.json()
    const labels: any = []
    const data: any = []
    const change24: any = []
    const period = this.state.periodChart
    if (responseJson.success) {
      responseJson.data.forEach(function (item: any) {
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ]
        period === 1
          ? labels.push(
              `${new Date(item['timestamp']).getHours() % 12}:${
                new Date(item['timestamp']).getMinutes() < 10
                  ? `0${new Date(item['timestamp']).getMinutes()}`
                  : new Date(item['timestamp']).getMinutes()
              }`
            )
          : labels.push(
              `${months[new Date(item['timestamp']).getMonth()]} ${new Date(
                item['timestamp']
              ).getDate()}`
            )
        data.push(item['tvl'])
        change24.push(item['diffWithPrevPrecents'])
      })
      const tvlDiff =
        (responseJson.data[Object.keys(responseJson.data).length - 1].tvl -
          responseJson.data[0].tvl) /
        responseJson.data[0].tvl
      this._isMounted && this.setState({ ...this.state, diffWithPrevPrecents: tvlDiff * 100 })
    } else {
      console.error(responseJson.message)
    }
    await this.setState({ ...this.state, labels: labels, data: data, change24: change24 })
  }
}
