import { BigNumber } from "bignumber.js";

export const getOnExchangeBalance = async (efx: any, tokenName: string): Promise<BigNumber> => {
  // https://docs.ethfinex.com/?version=latest#get-locked-balance
  let lockedTokenBalance = await efx.contract.locked(tokenName);
  return new BigNumber(lockedTokenBalance).dividedBy(10 ** 18);
};
