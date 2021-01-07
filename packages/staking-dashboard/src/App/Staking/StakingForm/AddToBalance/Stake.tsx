import { observer } from 'mobx-react'
import React from 'react'
import { Button } from 'ui-framework'
import StakingFormVM from '../StakingFormVM'
import InputStake from './InputStake'
import SpendingAllowance from './SpendingAllowance'

export function AddToBalance({ vm }: { vm: StakingFormVM }) {
  const { wallet } = vm.stakingStore.userBalances
  const { stakingAllowances } = vm.stakingStore

  return (
    <React.Fragment>
      <SpendingAllowance vm={vm} />

      {stakingAllowances.needApprovalList.length < 4 && (
        <>
          <h3 className="section-header">Add to Staking Balance</h3>

          {wallet.bzrx.gte(0.01) && stakingAllowances.bzrx.amount.gte(wallet.bzrx) && (
            <InputStake
              id="bzrx"
              label="BZRX"
              max={wallet.bzrx}
              onChange={vm.changeTokenBalance}
              value={vm.bzrxInput}
            />
          )}
          {wallet.vbzrx.gte(0.01) && stakingAllowances.vbzrx.amount.gte(wallet.vbzrx) && (
            <InputStake
              id="vbzrx"
              label="vBZRX"
              max={wallet.vbzrx}
              onChange={vm.changeTokenBalance}
              value={vm.vbzrxInput}
            />
          )}
          {wallet.ibzrx.gte(0.01) && stakingAllowances.ibzrx.amount.gte(wallet.ibzrx) && (
            <InputStake
              id="ibzrx"
              label="iBZRX"
              max={wallet.ibzrx}
              onChange={vm.changeTokenBalance}
              value={vm.ibzrxInput}
            />
          )}
          {wallet.bpt.gte(0.01) && stakingAllowances.bpt.amount.gte(wallet.bpt) && (
            <InputStake
              id="bpt"
              label="BPT"
              max={wallet.bpt}
              onChange={vm.changeTokenBalance}
              value={vm.bptInput}
            />
          )}

          {stakingAllowances.needApprovalList.length < 4 && (
            <Button
              isLoading={vm.stakingStore.stakingPending}
              className="button full-button blue"
              disabled={!vm.canStake}
              onClick={vm.stake}>
              Stake
            </Button>
          )}
        </>
      )}
    </React.Fragment>
  )
}

export default observer(AddToBalance)
