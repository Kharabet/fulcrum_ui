// import styled from "styled-components";
import React, { Component } from "react";
import Web3 from "web3";
import { IWeb3ProviderSettings } from "../domain/IWeb3ProviderSettings";
import { ProviderType } from "../domain/ProviderType";
import { ProviderTypeDetails } from "../domain/ProviderTypeDetails";
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

export interface IOnChainIndicatorProps {
  doNetworkConnect: () => void;
  isLoading: boolean | false;
}

interface IOnChainIndicatorState {
  selectedProviderType: ProviderType;
  web3: Web3 | null;
  walletAddress: string | null;
  providerSettings: IWeb3ProviderSettings | null;
}

export class OnChainIndicator extends Component<IOnChainIndicatorProps, IOnChainIndicatorState> {
  constructor(props: IOnChainIndicatorProps) {
    super(props);

    this.state = {
      selectedProviderType: FulcrumProvider.Instance.providerType,
      web3: FulcrumProvider.Instance.web3,
      walletAddress: null,
      providerSettings: null
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private async derivedUpdate() {
    if (FulcrumProvider.Instance.web3) {
      const accounts = await FulcrumProvider.Instance.web3.eth.getAccounts();
      const account = accounts ? accounts[0].toLowerCase() : null;
      const providerSettings = await FulcrumProvider.getWeb3ProviderSettings(FulcrumProvider.Instance.web3);
      this.setState({
        ...this.state,
        selectedProviderType: FulcrumProvider.Instance.providerType,
        web3: FulcrumProvider.Instance.web3,
        walletAddress: account,
        providerSettings: providerSettings
      });
    } else {
      this.setState({
        ...this.state,
        selectedProviderType: FulcrumProvider.Instance.providerType,
        web3: FulcrumProvider.Instance.web3,
        walletAddress: null,
        providerSettings: null
      });
    }
  }

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public async componentDidMount() {
    this.derivedUpdate();
  }

  public render() {
    const providerTypeDetails = ProviderTypeDictionary.providerTypes.get(this.state.selectedProviderType) || null;
    const walletAddressText = this.state.walletAddress
      ? `${this.state.walletAddress.slice(0, 6)}...${this.state.walletAddress.slice(
          this.state.walletAddress.length - 4,
          this.state.walletAddress.length
        )}`
      : "...";

    return (
      <div className="on-chain-indicator">
        <button className="on-chain-indicator__container">
          {this.renderProviderType(providerTypeDetails)}
          {this.state.walletAddress && this.state.providerSettings ? (
            <a
              className="on-chain-indicator__wallet-address"
              href={`${this.state.providerSettings.etherscanURL}address/${this.state.walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {walletAddressText}
            </a>
          ) : (
            <span className="on-chain-indicator__wallet-address" onClick={this.props.doNetworkConnect}>
              {walletAddressText}
            </span>
          )}
        </button>
      </div>
    );
  }

  public renderProviderType(providerTypeDetails: ProviderTypeDetails | null) {
    if (providerTypeDetails !== null && providerTypeDetails.logoSvg !== null) {
      return (
        <img
          className="on-chain-indicator__provider-img"
          src={providerTypeDetails.logoSvg}
          alt={providerTypeDetails.displayName}
          onClick={this.props.doNetworkConnect}
        />
      );
    }
    else {
      if (this.props.isLoading) {
        return (
          <span className="on-chain-indicator__provider-txt" onClick={this.props.doNetworkConnect}>
            Loading...
          </span>
        );
      } else {
        return (
          <span className="on-chain-indicator__provider-txt" onClick={this.props.doNetworkConnect}>
            Click To Connect
          </span>
        );
      }
    }
  }
}
