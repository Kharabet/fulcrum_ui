import { observer } from 'mobx-react'
import React from 'react'
import { Button } from 'ui-framework'
import AppVM from '../AppVM'
import Rewards from './Rewards'
import StakingForm from './StakingForm'
import WalletUpdate from './WalletUpdate'

export function StakingDashboard({ appVM }: { appVM: AppVM }) {
  const {rewards} = appVM.rootStore.stakingStore
  return (
    <section className="calculator padded-h-2">
      <div className="margin-bottom-2">
        <Button
          className={`btn--tab margin-right-2 ${appVM.section === 'stake' ? 'active' : ''}`}
          name="section"
          value="stake"
          onClick={appVM.set}
          onClickEmit="name-value">
          Staking
        </Button>
        <Button
          notify={rewards.canClaimStakingRewards || rewards.canClaimRebateRewards}
          className={`btn--tab ${appVM.section === 'rewards' ? 'active' : ''}`}
          name="section"
          value="rewards"
          onClick={appVM.set}
          onClickEmit="name-value">
          Rewards
        </Button>
      </div>
      {appVM.section === 'stake' && <StakingForm />}
      {appVM.section === 'rewards' && <Rewards appVM={appVM}/>}
      <WalletUpdate appVM={appVM}/>
    </section>
  )
}

export default observer(StakingDashboard)
