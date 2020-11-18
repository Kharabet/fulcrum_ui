import { Web3Wrapper } from '@0x/web3-wrapper'
import React, { Component } from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import configProviders from '../config/providers.json'
import { ProviderType } from '../domain/ProviderType'
import { Footer } from '../layout/Footer'
import { Header } from '../layout/Header'
import { LiquidationsPage } from '../pages/LiquidationsPage'
import { MainPage } from '../pages/MainPage'
import { SearchResultPage } from '../pages/SearchResultPage'
import { StatsPage } from '../pages/StatsPage'
import { NavService } from '../services/NavService'

import Modal from 'react-modal'
import { ExplorerProviderEvents } from '../services/events/ExplorerProviderEvents'
import { ProviderChangedEvent } from '../services/events/ProviderChangedEvent'
import { ExplorerProvider } from '../services/ExplorerProvider'

import { Web3ProviderEngine } from '@0x/subproviders'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Web3ReactProvider } from '@web3-react/core'
import { ConnectorEvent, ConnectorUpdate } from '@web3-react/types'
import { errors } from 'ethers'
import ProviderTypeDictionary from '../domain/ProviderTypeDictionary'
import { Web3ConnectionFactory } from '../domain/Web3ConnectionFactory'
import { ProviderMenu } from './ProviderMenu'

const isMainnetProd =
  process.env.NODE_ENV &&
  process.env.NODE_ENV !== 'development' &&
  process.env.REACT_APP_ETH_NETWORK === 'mainnet'

interface IAppRouterState {
  isProviderMenuModalOpen: boolean
  selectedProviderType: ProviderType
  isLoading: boolean
  web3: Web3Wrapper | null
  isMobileMedia: boolean
}

export class AppRouter extends Component<any, IAppRouterState> {
  private _isMounted: boolean = false
  constructor(props: any) {
    super(props)

    this.state = {
      isProviderMenuModalOpen: false,
      isLoading: false,
      selectedProviderType: ExplorerProvider.Instance.providerType,
      web3: ExplorerProvider.Instance.web3Wrapper,
      isMobileMedia: window.innerWidth <= 991
    }

    ExplorerProvider.Instance.eventEmitter.on(
      ExplorerProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  public componentWillUnmount(): void {
    this._isMounted = false
    ExplorerProvider.Instance.eventEmitter.removeListener(
      ExplorerProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
    window.removeEventListener('resize', this.didResize.bind(this))
  }

  public componentDidMount() {
    this._isMounted = true
    Modal.setAppElement('body')
    window.addEventListener('resize', this.didResize.bind(this))
    errors.setLogLevel('error')
    this.doNetworkConnect()
  }

  public getLibrary = async (provider: any, connector: any): Promise<Web3ProviderEngine> => {
    // console.log(provider)
    // handle connectors events (i.e. network changed)
    await this.onProviderTypeSelect(connector)
    if (!connector.listeners(ConnectorEvent.Update).includes(this.onConnectorUpdated)) {
      connector.on(ConnectorEvent.Update, this.onConnectorUpdated)
    }
    return Web3ConnectionFactory.currentWeb3Engine
  }

  public render() {
    return (
      <Web3ReactProvider getLibrary={this.getLibrary}>
        <Modal
          isOpen={this.state.isProviderMenuModalOpen}
          onRequestClose={this.onRequestClose}
          className="modal-content-div"
          overlayClassName="modal-overlay-div">
          <ProviderMenu
            providerTypes={ProviderTypeDictionary.WalletProviders}
            isMobileMedia={this.state.isMobileMedia}
            onSelect={this.onProviderTypeSelect}
            onDeactivate={this.onDeactivate}
            onProviderMenuClose={this.onRequestClose}
          />
        </Modal>

        <div className="pages-container flex jc-c">
          <div className="flex fd-c ac-c w-100">
            <Router history={NavService.Instance.History}>
              <Switch>
                <Route exact={true} path="/">
                  <MainPage
                    isMobileMedia={this.state.isMobileMedia}
                    doNetworkConnect={this.doNetworkConnect}
                  />
                </Route>
                <Route
                  path="/stats/:token"
                  render={(props) => (
                    <StatsPage
                      {...props}
                      isMobileMedia={this.state.isMobileMedia}
                      doNetworkConnect={this.doNetworkConnect}
                    />
                  )}
                />
                <Route
                  path="/search/:filter"
                  render={(props) => (
                    <SearchResultPage
                      {...props}
                      isMobileMedia={this.state.isMobileMedia}
                      doNetworkConnect={this.doNetworkConnect}
                    />
                  )}
                />
                <Route path="/liquidations">
                  <LiquidationsPage
                    isMobileMedia={this.state.isMobileMedia}
                    doNetworkConnect={this.doNetworkConnect}
                  />
                </Route>
              </Switch>
            </Router>
            <Footer />
          </div>
        </div>
      </Web3ReactProvider>
    )
  }

  private didResize = () => {
    const isMobileMedia = window.innerWidth <= 991
    if (isMobileMedia !== this.state.isMobileMedia) {
      this._isMounted && this.setState({ isMobileMedia })
    }
  }

  public doNetworkConnect = () => {
    this._isMounted &&
      !this.state.isProviderMenuModalOpen &&
      this.setState({ ...this.state, isProviderMenuModalOpen: true })
  }

  public async onConnectorUpdated(update: ConnectorUpdate) {
    // console.log('onConnectorUpdated')
    ExplorerProvider.Instance.eventEmitter.emit(ExplorerProviderEvents.ProviderIsChanging)

    await Web3ConnectionFactory.updateConnector(update)
    await ExplorerProvider.Instance.setWeb3ProviderFinalize(ExplorerProvider.Instance.providerType)
    ExplorerProvider.Instance.eventEmitter.emit(
      ExplorerProviderEvents.ProviderChanged,
      new ProviderChangedEvent(
        ExplorerProvider.Instance.providerType,
        ExplorerProvider.Instance.web3Wrapper
      )
    )
  }

  public onDeactivate = async () => {
    ExplorerProvider.Instance.isLoading = true

    ExplorerProvider.Instance.eventEmitter.emit(ExplorerProviderEvents.ProviderIsChanging)
    this._isMounted &&
      this.setState({
        ...this.state,
        isProviderMenuModalOpen: false
      })
    await ExplorerProvider.Instance.setReadonlyWeb3Provider()

    ExplorerProvider.Instance.isLoading = false
    ExplorerProvider.Instance.eventEmitter.emit(
      ExplorerProviderEvents.ProviderChanged,
      new ProviderChangedEvent(
        ExplorerProvider.Instance.providerType,
        ExplorerProvider.Instance.web3Wrapper
      )
    )
  }

  public onProviderTypeSelect = async (connector: AbstractConnector, account?: string) => {
    if (!this.state.isLoading) {
      ExplorerProvider.Instance.isLoading = true

      ExplorerProvider.Instance.eventEmitter.emit(ExplorerProviderEvents.ProviderIsChanging)
      this._isMounted &&
        this.setState(
          {
            ...this.state,
            isLoading: true,
            isProviderMenuModalOpen: false
          },
          async () => {
            await ExplorerProvider.Instance.setWeb3Provider(connector, account)

            ExplorerProvider.Instance.isLoading = false

            ExplorerProvider.Instance.eventEmitter.emit(
              ExplorerProviderEvents.ProviderChanged,
              new ProviderChangedEvent(
                ExplorerProvider.Instance.providerType,
                ExplorerProvider.Instance.web3Wrapper
              )
            )
          }
        )
    } else {
      this._isMounted &&
        this.setState({
          ...this.state,
          isProviderMenuModalOpen: false
        })
    }
  }

  public onRequestClose = async () => {
    this._isMounted && this.setState({ ...this.state, isProviderMenuModalOpen: false })
  }

  public onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.checkGasTokenAllowance()
    this._isMounted &&
      this.setState({
        ...this.state,
        selectedProviderType: event.providerType,
        isLoading: false,
        web3: event.web3
      })
  }

  private checkGasTokenAllowance = async () => {
    const gasTokenAllowance = await ExplorerProvider.Instance.getGasTokenAllowance()
    localStorage.setItem('isGasTokenEnabled', gasTokenAllowance.gt(0) ? 'true' : 'false')
  }
}
