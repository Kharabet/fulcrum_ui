import { ReactComponent as BPTIcon } from 'app-images/token-bpt.svg'
import { ReactComponent as BzrxIcon } from 'app-images/token-bzrx.svg'
import { ReactComponent as VBzrxIcon } from 'app-images/token-vbzrx.svg'
import { observer } from 'mobx-react'
import React from 'react'
import RootStore from 'src/stores/RootStore'
import { Loader } from 'ui-framework'
import FormAssetBalance from './FormAssetBalance'

export function UserBalances({ rootStore }: { rootStore: RootStore }) {
  const { stakingStore, etherscanURL } = rootStore
  const { userBalances } = stakingStore
  const { wallet, staked } = stakingStore.userBalances

  return (
    <div className="balance-wrapper">
      {userBalances.pending && (
        <Loader
          className="calculator__balance-loader"
          quantityDots={3}
          sizeDots="small"
          title=""
          isOverlay={false}
        />
      )}
      <div className="balance-item">
        <div className="row-header">Wallet Balance:</div>
        <FormAssetBalance
          link={`${etherscanURL}token/0x56d811088235F11C8920698a204A5010a788f4b3`}
          tokenLogo={<BzrxIcon />}
          balance={wallet.bzrx}
          name="BZRX"
        />

        <FormAssetBalance
          link={`${etherscanURL}token/0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F`}
          tokenLogo={<VBzrxIcon />}
          balance={wallet.vbzrx}
          name="vBZRX"
        />

        <FormAssetBalance
          link={`${etherscanURL}token/0xe26A220a341EAca116bDa64cF9D5638A935ae629`}
          tokenLogo={<BPTIcon />}
          balance={wallet.bpt}
          name="BPT"
        />
      </div>
      <div className="balance-item">
        <div className="row-header">Staking Balance:</div>

        <FormAssetBalance
          link={`${etherscanURL}token/0x56d811088235F11C8920698a204A5010a788f4b3`}
          tokenLogo={<BzrxIcon />}
          balance={staked.bzrx}
          name="BZRX"
        />

        <FormAssetBalance
          link={`${etherscanURL}token/0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F`}
          tokenLogo={<VBzrxIcon />}
          balance={staked.vbzrx}
          name="vBZRX"
        />

        <FormAssetBalance
          link={`${etherscanURL}token/0xe26A220a341EAca116bDa64cF9D5638A935ae629`}
          tokenLogo={<BPTIcon />}
          balance={staked.bpt}
          name="BPT"
        />
      </div>
      <p className="notice">
        The staking dashboard in its current form tracks BZRX in your wallet or deployed in the
        protocol. If it is transferred elsewhere your staked balance may drop.
      </p>
    </div>
  )
}

export default observer(UserBalances)
