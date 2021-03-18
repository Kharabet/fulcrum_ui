import { observer } from 'mobx-react'
import React from 'react'
import AppVM from '../AppVM'
import { ReactComponent as GenericWalletShort } from 'bzx-common/src/assets/images/providers/logo_short___genericwallet.svg'

export function OnChainIndicator({ appVM }: { appVM: AppVM }) {
  const { etherscanURL, web3Connection } = appVM.rootStore
  const {
    providerTypeDetails,
    wrongNetwork,
    isConnected,
    walletAddress,
    isDisconnecting,
    isLoadingWallet,
    hasProvider,
  } = web3Connection

  if (!hasProvider) {
    if (wrongNetwork) {
      return (
        <button className="btn--onchain-indicator">
          <div>
            <i>Wrong Network!</i>
          </div>
        </button>
      )
    }

    return (
      <button className="btn--onchain-indicator" onClick={appVM.providerMenu.show}>
        <div className="flex-row-center">
          <div className="on-chain-indicator__svg">
            <GenericWalletShort />
          </div>
          <div className="on-chain-indicator__description margin-left-05">Connect Wallet</div>
        </div>
      </button>
    )
  }

  if (providerTypeDetails === null) {
    return (
      <button className="btn--onchain-indicator">
        <div className="on-chain-indicator__description">Unknown provider</div>
      </button>
    )
  }
  const ProviderLogoIcon = providerTypeDetails.reactLogoSvgShort

  return (
    <button className="btn--onchain-indicator" onClick={appVM.providerMenu.show}>
      <div className="flex-row-center">
        <div className="on-chain-indicator__svg">
          <ProviderLogoIcon />
        </div>
        <div className="margin-left-05 txt-left">
          <div className="on-chain-indicator__description">{providerTypeDetails.displayName}</div>
          {isConnected && !isDisconnecting && etherscanURL && (
            <a
              className="on-chain-indicator__wallet-address"
              href={`${etherscanURL}address/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}>
              <small>{web3Connection.shortWalletAddress}</small>
            </a>
          )}
          {isConnected && !isDisconnecting && !etherscanURL && (
            <div className="on-chain-indicator__wallet-address">
              <small>{web3Connection.shortWalletAddress}</small>
            </div>
          )}
          {isLoadingWallet && (
            <div>
              <i>Loading Wallet...</i>
            </div>
          )}
          {isDisconnecting && (
            <div>
              <i>Disconnecting...</i>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

export default observer(OnChainIndicator)
