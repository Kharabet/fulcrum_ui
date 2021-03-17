import { Web3Wrapper } from '@0x/web3-wrapper'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Web3ReactProvider } from '@web3-react/core'
import { ConnectorEvent, ConnectorUpdate } from '@web3-react/types'
import appConfig from 'bzx-common/src/config/appConfig'
import configProviders from 'bzx-common/src/config/providers'
import ProviderTypeDictionary from 'bzx-common/src/domain/ProviderTypeDictionary'
import Web3ConnectionFactory from 'bzx-common/src/services/Web3ConnectionFactory'
import RiskDisclosure from 'bzx-common/src/shared-components/RiskDisclosure'
import { errors } from 'ethers'
import React, { Component, Suspense } from 'react'
import TagManager from 'react-gtm-module'
import Modal from 'react-modal'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { PreloaderChart } from '../components/PreloaderChart'
import siteConfig from '../config/SiteConfig.json'
import Footer from '../layout/Footer'
import { HeaderOps } from '../layout/HeaderOps'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { ProviderChangedEvent } from '../services/events/ProviderChangedEvent'
import { FulcrumProvider } from '../services/FulcrumProvider'
import { ProviderMenu } from './ProviderMenu'

const Intercom = React.lazy(() => import('react-intercom'))
const LendPage = React.lazy(() => import('../pages/LendPage'))
const MaintenancePage = React.lazy(() => import('../pages/MaintenancePage'))

const StatsPage = React.lazy(() => import('../pages/StatsPage'))
const TradePage = React.lazy(() => import('../pages/TradePage'))

if (appConfig.isMainnetProd) {
  const tagManagerArgs = {
    gtmId: configProviders.Google_TrackingID,
    dataLayer: {
      name: 'Home',
      status: 'Intailized',
    },
  }
  TagManager.initialize(tagManagerArgs)
}

interface IAppRouterState {
  isProviderMenuModalOpen: boolean
  isRiskDisclosureModalOpen: boolean
  isLoading: boolean
  currentPage: string
  web3: Web3Wrapper | null
  isMobileMedia: boolean
  //isV1ITokenInWallet: boolean;
}

export class AppRouter extends Component<any, IAppRouterState> {
  private _isMounted: boolean = false
  constructor(props: any) {
    super(props)

    this.state = {
      isProviderMenuModalOpen: false,
      isRiskDisclosureModalOpen: false,
      isLoading: false,
      currentPage: '',
      web3: FulcrumProvider.Instance.web3Wrapper,
      isMobileMedia: window.innerWidth <= 991,
      //isV1ITokenInWallet: false
    }

    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  public componentDidMount(): void {
    this._isMounted = true
    window.addEventListener('resize', this.didResize.bind(this))
    errors.setLogLevel('error')
    this.doNetworkConnect()
  }

  public componentWillUnmount(): void {
    this._isMounted = false
    FulcrumProvider.Instance.eventEmitter.removeListener(
      FulcrumProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
    window.removeEventListener('resize', this.didResize.bind(this))
  }

  public getLibrary = async (provider: any, connector: any): Promise<any> => {
    //handle connectors events (i.e. network changed)
    // await this.onProviderTypeSelect(connector)
    if (!connector.listeners(ConnectorEvent.Update).includes(this.onConnectorUpdated)) {
      connector.on(ConnectorEvent.Update, this.onConnectorUpdated)
    }

    return Web3ConnectionFactory.currentWeb3Engine
  }

  public render() {
    return (
      <Web3ReactProvider getLibrary={this.getLibrary}>
        {appConfig.isMainnetProd && !this.state.isMobileMedia ? (
          <React.Fragment>
            <Suspense
              fallback={
                <PreloaderChart
                  quantityDots={4}
                  sizeDots={'middle'}
                  title={'Loading'}
                  isOverlay={false}
                />
              }>
              <Intercom appID="dfk4n5ut" />
            </Suspense>
          </React.Fragment>
        ) : null}

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
          />
        </Modal>
        <Modal
          isOpen={this.state.isRiskDisclosureModalOpen}
          onRequestClose={this.onRiskDisclosureRequestClose}
          className="modal-content-div-top"
          overlayClassName="modal-overlay-div overflow-auto">
          <RiskDisclosure onClose={this.onRiskDisclosureRequestClose} />
        </Modal>
        <div className="pages-container">
          <div className="pages-wrap">
            {siteConfig.MaintenanceMode ? (
              <MaintenancePage />
            ) : (
              <BrowserRouter>
                <Switch>
                  {!appConfig.isMainnetProd ? (
                    <Route
                      exact={true}
                      path="/"
                      render={(props) =>
                        props.location.hash.startsWith('#/') ? (
                          <Redirect to={props.location.hash.replace('#', '')} />
                        ) : (
                          <Redirect to={props.location.hash.replace('', 'trade')} />
                        )
                      }
                    />
                  ) : (
                    <Route
                      exact={true}
                      path="/"
                      render={(props) => {
                        if (props.location.hash.startsWith('#/')) {
                          return <Redirect to={props.location.hash.replace('#/', '')} />
                        } else {
                          window.location.href = 'https://fulcrum.trade'
                          return null
                        }
                      }}
                    />
                  )}

                  <Route
                    exact={true}
                    path="/lend"
                    render={() => (
                      <React.Fragment>
                        <HeaderOps
                          headerClass="lend"
                          isMobileMedia={this.state.isMobileMedia}
                          doNetworkConnect={this.doNetworkConnect}
                          isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen}
                        />
                        <Suspense
                          fallback={
                            <PreloaderChart
                              quantityDots={4}
                              sizeDots={'middle'}
                              title={'Loading'}
                              isOverlay={false}
                            />
                          }>
                          <LendPage
                            isMobileMedia={this.state.isMobileMedia}
                            doNetworkConnect={this.doNetworkConnect}
                            isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen}
                          />
                        </Suspense>
                      </React.Fragment>
                    )}
                  />
                  {/*{!this.state.isMobileMedia ? (*/}
                  <Route
                    exact={true}
                    path="/trade"
                    render={() => (
                      <React.Fragment>
                        <HeaderOps
                          headerClass="trade"
                          isMobileMedia={this.state.isMobileMedia}
                          doNetworkConnect={this.doNetworkConnect}
                          isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen}
                        />
                        <Suspense
                          fallback={
                            <PreloaderChart
                              quantityDots={4}
                              sizeDots={'middle'}
                              title={'Loading'}
                              isOverlay={false}
                            />
                          }>
                          <TradePage
                            isMobileMedia={this.state.isMobileMedia}
                            doNetworkConnect={this.doNetworkConnect}
                            isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen}
                          />
                        </Suspense>
                      </React.Fragment>
                    )}
                  />

                  <Route
                    exact={true}
                    path="/stats"
                    render={() => (
                      <React.Fragment>
                        <HeaderOps
                          headerClass="stats"
                          isMobileMedia={this.state.isMobileMedia}
                          doNetworkConnect={this.doNetworkConnect}
                          isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen}
                        />
                        <Suspense
                          fallback={
                            <PreloaderChart
                              quantityDots={4}
                              sizeDots={'middle'}
                              title={'Loading'}
                              isOverlay={false}
                            />
                          }>
                          <StatsPage
                            isMobileMedia={this.state.isMobileMedia}
                            doNetworkConnect={this.doNetworkConnect}
                            isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen}
                          />
                        </Suspense>
                      </React.Fragment>
                    )}
                  />
                  {appConfig.isMainnetProd ? (
                    <Route
                      path="*"
                      component={() => {
                        window.location.href = 'https://fulcrum.trade'
                        return null
                      }}
                    />
                  ) : (
                    <Route path="*" render={() => <Redirect to="/" />} />
                  )}
                </Switch>
                {appConfig.isMainnetProd ? (
                  <Route
                    path="/"
                    render={({ location }) => {
                      const tagManagerArgs = {
                        dataLayer: {
                          // userId: '001',
                          userProject: 'fulcrum',
                          page: location.pathname + location.search,
                        },
                      }
                      // ReactGA.ga('set', 'page', location.pathname + location.search);
                      // ReactGA.ga('send', 'pageview');
                      TagManager.dataLayer(tagManagerArgs)
                      return null
                    }}
                  />
                ) : (
                  ``
                )}

                <Footer isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen} />
              </BrowserRouter>
            )}
          </div>
        </div>
      </Web3ReactProvider>
    )
  }
  private didResize = () => {
    const isMobileMedia = window.innerWidth <= 959
    this.setState({ isMobileMedia })
  }

  public doNetworkConnect = async () => {
    ;(await this._isMounted) &&
      !this.state.isProviderMenuModalOpen &&
      this.setState({ ...this.state, isProviderMenuModalOpen: true })
  }

  public async onConnectorUpdated(update: ConnectorUpdate) {
    FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.ProviderIsChanging)

    await Web3ConnectionFactory.updateConnector(update)
    await FulcrumProvider.Instance.setWeb3ProviderFinalize(FulcrumProvider.Instance.providerType)
  }

  public onDeactivate = async () => {
    await FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.ProviderIsChanging)
    ;(await this._isMounted) &&
      this.setState({
        ...this.state,
        isProviderMenuModalOpen: false,
      })
    await FulcrumProvider.Instance.setReadonlyWeb3Provider()
  }

  public onProviderTypeSelect = async (connector: AbstractConnector, account?: string) => {
    this.setState({
      ...this.state,
      isLoading: true,
      isProviderMenuModalOpen: false,
    })

    FulcrumProvider.Instance.setWeb3Provider(connector, account)
  }

  public onRequestClose = async () => {
    ;(await this._isMounted) && this.setState({ ...this.state, isProviderMenuModalOpen: false })
  }

  public onProviderChanged = (event: ProviderChangedEvent) => {
    //await this.checkITokenV1Balances();
    this.checkGasTokenAllowance()
    // ;(await this._isMounted) &&
    //   this.setState({
    //     ...this.state,
    //     isLoading: false,
    //     web3: event.web3
    //   })
  }
  public onRiskDisclosureRequestClose = async () => {
    ;(await this._isMounted) && this.setState({ ...this.state, isRiskDisclosureModalOpen: false })
  }
  public onRiskDisclosureRequestOpen = async () => {
    ;(await this._isMounted) && this.setState({ ...this.state, isRiskDisclosureModalOpen: true })
  }
  // private checkITokenV1Balances = async () => {
  //   const v1AssetsArray = [
  //     Asset.ETHv1,
  //     Asset.DAIv1,
  //     Asset.SAIv1,
  //     Asset.USDCv1,
  //     Asset.WBTCv1,
  //     Asset.BATv1,
  //     Asset.KNCv1,
  //     Asset.REPv1,
  //     Asset.ZRXv1,
  //     Asset.LINKv1,
  //     Asset.SUSDv1,
  //     Asset.USDTv1,
  //   ]
  //   for (const i in v1AssetsArray) {
  //     const iTokenBalance = await FulcrumProvider.Instance.getITokenBalanceOfUser(v1AssetsArray[i]);
  //     if (iTokenBalance.gt(0)) {
  //       await this._isMounted && this.setState({
  //         ...this.state,
  //         isV1ITokenInWallet: true
  //       })
  //       return;
  //     }

  //   }
  //   await this._isMounted && this.setState({
  //     ...this.state,
  //     isV1ITokenInWallet: false
  //   })
  // }

  private checkGasTokenAllowance = async () => {
    const gasTokenAllowance = await FulcrumProvider.Instance.getGasTokenAllowance()
    localStorage.setItem('isGasTokenEnabled', gasTokenAllowance.gt(0) ? 'true' : 'false')
  }
}
