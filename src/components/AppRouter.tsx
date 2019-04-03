import React, { Component } from "react";
import Modal from "react-modal";
import { HashRouter, Route, Switch } from "react-router-dom";
import Web3 from "web3";
import { ProviderType } from "../domain/ProviderType";
import { LandingPage } from "../pages/LandingPage";
import { LendPage } from "../pages/LendPage";
import { TradePage } from "../pages/TradePage";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import FulcrumProvider from "../services/FulcrumProvider";
import { FulcrumProviderEvents } from "../services/FulcrumProviderEvents";
import { ProgressFragment } from "./ProgressFragment";
import { ProviderMenu } from "./ProviderMenu";

interface IAppRouterState {
  isProviderMenuModalOpen: boolean;
  selectedProviderType: ProviderType;
  web3: Web3 | null;
}

export class AppRouter extends Component<any, IAppRouterState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isProviderMenuModalOpen: false,
      selectedProviderType: ProviderType.None,
      web3: FulcrumProvider.web3
    };

    FulcrumProvider.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
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
            providerTypes={[ProviderType.MetaMask, ProviderType.Fortmatic, ProviderType.Portis, ProviderType.None]}
            onSelect={this.onProviderTypeSelect}
          />
        </Modal>
        <ProgressFragment />
        <HashRouter>
          <Switch>
            <Route exact={true} path="/" render={() => <LandingPage />} />
            <Route exact={true} path="/lend" render={() => <LendPage doNetworkConnect={this.doNetworkConnect} />} />
            <Route exact={true} path="/trade" render={() => <TradePage doNetworkConnect={this.doNetworkConnect} />} />
          </Switch>
        </HashRouter>
      </React.Fragment>
    );
  }

  public doNetworkConnect = () => {
    this.setState({ ...this.state, isProviderMenuModalOpen: true });
  };

  public onProviderTypeSelect = async (providerType: ProviderType) => {
    await FulcrumProvider.setWeb3Provider(providerType);

    this.setState({
      ...this.state,
      isProviderMenuModalOpen: false
    });
  };

  public onRequestClose = () => {
    this.setState({ ...this.state, isProviderMenuModalOpen: false });
  };

  public onProviderChanged = async (event: ProviderChangedEvent) => {
    this.setState({
      ...this.state,
      selectedProviderType: event.providerType,
      web3: event.web3
    });
  };
}
