import { observer } from 'mobx-react'
import React from 'react'
import RootStore from 'src/stores/RootStore'
import { Loader } from 'ui-framework'
import Balances from './Balances'

export function UserBalances({ rootStore }: { rootStore: RootStore }) {
  const { stakingStore, etherscanURL } = rootStore
  const { userBalances } = stakingStore
  const { wallet, staked } = userBalances

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
          <Balances wallet={wallet} etherscanURL={etherscanURL} />
        </div>

        <div className="panel--white padded-2">
          <h3 className="section-header">Staking Balance</h3>
          <Balances wallet={staked} etherscanURL={etherscanURL} />
        </div>
      </div>

      {userBalances.loaded && wallet.isEmpty && staked.isEmpty && (
        <p>
          <i>There are no tokens available to stake in your wallet.</i>
        </p>
      )}
    </div>
  )
}

export default observer(UserBalances)
