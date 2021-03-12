import { observer } from 'mobx-react'
import React from 'react'
import ProviderType from 'bzx-common/src/domain/ProviderType'
import ProviderTypeDictionary from 'bzx-common/src/domain/ProviderTypeDictionary'
import { Loader, ButtonBasic } from 'ui-framework'
import Web3Connection from 'src/stores/Web3Connection'

const loader = <Loader quantityDots={3} sizeDots={'small'} title={''} isOverlay={false} />

export interface IProviderMenuListItemProps {
  connect: (providerType: ProviderType) => void
  web3Connection: Web3Connection
  disabled: boolean
  providerType: ProviderType
  isConnected: boolean
  isActivating: boolean
}

export function ProviderMenuListItem(props: IProviderMenuListItemProps) {
  const { web3Connection } = props
  const { etherscanWalletLink, shortWalletAddress, supportedNetwork } = web3Connection

  const providerTypeDetails = ProviderTypeDictionary.providerTypes.get(props.providerType)

  if (!providerTypeDetails) {
    return null
  }

  const ProviderLogoIcon = providerTypeDetails.reactLogoSvgShort

  if (props.isConnected) {
    const walletAddressText = supportedNetwork ? shortWalletAddress : 'Wrong Network!'
    return (
      <ButtonBasic
        className="provider-menu__list-item provider-menu__list-item--selected"
        disabled={true}
        onClick={props.connect}
        onClickEmit="value"
        value={props.providerType}>
        <div className="provider-menu__list-item-description">
          <span className="provider-name">{providerTypeDetails.displayName}</span>
          {supportedNetwork && etherscanWalletLink ? (
            <a
              className="address"
              href={etherscanWalletLink}
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
      </ButtonBasic>
    )
  }

  return (
    <ButtonBasic
      className="provider-menu__list-item"
      onClick={props.connect}
      onClickEmit="value"
      value={props.providerType}
      disabled={props.disabled}>
      <div className="provider-menu__list-item-content-txt">{providerTypeDetails.displayName}</div>
      <div className="provider-menu__list-item-content-img">
        {props.isActivating ? loader : <ProviderLogoIcon />}
      </div>
    </ButtonBasic>
  )
}

export default observer(ProviderMenuListItem)
