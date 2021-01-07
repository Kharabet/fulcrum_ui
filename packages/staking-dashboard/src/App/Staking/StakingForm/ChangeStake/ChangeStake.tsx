import { observer } from 'mobx-react'
import React from 'react'
import InputStake from './InputStake'
import StakingFormVM from '../StakingFormVM'

export function ChangeStake({ vm }: { vm: StakingFormVM }) {
  const { wallet, staked } = vm.stakingStore.userBalances

  return (
    <React.Fragment>
      <div className="add-to-balance padded-2 bg-content">
        <div className="bg-darken padded-2">
          <h3 className="section-header">Add to Staking Balance</h3>
          <div className="flex-row">
            <h3 style={{position: 'relative', left: '67px'}}>In your wallet</h3>
            <h3 style={{position: 'absolute', right: '83px'}}>Staked</h3>
          </div>
          {wallet.bzrx.gt(0) && (
            <InputStake
              id="bzrx"
              label="BZRX"
              walletBalance={wallet.bzrx}
              stakedBalance={staked.bzrx}
              onChange={vm.changeTokenBalance}
              value={vm.bzrxInput}
            />
          )}
          {wallet.vbzrx.gt(0) && (
            <InputStake
              id="vbzrx"
              label="vBZRX"
              walletBalance={wallet.vbzrx}
              stakedBalance={staked.vbzrx}
              onChange={vm.changeTokenBalance}
              value={vm.vbzrxInput}
            />
          )}
          {wallet.ibzrx.gt(0) && (
            <InputStake
              id="ibzrx"
              label="iBZRX"
              walletBalance={wallet.ibzrx}
              stakedBalance={staked.ibzrx}
              onChange={vm.changeTokenBalance}
              value={vm.ibzrxInput}
            />
          )}
          {wallet.bpt.gt(0) && (
            <InputStake
              id="bpt"
              label="BPT"
              walletBalance={wallet.bpt}
              stakedBalance={staked.bpt}
              onChange={vm.changeTokenBalance}
              value={vm.bptInput}
            />
          )}

          <div>
            <button
              title="Stake"
              className="button full-button blue"
              disabled={!vm.canStake}
              onClick={vm.stake}>
              Stake
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default observer(ChangeStake)
