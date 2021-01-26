import { observer } from 'mobx-react'
import React from 'react'
import AssetBalance from 'shared-components/AssetBalance'
import ExternalLink from 'shared-components/ExternalLink'
import { Button, InputBasic } from 'ui-framework'
import RewardsVM from './RewardsVM'

export function StakingRewards({ vm }: { vm: RewardsVM }) {
  const { rewards } = vm

  return (
    <div className="panel--white padded-2 margin-bottom-2">
      <h3 className="section-header">Staking Rewards</h3>
      <div className="ui-grid-wmin-260px">
        <div className="margin-bottom-1">
          <AssetBalance
            className="margin-bottom-2"
            variant="green"
            balance={rewards.bzrx}
            id="bzrx"
            name="BZRX"
          />

          <AssetBalance
            className="margin-bottom-2"
            variant="green"
            balance={rewards.stableCoin}
            id="crv"
            name="3CRV (USD)"
          />
        </div>

        <div className="margin-bottom-1 flex-col">
          <p className="margin-top-0">
            <b>3CRV</b> is an interest earning stablecoin made up of other stablecoins. You can
            redeem them for USDC, USDT, or DAI on{' '}
            <ExternalLink href="https://www.curve.fi/">curve.fi</ExternalLink>. Learn more{' '}
            <ExternalLink href="https://bzx.network/blog/staking-bzrx">here</ExternalLink>.
          </p>
          <Button
            isLoading={rewards.pendingStakingRewards}
            className="button blue btn--medium margin-bottom-1"
            disabled={!rewards.canClaimStakingRewards}
            onClick={vm.claimStakingRewards}>
            Claim {vm.inputRestake ? '& Restake' : ''}
          </Button>
          <div className="txt-center">
            <InputBasic
              id="input-restake"
              type="checkbox"
              onChange={vm.set}
              onChangeEmit="name-value"
              name="inputRestake"
              value={vm.inputRestake}
            />
            <label className="margin-left-1ch label" htmlFor="input-restake">
              Restake
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(StakingRewards)
