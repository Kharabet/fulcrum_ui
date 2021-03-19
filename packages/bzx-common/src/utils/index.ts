import { BigNumber } from '@0x/utils'
import { Web3Wrapper } from '@0x/web3-wrapper'
import Asset from '../assets/Asset'
import ContractsSource from '../contracts/ContractsSource'
import AssetsDictionary from '../assets/AssetsDictionary'
import appConfig from '../config/appConfig'
import { TorqueProvider } from '../../../torque/src/services/TorqueProvider'
import { ExplorerProvider } from '../../../protocol-explorer/src/services/ExplorerProvider'
import { StakingProvider } from '../../../staking-dashboard/src/services/StakingProvider'
import { FulcrumProvider } from '../../../fulcrum/src/services/FulcrumProvider'

function getErc20AddressOfAsset(asset: Asset): string | null {
  let result: string | null = null

  const assetDetails = AssetsDictionary.assets.get(asset)
  if (appConfig.web3ProviderSettings && assetDetails) {
    result = assetDetails.addressErc20.get(appConfig.web3ProviderSettings.networkId) || ''
  }
  return result
}

async function getEthBalance(
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider
): Promise<BigNumber> {
  let result: BigNumber = new BigNumber(0)
  const account = provider.currentAccount
  if (!account || !provider.web3Wrapper) {
    return result
  }
  const balance = await provider.web3Wrapper.getBalanceInWeiAsync(account)
  result = new BigNumber(balance)

  return result
}

async function getErc20BalanceOfUser(
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  addressErc20: string,
  account?: string
): Promise<BigNumber> {
  let result = new BigNumber(0)

  if (account && provider.contractsSource) {
    const tokenContract = await provider.contractsSource.getErc20Contract(addressErc20)
    if (tokenContract) {
      result = await tokenContract.balanceOf(account).callAsync()
    }
  }

  return result
}

function getGoodSourceAmountOfAsset(asset: Asset): BigNumber {
  switch (asset) {
    case Asset.WBTC:
      return new BigNumber(10 ** 6)
    case Asset.USDC:
    case Asset.USDT:
      return new BigNumber(10 ** 4)
    default:
      return new BigNumber(10 ** 16)
  }
}

const getLocalstorageItem = (item: string) => {
  let response = ''
  try {
    response = localStorage.getItem(item) || ''
  } catch (e) {
    console.error(e)
  }
  return response
}

const setLocalstorageItem = (item: string, val: string) => {
  try {
    localStorage.setItem(item, val)
  } catch (e) {
    console.error(e)
  }
}

const getCurrentAccount = (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider
) => {
  return provider.impersonateAddress
    ? provider.impersonateAddress
    : provider.accounts.length > 0 && provider.accounts[0]
    ? provider.accounts[0].toLowerCase()
    : undefined
}

export {
  getErc20AddressOfAsset,
  getEthBalance,
  getErc20BalanceOfUser,
  getGoodSourceAmountOfAsset,
  getLocalstorageItem,
  setLocalstorageItem,
  getCurrentAccount,
}
export * from './blockchainEventsUtils'
