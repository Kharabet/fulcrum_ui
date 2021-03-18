import React from 'react'
import { ProviderType } from '../domain/ProviderType'
import ProviderTypeDictionary from 'bzx-common/src/domain/ProviderTypeDictionary'
import { useWeb3React } from '@web3-react/core'
import { FulcrumProvider } from '../services/FulcrumProvider'
import TagManager from 'react-gtm-module'
import appConfig from 'bzx-common/src/config/appConfig'

const Loader = () => {
  return (
    <div className="loader">
      <div className="loader-content">
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  )
}

export interface IProviderMenuListItemProps {
  providerType: ProviderType
  isConnected: boolean
  isActivating: boolean
  onSelect: (providerType: ProviderType) => void
}

export function ProviderMenuListItem(props: IProviderMenuListItemProps) {
  const context = useWeb3React()
  const { account } = context

  const providerTypeDetails = ProviderTypeDictionary.providerTypes.get(props.providerType) || null
  if (!providerTypeDetails) {
    return null
  }

  const onClick = () => {
    // if (props.isConnected) return;
    props.onSelect(props.providerType)
    if (appConfig.isGTMEnabled) {
      const tagManagerArgs = {
        dataLayer: {
          event: 'select-provider',
          providerName: props.providerType,
        },
      }
      TagManager.dataLayer(tagManagerArgs)
    }
  }
  if (props.isConnected) {
    const isUnSupportedNetwork = FulcrumProvider.Instance.unsupportedNetwork

    const walletAddressText = isUnSupportedNetwork
      ? 'Wrong Network!'
      : account
      ? `${account.slice(0, 6)}...${account.slice(account.length - 4, account.length)}`
      : ''

    const etherscanURL = FulcrumProvider.Instance.web3ProviderSettings
      ? FulcrumProvider.Instance.web3ProviderSettings.etherscanURL
      : ''
    const ProviderLogoIcon = providerTypeDetails.reactLogoSvgShort
    if (!ProviderLogoIcon) {
      return null
    }
    return (
      <li
        className={`provider-menu__list-item provider-menu__list-item--selected`}
        onClick={onClick}>
        <div className="provider-menu__list-item-description">
          <span className="provider-name">{providerTypeDetails.displayName}</span>

          {!isUnSupportedNetwork && account && etherscanURL ? (
            <a
              className="address"
              href={`${etherscanURL}address/${account}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}>
              {walletAddressText}
            </a>
          ) : (
            <span className="address">{walletAddressText}</span>
          )}
        </div>
        <div className="provider-menu__list-item-content-img">
          <ProviderLogoIcon />
        </div>
      </li>
    )
  }
  const ProviderLogoIcon = providerTypeDetails.reactLogoSvgShort
  if (!ProviderLogoIcon) {
    return null
  }
  return (
    <li className={`provider-menu__list-item `} onClick={onClick}>
      <div className="provider-menu__list-item-content-txt">{providerTypeDetails.displayName}</div>
      <div className="provider-menu__list-item-content-img">
        {props.isActivating ? <Loader /> : <ProviderLogoIcon />}
      </div>
    </li>
  )
}
