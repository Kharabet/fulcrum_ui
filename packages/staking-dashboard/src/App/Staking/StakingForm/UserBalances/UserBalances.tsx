import { ReactComponent as BPTIcon } from 'app-images/token-bpt.svg'
import { ReactComponent as BzrxIcon } from 'app-images/token-bzrx.svg'
import { ReactComponent as VBzrxIcon } from 'app-images/token-vbzrx.svg'
import { ReactComponent as IbzrxIcon } from 'app-images/token-ibzrx.svg'
import { observer } from 'mobx-react'
import React from 'react'
import RootStore from 'src/stores/RootStore'
import { Loader } from 'ui-framework'
import AssetBalance from 'shared-components/AssetBalance'

export function UserBalances({ rootStore }: { rootStore: RootStore }) {
  const { stakingStore, etherscanURL } = rootStore
  const { userBalances } = stakingStore
  const { wallet, staked } = stakingStore.userBalances

  return (
    <div className="balance-wrapper panel--white padded-2">
      {userBalances.pending && (
        <Loader
          className="calculator__balance-loader"
          quantityDots={3}
          sizeDots="small"
          title=""
          isOverlay={false}
        />
      )}
      <div className="ui-grid-wmin-260px">
        <div>
          <h3 className="section-header">Wallet Balance</h3>
          <AssetBalance
            className="margin-bottom-2"
            link={`${etherscanURL}token/0x56d811088235F11C8920698a204A5010a788f4b3`}
            tokenLogo={<BzrxIcon />}
            balance={wallet.bzrx}
            name="BZRX"
          />

          <AssetBalance
            className="margin-bottom-2"
            link={`${etherscanURL}token/0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F`}
            tokenLogo={<VBzrxIcon />}
            balance={wallet.vbzrx}
            name="vBZRX"
          />

          <AssetBalance
            className="margin-bottom-2"
            link={`${etherscanURL}token/0x18240BD9C07fA6156Ce3F3f61921cC82b2619157`}
            tokenLogo={<IbzrxIcon />}
            balance={wallet.ibzrx}
            name="iBZRX"
          />

          <AssetBalance
            className="margin-bottom-2"
            link={`${etherscanURL}token/0xe26A220a341EAca116bDa64cF9D5638A935ae629`}
            tokenLogo={<BPTIcon />}
            balance={wallet.bpt}
            name="BPT"
          />
        </div>
        <div>
          <h3 className="section-header">Staking Balance</h3>

          <AssetBalance
            className="margin-bottom-2"
            link={`${etherscanURL}token/0x56d811088235F11C8920698a204A5010a788f4b3`}
            tokenLogo={<BzrxIcon />}
            balance={staked.bzrx}
            name="BZRX"
          />

          <AssetBalance
            className="margin-bottom-2"
            link={`${etherscanURL}token/0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F`}
            tokenLogo={<VBzrxIcon />}
            balance={staked.vbzrx}
            name="vBZRX"
          />

          <AssetBalance
            className="margin-bottom-2"
            link={`${etherscanURL}token/0x18240BD9C07fA6156Ce3F3f61921cC82b2619157`}
            tokenLogo={<IbzrxIcon />}
            balance={staked.ibzrx}
            name="iBZRX"
          />

          <AssetBalance
            className="margin-bottom-2"
            link={`${etherscanURL}token/0xe26A220a341EAca116bDa64cF9D5638A935ae629`}
            tokenLogo={<BPTIcon />}
            balance={staked.bpt}
            name="BPT"
          />
        </div>
      </div>
    </div>
  )
}

export default observer(UserBalances)
