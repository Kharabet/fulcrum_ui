import { Web3Wrapper } from '@0x/web3-wrapper';
import { Web3ReactProvider } from "@web3-react/core";
import { AbstractConnector } from '@web3-react/abstract-connector';
import { Web3ProviderEngine } from "@0x/subproviders";
import { Web3ConnectionFactory } from '../domain/Web3ConnectionFactory';
import { StakingProvider } from "../services/StakingProvider";
import { StakingProviderEvents } from "../services/events/StakingProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import Modal from "react-modal";

import Intercom from "react-intercom";
import { ProviderMenu } from "./ProviderMenu";
import { FindRepresentative } from "./FindRepresentative";


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
  isFindRepresentativeOpen: boolean;
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
      isFindRepresentativeOpen: false,
      isLoading: false,
      selectedProviderType: StakingProvider.Instance.providerType,
      web3: StakingProvider.Instance.web3Wrapper,
      isMobileMedia: false,
    };
    StakingProvider.Instance.eventEmitter.on(StakingProviderEvents.ProviderChanged, this.onProviderChanged);
  }
  public async onConnectorUpdated(update: ConnectorUpdate) {
    console.log("onConnectorUpdated")
    await StakingProvider.Instance.eventEmitter.emit(StakingProviderEvents.ProviderIsChanging);

    await Web3ConnectionFactory.updateConnector(update);
    await StakingProvider.Instance.setWeb3ProviderFinalize(StakingProvider.Instance.providerType)
    await StakingProvider.Instance.eventEmitter.emit(
      StakingProviderEvents.ProviderChanged,
      new ProviderChangedEvent(StakingProvider.Instance.providerType, StakingProvider.Instance.web3Wrapper)
    );
  }

  public onDeactivate = async () => {

    StakingProvider.Instance.isLoading = true;

    await StakingProvider.Instance.eventEmitter.emit(StakingProviderEvents.ProviderIsChanging);

    await this._isMounted && this.setState({
      ...this.state,
      isProviderMenuModalOpen: false
    });
    await StakingProvider.Instance.setReadonlyWeb3Provider();

    StakingProvider.Instance.isLoading = false;
    await StakingProvider.Instance.eventEmitter.emit(
      StakingProviderEvents.ProviderChanged,
      new ProviderChangedEvent(StakingProvider.Instance.providerType, StakingProvider.Instance.web3Wrapper)
    );
  }

  public onProviderTypeSelect = async (connector: AbstractConnector, account?: string) => {
    if (!this.state.isLoading) {
      StakingProvider.Instance.isLoading = true;

      await StakingProvider.Instance.eventEmitter.emit(StakingProviderEvents.ProviderIsChanging);

      await this._isMounted && this.setState({
        ...this.state,
        isLoading: true,
        isProviderMenuModalOpen: false
      }, async () => {
        await StakingProvider.Instance.setWeb3Provider(connector, account);

        StakingProvider.Instance.isLoading = false;

        await StakingProvider.Instance.eventEmitter.emit(
          StakingProviderEvents.ProviderChanged,
          new ProviderChangedEvent(StakingProvider.Instance.providerType, StakingProvider.Instance.web3Wrapper)
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
    await this._isMounted && this.setState({
      ...this.state,
      isProviderMenuModalOpen: false,
      isFindRepresentativeOpen: false
    });
  };
  public componentWillUnmount(): void {
    this._isMounted = false;
    StakingProvider.Instance.eventEmitter.removeListener(StakingProviderEvents.ProviderChanged, this.onProviderChanged);
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

  public openFindRepresentative = () => {
    this._isMounted && !this.state.isFindRepresentativeOpen && this.setState({ ...this.state, isFindRepresentativeOpen: true });
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
        <Modal
          isOpen={this.state.isFindRepresentativeOpen}
          onRequestClose={this.onRequestClose}
          className="modal-content-div"
          overlayClassName="modal-overlay-div"
        >
          <FindRepresentative
            onFindRepresentativeClose={this.onRequestClose}
          />
        </Modal>
        {isMainnetProd ? (
          <Intercom appID="dfk4n5ut" />
        ) : null}
        <Router>
          <LocationListener doNetworkConnect={this.doNetworkConnect}>
            <Switch>
              <Route exact={true} path="/">
                <DashboardPage isMobileMedia={this.state.isMobileMedia} doNetworkConnect={this.doNetworkConnect} openFindRepresentative={this.openFindRepresentative}/>
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
