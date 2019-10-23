import { Web3Wrapper } from '@0x/web3-wrapper';
import React, { Component } from "react";
import ReactGA from "react-ga";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import configProviders from "../config/providers.json";
import { ProviderType } from "../domain/ProviderType";
import { BorrowPage } from "../pages/BorrowPage";
import { DashboardPage } from "../pages/DashboardPage";
import { LandingPage } from "../pages/LandingPage";
import { LandingPageStatic } from "../pages/LandingPageStatic";
import { MaintenancePage } from "../pages/MaintenancePage";
import { WalletSelectionPage } from "../pages/WalletSelectionPage";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { NavService } from "../services/NavService";
import { TorqueProvider } from "../services/TorqueProvider";
import { LocationListener } from "./LocationListener";

import siteConfig from "./../config/SiteConfig.json";

const isMainnetProd = 
  process.env.NODE_ENV && process.env.NODE_ENV !== "development"
  && process.env.REACT_APP_ETH_NETWORK === "mainnet";

if (isMainnetProd) {
  ReactGA.initialize(configProviders.Google_TrackingID);
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
          <div dangerouslySetInnerHTML={{__html: '<script>  window.intercomSettings = {  	app_id: "dfk4n5ut"  };</script><script>(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic("reattach_activator");ic("update",w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement("script");s.type="text/javascript";s.async=true;s.src="https://widget.intercom.io/widget/dfk4n5ut";var x=d.getElementsByTagName("script")[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent("onload",l);}else{w.addEventListener("load",l,false);}}})();</script>'}} />
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
                          ReactGA.ga('set', 'page', location.pathname + location.search);
                          ReactGA.ga('send', 'pageview');
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

  public doNetworkConnect = (destinationAbbr: string) => {
    NavService.Instance.History.replace(NavService.Instance.getWalletAddress(destinationAbbr));
    // this.setState({ ...this.state, isProviderMenuModalOpen: true });
  };

  private onProviderTypeSelect = async (providerType: ProviderType) => {
    if (providerType !== TorqueProvider.Instance.providerType ||
      providerType !== ProviderType.None && TorqueProvider.Instance.accounts.length === 0 || !TorqueProvider.Instance.accounts[0]) {
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
    } else {
      this.setState({
        ...this.state,
//        isProviderMenuModalOpen: false
      });
    }
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
