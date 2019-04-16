//import styled from "styled-components";
import React, { Component } from "react";
import Web3 from "web3";
import { ProviderType } from "../domain/ProviderType";
import { ProviderTypeDetails } from "../domain/ProviderTypeDetails";
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import FulcrumProvider from "../services/FulcrumProvider";

export interface IOnChainIndicatorProps {
  doNetworkConnect: () => void;
}

interface IOnChainIndicatorState {
  selectedProviderType: ProviderType;
  web3: Web3 | null;
  walletAddress: string | null;
  networkId: number | null;
  networkName: string | null;
  etherscanURL: string | null;
}

export class OnChainIndicator extends Component<IOnChainIndicatorProps, IOnChainIndicatorState> {
  constructor(props: IOnChainIndicatorProps) {
    super(props);

    this.state = {
      selectedProviderType: FulcrumProvider.providerType,
      web3: FulcrumProvider.web3,
      walletAddress: null,
      networkId: null,
      networkName: null,
      etherscanURL: null
    };

    FulcrumProvider.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public async componentDidMount() {
    if (FulcrumProvider.web3) {
      
      const accounts = await FulcrumProvider.web3.eth.getAccounts();
      const account = accounts ? accounts[0] : null;
      let providerSettings = await OnChainIndicator.getProviderSettings(FulcrumProvider.web3);
      this.setState({
        selectedProviderType: FulcrumProvider.providerType,
        web3: FulcrumProvider.web3,
        walletAddress: account,
        networkId: providerSettings.networkId,
        networkName: providerSettings.networkName,
        etherscanURL: providerSettings.etherscanURL
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
      let providerSettings = await OnChainIndicator.getProviderSettings(FulcrumProvider.web3);
      return {
        selectedProviderType: FulcrumProvider.providerType,
        web3: FulcrumProvider.web3,
        walletAddress: account,
        networkId: providerSettings.networkId,
        networkName: providerSettings.networkName,
        etherscanURL: providerSettings.etherscanURL
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
      <div className="on-chain-indicator">
        <button className="on-chain-indicator__container">
          {this.renderProviderType(providerTypeDetails)}
          {this.state.walletAddress ? (
            <a className="on-chain-indicator__wallet-address"
            href={`${this.state.etherscanURL}address/${this.state.walletAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            >
              {walletAddressText}
            </a>
          ) : (
            <span className="on-chain-indicator__wallet-address"
              onClick={this.props.doNetworkConnect}
            >
              {walletAddressText}
            </span>
          )}
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
        onClick={this.props.doNetworkConnect}
      />
    ) : (
      <span 
        className="on-chain-indicator__provider-txt"
        onClick={this.props.doNetworkConnect}
      >
        Click To Connect
      </span>
    );
  }

  public static async getProviderSettings (web3: Web3 | null) {
    if (web3) {
      const networkId = await web3.eth.net.getId();
      let networkName, etherscanURL;
      switch (networkId) {
        case 1:
          networkName = "mainnet";
          etherscanURL = "https://etherscan.io/";
          break;
        case 3:
          networkName = "ropsten";
          etherscanURL = "https://ropsten.etherscan.io/";
          break;
        case 4:
          networkName = "rinkeby";
          etherscanURL = "https://rinkeby.etherscan.io/";
          break;
        case 42:
          networkName = "kovan";
          etherscanURL = "https://kovan.etherscan.io/";
          break;
        default:
          networkName = "local";
          etherscanURL = "";
          break;
      }
      return {
        networkId,
        networkName,
        etherscanURL
      };
    }

    return {
      networkId: null,
      networkName: null,
      etherscanURL: null
    };
  };

  public onProviderChanged = async (event: ProviderChangedEvent) => {
    const accounts = event.web3 ? await event.web3.eth.getAccounts() : null;
    const account = accounts ? accounts[0] : null;
    let providerSettings = await OnChainIndicator.getProviderSettings(event.web3);
    this.setState({
      ...this.state,
      selectedProviderType: event.providerType,
      web3: event.web3,
      walletAddress: account,
      networkId: providerSettings.networkId,
      networkName: providerSettings.networkName,
      etherscanURL: providerSettings.etherscanURL
    });
  };
}
