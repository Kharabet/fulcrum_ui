import React, { Component } from "react";
import Modal from "react-modal";
import Web3 from "web3";
import { ProviderType } from "../domain/ProviderType";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import FulcrumProvider from "../services/FulcrumProvider";
import { FulcrumProviderEvents } from "../services/FulcrumProviderEvents";
import { ProviderMenu } from "./ProviderMenu";

interface IOnChainIndicatorState {
  isProviderMenuModalOpen: boolean;
  selectedProviderType: ProviderType;
  web3: Web3 | null;
}

export class OnChainIndicator extends Component<any, IOnChainIndicatorState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isProviderMenuModalOpen: false,
      selectedProviderType: FulcrumProvider.providerType,
      web3: FulcrumProvider.web3
    };

    FulcrumProvider.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public render() {
    const dotStyle = this.state.web3 ? "on-chain-indicator__dot--online" : "on-chain-indicator__dot--offline";
    const indicatorText = this.state.web3 ? "Online" : "Connect wallet";

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

        <div className="on-chain-indicator" onClick={this.onNetworkConnect}>
          <button className="on-chain-indicator__container">
            <span className="on-chain-indicator__title">
              <span className={`on-chain-indicator__dot ${dotStyle}`}>&#x25CF;</span>
              {indicatorText}
            </span>
          </button>
        </div>
      </React.Fragment>
    );
  }

  public onRequestClose = () => {
    this.setState({ ...this.state, isProviderMenuModalOpen: false });
  };

  public onNetworkConnect = () => {
    this.setState({ ...this.state, isProviderMenuModalOpen: true });
  };

  public onProviderTypeSelect = async (providerType: ProviderType) => {
    await FulcrumProvider.setWeb3Provider(providerType);

    this.setState({
      ...this.state,
      isProviderMenuModalOpen: false
    });
  };

  public onProviderChanged = (event: ProviderChangedEvent) => {
    this.setState({
      ...this.state,
      web3: event.web3
    });
  };
}
