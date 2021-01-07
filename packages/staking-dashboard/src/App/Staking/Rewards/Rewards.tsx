import React from 'react'
import RewardsVM from './RewardsVM'
import AssetBalance from 'shared-components/AssetBalance'
import { Button, InputBasic } from 'ui-framework'
import { tokenIcons } from 'app-images'

export default function Rewards({ vm }: { vm: RewardsVM }) {
  const { rootStore } = vm
  const { etherscanURL, stakingStore } = rootStore
  const { rewards } = stakingStore

  return (
    <div>
      <div className="panel--white padded-2 margin-bottom-2">
        <h3 className="section-header">Staking Rewards</h3>
        <div className="ui-grid-wmin-260px">
          <div className="margin-bottom-1">
            <AssetBalance
              className="margin-bottom-2"
              variant="green"
              tokenLogo={tokenIcons.bzrx}
              balance={rewards.bzrx}
              name="BZRX"
            />

            <AssetBalance
              className="margin-bottom-2"
              variant="green"
              tokenLogo={tokenIcons.crv}
              balance={rewards.stableCoin}
              name="3CRV (USD)"
            />
          </div>

          <div className="margin-bottom-1 flex-col">
            <p className="margin-top-0">
              <b>What is 3CRV?</b> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus
              est ex dolorum, at rem odio ipsa ratione nam ut nihil.
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

      <div className="panel--white padded-2 margin-bottom-2">
        <h3 className="section-header">Time-Locked Rewards</h3>
        <div className="ui-grid-wmin-260px">
          <div className="margin-bottom-1">
            <AssetBalance
              className="margin-bottom-2"
              variant="green"
              tokenLogo={tokenIcons.bzrx}
              balance={rewards.bzrxVesting}
              name="BZRX"
            />
            <AssetBalance
              className="margin-bottom-2"
              variant="green"
              tokenLogo={tokenIcons.crv}
              balance={rewards.stableCoinVesting}
              name="3CRV (USD)"
            />
          </div>
          <div className="flex-col">
            <p className="margin-top-0">
              <b>What are time-locked rewards?</b> Lorem ipsum dolor sit amet, consectetur adipisicing
              elit!
            </p>
          </div>
        </div>
      </div>

      <div className="panel--white padded-2 margin-bottom-2">
        <h3 className="section-header">Incentive Rewards</h3>
        <div className="ui-grid-wmin-260px">
          <div>
            <AssetBalance
              variant="green"
              className="margin-bottom-3"
              balance={rewards.rebateRewards}
              link={`${etherscanURL}token/0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F`}
              name="vBZRX"
              tokenLogo={tokenIcons.vbzrx}
            />
          </div>
          <div className="flex-col">
            <p className="margin-top-0">
              <b>What are incentive rewards?</b> Rewards for using the platform.
            </p>
            <Button
              isLoading={rewards.pendingRebateRewards}
              className="button blue btn--medium"
              disabled={!rewards.canClaimRebateRewards}
              onClick={rewards.claimRebateRewards}>
              Claim
            </Button>
          </div>
        </div>
      </div>

      <div className="panel--white padded-2">
        <h3 className="section-header">Vested BZRX</h3>
        <div className="ui-grid-wmin-260px">
          <div>
            <AssetBalance
              variant="green"
              className="margin-bottom-3"
              balance={rewards.vestedVbzrx}
              name="BZRX"
              tokenLogo={tokenIcons.bzrx}
            />
          </div>
          <div className="flex-col">
            <p className="margin-top-0">
              vBZRX tokens turn into BZRX over time.
            </p>
            <Button
              isLoading={rewards.pendingVbzrxClaim}
              className="button blue btn--medium"
              disabled={!rewards.canClaimVestedBZRX}
              onClick={rewards.claimVestedBzrx}>
              Claim
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
