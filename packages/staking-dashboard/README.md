# Interface for the bZx staking dashboard

# Development

## Working with a local mainnet fork
This method uses _brownie_ and _Infura_ to create a local mainnet fork.

__Contracts setup and requirements__

The following must be done in the contract repo folder.

* [brownie must be installed](https://github.com/eth-brownie/brownie)
* You must compile the contracts with `brownie compile --all`
* you need a [personal Infura project id](https://infura.io/)
* __env vars__ must be available when running brownie:
    * `WEB3_INFURA_PROJECT_ID`
    * `ETHERSCAN_TOKEN `


__UI setup__

* The UI is started with `yarn start-mainnet`
* The local fork will be available on `localhost:8545`
* Provider, like Metamask should be pointed to `localhost:8545`


### Commands and scripts

Run from the __contract repo folder__.

__Start the fork__

```
brownie console --network mainnet-fork
```

__Setup the fork + useful commands__

You can copy paste the following up until `"Commands to create test cases"` into the brownie console. The rest of the commands to execute depend on what you want to test.

```py
# ACCOUNT: change "myAccount" to your wallet eg: Metamask)
myAccount="0x9B5dFE7965C4A30eAB764ff7abf81b3fa96847Fe"

# CONTRACTS SETUP
exec(open("./scripts/staking-fork.py").read())

# TEST ACCOUNT SETUP (sends token + approvals)
accounts[0].transfer(myAccount, 10e18)
BZRX.transfer(myAccount, 123e18, {"from": BZRX.address})
vBZRX.transfer(myAccount, 234e18, {"from": vBZRX.address})
## Note: LPT "stolen" from a whale, change address if needed
LPT.transferFrom("0x4085e9fb679dd2f60c2e64afe9533107fa1c18f2", myAccount, 345e18, {"from": "0x4085e9fb679dd2f60c2e64afe9533107fa1c18f2"})
BZRX.approve(iBZRX, 10*10**50, {"from": myAccount})
iBZRX.mint(myAccount, 25*10**18, {"from": myAccount})
## Spending Approvals
BZRX.approve(staking, 10*10**50, {"from": accounts[0]})
vBZRX.approve(staking, 10*10**50, {"from": accounts[0]})
iBZRX.approve(staking, 10*10**50, {"from": accounts[0]})
LPT.approve(staking, 10*10**50, {"from": accounts[0]})

# ----------  COMMANDS TO CREATE TEST CASES ----------- #

# --- STAKE ---

# STAKE multiple
staking.stake([BZRX, vBZRX, iBZRX, LPT], [10e18, 10e18, 10e18, 10e18], {"from": accounts[0]})

# --- REWARDS ---

# SWEEP FEES (myAccount can claim BZRX / 3CRV)
staking.setMaxAllowedDisagreement(10e18)
staking.sweepFees({"from": accounts[0]})

# REWARDS: generate incentive rewards (VBZRX)
borrowAmount = 100*10**6
borrowTime = 7884000
collateralAmount = 1*10**18
collateralAddress = "0x0000000000000000000000000000000000000000"
txBorrow = iUSDC.borrow("", borrowAmount, borrowTime, collateralAmount, collateralAddress,                         myAccount, myAccount, b"", {'from': myAccount, 'value': Wei(collateralAmount)})

# --- UNSTAKE ---

# UNSTAKE one
staking.unstake([BZRX], [10e18], {"from": accounts[0]})

# UNSTAKE multiple
staking.unstake([BZRX, vBZRX, iBZRX, LPT], [10e18, 10e18, 10e18, 10e18], {"from": accounts[0]})

# UNSTAKE all
staking.exit({"from": accounts[0]})

# --- DELEGATES ---

# CREATE DELEGATES
for i in range(10):
    BZRX.transfer(accounts[i], (100+i)*10**18, {'from': BZRX})
    BZRX.approve(staking, 500e18, {'from': accounts[i]})
    staking.stake([BZRX], [BZRX.balanceOf(accounts[i])], {'from': accounts[i]})

```
