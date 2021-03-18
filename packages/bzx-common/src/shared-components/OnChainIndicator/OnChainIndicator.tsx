import React, { Component } from 'react'
import ProviderType from '../../domain/ProviderType'
import ProviderTypeDetails from '../../domain/ProviderTypeDetails'
import ProviderTypeDictionary from '../../domain/ProviderTypeDictionary'
import ProviderChangedEvent from '../../services/ProviderChangedEvent'
import { ReactComponent as GenericWalletShort } from '../../assets/images/providers/logo_short___genericwallet.svg'
import { FulcrumProvider } from '../../../../fulcrum/src/services/FulcrumProvider'
import { TorqueProvider } from '../../../../torque/src/services/TorqueProvider'
import { ExplorerProvider } from '../../../../protocol-explorer/src/services/ExplorerProvider'
import { TorqueProviderEvents } from '../../../../torque/src/services/events/TorqueProviderEvents'
import { FulcrumProviderEvents } from '../../../../fulcrum/src/services/events/FulcrumProviderEvents'
import { ExplorerProviderEvents } from '../../../../protocol-explorer/src/services/events/ExplorerProviderEvents'
import './OnChainIndicator.scss'

export interface IOnChainIndicatorProps {
  doNetworkConnect: () => void
  provider: TorqueProvider | FulcrumProvider | ExplorerProvider
  providerIsChanging: TorqueProviderEvents | FulcrumProviderEvents | ExplorerProviderEvents
  providerChanged: TorqueProviderEvents | FulcrumProviderEvents | ExplorerProviderEvents
}

interface IOnChainIndicatorState {
  isLoading: boolean
  isSupportedNetwork: boolean
  etherscanURL: string
  accountText: string
  providerTypeDetails: ProviderTypeDetails
}

class OnChainIndicator extends Component<IOnChainIndicatorProps, IOnChainIndicatorState> {
  constructor(props: IOnChainIndicatorProps) {
    super(props)

    this.state = {
      isLoading: false,
      isSupportedNetwork: true,
      etherscanURL: '',
      accountText: '',
      providerTypeDetails: ProviderTypeDictionary.providerTypes.get(ProviderType.None)!,
    }

    props.provider.eventEmitter.on(props.providerIsChanging, this.onProviderIsChanging)
    props.provider.eventEmitter.on(props.providerChanged, this.onProviderChanged)
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
    this.props.provider.eventEmitter.removeListener(
      this.props.providerChanged,
      this.onProviderChanged
    )
  }

  private async derivedUpdate() {
    const accountText =
      this.props.provider.accounts.length > 0 && this.props.provider.accounts[0]
        ? this.props.provider.accounts[0].toLowerCase()
        : ''

    let providerTypeDetails = null
    if (accountText && this.props.provider.providerType !== ProviderType.None) {
      providerTypeDetails = ProviderTypeDictionary.providerTypes.get(
        this.props.provider.providerType
      )
    }

    const isLoading = this.props.provider.isLoading
    const isSupportedNetwork = !this.props.provider.unsupportedNetwork
    const etherscanURL = this.props.provider.web3ProviderSettings
      ? this.props.provider.web3ProviderSettings.etherscanURL
      : ''

    this.setState({
      ...this.state,
      isLoading,
      isSupportedNetwork,
      etherscanURL,
      accountText,
      providerTypeDetails:
        providerTypeDetails || ProviderTypeDictionary.providerTypes.get(ProviderType.None)!,
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
    if (this.props.provider.unsupportedNetwork) {
      walletAddressText = 'Wrong Network!'
    } else if (accountText) {
      walletAddressText = `${accountText.slice(0, 6)}...${accountText.slice(
        accountText.length - 4,
        accountText.length
      )}`
    } else {
      walletAddressText = ''
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
    if (isLoading && providerTypeDetails) {
      const ProviderIcon = providerTypeDetails.reactLogoSvgShort

      return (
        <React.Fragment>
          <div className="on-chain-indicator__svg">
            <ProviderIcon />
          </div>
          <div className="on-chain-indicator__description">
            <span className="on-chain-indicator__provider-txt">Loading Wallet...</span>
          </div>
        </React.Fragment>
      )
    } else {
      if (providerTypeDetails !== null && providerTypeDetails.reactLogoSvgShort !== undefined) {
        const ProviderIcon = providerTypeDetails.reactLogoSvgShort
        return (
          <React.Fragment>
            <div className="on-chain-indicator__svg">
              <ProviderIcon />
            </div>
            <div className="on-chain-indicator__description">
              <span>
                {providerTypeDetails !==
                ProviderTypeDictionary.providerTypes.get(ProviderType.None)!
                  ? providerTypeDetails.displayName
                  : 'Connect Wallet'}
              </span>
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
            {this.props.provider.unsupportedNetwork ? (
              <span className="on-chain-indicator__wallet-address">{walletAddressText}</span>
            ) : (
              <React.Fragment>
                <div className="on-chain-indicator__svg">
                  <GenericWalletShort />
                </div>
                <div className="on-chain-indicator__description">
                  <span className="on-chain-indicator__wallet-address">Connect Wallet</span>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )
      }
    }
  }
}

export default OnChainIndicator
