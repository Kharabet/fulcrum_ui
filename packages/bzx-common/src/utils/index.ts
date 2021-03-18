import { BigNumber } from '@0x/utils'
import { Web3Wrapper } from '@0x/web3-wrapper'
import Asset from '../assets/Asset'
import ContractsSource from '../contracts/ContractsSource'
import AssetsDictionary from '../assets/AssetsDictionary'
import appConfig from '../config/appConfig'


function getErc20AddressOfAsset(asset: Asset): string | null {
  let result: string | null = null

  const assetDetails = AssetsDictionary.assets.get(asset)
  if (appConfig.web3ProviderSettings && assetDetails) {
    result = assetDetails.addressErc20.get(appConfig.web3ProviderSettings.networkId) || ''
  }
  return result
}

async function getEthBalance(
  web3Wrapper: Web3Wrapper,
  account?: string
): Promise<BigNumber> {
  let result: BigNumber = new BigNumber(0)

  if (account) {
    const balance = await web3Wrapper.getBalanceInWeiAsync(account)
    result = new BigNumber(balance)
  }

  return result
}

async function getErc20BalanceOfUser(
  contractsSource: ContractsSource,
  addressErc20: string,
  account?: string): Promise<BigNumber> {
  let result = new BigNumber(0)

  if (account) {
    const tokenContract = await contractsSource.getErc20Contract(addressErc20)
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

const getCurrentAccount = (accounts: string[], impersonateAddress?: string) => {
  return impersonateAddress
    ? impersonateAddress
    : accounts.length > 0 && accounts[0]
      ? accounts[0].toLowerCase()
      : undefined
}

export {
  getErc20AddressOfAsset,
  getEthBalance,
  getErc20BalanceOfUser,
  getGoodSourceAmountOfAsset,
  getLocalstorageItem,
  setLocalstorageItem,
  getCurrentAccount
}
export * from './blockchainEventsUtils'