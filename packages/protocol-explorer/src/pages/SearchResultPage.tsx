import React, { Component } from 'react'
import { Header } from '../layout/Header'
import ContractsSource from 'bzx-common/src/contracts/ContractsSource'
import { LiquidationEvent } from '../domain/LiquidationEvent'
import { BigNumber } from '@0x/utils'
import { ITxRowProps } from '../components/TxRow'
import configProviders from '../config/providers.json'
import { TxGrid } from '../components/TxGrid'
import { LoanGrid } from '../components/LoanGrid'
import Asset from 'bzx-common/src/assets/Asset'
import { Bar } from 'react-chartjs-2'
import { Search } from '../components/Search'
import { UnhealthyChart } from '../components/UnhealthyChart'
import { RouteComponentProps } from 'react-router'
import { TradeEvent } from '../domain/TradeEvent'
import { CloseWithSwapEvent } from '../domain/CloseWithSwapEvent'
import { CloseWithDepositEvent } from '../domain/CloseWithDepositEvent'
import { BorrowEvent } from '../domain/BorrowEvent'
import { BurnEvent } from '../domain/BurnEvent'
import { MintEvent } from '../domain/MintEvent'
import { ExplorerProvider } from '../services/ExplorerProvider'
import { ExplorerProviderEvents } from '../services/events/ExplorerProviderEvents'
import { Loader } from '../components/Loader'

const getWeb3ProviderSettings = (networkId: number): string => {
  let etherscanURL = ''
  switch (networkId) {
    case 1:
      etherscanURL = 'https://etherscan.io/'
      break
    case 3:
      etherscanURL = 'https://ropsten.etherscan.io/'
      break
    case 4:
      etherscanURL = 'https://rinkeby.etherscan.io/'
      break
    case 42:
      etherscanURL = 'https://kovan.etherscan.io/'
      break
    default:
      etherscanURL = ''
      break
  }
  return etherscanURL
}

const getNetworkIdByString = (networkName: string | undefined) => {
  switch (networkName) {
    case 'mainnet':
      return 1
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'kovan':
      return 42
    default:
      return 0
  }
}
const networkName = process.env.REACT_APP_ETH_NETWORK
const initialNetworkId = getNetworkIdByString(networkName)

interface MatchParams {
  filter: string
}

interface ISearchResultPageProps extends RouteComponentProps<MatchParams> {
  doNetworkConnect: () => void
  isMobileMedia: boolean
}

interface ISearchResultPageState {
  events: ITxRowProps[]
  filter: string
  filteredEvents: ITxRowProps[]
  showSearchResult: boolean
  isLoading: boolean
}
export class SearchResultPage extends Component<ISearchResultPageProps, ISearchResultPageState> {
  constructor(props: any) {
    super(props)
    this.state = {
      events: [],
      filteredEvents: [],
      showSearchResult: false,
      isLoading: false,
      filter: this.props.match.params.filter.toLowerCase()
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

  private _isMounted: boolean

  private onProviderChanged = () => {
    this.derivedUpdate()
  }

  private onProviderAvailable = () => {
    this.derivedUpdate()
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

  derivedUpdate = async () => {
    this.setState({ isLoading: true })
    const liquidationEvents = ExplorerProvider.Instance.getGridItems(
      await ExplorerProvider.Instance.getLiquidationHistory()
    )
    const tradeEvents = ExplorerProvider.Instance.getGridItems(
      await ExplorerProvider.Instance.getTradeHistory()
    )
    const rolloverEvents = ExplorerProvider.Instance.getGridItems(
      await ExplorerProvider.Instance.getRolloverHistory()
    )
    const closeEvents = ExplorerProvider.Instance.getGridItems(
      await ExplorerProvider.Instance.getCloseWithSwapHistory()
    )
    const closeWithDepositEvents = ExplorerProvider.Instance.getGridItems(
      await ExplorerProvider.Instance.getCloseWithDepositHistory()
    )
    const borrowEvents = ExplorerProvider.Instance.getGridItems(
      await ExplorerProvider.Instance.getBorrowHistory()
    )
    const events: ITxRowProps[] = liquidationEvents
      .concat(closeEvents)
      .concat(tradeEvents)
      .concat(closeWithDepositEvents)
      .concat(borrowEvents)
      .concat(rolloverEvents)

    this._isMounted &&
      this.setState({
        ...this.state,
        events,
        isLoading: false
      })
    this.onSearch(this.state.filter)
  }

  public componentDidMount(): void {
    this._isMounted = true
    this.derivedUpdate()
  }

  onSearch = (filter: string) => {
    if (filter === '') {
      this._isMounted &&
        this.setState({
          ...this.state,
          showSearchResult: false,
          filteredEvents: []
        })
      return
    }
    const filteredEvents = this.state.events.filter(
      (e) =>
        e.hash.toLowerCase() === filter.toLowerCase() ||
        e.account.toLowerCase() === filter.toLowerCase()
    )
    this._isMounted &&
      this.setState({
        ...this.state,
        showSearchResult: true,
        filteredEvents,
        filter: filter
      })
  }

  public render() {
    return (
      <React.Fragment>
        <Header
          isMobileMedia={this.props.isMobileMedia}
          doNetworkConnect={this.props.doNetworkConnect}
        />
        <section className="search-container pt-45">
          <Search onSearch={this.onSearch.bind(this)} initialFilter={this.state.filter} />
        </section>
        <section className="pt-90">
          <div className="container">
            <h1>Result:</h1>
            {this.state.isLoading ? (
              <div className="pt-90 pb-45">
                <Loader quantityDots={5} sizeDots={'large'} title={'Loading'} isOverlay={false} />
              </div>
            ) : (
              <TxGrid
                events={
                  !this.state.showSearchResult ? this.state.events : this.state.filteredEvents
                }
                quantityTx={25}
              />
            )}
          </div>
        </section>
      </React.Fragment>
    )
  }
}
