# Interface for the bZx staking dashboard

# Development

## Working with a local mainnet fork

This method uses _brownie_ and _Infura_ to create a local mainnet fork.

**Contracts setup and requirements**

The following must be done in the contract repo folder.

- [brownie must be installed](https://github.com/eth-brownie/brownie)
- You must compile the contracts with `brownie compile --all`
- you need a [personal Infura project id](https://infura.io/)
- **env vars** must be available when running brownie:
  - `WEB3_INFURA_PROJECT_ID`
  - `ETHERSCAN_TOKEN`

**UI setup**

- The UI is started with `yarn start-mainnet`
- The local fork will be available on `localhost:8545`
- Provider, like Metamask should be pointed to `localhost:8545`

### Commands and scripts

Run from the **contract repo folder**.

**Start the fork**

```
brownie console --network mainnet-fork
```

**Setup the fork + useful commands**

You can copy paste the following up until `"Commands to create test cases"` into the brownie console. The rest of the commands to execute depend on what you want to test.

```py
# FORK SETUP
exec(open("./scripts/set-env.py").read())

# ACCOUNT: change "myAccount" to your wallet eg: Metamask)
myAccount="0x9B5dFE7965C4A30eAB764ff7abf81b3fa96847Fe"

# TEST ACCOUNT SETUP (sends token + approvals)
accounts[0].transfer(myAccount, 10e18)
BZRX.transfer(myAccount, 123e18, {"from": BZRX.address})
vBZRX.transfer(myAccount, 234e18, {"from": vBZRX.address})
## Note: BPT "stolen" from a whale, change address if needed
BPT.transferFrom("0xe95ebce2b02ee07def5ed6b53289801f7fc137a4", myAccount, 345e18, {"from": "0xe95ebce2b02ee07def5ed6b53289801f7fc137a4"})
BZRX.approve(iBZRX, 10*10**50, {"from": myAccount})
iBZRX.mint(myAccount, 25*10**18, {"from": myAccount})
## Spending Approvals
BZRX.approve(staking, 10*10**50, {"from": myAccount})
vBZRX.approve(staking, 10*10**50, {"from": myAccount})
iBZRX.approve(staking, 10*10**50, {"from": myAccount})
BPT.approve(staking, 10*10**50, {"from": myAccount})

# ----------  COMMANDS TO CREATE TEST CASES ----------- #

# --- STAKE ---

# STAKE multiple
staking.stake([BZRX, vBZRX, iBZRX, BPT], [10e18, 10e18, 10e18, 10e18], {"from": myAccount})

# --- REWARDS ---

# SWEEP FEES (myAccount can claim BZRX / 3CRV)
staking.sweepFees({"from": myAccount})

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
staking.unstake([BZRX, vBZRX, iBZRX, BPT], [10e18, 10e18, 10e18, 10e18], {"from": myAccount})

# UNSTAKE all
staking.exit({"from": myAccount})

# --- DELEGATES ---

# CREATE DELEGATES
for i in range(10):
    BZRX.transfer(accounts[i], (100+i)*10**18, {'from': BZRX})
    BZRX.approve(staking, 500e18, {'from': accounts[i]})
    staking.stake([BZRX], [BZRX.balanceOf(accounts[i])], {'from': accounts[i]})


# --- Move the blockchain in time for vbzrx ---
# 1720792801 is when vbzrx have all vested
chain.sleep(1720792801 - chain.time())
chain.mine()
```

## Other

### Running ganache cli standalone

`ganache-cli --accounts 10 --hardfork istanbul --fork https://mainnet.infura.io/v3/11e3d4b69e3b45869281bddc2e67477e --gasLimit 10000000 --mnemonic brownie --port 8545 -v`
