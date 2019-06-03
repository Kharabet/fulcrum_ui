import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderTypeDetails } from "../domain/ProviderTypeDetails";
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";
import { FulcrumProvider } from "../services/FulcrumProvider";

export interface IOnChainIndicatorProps {
  doNetworkConnect: () => void;
}

interface IOnChainIndicatorState {
}

export class OnChainIndicator extends Component<IOnChainIndicatorProps, IOnChainIndicatorState> {
  constructor(props: IOnChainIndicatorProps) {
    super(props);
  }

  public render() {
    const providerTypeDetails = FulcrumProvider.Instance.providerType !== ProviderType.None ? 
      ProviderTypeDictionary.providerTypes.get(FulcrumProvider.Instance.providerType) || null :
      null;

    const accountText = FulcrumProvider.Instance.accounts.length > 0 && FulcrumProvider.Instance.accounts[0] ? 
      FulcrumProvider.Instance.accounts[0].toLowerCase() :
      null;

    let walletAddressText: string;
    if (FulcrumProvider.Instance.unsupportedNetwork) {
      walletAddressText = "Wrong Network!";
    } else if (accountText) {
        walletAddressText = `${accountText.slice(0, 6)}...${accountText.slice(
          accountText.length - 4,
          accountText.length
        )}`;
    } else {
      walletAddressText = "...";
    }

    const isLoading = FulcrumProvider.Instance.isLoading;
    const isSupportedNetwork = !FulcrumProvider.Instance.unsupportedNetwork;
    const etherscanURL = FulcrumProvider.Instance.web3ProviderSettings? FulcrumProvider.Instance.web3ProviderSettings.etherscanURL : null;

    return (
      <div className="on-chain-indicator">
        <button className="on-chain-indicator__container">
          {this.renderProviderDisplay(
            isLoading,
            isSupportedNetwork,
            etherscanURL,
            providerTypeDetails,
            accountText,
            walletAddressText)}
        </button>
      </div>
    );
  }

  public renderProviderDisplay(
    isLoading: boolean,
    isSupportedNetwork: boolean,
    etherscanURL: string | null,
    providerTypeDetails: ProviderTypeDetails | null,
    accountText: string | null,
    walletAddressText: string) {
    if (isLoading) {
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
            {isSupportedNetwork && accountText && etherscanURL ? (
              <a
                className="on-chain-indicator__wallet-address"
                href={`${etherscanURL}address/${accountText}`}
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
