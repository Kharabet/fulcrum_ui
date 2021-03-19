import { AbstractConnector } from '@web3-react/abstract-connector'
import { ConnectorEvent, ConnectorUpdate } from '@web3-react/types'
import { errors } from 'ethers'
import { MaintenancePage } from '../pages/MaintenancePage'
import { NavService } from '../services/NavService'
import ProviderMenu from 'bzx-common/src/shared-components/ProviderMenu'
import { ProviderType } from '../domain/ProviderType'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { TorqueProvider } from '../services/TorqueProvider'
import { TorqueProviderEvents } from '../services/events/TorqueProviderEvents'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Wrapper } from '@0x/web3-wrapper'
import appConfig from 'bzx-common/src/config/appConfig'
import configProviders from 'bzx-common/src/config/providers'
import Intercom from 'react-intercom'
import Modal from 'react-modal'
import ProviderChangedEvent from 'bzx-common/src/services/ProviderChangedEvent'
import ProviderTypeDictionary from 'bzx-common/src/domain/ProviderTypeDictionary'
import React, { Component } from 'react'
import RiskDisclosure from 'bzx-common/src/shared-components/RiskDisclosure'
import siteConfig from '../config/SiteConfig.json'
import TabContainer from '../layout/TabContainer'
import TagManager from 'react-gtm-module'
import Web3ConnectionFactory from 'bzx-common/src/services/Web3ConnectionFactory'

if (appConfig.isGTMEnabled) {
  const tagManagerArgs = {
    gtmId: configProviders.Google_TrackingID,
    dataLayer: {
      name: 'Home',
      status: 'Intailized',
    },
  }
  TagManager.initialize(tagManagerArgs)
  // ReactGA.initialize(configProviders.Google_TrackingID);
}

interface IAppRouterState {
  isProviderMenuModalOpen: boolean
  isRiskDisclosureModalOpen: boolean
  selectedProviderType: ProviderType
  isLoading: boolean
  web3: Web3Wrapper | null
  isMobileMedia: boolean
  isChiEnabled: boolean
}

export class AppRouter extends Component<any, IAppRouterState> {
  private _isMounted: boolean = false
  constructor(props: any) {
    super(props)

    this.state = {
      isProviderMenuModalOpen: false,
      isRiskDisclosureModalOpen: false,
      isLoading: false,
      selectedProviderType: TorqueProvider.Instance.providerType,
      web3: TorqueProvider.Instance.web3Wrapper,
      isMobileMedia: window.innerWidth <= 959,
      isChiEnabled: TorqueProvider.getLocalstorageItem('isChiEnabled') === 'true',
    }

    TorqueProvider.Instance.eventEmitter.on(
      TorqueProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  public componentWillUnmount(): void {
    this._isMounted = false
    TorqueProvider.Instance.eventEmitter.removeListener(
      TorqueProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
    window.removeEventListener('resize', this.didResize.bind(this))
  }

  public componentDidMount(): void {
    this._isMounted = true
    window.addEventListener('resize', this.didResize.bind(this))
    errors.setLogLevel('error')
    this.doNetworkConnect()
  }

  public getLibrary = async (provider: any, connector: any): Promise<any> => {
    //handle connectors events (i.e. network changed)
    await this.onProviderTypeSelect(connector)
    if (!connector.listeners(ConnectorEvent.Update).includes(this.onConnectorUpdated))
      connector.on(ConnectorEvent.Update, this.onConnectorUpdated)
    return Web3ConnectionFactory.currentWeb3Engine
  }

  public onChiSwitch = () => {}

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
            provider={TorqueProvider.Instance}
            getLocalstorageItem={TorqueProvider.getLocalstorageItem}
          />
        </Modal>

        <Modal
          isOpen={this.state.isRiskDisclosureModalOpen}
          onRequestClose={this.onRiskDisclosureRequestClose}
          className="modal-content-div-top"
          overlayClassName="modal-overlay-div overflow-auto">
          <RiskDisclosure onClose={this.onRiskDisclosureRequestClose} />
        </Modal>
        {appConfig.isProduction ? <Intercom appID="dfk4n5ut" /> : null}
        <div className="pages-container">
          {siteConfig.MaintenanceMode ? (
            <MaintenancePage />
          ) : (
            <Router history={NavService.Instance.History}>
              <Switch>
                <Route
                  exact={true}
                  path={'/'}
                  render={(props) => (
                    <TabContainer
                      {...props}
                      isMobileMedia={this.state.isMobileMedia}
                      doNetworkConnect={this.doNetworkConnect}
                      isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen}
                    />
                  )}
                />
                <Route
                  path={'/borrow'}
                  render={(props) => (
                    <TabContainer
                      {...props}
                      isMobileMedia={this.state.isMobileMedia}
                      doNetworkConnect={this.doNetworkConnect}
                      isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen}
                    />
                  )}
                />
                <Route
                  path={'/dashboard'}
                  render={(props) => (
                    <TabContainer
                      {...props}
                      isMobileMedia={this.state.isMobileMedia}
                      doNetworkConnect={this.doNetworkConnect}
                      isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen}
                    />
                  )}
                />
                <Route path="*" render={() => <Redirect to="/" />} />
              </Switch>
              {appConfig.isGTMEnabled ? (
                <Route
                  path="/"
                  render={({ location }) => {
                    const tagManagerArgs = {
                      dataLayer: {
                        userProject: 'Torque',
                        page: location.pathname + location.search,
                      },
                    }
                    TagManager.dataLayer(tagManagerArgs)
                    return null
                  }}
                />
              ) : (
                ``
              )}
            </Router>
          )}
        </div>
      </Web3ReactProvider>
    )
  }

  private didResize = async () => {
    const isMobileMedia = window.innerWidth <= 959
    this.setState({ isMobileMedia })
  }

  public doNetworkConnect = async () => {
    ;(await this._isMounted) &&
      !this.state.isProviderMenuModalOpen &&
      this.setState({ ...this.state, isProviderMenuModalOpen: true })
  }

  public async onConnectorUpdated(update: ConnectorUpdate) {
    await TorqueProvider.Instance.eventEmitter.emit(TorqueProviderEvents.ProviderIsChanging)

    await Web3ConnectionFactory.updateConnector(update)
    await TorqueProvider.Instance.setWeb3ProviderFinalize(TorqueProvider.Instance.providerType)
    await TorqueProvider.Instance.eventEmitter.emit(
      TorqueProviderEvents.ProviderChanged,
      new ProviderChangedEvent(
        TorqueProvider.Instance.providerType,
        TorqueProvider.Instance.web3Wrapper
      )
    )
  }

  public onDeactivate = async () => {
    TorqueProvider.Instance.isLoading = true

    await TorqueProvider.Instance.eventEmitter.emit(TorqueProviderEvents.ProviderIsChanging)
    ;(await this._isMounted) &&
      this.setState({
        ...this.state,
        isProviderMenuModalOpen: false,
      })
    await TorqueProvider.Instance.setReadonlyWeb3Provider()

    TorqueProvider.Instance.isLoading = false
    await TorqueProvider.Instance.eventEmitter.emit(
      TorqueProviderEvents.ProviderChanged,
      new ProviderChangedEvent(
        TorqueProvider.Instance.providerType,
        TorqueProvider.Instance.web3Wrapper
      )
    )
  }

  public onProviderTypeSelect = async (connector: AbstractConnector, account?: string) => {
    if (!this.state.isLoading) {
      TorqueProvider.Instance.isLoading = true

      await TorqueProvider.Instance.eventEmitter.emit(TorqueProviderEvents.ProviderIsChanging)
      ;(await this._isMounted) &&
        this.setState(
          {
            ...this.state,
            isLoading: true,
            isProviderMenuModalOpen: false,
          },
          async () => {
            await TorqueProvider.Instance.setWeb3Provider(connector, account)

            TorqueProvider.Instance.isLoading = false

            await TorqueProvider.Instance.eventEmitter.emit(
              TorqueProviderEvents.ProviderChanged,
              new ProviderChangedEvent(
                TorqueProvider.Instance.providerType,
                TorqueProvider.Instance.web3Wrapper
              )
            )
          }
        )
    } else {
      ;(await this._isMounted) &&
        this.setState({
          ...this.state,
          isProviderMenuModalOpen: false,
        })
    }
  }

  public onRequestClose = async () => {
    ;(await this._isMounted) && this.setState({ ...this.state, isProviderMenuModalOpen: false })
  }

  public onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.checkGasTokenAllowance()
    ;(await this._isMounted) &&
      this.setState({
        ...this.state,
        selectedProviderType: event.providerType,
        isLoading: false,
        web3: event.web3,
      })
  }
  public onRiskDisclosureRequestClose = async () => {
    ;(await this._isMounted) && this.setState({ ...this.state, isRiskDisclosureModalOpen: false })
  }
  public onRiskDisclosureRequestOpen = async () => {
    ;(await this._isMounted) && this.setState({ ...this.state, isRiskDisclosureModalOpen: true })
  }

  private checkGasTokenAllowance = async () => {
    const gasTokenAllowance = await TorqueProvider.Instance.getGasTokenAllowance()
    localStorage.setItem('isGasTokenEnabled', gasTokenAllowance.gt(0) ? 'true' : 'false')
  }
}
