import { observer } from 'mobx-react'
import React from 'react'
import StakingFormVM from '../StakingFormVM'
import Unstake from './Unstake'
import Stake from './Stake'
import { ButtonBasic } from 'ui-framework'
import SpendingAllowance from './SpendingAllowance'

export function AddToBalance({ vm }: { vm: StakingFormVM }) {
  return (
    <React.Fragment>
      <div className="margin-top-2">
        <div className="margin-bottom-2 margin-left-1">
          {vm.userBalances.wallet.isWorthEnough && (
            <ButtonBasic
              className={`btn--tab margin-right-1 ${!vm.unstakeSelected ? 'active' : ''}`}
              onClick={vm.set}
              onClickEmit="name-value"
              name="unstakeSelected"
              value={false}>
              Stake
            </ButtonBasic>
          )}
          {vm.userBalances.staked.isWorthEnough && (
            <ButtonBasic
              className={`btn--tab ${vm.unstakeSelected ? 'active' : ''}`}
              onClick={vm.set}
              onClickEmit="name-value"
              name="unstakeSelected"
              value={true}>
              Unstake
            </ButtonBasic>
          )}
        </div>

        {!vm.unstakeSelected && <SpendingAllowance vm={vm} />}

        {vm.stakingStore.stakingAllowances.needApprovalList.length < 4 &&
          (vm.unstakeSelected ? <Unstake vm={vm} /> : <Stake vm={vm} />)}
      </div>
    </React.Fragment>
  )
}

export default observer(AddToBalance)
