import { Web3Wrapper } from '@0x/web3-wrapper';
import React, { Component } from "react";
import Modal from "react-modal";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { ProviderType } from "../domain/ProviderType";
import { LandingPage } from "../pages/LandingPage";
import { LendPage } from "../pages/LendPage";
import { StatsPage } from "../pages/StatsPage";
import { TradePage } from "../pages/TradePage";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { ProgressFragment } from "./ProgressFragment";
import { ProviderMenu } from "./ProviderMenu";

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
      selectedProviderType: FulcrumProvider.Instance.providerType,
      web3: FulcrumProvider.Instance.web3Wrapper
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
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
              ProviderType.WalletConnect,
              ProviderType.None
            ]}
            onSelect={this.onProviderTypeSelect}
          />
        </Modal>
        <ProgressFragment />
        <div className="pages-container">
          <HashRouter hashType="slash">
            <Switch>
              <Route exact={true} path="/" render={() => <LandingPage />} />
              <Route exact={true} path="/lend" render={() => <LendPage isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} />} />
              <Route exact={true} path="/trade" render={() => <TradePage isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} />} />
              <Route exact={true} path="/stats" render={() => <StatsPage isLoading={this.state.isLoading} doNetworkConnect={this.doNetworkConnect} />} />
              <Route path="*" render={() => <Redirect to="/"/> } />
            </Switch>
          </HashRouter>
        </div>
      </React.Fragment>
    );
  }

  public doNetworkConnect = () => {
    this.setState({ ...this.state, isProviderMenuModalOpen: true });
  };

  public onProviderTypeSelect = async (providerType: ProviderType) => {
    if (providerType !== FulcrumProvider.Instance.providerType) {
      FulcrumProvider.Instance.isLoading = true;
 
      await this.setState({
        ...this.state,
        isLoading: true,
        isProviderMenuModalOpen: false
      });
 
      await FulcrumProvider.Instance.setWeb3Provider(providerType);

      FulcrumProvider.Instance.isLoading = false;

      await FulcrumProvider.Instance.eventEmitter.emit(
        FulcrumProviderEvents.ProviderChanged,
        new ProviderChangedEvent(FulcrumProvider.Instance.providerType, FulcrumProvider.Instance.web3Wrapper)
      );
    } else {
      await this.setState({
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
