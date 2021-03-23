import { BigNumber } from '@0x/utils'
import Asset from '../../assets/Asset'
import AssetsDictionary from '../../assets/AssetsDictionary'
import appConfig from '../../config/appConfig'
import providerUtils from '../providerUtils'
import { TorqueProvider } from '../../../../torque/src/services/TorqueProvider'
import { ExplorerProvider } from '../../../../protocol-explorer/src/services/ExplorerProvider'
import { StakingProvider } from '../../../../staking-dashboard/src/services/StakingProvider'
import { FulcrumProvider } from '../../../../fulcrum/src/services/FulcrumProvider'

// Returns swap rate from Chainlink Oracle
async function getSwapRate(
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  srcAsset: Asset,
  destAsset: Asset
): Promise<BigNumber> {
  let result: BigNumber = new BigNumber(0)
  if (provider.unsupportedNetwork) {
    return result
  }
  const srcAssetErc20Address = providerUtils.getErc20AddressOfAsset(srcAsset)
  const destAssetErc20Address = providerUtils.getErc20AddressOfAsset(destAsset)

  if (provider.contractsSource && srcAssetErc20Address && destAssetErc20Address) {
    const oracleContract = await provider.contractsSource.getOracleContract()

    const srcAssetDecimals = AssetsDictionary.assets.get(srcAsset)?.decimals || 18
    const srcAssetPrecision = new BigNumber(10 ** (18 - srcAssetDecimals))
    const destAssetDecimals = AssetsDictionary.assets.get(destAsset)?.decimals || 18
    const destAssetPrecision = new BigNumber(10 ** (18 - destAssetDecimals))
    try {
      const swapPriceData: BigNumber[] = await oracleContract
        .queryRate(srcAssetErc20Address, destAssetErc20Address)
        .callAsync()
      // console.log("swapPriceData- ",swapPriceData[0])
      result = swapPriceData[0]
        .times(srcAssetPrecision)
        .div(destAssetPrecision)
        .dividedBy(10 ** 18)
        .multipliedBy(swapPriceData[1].dividedBy(10 ** 18)) // swapPriceData[0].dividedBy(10 ** 18);
    } catch (e) {
      console.error(e)
      result = new BigNumber(0)
    }
  }
  return result
}

async function getSwapToUsdRateBatch(
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  assets: Asset[],
  usdToken: Asset
): Promise<[BigNumber[], BigNumber[], BigNumber[]]> {
  let result: [BigNumber[], BigNumber[], BigNumber[]] = [[], [], []]

  if (provider.unsupportedNetwork) {
    return result
  }

  if (provider.contractsSource) {
    const usdTokenAddress = providerUtils.getErc20AddressOfAsset(usdToken)
    const underlyings = assets.map((e) => providerUtils.getErc20AddressOfAsset(e)) as string[]
    const amounts = assets.map((e) => providerUtils.getGoodSourceAmountOfAsset(e)) as BigNumber[]

    const helperContract = await provider.contractsSource.getDAppHelperContract()
    if (helperContract && usdTokenAddress) {
      result = await helperContract.assetRates(usdTokenAddress, underlyings, amounts).callAsync()
    }
  }

  return result
}

async function getSwapToUsdRate(
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  asset: Asset
): Promise<BigNumber> {
  return getSwapRate(
    provider,
    asset,
    appConfig.appNetwork === 'bsc' ? Asset.BUSD : appConfig.isMainnet ? Asset.DAI : Asset.USDC
  )
}

export default { getSwapRate, getSwapToUsdRate, getSwapToUsdRateBatch }
