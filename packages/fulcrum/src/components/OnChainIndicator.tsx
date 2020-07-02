import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderTypeDetails } from "../domain/ProviderTypeDetails";
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

export interface IOnChainIndicatorProps {
  doNetworkConnect: () => void;
}

interface IOnChainIndicatorState {
  isLoading: boolean;
  isSupportedNetwork: boolean;
  etherscanURL: string;
  accountText: string;
  providerTypeDetails: ProviderTypeDetails | null;
}

export class OnChainIndicator extends Component<IOnChainIndicatorProps, IOnChainIndicatorState> {
  constructor(props: IOnChainIndicatorProps) {
    super(props);

    this.state = {
      isLoading: false,
      isSupportedNetwork: true,
      etherscanURL: "",
      accountText: "",
      providerTypeDetails: null
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderIsChanging, this.onProviderIsChanging);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private onProviderIsChanging = async () => {
    await this.derivedUpdate();
  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  public async componentDidMount() {
    await this.derivedUpdate();
  }

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderIsChanging, this.onProviderIsChanging);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private async derivedUpdate() {
    const accountText =
      FulcrumProvider.Instance.accounts.length > 0 && FulcrumProvider.Instance.accounts[0]
        ? FulcrumProvider.Instance.accounts[0].toLowerCase()
        : "";

    let providerTypeDetails = null;
    if (accountText && FulcrumProvider.Instance.providerType !== ProviderType.None) {
      providerTypeDetails = ProviderTypeDictionary.providerTypes.get(FulcrumProvider.Instance.providerType);
    }

    const isLoading = FulcrumProvider.Instance.isLoading;
    const isSupportedNetwork = !FulcrumProvider.Instance.unsupportedNetwork;
    const etherscanURL = FulcrumProvider.Instance.web3ProviderSettings
      ? FulcrumProvider.Instance.web3ProviderSettings.etherscanURL
      : "";

    this.setState({
      ...this.state,
      isLoading,
      isSupportedNetwork,
      etherscanURL,
      accountText,
      providerTypeDetails: providerTypeDetails || null
    });
  }

  public render() {
    const {
      isLoading,
      isSupportedNetwork,
      etherscanURL,
      providerTypeDetails,
      accountText } = this.state;

    let walletAddressText: string;
    if (FulcrumProvider.Instance.unsupportedNetwork) {
      walletAddressText = "Wrong Network!";
    } else if (accountText) {
      walletAddressText = `${accountText.slice(0, 6)}...${accountText.slice(
        accountText.length - 4,
        accountText.length
      )}`;
    } else {
      walletAddressText = ""; // "...";
    }

    return (
      <div className="on-chain-indicator">
        <button className="on-chain-indicator__container" onClick={this.props.doNetworkConnect}>
          {this.renderProviderDisplay(
            isLoading,
            isSupportedNetwork,
            etherscanURL,
            providerTypeDetails,
            accountText,
            walletAddressText
          )}
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
    walletAddressText: string
  ) {
    if (isLoading) {
      return (
        <React.Fragment>
          <span className="on-chain-indicator__provider-txt" >
            Loading Wallet...
          </span>
          {/*<span className="on-chain-indicator__wallet-address" onClick={this.props.doNetworkConnect}>
            ...
          </span>*/}
        </React.Fragment>
      );
    } else {
      if (providerTypeDetails !== null && providerTypeDetails.logoSvg !== null) {
        return (
          <React.Fragment>
            <div className="on-chain-indicator__svg">{providerTypeDetails.reactLogoSvgShort.render()}</div>
            <div className="on-chain-indicator__description">
              <span>{providerTypeDetails.displayName}</span>
            {walletAddressText ? (
              isSupportedNetwork && accountText && etherscanURL ? (
                <a
                  className="on-chain-indicator__wallet-address"
                  href={`${etherscanURL}address/${accountText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={event => event.stopPropagation()}
                >
                  {walletAddressText}
                </a>
              ) : (
                <span className="on-chain-indicator__wallet-address">
                  {walletAddressText}
                </span>
              )
            ) : (
              ``
            )}
            </div>

          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <span className="on-chain-indicator__provider-txt">
              Click To Connect Wallet
            </span>
            {FulcrumProvider.Instance.unsupportedNetwork ? (
              <span className="on-chain-indicator__wallet-address">
                {walletAddressText}
              </span>
            ) : ``}
          </React.Fragment>
        );
      }
    }
  }
}
