import React, { Component } from "react";
import Modal from "react-modal";
import { HashRouter, Route, Switch } from "react-router-dom";
import Web3 from "web3";
import { ProviderType } from "../domain/ProviderType";
import { Web3ConnectionFactory } from "../domain/Web3ConnectionFactory";
import { HomePage } from "../pages/HomePage";
import { LendPage } from "../pages/LendPage";
import { TradePage } from "../pages/TradePage";
import { ProviderMenu } from "./ProviderMenu";

interface IAppRootState {
  isTestModalOpen: boolean;
  selectedProviderType: ProviderType;
  web3: Web3 | null;
}

export class AppRoot extends Component<any, IAppRootState> {
  constructor(props: any) {
    super(props);

    this.state = { isTestModalOpen: false, selectedProviderType: ProviderType.None, web3: null };
  }

  public render() {
    return (
      <>
        <Modal
          isOpen={this.state.isTestModalOpen}
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
        <HashRouter>
          <Switch>
            <Route exact={true} path="/" component={HomePage} />
            <Route
              exact={true}
              path="/lend"
              render={props => <LendPage web3={this.state.web3} onNetworkConnect={this.onNetworkConnect} />}
            />
            <Route
              exact={true}
              path="/trade"
              render={props => <TradePage web3={this.state.web3} onNetworkConnect={this.onNetworkConnect} />}
            />
          </Switch>
        </HashRouter>
      </>
    );
  }

  public onRequestClose = () => {
    this.setState({ isTestModalOpen: false });
  };

  public onNetworkConnect = () => {
    this.setState({ ...this.state, isTestModalOpen: true });
  };

  public onProviderTypeSelect = async (providerType: ProviderType) => {
    const web3 = await Web3ConnectionFactory.getWeb3Connection(providerType);
    this.setState({
      ...this.state,
      selectedProviderType: web3 ? providerType : ProviderType.None,
      isTestModalOpen: false,
      web3: web3
    });
  };
}
