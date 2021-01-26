import React from 'react'
import RewardsVM from './RewardsVM'
import StakingRewards from './StakingRewards'
import UserRewards from './UserRewards'
import VestedBZRX from './VestedBZRX'
import VestingRewards from './VestingRewards'

export default function Rewards({ vm }: { vm: RewardsVM }) {
  return (
    <>
      <StakingRewards vm={vm} />
      <VestingRewards vm={vm} />
      <UserRewards vm={vm} />
      <VestedBZRX vm={vm} />
    </>
  )
}
