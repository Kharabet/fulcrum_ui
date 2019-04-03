import React, { Component } from "react";
import Web3 from "web3";
import { ProviderType } from "../domain/ProviderType";
import { ProviderTypeDetails } from "../domain/ProviderTypeDetails";
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import FulcrumProvider from "../services/FulcrumProvider";
import { FulcrumProviderEvents } from "../services/FulcrumProviderEvents";

export interface IOnChainIndicatorProps {
  doNetworkConnect: () => void;
}

interface IOnChainIndicatorState {
  selectedProviderType: ProviderType;
  web3: Web3 | null;
  walletAddress: string | null;
}

export class OnChainIndicator extends Component<IOnChainIndicatorProps, IOnChainIndicatorState> {
  constructor(props: IOnChainIndicatorProps) {
    super(props);

    this.state = {
      selectedProviderType: FulcrumProvider.providerType,
      web3: FulcrumProvider.web3,
      walletAddress: null
    };

    FulcrumProvider.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public componentDidMount(): void {
    if (FulcrumProvider.web3) {
      FulcrumProvider.web3.eth.getAccounts().then(accounts => {
        const account = accounts ? accounts[0] : null;
        this.setState({
          selectedProviderType: FulcrumProvider.providerType,
          web3: FulcrumProvider.web3,
          walletAddress: account
        });
      });
    }
  }

  public static async getDerivedStateFromProps(
    props: Readonly<IOnChainIndicatorProps>,
    state: Readonly<IOnChainIndicatorState>
  ) {
    if (FulcrumProvider.web3) {
      const accounts = await FulcrumProvider.web3.eth.getAccounts();
      const account = accounts ? accounts[0] : null;
      return {
        selectedProviderType: FulcrumProvider.providerType,
        web3: FulcrumProvider.web3,
        walletAddress: account
      };
    }

    return null;
  }

  public render() {
    const providerTypeDetails = ProviderTypeDictionary.providerTypes.get(this.state.selectedProviderType) || null;
    const walletAddressText = this.state.walletAddress
      ? `${this.state.walletAddress.slice(1, 6)}...${this.state.walletAddress.slice(
          this.state.walletAddress.length - 4,
          this.state.walletAddress.length
        )}`
      : "...";

    return (
      <div className="on-chain-indicator" onClick={this.props.doNetworkConnect}>
        <button className="on-chain-indicator__container">
          {this.renderProviderType(providerTypeDetails)}
          <span className="on-chain-indicator__wallet-address">{walletAddressText}</span>
        </button>
      </div>
    );
  }

  public renderProviderType(providerTypeDetails: ProviderTypeDetails | null) {
    return providerTypeDetails !== null && providerTypeDetails.logoSvg !== null ? (
      <img
        className="on-chain-indicator__provider-img"
        src={providerTypeDetails.logoSvg}
        alt={providerTypeDetails.displayName}
      />
    ) : (
      <span className="on-chain-indicator__provider-txt">None</span>
    );
  }

  public onProviderChanged = async (event: ProviderChangedEvent) => {
    const accounts = event.web3 ? await event.web3.eth.getAccounts() : null;
    const account = accounts ? accounts[0] : null;
    this.setState({
      ...this.state,
      selectedProviderType: event.providerType,
      web3: event.web3,
      walletAddress: account
    });
  };
}
