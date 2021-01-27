import React from 'react'
import RewardsVM from './RewardsVM'
import StakingRewards from './StakingRewards'
import UserRewards from './UserRewards'
import VestedBZRX from './VestedBZRX'
import VestingRewards from './VestingRewards'

export default function Rewards({ vm }: { vm: RewardsVM }) {
  return (
    <div className="grid--staking">
      <div className="panel--white padded-2">
        <StakingRewards vm={vm} />
      </div>
      <div className="panel--white padded-2">
        <VestingRewards vm={vm} />
      </div>
      <div className="panel--white padded-2">
        <UserRewards vm={vm} />
      </div>
      <div className="panel--white padded-2">
        <VestedBZRX vm={vm} />
      </div>
    </div>
  )
}
