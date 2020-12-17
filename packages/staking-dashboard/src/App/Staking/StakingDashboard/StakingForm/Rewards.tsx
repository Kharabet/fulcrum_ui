import { ReactComponent as VBzrxIcon } from 'app-images/token-vbzrx.svg'
import { observer } from 'mobx-react'
import React from 'react'
import { RootStore } from 'src/stores'

export function Rewards(props: { rootStore: RootStore }) {
  const { rootStore } = props
  const { etherscanURL, stakingStore } = rootStore
  const { rewards } = stakingStore

  return (
    <div className="calculator-row rewards-container">
      <div className="reward-item">
        <div className="row-header">Incentive rewards balance:</div>
        <div className="row-body">
          <div className="reward-content">
            <a
              href={`${etherscanURL}token/0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F`}
              target="_blank"
              rel="noopener noreferrer">
              <span className="icon">
                <VBzrxIcon />
              </span>
            </a>
            <span className="value" title={rewards.rebateRewards.toFixed(18, 1)}>
              {rewards.rebateRewards.toFixed(4, 1)}
            </span>
          </div>
          <button
            className="button"
            disabled={!rewards.rebateRewards.gt(0)}
            onClick={rewards.claimRewards}>
            Claim Rewards
          </button>
        </div>
      </div>
      <div className="reward-item">
        <div className="row-header">Staking rewards balance:</div>
        <div className="row-body">
          <div className="reward-content">
            <span className="currency">$</span>
            <span className="value" title={rewards.userEarnings.toFixed(18, 1)}>
              {rewards.userEarnings.toFixed(2, 1)}
            </span>
          </div>
          <button className="button" disabled={true}>
            Claim Rewards
          </button>
        </div>
      </div>
    </div>
  )
}

export default observer(Rewards)
