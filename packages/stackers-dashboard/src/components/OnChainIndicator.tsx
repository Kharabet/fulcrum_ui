import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderTypeDetails } from "../domain/ProviderTypeDetails";
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { StackerProviderEvents } from "../services/events/StackerProviderEvents";
import { StackerProvider } from "../services/StackerProvider";

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

    StackerProvider.Instance.eventEmitter.on(StackerProviderEvents.ProviderIsChanging, this.onProviderIsChanging);
    StackerProvider.Instance.eventEmitter.on(StackerProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private onProviderIsChanging = async () => {
    this.setState({
      ...this.state,
      isLoading: true
    });
  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    this.setState({
      ...this.state,
      isLoading: true
    });
    await this.derivedUpdate();
  };

  public async componentDidMount() {
    await this.derivedUpdate();
  }

  public componentWillUnmount(): void {
    StackerProvider.Instance.eventEmitter.removeListener(StackerProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  private async derivedUpdate() {
    const accountText = StackerProvider.Instance.accounts.length > 0 && StackerProvider.Instance.accounts[0]
      ? StackerProvider.Instance.accounts[0].toLowerCase()
      : "";

    let providerTypeDetails = null;
    if (accountText && StackerProvider.Instance.providerType !== ProviderType.None) {
      providerTypeDetails = ProviderTypeDictionary.providerTypes.get(StackerProvider.Instance.providerType);
    }

    const isLoading = StackerProvider.Instance.isLoading;
    const isSupportedNetwork = !StackerProvider.Instance.unsupportedNetwork;
    const etherscanURL = StackerProvider.Instance.web3ProviderSettings
      ? StackerProvider.Instance.web3ProviderSettings.etherscanURL
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
    if (StackerProvider.Instance.unsupportedNetwork) {
      walletAddressText = "Wrong Network!";
    } else if (accountText) {
      walletAddressText = `${accountText.slice(0, 6)}...${accountText.slice(
        accountText.length - 4,
        accountText.length
      )}`;
    } else {
      walletAddressText = "";
    }

    return (
      <div className={`on-chain-indicator ${providerTypeDetails !== null ? `connect` : 'disconnect'}`}>
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
          <span className="on-chain-indicator__provider-txt">
            Loading Wallet...
          </span>
        </React.Fragment>
      );
    } else {
      if (providerTypeDetails !== null && providerTypeDetails.reactLogoSvgShort !== null) {
        return (
          <React.Fragment>
            <div className="on-chain-indicator__svg">{providerTypeDetails.reactLogoSvgShort.render()}</div>
            <div className="on-chain-indicator__description">
              <span>{providerTypeDetails.displayName}</span>
              {walletAddressText
                ? isSupportedNetwork && accountText && etherscanURL
                  ? <a
                    className="on-chain-indicator__wallet-address"
                    href={`${etherscanURL}address/${accountText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={event => event.stopPropagation()}
                  >
                    {walletAddressText}
                  </a>
                  : <span className="on-chain-indicator__wallet-address">
                    {walletAddressText}
                  </span>
                : ``
              }
            </div>

          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <span className="on-chain-indicator__provider-txt">
              Click To Connect Wallet
            </span>
            {StackerProvider.Instance.unsupportedNetwork
              ? <span className="on-chain-indicator__wallet-address">
                {walletAddressText}
              </span>
              : ``
            }
          </React.Fragment>
        );
      }
    }
  }
}
