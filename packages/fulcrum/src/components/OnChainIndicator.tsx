// import styled from "styled-components";
import { Web3Wrapper } from '@0x/web3-wrapper';
import React, { Component } from "react";
import { IWeb3ProviderSettings } from "../domain/IWeb3ProviderSettings";
import { ProviderType } from "../domain/ProviderType";
import { ProviderTypeDetails } from "../domain/ProviderTypeDetails";
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";
// import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
// import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

export interface IOnChainIndicatorProps {
  doNetworkConnect: () => void;
  isLoading: boolean | false;
}

interface IOnChainIndicatorState {
  selectedProviderType: ProviderType;
  web3: Web3Wrapper| null;
  walletAddress: string | null;
  providerSettings: IWeb3ProviderSettings | null;
}

export class OnChainIndicator extends Component<IOnChainIndicatorProps, IOnChainIndicatorState> {
  constructor(props: IOnChainIndicatorProps) {
    super(props);

    this.state = {
      selectedProviderType: FulcrumProvider.Instance.providerType,
      web3: FulcrumProvider.Instance.web3Wrapper,
      walletAddress: null,
      providerSettings: null
    };

    // FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  /*private async derivedUpdate() {
  }*/

  /*private onProviderChanged = async (event: ProviderChangedEvent) => {
    if (event.providerType !== FulcrumProvider.Instance.providerType) {
      this.derivedUpdate();
      console.log(`onProviderChanged`, event);
    }
  };

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  public async componentDidMount() {
    this.derivedUpdate();
  }*/

  public render() {
    const providerTypeDetails = FulcrumProvider.Instance.providerType !== ProviderType.None ? 
    ProviderTypeDictionary.providerTypes.get(FulcrumProvider.Instance.providerType) || null : null;

    const account = FulcrumProvider.Instance.accounts.length > 0 ? FulcrumProvider.Instance.accounts[0].toLowerCase() : null;

    let walletAddressText: string;
    if (account) {
        walletAddressText = `${account.slice(0, 6)}...${account.slice(
          account.length - 4,
          account.length
        )}`;
    } else {
      if (FulcrumProvider.Instance.providerType !== ProviderType.None
        && FulcrumProvider.Instance.contractsSource
        && !FulcrumProvider.Instance.contractsSource.canWrite) {
          walletAddressText = "Wrong Network!";
      } else {
        walletAddressText = "...";
      }
    }

    return (
      <div className="on-chain-indicator">
        <button className="on-chain-indicator__container">
          {this.renderProviderType(providerTypeDetails,
            account && this.state.providerSettings ? (
              <a
                className="on-chain-indicator__wallet-address"
                href={`${this.state.providerSettings.etherscanURL}address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {walletAddressText}
              </a>
            ) : (
              <span className="on-chain-indicator__wallet-address" onClick={this.props.doNetworkConnect}>
                {walletAddressText}
              </span>
            )
          )}
        </button>
      </div>
    );
  }

  public renderProviderType(providerTypeDetails: ProviderTypeDetails | null, addressRender: JSX.Element) {
    if (FulcrumProvider.Instance.isLoading) {
      return (
        <React.Fragment>
          <span className="on-chain-indicator__provider-txt" onClick={this.props.doNetworkConnect}>
            Loading...
          </span>
          <span className="on-chain-indicator__wallet-address" onClick={this.props.doNetworkConnect}>
            ...
          </span>
        </React.Fragment>
      );
    } else {
      if (providerTypeDetails !== null && providerTypeDetails.logoSvg !== null) {
        return (
          <React.Fragment>
            <img
              className="on-chain-indicator__provider-img"
              src={providerTypeDetails.logoSvg}
              alt={providerTypeDetails.displayName}
              onClick={this.props.doNetworkConnect}
            />
            {addressRender}
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <span className="on-chain-indicator__provider-txt" onClick={this.props.doNetworkConnect}>
              Click To Connect
            </span>
            <span className="on-chain-indicator__wallet-address" onClick={this.props.doNetworkConnect}>
              ...
            </span>
          </React.Fragment>
        );
      }
    }
  }
}
