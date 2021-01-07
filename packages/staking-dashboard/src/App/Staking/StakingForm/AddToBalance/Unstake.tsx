import { observer } from 'mobx-react'
import React from 'react'
import { Button } from 'ui-framework'
import InputStake from './InputStake'
import StakingFormVM from '../StakingFormVM'

export function Unstake({ vm }: { vm: StakingFormVM }) {
  const { staked } = vm.stakingStore.userBalances

  return (
    <React.Fragment>
      <h3 className="section-header">Remove from Staking Balance</h3>
      {staked.bzrx.gte(0.01) && (
        <InputStake
          id="bzrx"
          label="BZRX"
          max={staked.bzrx}
          onChange={vm.changeTokenBalance}
          value={vm.bzrxInput}
        />
      )}
      {staked.vbzrx.gte(0.01) && (
        <InputStake
          id="vbzrx"
          label="vBZRX"
          max={staked.vbzrx}
          onChange={vm.changeTokenBalance}
          value={vm.vbzrxInput}
        />
      )}
      {staked.ibzrx.gte(0.01) && (
        <InputStake
          id="ibzrx"
          label="iBZRX"
          max={staked.ibzrx}
          onChange={vm.changeTokenBalance}
          value={vm.ibzrxInput}
        />
      )}
      {staked.bpt.gte(0.01) && (
        <InputStake
          id="bpt"
          label="BPT"
          max={staked.bpt}
          onChange={vm.changeTokenBalance}
          value={vm.bptInput}
        />
      )}

      <Button
        isLoading={vm.stakingStore.stakingPending}
        className="button full-button blue"
        disabled={!vm.canUnstake}
        onClick={vm.unstake}>
        Unstake
      </Button>
    </React.Fragment>
  )
}

export default observer(Unstake)
