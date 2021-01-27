import { tokenIcons } from 'app-images'
import { observer } from 'mobx-react'
import React from 'react'
import AssetBalance from 'shared-components/AssetBalance'
import RootStore from 'src/stores/RootStore'
import { Loader } from 'ui-framework'

export function UserBalances({ rootStore }: { rootStore: RootStore }) {
  const { stakingStore, etherscanURL } = rootStore
  const { userBalances } = stakingStore
  const { wallet, staked } = stakingStore.userBalances

  return (
    <div>
      <div className="grid--staking">
        <div className="panel--white padded-2">
          {userBalances.pending && (
            <Loader
              className="calculator__balance-loader"
              quantityDots={3}
              sizeDots="small"
              title=""
              isOverlay={false}
            />
          )}
          <h3 className="section-header">Wallet Balance</h3>
          <AssetBalance
            className="margin-bottom-2"
            link={`${etherscanURL}token/0x56d811088235F11C8920698a204A5010a788f4b3`}
            tokenLogo={tokenIcons.bzrx}
            balance={wallet.bzrx}
            name="BZRX"
          />

          <AssetBalance
            className="margin-bottom-2"
            link={`${etherscanURL}token/0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F`}
            tokenLogo={tokenIcons.vbzrx}
            balance={wallet.vbzrx}
            name="vBZRX"
          />

          <AssetBalance
            className="margin-bottom-2"
            link={`${etherscanURL}token/0x18240BD9C07fA6156Ce3F3f61921cC82b2619157`}
            tokenLogo={tokenIcons.ibzrx}
            balance={wallet.ibzrx}
            name="iBZRX"
          />

          <AssetBalance
            link={`${etherscanURL}token/0xe26A220a341EAca116bDa64cF9D5638A935ae629`}
            tokenLogo={tokenIcons.bpt}
            balance={wallet.bpt}
            name="BPT"
          />
        </div>
        <div className="panel--white padded-2">
          <h3 className="section-header">Staking Balance</h3>

          <AssetBalance
            className="margin-bottom-2"
            link={`${etherscanURL}token/0x56d811088235F11C8920698a204A5010a788f4b3`}
            tokenLogo={tokenIcons.bzrx}
            balance={staked.bzrx}
            name="BZRX"
          />

          <AssetBalance
            className="margin-bottom-2"
            link={`${etherscanURL}token/0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F`}
            tokenLogo={tokenIcons.vbzrx}
            balance={staked.vbzrx}
            name="vBZRX"
          />

          <AssetBalance
            className="margin-bottom-2"
            link={`${etherscanURL}token/0x18240BD9C07fA6156Ce3F3f61921cC82b2619157`}
            tokenLogo={tokenIcons.ibzrx}
            balance={staked.ibzrx}
            name="iBZRX"
          />

          <AssetBalance
            link={`${etherscanURL}token/0xe26A220a341EAca116bDa64cF9D5638A935ae629`}
            tokenLogo={tokenIcons.bpt}
            balance={staked.bpt}
            name="BPT"
          />
        </div>
      </div>
      {userBalances.loaded && userBalances.wallet.isEmpty && userBalances.staked.isEmpty && (
        <p>
          <i>There are no tokens available to stake in your wallet.</i>
        </p>
      )}
    </div>
  )
}

export default observer(UserBalances)
