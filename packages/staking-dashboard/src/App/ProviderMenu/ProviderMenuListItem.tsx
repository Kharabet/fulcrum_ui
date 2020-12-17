import { observer } from 'mobx-react'
import React from 'react'
import ProviderType from 'src/domain/ProviderType'
import ProviderTypeDictionary from 'src/domain/ProviderTypeDictionary'
import { Loader, ButtonBasic } from 'ui-framework'
import Web3Connection from 'src/stores/Web3Connection'

const loader = <Loader quantityDots={3} sizeDots={'small'} title={''} isOverlay={false} />

export interface IProviderMenuListItemProps {
  web3Connection: Web3Connection
  disabled: boolean
  providerType: ProviderType
  isConnected: boolean
  isActivating: boolean
}

export function ProviderMenuListItem(props: IProviderMenuListItemProps) {
  const { web3Connection } = props
  const { etherscanWalletLink, shortWalletAddress, supportedNetwork } = web3Connection

  const providerTypeDetails = ProviderTypeDictionary.providerTypes.get(props.providerType) || null

  if (!providerTypeDetails) {
    return null
  }

  if (props.isConnected) {
    const walletAddressText = supportedNetwork ? shortWalletAddress : 'Wrong Network!'
    return (
      <ButtonBasic
        className="provider-menu__list-item provider-menu__list-item--selected"
        disabled={true}
        onClick={web3Connection.connect}
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
          {providerTypeDetails.reactLogoSvgShort.render()}
        </div>
      </ButtonBasic>
    )
  }

  return (
    <ButtonBasic
      className="provider-menu__list-item"
      onClick={web3Connection.connect}
      onClickEmit="value"
      value={props.providerType}
      disabled={props.disabled}>
      <div className="provider-menu__list-item-content-txt">{providerTypeDetails.displayName}</div>
      <div className="provider-menu__list-item-content-img">
        {props.isActivating ? loader : providerTypeDetails.reactLogoSvgShort.render()}
      </div>
    </ButtonBasic>
  )
}

export default observer(ProviderMenuListItem)
