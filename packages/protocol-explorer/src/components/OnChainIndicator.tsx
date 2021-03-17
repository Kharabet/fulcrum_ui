import React, { Component } from 'react'
import { ProviderType } from '../domain/ProviderType'
import { ProviderTypeDetails } from '../domain/ProviderTypeDetails'
import ProviderTypeDictionary from 'bzx-common/src/domain/ProviderTypeDictionary'
import ProviderChangedEvent from 'bzx-common/src/services/ProviderChangedEvent'
import { ExplorerProviderEvents } from '../services/events/ExplorerProviderEvents'
import { ExplorerProvider } from '../services/ExplorerProvider'
import { ReactComponent as GenericWalletShort } from 'bzx-common/src/assets/images/providers/logo_short___genericwallet.svg'

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
      providerTypeDetails: null,
    }

    ExplorerProvider.Instance.eventEmitter.on(
      ExplorerProviderEvents.ProviderIsChanging,
      this.onProviderIsChanging
    )
    ExplorerProvider.Instance.eventEmitter.on(
      ExplorerProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  private onProviderIsChanging = async () => {
    this.setState({
      ...this.state,
      isLoading: true,
    })
  }

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    this.setState({
      ...this.state,
      isLoading: true,
    })
    await this.derivedUpdate()
  }

  public async componentDidMount() {
    await this.derivedUpdate()
  }

  public componentWillUnmount(): void {
    // ExplorerProvider.Instance.eventEmitter.removeListener(ExplorerProviderEvents.ProviderIsChanging, this.onProviderIsChanging);
    ExplorerProvider.Instance.eventEmitter.removeListener(
      ExplorerProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  private async derivedUpdate() {
    const accountText =
      ExplorerProvider.Instance.accounts.length > 0 && ExplorerProvider.Instance.accounts[0]
        ? ExplorerProvider.Instance.accounts[0].toLowerCase()
        : ''

    let providerTypeDetails = null
    if (accountText && ExplorerProvider.Instance.providerType !== ProviderType.None) {
      providerTypeDetails = ProviderTypeDictionary.providerTypes.get(
        ExplorerProvider.Instance.providerType
      )
    }

    const isLoading = ExplorerProvider.Instance.isLoading
    const isSupportedNetwork = !ExplorerProvider.Instance.unsupportedNetwork
    const etherscanURL = ExplorerProvider.Instance.web3ProviderSettings
      ? ExplorerProvider.Instance.web3ProviderSettings.etherscanURL
      : ''

    this.setState({
      ...this.state,
      isLoading,
      isSupportedNetwork,
      etherscanURL,
      accountText,
      providerTypeDetails: providerTypeDetails || null,
    })
  }

  public render() {
    const {
      isLoading,
      isSupportedNetwork,
      etherscanURL,
      providerTypeDetails,
      accountText,
    } = this.state

    let walletAddressText: string
    if (ExplorerProvider.Instance.unsupportedNetwork) {
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
      <div className={`on-chain-indicator ${providerTypeDetails !== null ? `active` : `deactive`}`}>
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
        const ProviderLogoIcon = providerTypeDetails.reactLogoSvgShort
        return (
          <React.Fragment>
            <div className="on-chain-indicator__svg">
              <ProviderLogoIcon />
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
            {ExplorerProvider.Instance.unsupportedNetwork ? (
              <span className="on-chain-indicator__wallet-address">{walletAddressText}</span>
            ) : (
              <span className="on-chain-indicator__provider-txt">
                <div className="on-chain-indicator__svg">
                  <GenericWalletShort />
                </div>
                Connect Wallet
              </span>
            )}
          </React.Fragment>
        )
      }
    }
  }
}
