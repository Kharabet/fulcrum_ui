import { observer } from 'mobx-react'
import React from 'react'
import { Button } from 'ui-framework'
import AppVM from '../AppVM'
import Rewards from './Rewards'
import StakingForm from './StakingForm'
// import Governance from './Governance'
import WalletUpdate from './WalletUpdate'

export function StakingDashboard({ appVM }: { appVM: AppVM }) {
  const { rewards } = appVM.rootStore.stakingStore
  return (
    <section className="calculator r-padded-h-2">
      <div className="margin-bottom-2 flex-center">
        <Button
          className="staking__tab margin-right-1"
          active={appVM.section === 'stake'}
          name="section"
          value="stake"
          onClick={appVM.set}
          onClickEmit="name-value">
          Staking
        </Button>
        <Button
          notify={rewards.canClaimStakingRewards || rewards.canClaimRebateRewards}
          className="staking__tab"
          active={appVM.section === 'rewards'}
          name="section"
          value="rewards"
          onClick={appVM.set}
          onClickEmit="name-value">
          Rewards
        </Button>
        {/* <Button
          className="staking__tab"
          active={appVM.section === 'dao'}
          name="section"
          value="dao"
          onClick={appVM.set}
          onClickEmit="name-value">
          Governance
        </Button> */}
      </div>
      {appVM.section === 'stake' && <StakingForm />}
      {appVM.section === 'rewards' && <Rewards appVM={appVM} />}
      {/* {appVM.section === 'dao' && <Governance appVM={appVM} />} */}
      <WalletUpdate appVM={appVM} />
    </section>
  )
}

export default observer(StakingDashboard)
