import { Web3Wrapper } from '@0x/web3-wrapper';
import React, { Component, Context } from "react";

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
import { SupportedProvider } from "ethereum-types";

import {
  Web3ReactProvider,
  useWeb3React, createWeb3ReactRoot, getWeb3ReactContext
} from "@web3-react/core";
import { MetamaskSubprovider, RPCSubprovider, SignerSubprovider, Web3ProviderEngine } from "@0x/subproviders";
import { Web3ConnectionFactory } from '../domain/Web3ConnectionFactory';
import {
  injected,
  fortmatic,
  portis,
  squarelink,
  bitski
} from '../domain/WalletConnectors'
import { AbstractConnector } from '@web3-react/abstract-connector'

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
function getKeyByValue(object: { [name: string]: AbstractConnector }, value: AbstractConnector): ProviderType {
  return Object.keys(object).find(key => object[key] === value) as ProviderType;
}

interface IAppRouterState {
  isProviderMenuModalOpen: boolean;
  isRiskDisclosureModalOpen: boolean;
  selectedProviderType: ProviderType;
  isLoading: boolean;
  web3: Web3Wrapper | null;
  isMobileMedia: boolean;
}
const connectorsByName: { [name: string]: AbstractConnector } = {
  [ProviderType.MetaMask]: injected,
  [ProviderType.Fortmatic]: fortmatic,
  [ProviderType.Portis]: portis,
  [ProviderType.Squarelink]: squarelink,
  [ProviderType.Bitski]: bitski,
}


const Web3ReactContext = getWeb3ReactContext()

export class AppRouter extends Component<any, IAppRouterState> {
  static contextType = Web3ReactContext;
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
    window.addEventListener("resize", this.didResize.bind(this));
    this.didResize();
    errors.setLogLevel("error");
    const { connector, library, chainId, account, activate, deactivate, active, error } = this.context;
    if (this.state.isMobileMedia){
      activate(connectorsByName[ProviderType.MetaMask]);
    }
  }

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    window.removeEventListener("resize", this.didResize.bind(this));
  }

  // public componentWillMount(): void {
  //   const { connector, library, chainId, account, activate, deactivate, active, error } = this.context;
  //   this.onProviderTypeSelect(getKeyByValue(connectorsByName, connector))
  // }

  public getLibrary = async (provider: any, connector: any): Promise<Web3ProviderEngine> => {
    console.log(provider);
    await this.onProviderTypeSelect(getKeyByValue(connectorsByName, connector), provider)
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
                ProviderType.Fortmatic,
                ProviderType.Portis,
                ProviderType.Bitski,
                ProviderType.Squarelink,
                // ProviderType.WalletConnect,
                ProviderType.None
              ]}
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
  private didResize = () => {
    const isMobileMedia = (window.innerWidth <= 959);
    if (isMobileMedia !== this.state.isMobileMedia) {
      this.setState({ isMobileMedia });
    }
  }

  public doNetworkConnect = () => {
    const isMobileMedia = (window.innerWidth <= 959);
    if (this.state.isMobileMedia) {
      this.onProviderTypeSelect(ProviderType.MetaMask)
    } else {
      this.setState({ ...this.state, isProviderMenuModalOpen: true });
    }
    this.setState({ ...this.state, isProviderMenuModalOpen: true });
  };

  public onProviderTypeSelect = async (providerType: ProviderType, provider?: any) => {

    if (true) {
      FulcrumProvider.Instance.isLoading = true;

      await FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.ProviderIsChanging);

      this.setState({
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
      this.setState({
        ...this.state,
        isProviderMenuModalOpen: false
      });
    }
  };

  public onRequestClose = () => {
    this.setState({ ...this.state, isProviderMenuModalOpen: false });
  };

  public onProviderChanged = async (event: ProviderChangedEvent) => {
    this.setState({
      ...this.state,
      selectedProviderType: event.providerType,
      isLoading: false,
      web3: event.web3
    });
  };
  public onRiskDisclosureRequestClose = () => {
    this.setState({ ...this.state, isRiskDisclosureModalOpen: false });
  }
  public onRiskDisclosureRequestOpen = () => {
    this.setState({ ...this.state, isRiskDisclosureModalOpen: true });
  }
}
