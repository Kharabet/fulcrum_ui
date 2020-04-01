import { Web3Wrapper } from '@0x/web3-wrapper';
import React, { Component } from "react";

import TagManager from 'react-gtm-module';
import Intercom from "react-intercom";
import Modal from "react-modal";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { ProviderType } from "../domain/ProviderType";
import { LandingPage } from "../pages/LandingPage";
import { LendPage } from "../pages/LendPage";
import { MaintenancePage } from "../pages/MaintenancePage";
import { StatsPage } from "../pages/StatsPage";
import { TradePage } from "../pages/TradePage";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import configProviders from "./../config/providers.json";
import { LocationListener } from "./LocationListener";
import { ProgressFragment } from "./ProgressFragment";
import { ProviderMenu } from "./ProviderMenu";
import { RiskDisclosure } from "./RiskDisclosure";
import { errors } from "ethers"
import siteConfig from "./../config/SiteConfig.json";

import { Web3ReactProvider, getWeb3ReactContext } from "@web3-react/core";
import { Web3ProviderEngine } from "@0x/subproviders";
import { Web3ConnectionFactory } from '../domain/Web3ConnectionFactory';
import { ProviderTypeDictionary } from '../domain/ProviderTypeDictionary';

const isMainnetProd =
  process.env.NODE_ENV && process.env.NODE_ENV !== "development"
  && process.env.REACT_APP_ETH_NETWORK === "mainnet";

if (isMainnetProd) {
  const tagManagerArgs = {
    gtmId: configProviders.Google_TrackingID,
    'dataLayer': {
      'name': "Home",
      'status': "Intailized"
    }
  }
  TagManager.initialize(tagManagerArgs)
}

interface IAppRouterState {
  isProviderMenuModalOpen: boolean;
  isRiskDisclosureModalOpen: boolean;
  selectedProviderType: ProviderType;
  isLoading: boolean;
  web3: Web3Wrapper | null;
  isMobileMedia: boolean;
}

const Web3ReactContext = getWeb3ReactContext()

export class AppRouter extends Component<any, IAppRouterState> {
  static contextType = Web3ReactContext;
  private _isMounted: boolean = false;
  constructor(props: any) {
    super(props);

    this.state = {
      isProviderMenuModalOpen: false,
      isRiskDisclosureModalOpen: false,
      isLoading: false,
      selectedProviderType: FulcrumProvider.Instance.providerType,
      web3: FulcrumProvider.Instance.web3Wrapper,
      isMobileMedia: false
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidMount(): void {
    this._isMounted = true;
    window.addEventListener("resize", this.didResize.bind(this));
    this.didResize();
    errors.setLogLevel("error");
    this.doNetworkConnect();
  }

  public componentWillUnmount(): void {
    this._isMounted = false;
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    window.removeEventListener("resize", this.didResize.bind(this));
  }

  public getLibrary = async (provider: any, connector: any): Promise<Web3ProviderEngine> => {
    console.log(provider);
    const providerType = await ProviderTypeDictionary.getProviderTypeByConnector(connector);
    await this.onProviderTypeSelect(providerType, provider)
    return Web3ConnectionFactory.currentWeb3Engine;
  }

  public render() {
    return (
      <Web3ReactProvider getLibrary={this.getLibrary}>
               {isMainnetProd && !this.state.isMobileMedia ? (

          <Intercom appID="dfk4n5ut" />
        ) : null}

        <Modal
          isOpen={this.state.isProviderMenuModalOpen}
          onRequestClose={this.onRequestClose}
          className="modal-content-div"
          overlayClassName="modal-overlay-div"
        >
          <ProviderMenu
            selectedProviderType={this.state.selectedProviderType}
            providerTypes={[
              ProviderType.MetaMask,
              ProviderType.TrustWallet,
              ProviderType.Frame,
              ProviderType.Fortmatic,
              ProviderType.Portis,
              ProviderType.Bitski,
              ProviderType.Squarelink,
              ProviderType.Ledger,
              // ProviderType.WalletConnect,
              ProviderType.None
            ]}
            isMobileMedia={this.state.isMobileMedia}
            onSelect={this.onProviderTypeSelect}
          />
        </Modal>
        <Modal
          isOpen={this.state.isRiskDisclosureModalOpen}
          onRequestClose={this.onRiskDisclosureRequestClose}
          className="modal-content-div-top"
          overlayClassName="modal-overlay-div overflow-auto"
        >
          <RiskDisclosure onClose={this.onRiskDisclosureRequestClose} />
        </Modal>
        <ProgressFragment />
        <div className="pages-container">
          {
            siteConfig.MaintenanceMode
              ? <MaintenancePage />
              :
              <HashRouter hashType="slash">
                <LocationListener doNetworkConnect={this.doNetworkConnect}>
                  <Switch>
                    {!isMainnetProd ? <Route exact={true} path="/" render={() => <LandingPage isMobileMedia={this.state.isMobileMedia} isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen} />} /> : undefined}
                    <Route exact={true} path="/lend" render={() => <LendPage isMobileMedia={this.state.isMobileMedia} isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen} />} />
                    {/*{!this.state.isMobileMedia ? (*/}
                    <Route exact={true} path="/trade" render={() => <TradePage isMobileMedia={this.state.isMobileMedia} isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen} />} />
                    // ) : ``}
                    <Route exact={true} path="/stats" render={() => <StatsPage isMobileMedia={this.state.isMobileMedia} isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen} />} />
                    {isMainnetProd ? <Route path="*" component={() => {
                      window.location.href = 'https://fulcrum.trade';
                      return null;
                    }} /> : <Route path="*" render={() => <Redirect to="/" />} />}
                  </Switch>
                  {isMainnetProd ? (
                    <Route path="/" render={({ location }) => {
                      const tagManagerArgs = {
                        dataLayer: {
                          // userId: '001',
                          userProject: 'fulcrum',
                          page: location.pathname + location.search
                        }
                      }
                      // ReactGA.ga('set', 'page', location.pathname + location.search);
                      // ReactGA.ga('send', 'pageview');
                      TagManager.dataLayer(tagManagerArgs);
                      return null;
                    }} />
                  ) : ``}
                </LocationListener>
              </HashRouter>
          }
        </div>
      </Web3ReactProvider>
    );
  }
  private didResize = async () => {
    const isMobileMedia = (window.innerWidth <= 959);
    if (isMobileMedia !== this.state.isMobileMedia) {
      await this._isMounted && this.setState({ isMobileMedia });
    }
  }

  public doNetworkConnect = async () => {
    await this._isMounted && this.setState({ ...this.state, isProviderMenuModalOpen: true });
  };

  public onProviderTypeSelect = async (providerType: ProviderType, provider?: any) => {

    if (!this.state.isLoading) {
      FulcrumProvider.Instance.isLoading = true;

      await FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.ProviderIsChanging);

      await this._isMounted && this.setState({
        ...this.state,
        isLoading: true,
        isProviderMenuModalOpen: false
      }, async () => {
        await FulcrumProvider.Instance.setWeb3Provider(providerType, provider);

        FulcrumProvider.Instance.isLoading = false;

        await FulcrumProvider.Instance.eventEmitter.emit(
          FulcrumProviderEvents.ProviderChanged,
          new ProviderChangedEvent(FulcrumProvider.Instance.providerType, FulcrumProvider.Instance.web3Wrapper)
        );
      });
    } else {
      await this._isMounted && this.setState({
        ...this.state,
        isProviderMenuModalOpen: false
      });
    }
  };

  public onRequestClose = async () => {
    await this._isMounted && this.setState({ ...this.state, isProviderMenuModalOpen: false });
  };

  public onProviderChanged = async (event: ProviderChangedEvent) => {
    await this._isMounted && this.setState({
      ...this.state,
      selectedProviderType: event.providerType,
      isLoading: false,
      web3: event.web3
    });
  };
  public onRiskDisclosureRequestClose = async () => {
    await this._isMounted && this.setState({ ...this.state, isRiskDisclosureModalOpen: false });
  }
  public onRiskDisclosureRequestOpen = async () => {
    await this._isMounted && this.setState({ ...this.state, isRiskDisclosureModalOpen: true });
  }
}
