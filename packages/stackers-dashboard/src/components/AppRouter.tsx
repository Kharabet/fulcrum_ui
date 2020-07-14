import { Web3Wrapper } from '@0x/web3-wrapper';
import { Web3ReactProvider } from "@web3-react/core";
import { AbstractConnector } from '@web3-react/abstract-connector';
import { Web3ProviderEngine } from "@0x/subproviders";
import { Web3ConnectionFactory } from '../domain/Web3ConnectionFactory';
import { StackerProvider } from "../services/StackerProvider";
import { StackerProviderEvents } from "../services/events/StackerProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import Modal from "react-modal";

import Intercom from "react-intercom";
import { ProviderMenu } from "./ProviderMenu";


import React, { Component } from "react";
import TagManager from 'react-gtm-module';

import { DashboardPage } from '../pages/DashboardPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { Footer } from '../layout/Footer';
import { BrowserRouter as Router, Switch, Route, } from "react-router-dom";
import { ConnectorEvent, ConnectorUpdate } from '@web3-react/types';
import { ProviderType } from '../domain/ProviderType';
import { LocationListener } from "./LocationListener";
import configProviders from "../config/providers.json";
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
  // ReactGA.initialize(configProviders.Google_TrackingID);
}

interface IAppRouterState {
  isProviderMenuModalOpen: boolean;
  isLoading: boolean;
  selectedProviderType: ProviderType;
  web3: Web3Wrapper | null;
  isMobileMedia: boolean;
}

export class AppRouter extends Component<any, IAppRouterState> {
  private _isMounted: boolean = false;
  constructor(props: any) {
    super(props);
    this.state = {
      isProviderMenuModalOpen: false,
      isLoading: false,
      selectedProviderType: StackerProvider.Instance.providerType,
      web3: StackerProvider.Instance.web3Wrapper,
      isMobileMedia: false,
    };
    StackerProvider.Instance.eventEmitter.on(StackerProviderEvents.ProviderChanged, this.onProviderChanged);
  }
  public async onConnectorUpdated(update: ConnectorUpdate) {
    console.log("onConnectorUpdated")
    await StackerProvider.Instance.eventEmitter.emit(StackerProviderEvents.ProviderIsChanging);

    await Web3ConnectionFactory.updateConnector(update);
    await StackerProvider.Instance.setWeb3ProviderFinalize(StackerProvider.Instance.providerType)
    await StackerProvider.Instance.eventEmitter.emit(
      StackerProviderEvents.ProviderChanged,
      new ProviderChangedEvent(StackerProvider.Instance.providerType, StackerProvider.Instance.web3Wrapper)
    );
  }

  public onDeactivate = async () => {

    StackerProvider.Instance.isLoading = true;

    await StackerProvider.Instance.eventEmitter.emit(StackerProviderEvents.ProviderIsChanging);

    await this._isMounted && this.setState({
      ...this.state,
      isProviderMenuModalOpen: false
    });
    await StackerProvider.Instance.setReadonlyWeb3Provider();

    StackerProvider.Instance.isLoading = false;
    await StackerProvider.Instance.eventEmitter.emit(
      StackerProviderEvents.ProviderChanged,
      new ProviderChangedEvent(StackerProvider.Instance.providerType, StackerProvider.Instance.web3Wrapper)
    );
  }

  public onProviderTypeSelect = async (connector: AbstractConnector, account?: string) => {
    if (!this.state.isLoading) {
      StackerProvider.Instance.isLoading = true;

      await StackerProvider.Instance.eventEmitter.emit(StackerProviderEvents.ProviderIsChanging);

      await this._isMounted && this.setState({
        ...this.state,
        isLoading: true,
        isProviderMenuModalOpen: false
      }, async () => {
        await StackerProvider.Instance.setWeb3Provider(connector, account);

        StackerProvider.Instance.isLoading = false;

        await StackerProvider.Instance.eventEmitter.emit(
          StackerProviderEvents.ProviderChanged,
          new ProviderChangedEvent(StackerProvider.Instance.providerType, StackerProvider.Instance.web3Wrapper)
        );
        await this._isMounted && this.setState({
          ...this.state,
          isLoading: false
        })
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
  public componentWillUnmount(): void {
    this._isMounted = false;
    StackerProvider.Instance.eventEmitter.removeListener(StackerProviderEvents.ProviderChanged, this.onProviderChanged);
    window.removeEventListener("resize", this.didResize.bind(this));
  }
  public componentDidMount(): void {
    this._isMounted = true;
    window.addEventListener("resize", this.didResize.bind(this));
    this.didResize();
    //errors.setLogLevel("error")
    this.doNetworkConnect();
  }
  private didResize = async () => {
    const isMobileMedia = (window.innerWidth <= 767);
    if (isMobileMedia !== this.state.isMobileMedia) {
      await this._isMounted && this.setState({ isMobileMedia });
    }
  }

  public getLibrary = async (provider: any, connector: any): Promise<Web3ProviderEngine> => {
    console.log(provider);
    //handle connectors events (i.e. network changed)
    await this.onProviderTypeSelect(connector)
    if (!connector.listeners(ConnectorEvent.Update).includes(this.onConnectorUpdated))
      connector.on(ConnectorEvent.Update, this.onConnectorUpdated)
    return Web3ConnectionFactory.currentWeb3Engine;
  }

  public doNetworkConnect = async () => {
    await this._isMounted && !this.state.isProviderMenuModalOpen && this.setState({ ...this.state, isProviderMenuModalOpen: true });
  };


  public onProviderChanged = async (event: ProviderChangedEvent) => {
    await this._isMounted && this.setState({
      ...this.state,
      selectedProviderType: event.providerType,
      isLoading: false,
      web3: event.web3
    });
  };
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
            onProviderMenuClose={this.onRequestClose}
          />
        </Modal>
        {isMainnetProd ? (
          <Intercom appID="dfk4n5ut" />
        ) : null}
        <Router>
          <LocationListener doNetworkConnect={this.doNetworkConnect}>
            <Switch>
              <Route exact={true} path="/">
                <DashboardPage isMobileMedia={this.state.isMobileMedia} doNetworkConnect={this.doNetworkConnect} />
              </Route>
              {/* <Route path="/transactions">
                <TransactionsPage isMobileMedia={this.state.isMobileMedia} doNetworkConnect={this.doNetworkConnect} />
              </Route> */}
            </Switch>
          </LocationListener>
        </Router>
        <Footer />
      </Web3ReactProvider >
    );
  }
}
