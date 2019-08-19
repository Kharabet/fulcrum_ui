import { Web3Wrapper } from '@0x/web3-wrapper';
import React, { Component } from "react";
import ReactGA from "react-ga";
import Modal from "react-modal";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import configProviders from "../config/providers.json";
import { ProviderType } from "../domain/ProviderType";
import { BorrowPage } from "../pages/BorrowPage";
import { DashboardPage } from "../pages/DashboardPage";
import { LandingPage } from "../pages/LandingPage";
import { MaintenancePage } from "../pages/MaintenancePage";
import { WalletSelectionPage } from "../pages/WalletSelectionPage";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { LocationListener } from "./LocationListener";
import { ProviderMenu } from "./ProviderMenu";

import siteConfig from "./../config/SiteConfig.json";

const isMainnetProd = 
  process.env.NODE_ENV && process.env.NODE_ENV !== "development"
  && process.env.REACT_APP_ETH_NETWORK === "mainnet";

if (isMainnetProd) {
  ReactGA.initialize(configProviders.Google_TrackingID);
}

interface IAppRouterState {
  isProviderMenuModalOpen: boolean;
  selectedProviderType: ProviderType;
  isLoading: boolean;
  web3: Web3Wrapper| null;
}

export class AppRouter extends Component<any, IAppRouterState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isProviderMenuModalOpen: false,
      isLoading: false,
      selectedProviderType: TorqueProvider.Instance.providerType,
      web3: TorqueProvider.Instance.web3Wrapper
    };

    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentWillUnmount(): void {
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public render() {
    return (
      <React.Fragment>
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
              // ProviderType.WalletConnect,
              ProviderType.None
            ]}
            onSelect={this.onProviderTypeSelect}
          />
        </Modal>
        <div className="pages-container">
          {
            siteConfig.MaintenanceMode
              ? <MaintenancePage />
              :
                <HashRouter hashType="slash">
                  <LocationListener doNetworkConnect={this.doNetworkConnect}>
                    <Switch>
                      <Route exact={true} path="/" component={LandingPage} />
                      <Route exact={true} path="/wallet" component={WalletSelectionPage} />
                      <Route exact={true} path="/borrow" component={BorrowPage} />
                      <Route exact={true} path="/dashboard" component={DashboardPage} />
                      <Route exact={true} path="/dashboard/:walletAddress" component={DashboardPage} />
                      <Route path="*" render={() => <Redirect to="/"/> } />
                    </Switch>
                    {isMainnetProd ? (
                      <Route path="/" render={({location}) => {
                        ReactGA.ga('set', 'page', location.pathname + location.search);
                        ReactGA.ga('send', 'pageview');
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

  public doNetworkConnect = () => {
    this.setState({ ...this.state, isProviderMenuModalOpen: true });
  };

  public onProviderTypeSelect = async (providerType: ProviderType) => {
    if (providerType !== TorqueProvider.Instance.providerType ||
      providerType !== ProviderType.None && TorqueProvider.Instance.accounts.length === 0 || !TorqueProvider.Instance.accounts[0]) {
      TorqueProvider.Instance.isLoading = true;

      await TorqueProvider.Instance.eventEmitter.emit(TorqueProviderEvents.ProviderIsChanging);

      this.setState({
        ...this.state,
        isLoading: true,
        isProviderMenuModalOpen: false
      }, async () => {
        await TorqueProvider.Instance.setWeb3Provider(providerType);	

        TorqueProvider.Instance.isLoading = false;	

        await TorqueProvider.Instance.eventEmitter.emit(	
          TorqueProviderEvents.ProviderChanged,	
          new ProviderChangedEvent(TorqueProvider.Instance.providerType, TorqueProvider.Instance.web3Wrapper)	
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
