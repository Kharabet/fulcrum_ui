import { observer } from 'mobx-react'
import React from 'react'
import AssetBalance from 'shared-components/AssetBalance'
import { Button } from 'ui-framework'
import RewardsVM from './RewardsVM'

export function StakingRewards({ vm }: { vm: RewardsVM }) {
  const { stakingStore, rewards } = vm

  return (
    <div className="flex-col">
      <h3 className="section-header">User Rewards</h3>

      <AssetBalance
        variant="green"
        className="margin-bottom-2"
        balance={rewards.rebateRewards}
        id="vbzrx"
        name="vBZRX"
      />

      <p className="margin-bottom-2">
        <b>When you trade or borrow</b>, half the fees you've paid are returned to you in the form
        of vBZRX.
      </p>
      <Button
        isLoading={rewards.pendingRebateRewards}
        className="button blue btn--medium flex-col-end"
        disabled={!rewards.canClaimRebateRewards}
        onClick={stakingStore.claimRebateRewards}>
        Claim
      </Button>
    </div>
  )
}

export default observer(StakingRewards)
