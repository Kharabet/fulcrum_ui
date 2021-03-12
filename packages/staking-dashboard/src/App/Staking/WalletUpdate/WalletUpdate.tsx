import { observer } from 'mobx-react'
import React from 'react'
import AssetBalance from 'shared-components/AssetBalance'
import AppVM from '../../AppVM'

export function WalletUpdate({ appVM }: { appVM: AppVM }) {
  const { walletUpdate } = appVM.rootStore.stakingStore
  const { walletUpdatePopup } = appVM.rootStore.uiStore

  if (!walletUpdatePopup.visible || !walletUpdate) {
    return null
  }

  const lines = Math.ceil(walletUpdate.from.length / 2)
  const styles = {
    height: `${lines * 40 + 84}px`,
  }

  const cssClass = `st-side-dialog--${walletUpdatePopup.state} padded-1`

  return (
    <div className={cssClass} style={styles}>
      <h3 className="section-header margin-top-0">Wallet Update</h3>
      <div className="st-wallet-changes__tokens">
        {walletUpdate.from.map((change) => {
          return (
            <div key={change.token}>
              <AssetBalance
                id={change.token}
                size="small"
                balance={change.amount}
                name={change.token.toUpperCase() + (change.staked ? ' staked' : '')}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default observer(WalletUpdate)
