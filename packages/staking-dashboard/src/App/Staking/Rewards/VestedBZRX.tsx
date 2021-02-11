import { observer } from 'mobx-react'
import React from 'react'
import AssetBalance from 'shared-components/AssetBalance'
import { Button } from 'ui-framework'
import RewardsVM from './RewardsVM'

export function StakingRewards({ vm }: { vm: RewardsVM }) {
  const { rewards, stakingStore } = vm

  return (
    <div className="flex-col">
      <h3 className="section-header">Vested BZRX in Your Wallet</h3>
      <AssetBalance
        variant="green"
        className="margin-bottom-2"
        balance={rewards.vestedVbzrx}
        id="bzrx"
        name="BZRX"
      />

      <p className="margin-bottom-2">
        <b>vBZRX tokens in your wallet</b> vest BZRX overtime. Your available BZRX are listed above.
      </p>

      <Button
        isLoading={rewards.pendingVbzrxClaim}
        className="button blue btn--medium flex-col-end"
        disabled={!rewards.canClaimVestedBZRX}
        onClick={stakingStore.claimVestedBzrx}>
        Claim
      </Button>
    </div>
  )
}

export default observer(StakingRewards)
