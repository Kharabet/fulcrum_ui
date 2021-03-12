import { observer } from 'mobx-react'
import React from 'react'
import AssetBalance from 'shared-components/AssetBalance'
import ExternalLink from 'shared-components/ExternalLink'
import RewardsVM from './RewardsVM'

export function VestingRewards({ vm }: { vm: RewardsVM }) {
  const { rewards } = vm

  return (
    <>
      <h3 className="section-header">Time-Locked Rewards</h3>
      <div>
        <div className="margin-bottom-1">
          <AssetBalance
            className="margin-bottom-2"
            variant="green"
            balance={rewards.bzrxVesting}
            id="bzrx"
            name="BZRX"
          />
          <AssetBalance
            className="margin-bottom-2"
            variant="green"
            balance={rewards.stableCoinVesting}
            id="crv"
            name="3CRV (USD)"
          />
        </div>
        <div className="flex-col">
          <p>
            <b>When you stake vesting BZRX</b> (vBZRX), your staking rewards are unlocked on the
            same schedule as the vesting. Learn more{' '}
            <ExternalLink href="https://bzx.network/blog/staking-bzrx" targetBlank={true}>
              here
            </ExternalLink>
            .
          </p>
        </div>
      </div>
    </>
  )
}

export default observer(VestingRewards)
