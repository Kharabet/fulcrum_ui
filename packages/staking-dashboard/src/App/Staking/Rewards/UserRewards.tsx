import { observer } from 'mobx-react'
import React from 'react'
import AssetBalance from 'shared-components/AssetBalance'
import { Button } from 'ui-framework'
import RewardsVM from './RewardsVM'

export function StakingRewards({ vm }: { vm: RewardsVM }) {
  const { stakingStore, rewards } = vm

  return (
    <div className="panel--white padded-2 margin-bottom-2">
      <h3 className="section-header">User Rewards</h3>
      <div className="ui-grid-wmin-260px">
        <div>
          <AssetBalance
            variant="green"
            className="margin-bottom-3"
            balance={rewards.rebateRewards}
            id="vbzrx"
            name="vBZRX"
          />
        </div>
        <div className="flex-col">
          <p className="margin-top-0">
            <b>When you trade or borrow</b>, half the fees you've paid are returned to you in the
            form of vBZRX.
          </p>
          <Button
            isLoading={rewards.pendingRebateRewards}
            className="button blue btn--medium"
            disabled={!rewards.canClaimRebateRewards}
            onClick={stakingStore.claimRebateRewards}>
            Claim
          </Button>
        </div>
      </div>
    </div>
  )
}

export default observer(StakingRewards)
