import { observer } from 'mobx-react'
import React from 'react'
import { Button } from 'ui-framework'
import StakingFormVM from '../StakingFormVM'
import { tokenIcons } from 'app-images'

export function SpendingAllowance({ vm }: { vm: StakingFormVM }) {
  const { needApprovalList } = vm.stakingStore.stakingAllowances

  if (needApprovalList.length === 0) {
    return null
  }

  return (
    <div className="margin-bottom-2 panel--white padded-2">
      <h3 className="section-header">Spending Approval</h3>
      <p className="margin-bottom-2">
        <span className="margin-right-1ch">
          Please approve all the tokens you are planning to stake, in order to save on transaction
          fees.
        </span>
        <Button className="btn--link" onClick={vm.spendingAllowanceDetails.toggle}>
          <i>Details</i>
        </Button>
      </p>
      {vm.spendingAllowanceDetails.visible && (
        <div className="margin-bottom-2">
          <h3 className="section-header">What is a Spending Approval?</h3>
          <p>
            When staking, your tokens are moved from your wallet to the BZX staking contract. In
            order to do so, you need to approve a transaction that will allow it.
          </p>
          <p>
            While you can stake multiple tokens at the same time, spending approvals are done for
            each token separately.
          </p>
        </div>
      )}

      <div className="ui-grid-wmin-260px">
        {needApprovalList.map((allowance) => {
          const tokenlc = allowance.tokenName.toLowerCase()
          return (
            <Button
              key={allowance.tokenName}
              isLoading={allowance.pending}
              className="btn--blue btn--medium txt-left"
              onClick={vm.setSpendingAllowance}
              onClickEmit="value"
              value={tokenlc}>
              <div className="flex-row-center">
                <div className="margin-right-1">{tokenIcons[tokenlc]}</div>
                <span>Approve {allowance.tokenName}</span>
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default observer(SpendingAllowance)
