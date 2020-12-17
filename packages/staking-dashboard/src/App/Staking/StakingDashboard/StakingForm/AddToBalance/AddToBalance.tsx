import { observer } from 'mobx-react'
import React from 'react'
import InputStake from './InputStake'
import StakingFormVM from '../StakingFormVM'

export function AddToBalance({ vm }: { vm: StakingFormVM }) {
  const { wallet } = vm.stakingStore.userBalances

  return (
    <React.Fragment>
      <div className="add-to-balance calculator-row">
        <label>Add to staking balance</label>
        {wallet.bzrx.gt(0) && (
          <InputStake
            id="bzrx"
            label="BZRX"
            max={wallet.bzrx}
            onChange={vm.changeTokenBalance}
            value={vm.bzrxInput}
          />
        )}
        {wallet.vbzrx.gt(0) && (
          <InputStake
            id="vbzrx"
            label="vBZRX"
            max={wallet.vbzrx}
            onChange={vm.changeTokenBalance}
            value={vm.vbzrxInput}
          />
        )}
        {wallet.bpt.gt(0) && (
          <InputStake
            id="bpt"
            label="BPT"
            max={wallet.bpt}
            onChange={vm.changeTokenBalance}
            value={vm.bptInput}
          />
        )}

        <div className="group-buttons">
          <button
            title="Stake"
            className="button full-button blue"
            disabled={!vm.canStake}
            onClick={vm.stake}>
            Stake
          </button>
        </div>
      </div>
    </React.Fragment>
  )
}

export default observer(AddToBalance)
