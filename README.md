# User interfaces for fulcrum.trade, torque.loans, and some related packages

# Development

## Installation

Before starting the project need to install:

- [Node.js](https://nodejs.org/uk/) release 14.x or later with **npm** required.
- Yarn through the npm package manager `npm install --global yarn`
- [node-jyp](https://github.com/nodejs/node-gyp)  - Node.js native addon build tool
- Install all project dependencies with `yarn` command

## Working with different networks

**Requirements**

- you need a [personal Infura project key](https://infura.io/)
- Create **.env** file based on **.env.sample** with `REACT_APP_INFURA_KEY` filled

**UI setup**

- change `REACT_APP_ETH_NETWORK` value to selected network name in the root `.env` file
- Change the directory (folder) in your terminal like `cd packages/app_name`
- Enter `yarn start` to run the app locally

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
- Set `REACT_APP_ETH_NETWORK = mainnet` variable in the root `.env` file
- The UI is started with `yarn`
- The local fork will be available on `localhost:8545`
- Provider, like Metamask should be pointed to `localhost:8545`

**Metamask example**

Go to Settings -> networks -> add network

- Network name: **Localhost 8545**
- RPC url: **http://localhost:8545**
- Chain ID: **1**
- Currency Symbol: **ETH**

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
```

## Other

### Running ganache cli standalone

`ganache-cli --accounts 10 --hardfork istanbul --fork https://mainnet.infura.io/v3/11e3d4b69e3b45869281bddc2e67477e --gasLimit 10000000 --mnemonic brownie --port 8545 -v`
