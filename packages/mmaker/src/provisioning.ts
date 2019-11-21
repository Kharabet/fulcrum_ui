import { BigNumber } from "@0x/utils";
import { Asset, ContractsSource, TradeTokenKey } from "@bzxnetwork/mmaker-wrappers";
import { waitForTransactionMined } from "./utils";

const gasAmount = 3500000;

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
    await depositPToken(efx, contractsSource, ethPriceInDai, assetName, amount, forTime);
  }
};

export const withdraw = async (efx: any, contractsSource: ContractsSource, assetName: string, amount: BigNumber) => {
  if (assetName === "ETH") {
    await withdrawEth(efx, amount);
  } else if (assetName === "DAI") {
    await withdrawDai(efx, amount);
  } else {
    await withdrawPToken(efx, contractsSource, assetName, amount);
  }
};

export const depositEth = async (efx: any, amount: BigNumber, forTime: number) => {
  console.log(`ETH: deposit ${amount.toFixed()} ETH`);
  await efx.contract.lock("ETH", amount.toNumber(), forTime);
  console.log(`ETH: deposit ${amount.toFixed()} ETH done`);
};

export const depositDai = async (efx: any, amount: BigNumber, forTime: number) => {
  console.log(`DAI: deposit ${amount.toFixed()} DAI`);
  await efx.contract.lock("DAI", amount.toNumber(), forTime);
  console.log(`DAI: deposit ${amount.toFixed()} DAI done`);
};

export const depositPToken = async (efx: any, contractsSource: ContractsSource, ethPriceInDai: BigNumber, assetName: string, amount: BigNumber, forTime: number) => {
  // TODO: next 2 lines are for debugging purposes, in prod use "assetName" instead
  const fulcrumTokenName = assetName === "MLN" ? "dsETH2x_v2" : assetName;
  const exchangeTokenName = assetName === "MLN" ? "-2xETH" : assetName;

  const fromAddress = efx.web3.currentProvider.addresses[0];
  const tradeTokenKey = TradeTokenKey.fromString(fulcrumTokenName);
  if (tradeTokenKey) {
    const pTokenContract = await contractsSource.getPTokenContract(tradeTokenKey);
    if (pTokenContract) {
      let targetTokenPriceInUnitsOfAccount = await pTokenContract.tokenPrice.callAsync();
      if (tradeTokenKey.unitOfAccount !== Asset.DAI) {
        targetTokenPriceInUnitsOfAccount = targetTokenPriceInUnitsOfAccount.multipliedBy(ethPriceInDai);
      }
      const amountOfDaiToSend = amount.multipliedBy(targetTokenPriceInUnitsOfAccount).dividedToIntegerBy(10 ** 18);
      console.log(`${assetName}: deposit ${amountOfDaiToSend} DAI`);
      const amountOfWeiToSend = amountOfDaiToSend.multipliedBy(10**18).dividedToIntegerBy(ethPriceInDai);
      console.log(`${assetName}: deposit ${amountOfWeiToSend} WEI`);

      const marketMakerProvisionContract = await contractsSource.getMarketMakerProvisionContract();
      const tx = await marketMakerProvisionContract.mint.sendTransactionAsync(
        exchangeTokenName, new BigNumber(0), new BigNumber(forTime), {
          from: fromAddress,
          value: amountOfWeiToSend,
          gas: gasAmount
        }
      );

      console.log(`${assetName} deposit tx: ${tx} - waiting`);
      await waitForTransactionMined(efx.web3,  tx);
      console.log(`${assetName} deposit tx: ${tx} - mined`);
    }
  } else {
    throw new Error("Incorrect token!");
  }
};

export const withdrawEth = async (efx: any, amount: BigNumber) => {
  await efx.contract.unlock("ETH", amount.toNumber());
};

export const withdrawDai = async (efx: any, amount: BigNumber) => {
  await efx.contract.unlock("DAI", amount.toNumber());
};

export const withdrawPToken = async (efx: any, contractsSource: ContractsSource, assetName: string, amount: BigNumber) => {
  // TODO: next 2 lines are for debugging purposes, in prod use "assetName" instead
  const fulcrumTokenName = assetName === "MLN" ? "dsETH2x_v2" : assetName;
  const exchangeTokenName = assetName === "MLN" ? "-2xETH" : assetName;

  const fromAddress = efx.web3.currentProvider.addresses[0];
  const tradeTokenKey = TradeTokenKey.fromString(fulcrumTokenName);
  if (tradeTokenKey) {
    // pTokens always have decimals 10 ** 18
    const targetAmountBN = amount.multipliedBy(10 ** 18);

    const marketMakerProvisionContract = await contractsSource.getMarketMakerProvisionContract();
    const tx = await marketMakerProvisionContract.burn.sendTransactionAsync(
      exchangeTokenName, targetAmountBN, new BigNumber(0), {
        from: fromAddress,
        gas: gasAmount
      }
    );

    console.log(`${assetName} withdraw tx: ${tx} - waiting`);
    await waitForTransactionMined(efx.web3,  tx);
    console.log(`${assetName} withdraw tx: ${tx} - mined`);
  } else {
    throw new Error("Incorrect token!");
  }
};
