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
      <div className="add-to-balance margin-top-2">
        <div className="margin-bottom-2">
          {vm.userBalances.wallet.isWorthEnough && (
            <ButtonBasic
              className={`btn--tab margin-right-2 ${!vm.unstakeSelected ? 'active' : ''}`}
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

        <SpendingAllowance vm={vm} />

        <div className="panel--white padded-2">
          {vm.unstakeSelected ? <Unstake vm={vm} /> : <Stake vm={vm} />}
        </div>
      </div>
    </React.Fragment>
  )
}

export default observer(AddToBalance)
