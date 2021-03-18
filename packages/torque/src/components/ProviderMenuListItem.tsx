import { Loader } from './Loader'
import { ProviderType } from '../domain/ProviderType'
import { TorqueProvider } from '../services/TorqueProvider'
import { useWeb3React } from '@web3-react/core'
import appConfig from 'bzx-common/src/config/appConfig'
import ProviderTypeDictionary from 'bzx-common/src/domain/ProviderTypeDictionary'
import React from 'react'
import TagManager from 'react-gtm-module'

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
    const isUnSupportedNetwork = TorqueProvider.Instance.unsupportedNetwork

    const walletAddressText = isUnSupportedNetwork
      ? 'Wrong Network!'
      : account
      ? `${account.slice(0, 6)}...${account.slice(account.length - 4, account.length)}`
      : ''

    const etherscanURL = TorqueProvider.Instance.web3ProviderSettings
      ? TorqueProvider.Instance.web3ProviderSettings.etherscanURL
      : ''
    const TokenIcon = providerTypeDetails.reactLogoSvgShort
    if (!TokenIcon) {
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
          <TokenIcon />
        </div>
      </li>
    )
  }
  const TokenIcon = providerTypeDetails.reactLogoSvgShort
  if (!TokenIcon) {
    return null
  }
  return (
    <li className={`provider-menu__list-item `} onClick={onClick}>
      <div className="provider-menu__list-item-content-txt">{providerTypeDetails.displayName}</div>
      <div className="provider-menu__list-item-content-img">
        {props.isActivating ? (
          <Loader quantityDots={3} sizeDots={'small'} title={''} isOverlay={false} />
        ) : (
          <TokenIcon />
        )}
      </div>
    </li>
  )
}
