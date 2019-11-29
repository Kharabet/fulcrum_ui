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

import siteConfig from "./../config/SiteConfig.json";

const isMainnetProd =
  process.env.NODE_ENV && process.env.NODE_ENV !== "development"
  && process.env.REACT_APP_ETH_NETWORK === "mainnet";

if (isMainnetProd) {
  const tagManagerArgs = {
       gtmId : configProviders.Google_TrackingID,
       'dataLayer' : {
                'name' : "Home",
                'status' : "Intailized"
            },
            'dataLayerName' : 'PageDataLayer'
    }
    TagManager.initialize(tagManagerArgs)
}

interface IAppRouterState {
  isProviderMenuModalOpen: boolean;
  selectedProviderType: ProviderType;
  isLoading: boolean;
  web3: Web3Wrapper| null;
  isMobileMedia: boolean;
}

export class AppRouter extends Component<any, IAppRouterState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isProviderMenuModalOpen: false,
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
  }

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    window.removeEventListener("resize", this.didResize.bind(this));
  }

  public render() {
    return (
      <React.Fragment>
        { isMainnetProd ? (
          <Intercom appID="dfk4n5ut" />
        ) : null }
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
        <ProgressFragment />
        <div className="pages-container">
          {
            siteConfig.MaintenanceMode
              ? <MaintenancePage />
              :
                <HashRouter hashType="slash">
                  <LocationListener doNetworkConnect={this.doNetworkConnect}>
                    <Switch>
                      <Route exact={true} path="/" render={() => <LandingPage isMobileMedia={this.state.isMobileMedia} />} />
                      <Route exact={true} path="/lend" render={() => <LendPage isMobileMedia={this.state.isMobileMedia} isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} />} />
                      {/*{!this.state.isMobileMedia ? (*/}
                        <Route exact={true} path="/trade" render={() => <TradePage isMobileMedia={this.state.isMobileMedia} isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} />} />
                      // ) : ``}
                      <Route exact={true} path="/stats" render={() => <StatsPage isMobileMedia={this.state.isMobileMedia} isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} />} />
                      <Route path="*" render={() => <Redirect to="/"/> } />
                    </Switch>
                    {isMainnetProd ? (
                      <Route path="/" render={({location}) => {
                        const tagManagerArgs = {
                            dataLayer: {
                                // userId: '001',
                                userProject: 'fulcrum',
                                page: location.pathname + location.search
                            },
                            dataLayerName: 'PageDataLayer'
                        }
                        // ReactGA.ga('set', 'page', location.pathname + location.search);
                        // ReactGA.ga('send', 'pageview');
                        TagManager.dataLayer(tagManagerArgs)
                        return null;
                      }} />
                    ) : ``}
                  </LocationListener>
                </HashRouter>
          }
        </div>
      </React.Fragment>
    );
  }

  private didResize = () => {
    const isMobileMedia = (window.innerWidth <= 959);
    if (isMobileMedia !== this.state.isMobileMedia) {
      this.setState({ isMobileMedia });
    }
  }

  public doNetworkConnect = () => {
    this.setState({ ...this.state, isProviderMenuModalOpen: true });
  };

  public onProviderTypeSelect = async (providerType: ProviderType) => {
    if (providerType !== FulcrumProvider.Instance.providerType ||
      providerType !== ProviderType.None && FulcrumProvider.Instance.accounts.length === 0 || !FulcrumProvider.Instance.accounts[0]) {
      FulcrumProvider.Instance.isLoading = true;

      await FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.ProviderIsChanging);

      this.setState({
        ...this.state,
        isLoading: true,
        isProviderMenuModalOpen: false
      }, async () => {
        await FulcrumProvider.Instance.setWeb3Provider(providerType);

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
}
