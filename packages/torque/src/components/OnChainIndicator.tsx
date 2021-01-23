import React, { Component } from 'react'
import { ProviderType } from '../domain/ProviderType'
import { ProviderTypeDetails } from '../domain/ProviderTypeDetails'
import { ProviderTypeDictionary } from '../domain/ProviderTypeDictionary'
import { ProviderChangedEvent } from '../services/events/ProviderChangedEvent'
import { TorqueProviderEvents } from '../services/events/TorqueProviderEvents'
import { TorqueProvider } from '../services/TorqueProvider'

export interface IOnChainIndicatorProps {
  doNetworkConnect: () => void
}

interface IOnChainIndicatorState {
  isLoading: boolean
  isSupportedNetwork: boolean
  etherscanURL: string
  accountText: string
  providerTypeDetails: ProviderTypeDetails | null
}

export class OnChainIndicator extends Component<IOnChainIndicatorProps, IOnChainIndicatorState> {
  constructor(props: IOnChainIndicatorProps) {
    super(props)

    this.state = {
      isLoading: false,
      isSupportedNetwork: true,
      etherscanURL: '',
      accountText: '',
      providerTypeDetails: null
    }

    TorqueProvider.Instance.eventEmitter.on(
      TorqueProviderEvents.ProviderIsChanging,
      this.onProviderIsChanging
    )
    TorqueProvider.Instance.eventEmitter.on(
      TorqueProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  private onProviderIsChanging = async () => {
    this.setState({
      ...this.state,
      isLoading: true
    })
  }

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    this.setState({
      ...this.state,
      isLoading: true
    })
    await this.derivedUpdate()
  }

  public async componentDidMount() {
    await this.derivedUpdate()
  }

  public componentWillUnmount(): void {
    // TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderIsChanging, this.onProviderIsChanging);
    TorqueProvider.Instance.eventEmitter.removeListener(
      TorqueProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  private async derivedUpdate() {
    const accountText =
      TorqueProvider.Instance.accounts.length > 0 && TorqueProvider.Instance.accounts[0]
        ? TorqueProvider.Instance.accounts[0].toLowerCase()
        : ''

    let providerTypeDetails = null
    if (accountText && TorqueProvider.Instance.providerType !== ProviderType.None) {
      providerTypeDetails = ProviderTypeDictionary.providerTypes.get(
        TorqueProvider.Instance.providerType
      )
    }

    const isLoading = TorqueProvider.Instance.isLoading
    const isSupportedNetwork = !TorqueProvider.Instance.unsupportedNetwork
    const etherscanURL = TorqueProvider.Instance.web3ProviderSettings
      ? TorqueProvider.Instance.web3ProviderSettings.etherscanURL
      : ''

    this.setState({
      ...this.state,
      isLoading,
      isSupportedNetwork,
      etherscanURL,
      accountText,
      providerTypeDetails: providerTypeDetails || null
    })
  }

  public render() {
    const {
      isLoading,
      isSupportedNetwork,
      etherscanURL,
      providerTypeDetails,
      accountText
    } = this.state

    let walletAddressText: string
    if (TorqueProvider.Instance.unsupportedNetwork) {
      walletAddressText = 'Wrong Network!'
    } else if (accountText) {
      walletAddressText = `${accountText.slice(0, 6)}...${accountText.slice(
        accountText.length - 4,
        accountText.length
      )}`
    } else {
      walletAddressText = '' // "...";
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
    )
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
          <span className="on-chain-indicator__provider-txt">Loading Wallet...</span>
          {/*<span className="on-chain-indicator__wallet-address" onClick={this.props.doNetworkConnect}>
            ...
          </span>*/}
        </React.Fragment>
      )
    } else {
      if (providerTypeDetails !== null && providerTypeDetails.reactLogoSvgShort !== undefined) {
        const TokenIcon = providerTypeDetails.reactLogoSvgShort
        return (
          <React.Fragment>
            <div className="on-chain-indicator__svg">
              <TokenIcon />
            </div>
            <div className="on-chain-indicator__description">
              <span>{providerTypeDetails.displayName}</span>
              {walletAddressText ? (
                isSupportedNetwork && accountText && etherscanURL ? (
                  <a
                    className="on-chain-indicator__wallet-address"
                    href={`${etherscanURL}address/${accountText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => event.stopPropagation()}>
                    {walletAddressText}
                  </a>
                ) : (
                  <span className="on-chain-indicator__wallet-address">{walletAddressText}</span>
                )
              ) : (
                ``
              )}
            </div>
          </React.Fragment>
        )
      } else {
        return (
          <React.Fragment>
            <span className="on-chain-indicator__provider-txt">Click To Connect Wallet</span>
            {TorqueProvider.Instance.unsupportedNetwork ? (
              <span className="on-chain-indicator__wallet-address">{walletAddressText}</span>
            ) : (
              ``
            )}
          </React.Fragment>
        )
      }
    }
  }
}
