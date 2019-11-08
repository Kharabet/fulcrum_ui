import { BigNumber } from "@0x/utils";
import { Asset, ContractsSource, TradeTokenKey } from "@bzxnetwork/mmaker-wrappers";

export const approve = async (efx: any, assetName: string) => {
  // we need approve only for DAI,
  // as ETH don't need it at all,
  // and pTokens don't need that, as we are handling them by another contract separately
  if (assetName === "DAI") {
    await efx.contract.approve(assetName);
  }
};

export const deposit = async (efx: any, contractsSource: ContractsSource, ethPriceInDai: BigNumber, assetName: string, amount: BigNumber, forTime: number = 24) => {
  if (assetName === "ETH") {
    await depositEth(efx, amount, forTime);
  } else if (assetName === "DAI") {
    await depositDai(efx, amount, forTime);
  } else {
    await depositPToken(contractsSource, ethPriceInDai, assetName, amount, forTime);
  }
};

export const withdraw = async (efx: any, contractsSource: ContractsSource, assetName: string, amount: BigNumber) => {
  if (assetName === "ETH") {
    await withdrawEth(efx, amount);
  } else if (assetName === "DAI") {
    await withdrawDai(efx, amount);
  } else {
    await withdrawPToken(contractsSource, assetName, amount);
  }
};

export const depositEth = async (efx: any, amount: BigNumber, forTime: number) => {
  await efx.contract.lock("ETH", amount.toNumber(), forTime);
};

export const depositDai = async (efx: any, amount: BigNumber, forTime: number) => {
  await efx.contract.lock("DAI", amount.toNumber(), forTime);
};

export const depositPToken = async (contractsSource: ContractsSource, ethPriceInDai: BigNumber, assetName: string, amount: BigNumber, forTime: number) => {
  const tradeTokenKey = TradeTokenKey.fromString(assetName);
  if (tradeTokenKey) {
    const pTokenContract = await contractsSource.getPTokenContract(tradeTokenKey);
    if (pTokenContract) {
      let targetTokenPriceInUnitsofAccount = await pTokenContract.tokenPrice.callAsync();
      if (tradeTokenKey.unitOfAccount !== Asset.DAI) {
        targetTokenPriceInUnitsofAccount = targetTokenPriceInUnitsofAccount.multipliedBy(ethPriceInDai);
      }
      const amountOfEthToSend = amount.multipliedBy(targetTokenPriceInUnitsofAccount);

      const marketMakerProvisionContract = await contractsSource.getMarketMakerProvisionContract();
      await marketMakerProvisionContract.mint.sendTransactionAsync(assetName, new BigNumber(0), new BigNumber(forTime), { value: amountOfEthToSend });
    }
  } else {
    throw new Error("Incorrect token!");
  }

  throw new Error("Not yet implemented!");
};

export const withdrawEth = async (efx: any, amount: BigNumber) => {
  await efx.contract.unlock("ETH", amount.toNumber());
};

export const withdrawDai = async (efx: any, amount: BigNumber) => {
  await efx.contract.unlock("DAI", amount.toNumber());
};

export const withdrawPToken = async (contractsSource: ContractsSource, assetName: string, amount: BigNumber) => {
  const tradeTokenKey = TradeTokenKey.fromString(assetName);
  if (tradeTokenKey) {
    // pTokens always have decimals 10 ** 18
    const targetAmountBN = amount.multipliedBy(10 ** 18);

    const marketMakerProvisionContract = await contractsSource.getMarketMakerProvisionContract();
    await marketMakerProvisionContract.burn.sendTransactionAsync(assetName, targetAmountBN, new BigNumber(0));
  } else {
    throw new Error("Incorrect token!");
  }
};
