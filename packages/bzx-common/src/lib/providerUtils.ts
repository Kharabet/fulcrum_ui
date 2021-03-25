import { BigNumber } from '@0x/utils'
import Asset from '../assets/Asset'
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
  address?: string
): Promise<BigNumber> {
  let result = new BigNumber(0)
  const account = address || provider.currentAccount
  if (account && provider.contractsSource) {
    const tokenContract = await provider.contractsSource.getErc20Contract(addressErc20)
    if (tokenContract) {
      result = await tokenContract.balanceOf(account).callAsync()
    }
  }

  return result
}

async function getAssetTokenBalanceOfUser(
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  asset: Asset,
  account?: string
): Promise<BigNumber> {
  let result: BigNumber = new BigNumber(0)
  if (asset === Asset.UNKNOWN) {
    // always 0
    result = new BigNumber(0)
  } else if (
    (appConfig.appNetwork === 'mainnet' && asset === Asset.ETH) ||
    (appConfig.appNetwork === 'bsc' && asset === Asset.BNB)
  ) {
    // get eth (wallet) balance
    if (provider.web3Wrapper && provider.contractsSource && provider.contractsSource.canWrite) {
      result = await getEthBalance(provider)
    }
  } else {
    const currentAccount = account ?? provider.currentAccount
    // get erc20 token balance
    const precision = AssetsDictionary.assets.get(asset)!.decimals || 18
    const assetErc20Address = getErc20AddressOfAsset(asset)
    if (provider.web3Wrapper && provider.contractsSource && assetErc20Address) {
      result = await getErc20BalanceOfUser(provider, assetErc20Address, currentAccount)
      result = result.multipliedBy(10 ** (18 - precision))
    }
  }
  // to get human-readable amount result should be divided always by 10**18
  return result
}

async function getITokenBalanceOfUser(
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  asset: Asset
): Promise<BigNumber> {
  let result = new BigNumber(0)

  if (provider.contractsSource) {
    const precision =
      AssetsDictionary.assets.get(
        (asset.includes('v1') ? asset.replace('v1', '') : asset) as Asset
      )!.decimals || 18
    const address = await provider.contractsSource.getITokenErc20Address(asset)
    if (address) {
      result = await getErc20BalanceOfUser(provider, address)
      result = result.multipliedBy(10 ** (18 - precision))
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
): string => {
  return provider.impersonateAddress
    ? provider.impersonateAddress
    : provider.accounts.length > 0 && provider.accounts[0]
    ? provider.accounts[0].toLowerCase()
    : ''
}

const isNativeToken = (asset: Asset): boolean => {
  return (appConfig.isMainnet && asset === Asset.ETH) || (appConfig.isBsc && asset === Asset.BNB) // || asset === Asset.WETH;
}

export default {
  getErc20AddressOfAsset,
  getEthBalance,
  getErc20BalanceOfUser,
  getAssetTokenBalanceOfUser,
  getITokenBalanceOfUser,
  getGoodSourceAmountOfAsset,
  getLocalstorageItem,
  setLocalstorageItem,
  getCurrentAccount,
  isNativeToken,
}
