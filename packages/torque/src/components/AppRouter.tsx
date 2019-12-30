import { Web3Wrapper } from '@0x/web3-wrapper';
import React, { Component } from "react";
// import ReactGA from "react-ga";
import Intercom from "react-intercom";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import configProviders from "../config/providers.json";
import { ProviderType } from "../domain/ProviderType";
import { WalletType } from "../domain/WalletType";
import { BorrowPage } from "../pages/BorrowPage";
import { DashboardPage } from "../pages/DashboardPage";
import { LandingPage } from "../pages/LandingPage";
import { LandingPageStatic } from "../pages/LandingPageStatic";
import { MaintenancePage } from "../pages/MaintenancePage";
import { WalletSelectionPage } from "../pages/WalletSelectionPage";
import { RefinancePage } from "../pages/RefinancePage";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { NavService } from "../services/NavService";
import { TorqueProvider } from "../services/TorqueProvider";
import { LocationListener } from "./LocationListener";
import TagManager from 'react-gtm-module';
import siteConfig from "./../config/SiteConfig.json";

const isMainnetProd =
  process.env.NODE_ENV && process.env.NODE_ENV !== "development"
  && process.env.REACT_APP_ETH_NETWORK === "kovan";

console.log("process.env.NODE_ENV = ", process.env.NODE_ENV)
console.log("isMainnetProd = ", isMainnetProd)
console.log("process.env.REACT_APP_ETH_NETWORK", process.env.REACT_APP_ETH_NETWORK)

if (isMainnetProd) {
  const tagManagerArgs = {
     gtmId : configProviders.Google_TrackingID,
     'dataLayer' : {
              'name' : "Home",
              'status' : "Intailized"
          }
  }
  TagManager.initialize(tagManagerArgs)
  // ReactGA.initialize(configProviders.Google_TrackingID);
}

interface IAppRouterState {
//  isProviderMenuModalOpen: boolean;
  selectedProviderType: ProviderType;
  isLoading: boolean;
  web3: Web3Wrapper| null;
}

export class AppRouter extends Component<any, IAppRouterState> {
  constructor(props: any) {
    super(props);

    this.state = {
      // isProviderMenuModalOpen: false,
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
        { isMainnetProd ? (
          <Intercom appID="dfk4n5ut" />
        ) : null }
        <div className="pages-container">
          {
            siteConfig.MaintenanceMode
              ? <MaintenancePage />
                : siteConfig.LandingPage
                ? <HashRouter hashType="slash">
                    <LocationListener doNetworkConnect={this.doNetworkConnect}>
                      <Switch>
                        <Route exact={true} path="/" component={LandingPageStatic} />
                        <Route path="*" render={() => <Redirect to="/"/> } />
                      </Switch>
                      {isMainnetProd ? (
                        <Route path="/" render={({location}) => {
                          const tagManagerArgs = {
                              dataLayer: {
                                  userProject: 'Torque',
                                  page: location.pathname + location.search
                              }
                          }
                          TagManager.dataLayer(tagManagerArgs);
                          return null;
                        }} />
                      ) : ``}
                    </LocationListener>
                  </HashRouter>
                :
                  <HashRouter hashType="slash">
                    <LocationListener doNetworkConnect={this.doNetworkConnect}>
                      <Switch>
                        <Route exact={true} path="/" component={LandingPage} />
                        <Route exact={true} path="/wallet/:destinationAbbr" render={props => <WalletSelectionPage {...props} onSelectProvider={this.onProviderTypeSelect} isLoading={this.state.isLoading} />} />
                        <Route exact={true} path="/borrow/:walletTypeAbbr" render={props => <BorrowPage {...props} isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} />} />
                        <Route exact={true} path="/dashboard/:walletTypeAbbr" render={props => <DashboardPage {...props} isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} />} />
                        <Route exact={true} path="/dashboard/:walletTypeAbbr/:walletAddress" render={props => <DashboardPage {...props} isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} />} />
                        <Route exact={true} path="/refinance/:walletTypeAbbr" render={props => <RefinancePage {...props} isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} />} />
                        <Route path="*" render={() => <Redirect to="/"/> } />
                      </Switch>
                      {isMainnetProd ? (
                        <Route path="/" render={({location}) => {
                          const tagManagerArgs = {
                              dataLayer: {
                                  userProject: 'Torque',
                                  page: location.pathname + location.search
                              }
                          }
                          TagManager.dataLayer(tagManagerArgs);
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

  public doNetworkConnect = (destinationAbbr: string) => {
    NavService.Instance.History.replace(NavService.Instance.getWalletAddress(destinationAbbr));
    // this.setState({ ...this.state, isProviderMenuModalOpen: true });
  };

  private onProviderTypeSelect = async (providerType: ProviderType) => {

    if (providerType === TorqueProvider.Instance.providerType && TorqueProvider.Instance.accounts.length !== 0) {
      const accountAddress = TorqueProvider.Instance.accounts[0];

      const walletType = TorqueProvider.Instance.providerType !== ProviderType.None ?
        WalletType.Web3 :
        WalletType.NonWeb3;

      if (TorqueProvider.Instance.destinationAbbr === "b") {
        NavService.Instance.History.replace(
          NavService.Instance.getBorrowAddress(walletType)
        );
      } if (TorqueProvider.Instance.destinationAbbr === "t") {
        if (accountAddress) {
          NavService.Instance.History.replace(
            NavService.Instance.getDashboardAddress(walletType, accountAddress)
          );
        }
      } else {
        // do nothing
      }

      return;
    }

    TorqueProvider.Instance.isLoading = true;

    await TorqueProvider.Instance.eventEmitter.emit(TorqueProviderEvents.ProviderIsChanging);

    this.setState({
      ...this.state,
      isLoading: true,
//        isProviderMenuModalOpen: false
    }, async () => {
      await TorqueProvider.Instance.setWeb3Provider(providerType);

      TorqueProvider.Instance.isLoading = false;

      await TorqueProvider.Instance.eventEmitter.emit(
        TorqueProviderEvents.ProviderChanged,
        new ProviderChangedEvent(TorqueProvider.Instance.providerType, TorqueProvider.Instance.web3Wrapper)
      );
    });
  };

  // public onRequestClose = () => {
  //   this.setState({ ...this.state, isProviderMenuModalOpen: false });
  // };

  public onProviderChanged = async (event: ProviderChangedEvent) => {
    this.setState({
      ...this.state,
      selectedProviderType: event.providerType,
      isLoading: false,
      web3: event.web3
    });
  };
}
