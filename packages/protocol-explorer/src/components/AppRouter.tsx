import { Web3Wrapper } from '@0x/web3-wrapper';
import React, { Component } from "react";
import { MainPage } from '../pages/MainPage';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { Router, Switch, Route, } from "react-router-dom";
import configProviders from "../config/providers.json";
import { ProviderType } from "../domain/ProviderType";
import { StatsPage } from "../pages/StatsPage";
import { LiquidationsPage } from "../pages/LiquidationsPage";
import { SearchResultPage } from "../pages/SearchResultPage";
import { NavService } from '../services/NavService';

import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { ExplorerProviderEvents } from "../services/events/ExplorerProviderEvents";
import { ExplorerProvider } from "../services/ExplorerProvider";
import Modal from "react-modal";


import { ProviderMenu } from "./ProviderMenu";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3ProviderEngine } from "@0x/subproviders";
import { Web3ConnectionFactory } from '../domain/Web3ConnectionFactory';
import ProviderTypeDictionary from '../domain/ProviderTypeDictionary';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { errors } from "ethers"
import { ConnectorEvent, ConnectorUpdate } from '@web3-react/types';

const isMainnetProd =
  process.env.NODE_ENV && process.env.NODE_ENV !== "development"
  && process.env.REACT_APP_ETH_NETWORK === "mainnet";

interface IAppRouterState {
  isProviderMenuModalOpen: boolean;
  selectedProviderType: ProviderType;
  isLoading: boolean;
  web3: Web3Wrapper | null;
  isMobileMedia: boolean;
}

export class AppRouter extends Component<any, IAppRouterState>  {
  private _isMounted: boolean = false;
  constructor(props: any) {
    super(props);

    this.state = {
      isProviderMenuModalOpen: false,
      isLoading: false,
      selectedProviderType: ExplorerProvider.Instance.providerType,
      web3: ExplorerProvider.Instance.web3Wrapper,
      isMobileMedia: false,
    };

    ExplorerProvider.Instance.eventEmitter.on(ExplorerProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentWillUnmount(): void {
    this._isMounted = false;
    ExplorerProvider.Instance.eventEmitter.removeListener(ExplorerProviderEvents.ProviderChanged, this.onProviderChanged);
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
    if (!connector.listeners(ConnectorEvent.Update).includes(this.onConnectorUpdated))
      connector.on(ConnectorEvent.Update, this.onConnectorUpdated)
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
            onProviderMenuClose={this.onRequestClose}
          />
        </Modal>

        <div className="pages-container flex jc-c">
          <div className="flex fd-c ac-c w-100">
            <Router history={NavService.Instance.History}>
              <Switch>
                <Route exact={true} path="/">
                  <MainPage isMobileMedia={this.state.isMobileMedia} doNetworkConnect={this.doNetworkConnect} />
                </Route>
                <Route path="/stats/:token" render={(props) => <StatsPage {...props} isMobileMedia={this.state.isMobileMedia} doNetworkConnect={this.doNetworkConnect} />} />
                <Route path="/search/:filter" render={(props) => <SearchResultPage {...props} isMobileMedia={this.state.isMobileMedia} doNetworkConnect={this.doNetworkConnect} />} />
                <Route path="/liquidations">
                  <LiquidationsPage isMobileMedia={this.state.isMobileMedia} doNetworkConnect={this.doNetworkConnect} />
                </Route>
              </Switch>
            </Router>
            <Footer />
          </div>
        </div>
      </Web3ReactProvider>
    );
  }

  private didResize = async () => {
    const isMobileMedia = (window.innerWidth <= 991);
    if (isMobileMedia !== this.state.isMobileMedia) {
      await this._isMounted && this.setState({ isMobileMedia });
    }
  }

  public doNetworkConnect = async () => {
    await this._isMounted && !this.state.isProviderMenuModalOpen && this.setState({ ...this.state, isProviderMenuModalOpen: true });
  };
  public async onConnectorUpdated(update: ConnectorUpdate) {
    console.log("onConnectorUpdated")
    await ExplorerProvider.Instance.eventEmitter.emit(ExplorerProviderEvents.ProviderIsChanging);

    await Web3ConnectionFactory.updateConnector(update);
    await ExplorerProvider.Instance.setWeb3ProviderFinalize(ExplorerProvider.Instance.providerType)
    await ExplorerProvider.Instance.eventEmitter.emit(
      ExplorerProviderEvents.ProviderChanged,
      new ProviderChangedEvent(ExplorerProvider.Instance.providerType, ExplorerProvider.Instance.web3Wrapper)
    );
  }

  public onDeactivate = async () => {

    ExplorerProvider.Instance.isLoading = true;

    await ExplorerProvider.Instance.eventEmitter.emit(ExplorerProviderEvents.ProviderIsChanging);

    await this._isMounted && this.setState({
      ...this.state,
      isProviderMenuModalOpen: false
    });
    await ExplorerProvider.Instance.setReadonlyWeb3Provider();

    ExplorerProvider.Instance.isLoading = false;
    await ExplorerProvider.Instance.eventEmitter.emit(
      ExplorerProviderEvents.ProviderChanged,
      new ProviderChangedEvent(ExplorerProvider.Instance.providerType, ExplorerProvider.Instance.web3Wrapper)
    );
  }

  public onProviderTypeSelect = async (connector: AbstractConnector, account?: string) => {
    if (!this.state.isLoading) {
      ExplorerProvider.Instance.isLoading = true;

      await ExplorerProvider.Instance.eventEmitter.emit(ExplorerProviderEvents.ProviderIsChanging);

      await this._isMounted && this.setState({
        ...this.state,
        isLoading: true,
        isProviderMenuModalOpen: false
      }, async () => {
        await ExplorerProvider.Instance.setWeb3Provider(connector, account);

        ExplorerProvider.Instance.isLoading = false;

        await ExplorerProvider.Instance.eventEmitter.emit(
          ExplorerProviderEvents.ProviderChanged,
          new ProviderChangedEvent(ExplorerProvider.Instance.providerType, ExplorerProvider.Instance.web3Wrapper)
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
    await this.checkGasTokenAllowance();
    await this._isMounted && this.setState({
      ...this.state,
      selectedProviderType: event.providerType,
      isLoading: false,
      web3: event.web3
    });
  };

  private checkGasTokenAllowance = async () => {
    const gasTokenAllowance = await ExplorerProvider.Instance.getGasTokenAllowance();
    localStorage.setItem('isGasTokenEnabled', gasTokenAllowance.gt(0) ? 'true' : 'false')
  }
}
