import { Web3Wrapper } from '@0x/web3-wrapper';
import React, { Component } from "react";
import TagManager from 'react-gtm-module';
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
import { RefinancePage } from "../pages/RefinancePage";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { NavService } from "../services/NavService";
import { TorqueProvider } from "../services/TorqueProvider";
import siteConfig from "./../config/SiteConfig.json";
import { LocationListener } from "./LocationListener";
import { RiskDisclosure } from "./RiskDisclosure";
import Modal from "react-modal";

import { ProviderMenu } from "./ProviderMenu";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3ProviderEngine } from "@0x/subproviders";
import { Web3ConnectionFactory } from '../domain/Web3ConnectionFactory';
import { ProviderTypeDictionary } from '../domain/ProviderTypeDictionary';
import { AbstractConnector } from '@web3-react/abstract-connector';
import {errors} from "ethers"

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
  // ReactGA.initialize(configProviders.Google_TrackingID);
}

interface IAppRouterState {
  isProviderMenuModalOpen: boolean;
  isRiskDisclosureModalOpen: boolean;
  selectedProviderType: ProviderType;
  isLoading: boolean;
  web3: Web3Wrapper | null;
  isMobileMedia: boolean;
}

export class AppRouter extends Component<any, IAppRouterState> {
  private _isMounted: boolean = false;
  constructor(props: any) {
    super(props);

    this.state = {
      isProviderMenuModalOpen: false,
      isRiskDisclosureModalOpen: false,
      isLoading: false,
      selectedProviderType: TorqueProvider.Instance.providerType,
      web3: TorqueProvider.Instance.web3Wrapper,
      isMobileMedia: false,
    };

    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentWillUnmount(): void {
    this._isMounted = false;
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderChanged, this.onProviderChanged);
    window.removeEventListener("resize", this.didResize.bind(this));
  }

  public componentDidMount(): void {
    this._isMounted = true;
    window.addEventListener("resize", this.didResize.bind(this));
    this.didResize();
    errors.setLogLevel("error")
    this.doNetworkConnect();
  }

  public getLibrary = async (provider: any, connector: any): Promise<Web3ProviderEngine> => {
    console.log(provider);
    //handle connectors events (i.e. network changed)
    await this.onProviderTypeSelect(connector)
    return Web3ConnectionFactory.currentWeb3Engine;
  }


  public render() {
    return (
      <Web3ReactProvider getLibrary={this.getLibrary}>

        <Modal
          isOpen={this.state.isProviderMenuModalOpen}
          onRequestClose={this.onRequestClose}
          className="modal-content-div"
          overlayClassName="modal-overlay-div"
        >
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
          overlayClassName="modal-overlay-div overflow-auto"
        >
          <RiskDisclosure onClose={this.onRiskDisclosureRequestClose} />
        </Modal>
        {isMainnetProd ? (
          <Intercom appID="dfk4n5ut" />
        ) : null}
        <div className="pages-container">
          {
            siteConfig.MaintenanceMode
              ? <MaintenancePage />
              : siteConfig.LandingPage
                ? <HashRouter hashType="slash">
                  <LocationListener doNetworkConnect={this.doNetworkConnect}>
                    <Switch>
                      <Route exact={true} path="/" render={props => <LandingPageStatic {...props} isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen} />} />
                      <Route path="*" render={() => <Redirect to="/" />} />
                    </Switch>
                    {isMainnetProd ? (
                      <Route path="/" render={({ location }) => {
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
                      <Route exact={true} path="/" render={props => <LandingPage {...props} isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen} />} />
                      <Route exact={true} path="/borrow" render={props => <BorrowPage {...props} isMobileMedia={this.state.isMobileMedia} isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen} />} />
                      <Route exact={true} path="/dashboard" render={props => <DashboardPage {...props} isMobileMedia={this.state.isMobileMedia} isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen} />} />
                      <Route exact={true} path="/refinance" render={props => <RefinancePage {...props} isMobileMedia={this.state.isMobileMedia} isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} isRiskDisclosureModalOpen={this.onRiskDisclosureRequestOpen} />} />
                      <Route path="*" render={() => <Redirect to="/" />} />
                    </Switch>
                    {isMainnetProd ? (
                      <Route path="/" render={({ location }) => {
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
    // NavService.Instance.History.replace(NavService.Instance.getWalletAddress(destinationAbbr));
    await this._isMounted && this.setState({ ...this.state, isProviderMenuModalOpen: true });
  };

  public onDeactivate = async () => {

    TorqueProvider.Instance.isLoading = true;

    await TorqueProvider.Instance.eventEmitter.emit(TorqueProviderEvents.ProviderIsChanging);

    await this._isMounted && this.setState({
      ...this.state,
      isProviderMenuModalOpen: false
    });
    await TorqueProvider.Instance.setReadonlyWeb3Provider();

    TorqueProvider.Instance.isLoading = false;
    await TorqueProvider.Instance.eventEmitter.emit(
      TorqueProviderEvents.ProviderChanged,
      new ProviderChangedEvent(TorqueProvider.Instance.providerType, TorqueProvider.Instance.web3Wrapper)
    );
  }

  public onProviderTypeSelect = async (connector: AbstractConnector, account?: string) => {
    if (!this.state.isLoading) {
      TorqueProvider.Instance.isLoading = true;

      await TorqueProvider.Instance.eventEmitter.emit(TorqueProviderEvents.ProviderIsChanging);

      await this._isMounted && this.setState({
        ...this.state,
        isLoading: true,
        isProviderMenuModalOpen: false
      }, async () => {
        await TorqueProvider.Instance.setWeb3Provider(connector, account);

        TorqueProvider.Instance.isLoading = false;

        await TorqueProvider.Instance.eventEmitter.emit(
          TorqueProviderEvents.ProviderChanged,
          new ProviderChangedEvent(TorqueProvider.Instance.providerType, TorqueProvider.Instance.web3Wrapper)
        );
      });
    } else {
      await this._isMounted && this.setState({
        ...this.state,
        isProviderMenuModalOpen: false
      });
    }
  };

  //   private onProviderTypeSelect = async (providerType: ProviderType) => {
  //     if (providerType === TorqueProvider.Instance.providerType && TorqueProvider.Instance.accounts.length !== 0) {
  //       const accountAddress = TorqueProvider.Instance.accounts[0];

  //       const walletType = TorqueProvider.Instance.providerType !== ProviderType.None ?
  //         WalletType.Web3 :
  //         WalletType.NonWeb3;

  //       if (TorqueProvider.Instance.destinationAbbr === "b") {
  //         NavService.Instance.History.replace(
  //           NavService.Instance.getBorrowAddress(walletType)
  //         );
  //       } if (TorqueProvider.Instance.destinationAbbr === "t") {
  //         if (accountAddress) {
  //           NavService.Instance.History.replace(
  //             NavService.Instance.getDashboardAddress(walletType, accountAddress)
  //           );
  //         }
  //       } else {
  //         // do nothing
  //       }

  //       return;
  //     }

  //     TorqueProvider.Instance.isLoading = true;

  //     await TorqueProvider.Instance.eventEmitter.emit(TorqueProviderEvents.ProviderIsChanging);

  //     await this._isMounted && this.setState({
  //       ...this.state,
  //       isLoading: true,
  // //        isProviderMenuModalOpen: false
  //     }, async () => {
  //       await TorqueProvider.Instance.setWeb3Provider(providerType);

  //       TorqueProvider.Instance.isLoading = false;

  //       await TorqueProvider.Instance.eventEmitter.emit(
  //         TorqueProviderEvents.ProviderChanged,
  //         new ProviderChangedEvent(TorqueProvider.Instance.providerType, TorqueProvider.Instance.web3Wrapper)
  //       );
  //     });
  //   };

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
