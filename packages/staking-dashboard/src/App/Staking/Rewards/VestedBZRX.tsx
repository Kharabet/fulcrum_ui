import { observer } from 'mobx-react'
import React from 'react'
import AssetBalance from 'shared-components/AssetBalance'
import { Button } from 'ui-framework'
import RewardsVM from './RewardsVM'

export function StakingRewards({ vm }: { vm: RewardsVM }) {
  const { rewards, stakingStore } = vm

  return (
    <div className="panel--white padded-2">
      <h3 className="section-header">Vested BZRX</h3>
      <div className="ui-grid-wmin-260px">
        <div>
          <AssetBalance
            variant="green"
            className="margin-bottom-3"
            balance={rewards.vestedVbzrx}
            id="bzrx"
            name="BZRX"
          />
        </div>
        <div className="flex-col">
          <p className="margin-top-0">vBZRX tokens turn into BZRX over time.</p>
          <Button
            isLoading={rewards.pendingVbzrxClaim}
            className="button blue btn--medium"
            disabled={!rewards.canClaimVestedBZRX}
            onClick={stakingStore.claimVestedBzrx}>
            Claim
          </Button>
        </div>
      </div>
    </div>
  )
}

export default observer(StakingRewards)
