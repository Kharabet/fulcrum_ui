# Staking QA

The main features of the staking dashboard and how they are expected to work.

The tokens related to staking: BZRX, vBZRX, iBZRX, BPT, 3CRV.

**Check the README.md** at the root of staking-dashboard folder to know how to use a local mainnet fork for testing.

## Sections: "Staking" & "Rewards"

The UI should show tabs to switch sections from "staking" and "rewards".

## Staking: User balances

- The UI should show properly the amount of tokens
  - that the user has in his wallet that he can stake
  - that the user has staked already.

## Staking: Stake / Unstake form

There are 2 tabs: "Stake" and "Unstake"

- "Stake" is visible only when the user has stakeable tokens in his wallet.
- "Unstake" is visible only when the user has tokens staked in BZX.

* The "stake" tab

  - There should be as many input (field + slider) as tokens that user can stake and approved
  - User moves slider and can click stake.
  - The "stake" tab also displays the token spending approvals. (next point)

* The "unstake" tab
  - If the user has already staked something, this tab should be visible
  - There should be as many input (field + slider) as tokens that user can unstake
  - User moves slider and can click unstake.

## Staking: Spending approvals

- The UI should show / allow user to set spending approval for the tokens **that need it**.
  - There are as many approval button than stakeable tokens in user wallet. eg: No "Approve BZRX" button should be shown if the user has no BZRX in his wallet.
  - If the user approves and it's successful, the button should disappear and the user can now stake.

## Rewards

There are 4 types of rewards. 3 are claimable:

1. "Staking rewards" (BZRX + 3CRV) -> Claimable
2. "Vesting staking rewards" or "time-locked" (BZRX + 3CRV) -> NOT claimable
3. "User rewards" (VBZRX = fee rebate) -> Claimable
4. "Vested BZRX" (BZRX) -> claimable

### 1. Staking rewards

Tokens: **BZRX, 3CRV**

- The UI should show the claimable amounts (BZRX & 3CRV tokens).
- There should be a "claim" button.
- There should be a "restake" option.
- Default option should be "restake" enabled.
- About restake option
  - If _enabled_: claimed BZRX are added to staked balance, 3CRV tokens are sent to user wallet.
  - If _NOT enabled_: claimed BZRX and 3CRV tokens are both sent to user wallet.

### 2. Vesting staking rewards

Tokens: **BZRX, 3CRV**

- The UI should show balances of BZRX and 3CRV.
- They can not be claimed.

### 3. User rewards (Fee rebate)

Tokens: **vBZRX**

- The UI should show balance of vBZRX that can be claimed.
- Once claimed they are sent to the user wallet.

### 4. Vested BZRX

Tokens: **BZRX**

- The UI should show balance of BZRX that can be claimed.
- Once claimed they are sent to user wallet.
