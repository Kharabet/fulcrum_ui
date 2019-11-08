import { BigNumber } from "@0x/utils";
import { Asset, AssetsDictionary, ContractsSource, TradeTokenKey } from "@bzxnetwork/mmaker-wrappers";

export const getEthPriceInDAI = async (contractsSource: ContractsSource, networkId: number): Promise<BigNumber> => {
  let result = new BigNumber(0);

  const ethAssetDetails = AssetsDictionary.assets.get(Asset.ETH);
  const daiAssetDetails = AssetsDictionary.assets.get(Asset.DAI);
  if (ethAssetDetails && daiAssetDetails) {
    const oracleContract = await contractsSource.getOracleContract();
    const swapPriceData: BigNumber[] = await oracleContract.getTradeData.callAsync(
      ethAssetDetails.addressErc20.get(networkId) || "",
      daiAssetDetails.addressErc20.get(networkId) || "",
      new BigNumber(10 ** 18)
    );
    result = swapPriceData[0].dividedBy(10 ** 18);
  }

  return result;
};

export const getTokenPriceInDAI = async (
  contractsSource: ContractsSource,
  networkId: number,
  tokenName: string,
  ethPriceInDai: BigNumber
): Promise<BigNumber> => {
  if (tokenName === "DAI") return new BigNumber(1);

  if (tokenName === "ETH") return getEthPriceInDAI(contractsSource, networkId);

  const tradeTokenKey = TradeTokenKey.fromString(tokenName);
  if (tradeTokenKey) {
    let tokenPrice = await getPTokenPrice(contractsSource, tradeTokenKey);
    return tradeTokenKey.unitOfAccount !== Asset.DAI ? tokenPrice.multipliedBy(ethPriceInDai) : tokenPrice;
  }

  return new BigNumber(0);
};

const getPTokenPrice = async (contractsSource: ContractsSource, selectedKey: TradeTokenKey): Promise<BigNumber> => {
  let result = new BigNumber(0);

  const assetContract = await contractsSource.getPTokenContract(selectedKey);
  if (assetContract) {
    result = await assetContract.tokenPrice.callAsync();
  }

  return result.dividedBy(10 ** 18);
};
