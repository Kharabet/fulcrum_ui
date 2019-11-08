import { ContractsSource } from "@bzxnetwork/mmaker-wrappers";
import { getOnExchangeBalance } from "./balanceProvider";

import { approve, deposit, withdraw } from "./provisioning";
import {
  getOrderBookData,
  getMMOrdersData,
  getOrderBookWithoutMMOrders,
  calculateOrderBookExposures,
  calculateOrderBookSpread,
} from "./orderBook";
import { getTokenPriceInDAI, getEthPriceInDAI } from "./priceProvider";
import { BigNumber } from "@0x/utils";
import { tradeConfig } from "./tradeConfig";

export const checkPass = async (
  efx: any,
  contractsSource: ContractsSource,
  networkId: number,
  forTimeInHours: number,
  token1: string,
  token2: string
) => {
  try {
    // validating if our tokens are listed on exchange
    const token1data = efx.config["0x"].tokenRegistry[token1];
    const token2data = efx.config["0x"].tokenRegistry[token2];
    if (!(token1data != null && token2data != null)) {
      console.log("Token (s) is (are) not listed!");
      return;
    }

    // pre-approving tokens (limited to DAI (not needed for pTokens as we have different deposit mechanism), but calling for both tokens)
    await approve(efx, token1);
    await approve(efx, token2);

    // generating trading pair name
    // TODO: important question: should pair name include "t" prefix
    const tradingPairName = `${token1}${token2}`;
    console.log(`tradingPairName: ${tradingPairName}`);

    // we need these prices for calculations later
    // getTokenPriceInDAI supports only ETH, DAI and pTokens!!!
    const ethPriceInDai = await getEthPriceInDAI(contractsSource, networkId);
    const token1PriceInDai = await getTokenPriceInDAI(contractsSource, networkId, token1, ethPriceInDai);
    let token2PriceInDai = await getTokenPriceInDAI(contractsSource, networkId, token2, ethPriceInDai);
    // At the current moment we use USD as test token2, as fulcrum tokens are not listed yet
    // TODO; remove let, and price rewrite
    token2PriceInDai = new BigNumber("1");
    console.log(`ethPriceInDai: ${ethPriceInDai.toFixed()}`);
    console.log(`token1PriceInDai: ${token1PriceInDai.toFixed()}`);
    console.log(`token2PriceInDai: ${token2PriceInDai.toFixed()}`);
    if (ethPriceInDai.eq(0) || token1PriceInDai.eq(0) || token2PriceInDai.eq(0)) {
      console.log("Zero token (s) price!");
      return;
    }

    // calculating exchange rate according to fulcrum and kyber data
    const fulcrumExchangeRate = token1PriceInDai.dividedBy(token2PriceInDai);
    console.log(`fulcrumExchangeRate: ${fulcrumExchangeRate.toFixed()}`);

    // getting on exchange balances
    // TODO: constantly gives "Error: Returned values aren't valid, did it run Out of Gas?", tested with ETH and MLN
    // const token1DFiLockedBalance = await getOnExchangeBalance(efx, token1);
    // const token2DFiLockedBalance = await getOnExchangeBalance(efx, token2);
    const token1DFiLockedBalance = new BigNumber(20);
    const token2DFiLockedBalance = new BigNumber(30);
    console.log(`token1DFiLockedBalance: ${token1DFiLockedBalance.toFixed()}`);
    console.log(`token2DFiLockedBalance: ${token2DFiLockedBalance.toFixed()}`);

    // getting on exchange exposures
    const token1DFiLockedExposure = token1DFiLockedBalance.multipliedBy(token1PriceInDai);
    const token2DFiLockedExposure = token2DFiLockedBalance.multipliedBy(token2PriceInDai);
    console.log(`token1DFiLockedExposure: ${token1DFiLockedExposure.toFixed()}`);
    console.log(`token2DFiLockedExposure: ${token2DFiLockedExposure.toFixed()}`);

    // getting our orders, our exposure and our spread (out spread is represented in "token2 per token1")
    const orderBookMMData = await getMMOrdersData(efx, tradingPairName);
    const orderBookMMExposures = await calculateOrderBookExposures(orderBookMMData, token2PriceInDai);
    const orderBookMMSpread = await calculateOrderBookSpread(orderBookMMData);
    const orderBookMMMidpoint =
      (orderBookMMSpread.maxBidPrice && orderBookMMSpread.minAskPrice)
        ? orderBookMMSpread.maxBidPrice.plus(orderBookMMSpread.minAskPrice).dividedBy(2)
        : null;

    // getting orders except ours, calculating exposure and spread for them
    const orderBookData = await getOrderBookData(tradingPairName);
    const orderBookWithoutMMOrders = await getOrderBookWithoutMMOrders(orderBookData, orderBookMMData);
    const orderBookExposures = await calculateOrderBookExposures(orderBookWithoutMMOrders, token2PriceInDai);
    const orderBookSpread = await calculateOrderBookSpread(orderBookWithoutMMOrders);
    const orderBookMidpoint =
      (orderBookSpread.maxBidPrice && orderBookSpread.minAskPrice)
        ? orderBookSpread.maxBidPrice.plus(orderBookSpread.minAskPrice).dividedBy(2)
        : null;

    // we expect to have such an exposure on every single side
    const expectedOneSidedExposure = new BigNumber(tradeConfig.exposureSumTarget).dividedBy(2);
    const maxOneSidedDiff = new BigNumber(tradeConfig.exposureSumDiffMax).dividedBy(2);

    // 1. we are looking for excessive orders to be able to free some funds before provisioning
    // looking for excessive bid exposure
    const excessiveBidExposureSum =
      expectedOneSidedExposure.plus(maxOneSidedDiff).isLessThan(orderBookMMExposures.bidExposure)
        ? orderBookMMExposures.bidExposure.minus(expectedOneSidedExposure)
        : new BigNumber(0);
    let isBidOrderRecreateNeeded: boolean = excessiveBidExposureSum.gt(0);

    // looking for excessive ask exposure
    const excessiveAskExposureSum =
      expectedOneSidedExposure.plus(maxOneSidedDiff).isLessThan(orderBookMMExposures.askExposure)
        ? orderBookMMExposures.askExposure.minus(expectedOneSidedExposure)
        : new BigNumber(0);
    let isAskOrderRecreateNeeded: boolean = excessiveAskExposureSum.gt(0);

    // 2. we are looking for scarce orders we will need to feed during provisioning
    // looking for scarce bid exposure
    const scarceBidExposureSum =
      expectedOneSidedExposure.minus(maxOneSidedDiff).isGreaterThan(orderBookMMExposures.bidExposure)
        ? expectedOneSidedExposure.minus(orderBookMMExposures.bidExposure)
        : new BigNumber(0);
    isBidOrderRecreateNeeded = isBidOrderRecreateNeeded || scarceBidExposureSum.gt(0);

    // looking for scarce ask exposure
    const scarceAskExposureSum =
      expectedOneSidedExposure.minus(maxOneSidedDiff).isGreaterThan(orderBookMMExposures.askExposure)
        ? expectedOneSidedExposure.minus(orderBookMMExposures.askExposure)
        : new BigNumber(0);
    isAskOrderRecreateNeeded = isAskOrderRecreateNeeded || scarceAskExposureSum.gt(0);

    // 3. calculating exposure operations balance
    const exposureBidOperationSum = excessiveBidExposureSum.minus(scarceBidExposureSum);
    const exposureAskOperationSum = excessiveAskExposureSum.minus(scarceAskExposureSum);

    // 4. calculating locked funds balance after provisioning will happen
    // token1 + Ask (amount of token1 proposed)
    const nextToken1DFiLockedExposure = token1DFiLockedExposure.plus(exposureAskOperationSum);
    const isToken1DepositNeeded = nextToken1DFiLockedExposure.isLessThan(tradeConfig.onExchangeMinBufferBalance);
    const isToken1WithdrawalNeeded = nextToken1DFiLockedExposure.isGreaterThan(tradeConfig.onExchangeMaxBufferBalance);

    // token2 + Bid (amount of token2 proposed)
    const nextToken2DFiLockedExposure = token2DFiLockedExposure.plus(exposureBidOperationSum);
    const isToken2DepositNeeded = nextToken2DFiLockedExposure.isLessThan(tradeConfig.onExchangeMinBufferBalance);
    const isToken2WithdrawalNeeded = nextToken2DFiLockedExposure.isGreaterThan(tradeConfig.onExchangeMaxBufferBalance);

    // 4. depositing funds we need
    const depositPromises = new Array<Promise<void>>();
    if (isToken1DepositNeeded) {
      const token1DepositSumInDai = new BigNumber(tradeConfig.onExchangeMinBufferBalance).minus(nextToken1DFiLockedExposure);
      const token1DepositAmount = token1DepositSumInDai.dividedBy(token1PriceInDai);
      depositPromises.push(
        deposit(efx, contractsSource, ethPriceInDai, token1, token1DepositAmount, forTimeInHours)
      );
    }

    if (isToken2DepositNeeded) {
      const token2DepositSum = new BigNumber(tradeConfig.onExchangeMinBufferBalance).minus(nextToken2DFiLockedExposure);
      const token2DepositAmount = token2DepositSum.dividedBy(token2PriceInDai);
      depositPromises.push(
        deposit(efx, contractsSource, ethPriceInDai, token2, token2DepositAmount, forTimeInHours)
      );
    }

    // 5. checking midpoint (if current midpoint is far from target midpoint, we should recreate bid and ask with new price)
    // TODO: according to talk with Kyle we should keep around fulcrum's token price (will require update on 5.1 - 5.4) and we shouldn't follow market midpoint.
    // 5.1. user's orders exist, but channel orders don't
    let midpointCorrectionNeeded = false;
    let bidPrice: BigNumber | null = null;
    let askPrice: BigNumber | null = null;
    if (orderBookMidpoint && !orderBookMMMidpoint) {
      const spreadSizeOneSided = orderBookMidpoint.multipliedBy(tradeConfig.spreadPercentTarget).dividedBy(2);
      bidPrice = orderBookMidpoint.minus(spreadSizeOneSided);
      askPrice = orderBookMidpoint.plus(spreadSizeOneSided);
      isBidOrderRecreateNeeded = true;
      isAskOrderRecreateNeeded = true;
    }

    // 5.2. user's orders exist and channel orders exist
    if (orderBookMidpoint && orderBookMMMidpoint) {
      if (orderBookMMSpread && orderBookMMSpread.maxBidPrice && orderBookMMSpread.minAskPrice) {
        const midpointDiff = orderBookMMMidpoint.minus(orderBookMidpoint).abs();
        const spreadSizeOneSided = orderBookMidpoint.multipliedBy(tradeConfig.spreadPercentTarget).dividedBy(2);
        const spreadSizeOneSidedMM = orderBookMMSpread.maxBidPrice.plus(orderBookMMSpread.minAskPrice).dividedBy(2);
        const midpointDiffPercent =
          (spreadSizeOneSidedMM.isGreaterThan(0))
            ? midpointDiff.dividedBy(spreadSizeOneSidedMM).multipliedBy(100)
            : new BigNumber(100000);

        if ((midpointDiffPercent || new BigNumber(0)).isGreaterThan(tradeConfig.midpointDiffMaxPercent)) {
          bidPrice = orderBookMidpoint.minus(spreadSizeOneSided);
          askPrice = orderBookMidpoint.plus(spreadSizeOneSided);
          isBidOrderRecreateNeeded = true;
          isAskOrderRecreateNeeded = true;
        }
      }
    }

    // 5.3. nor user's nor channel orders exist
    if (!orderBookMidpoint && !orderBookMMMidpoint) {
      const spreadSizeOneSided = fulcrumExchangeRate.multipliedBy(tradeConfig.spreadPercentTarget).dividedBy(2);
      bidPrice = fulcrumExchangeRate.minus(spreadSizeOneSided);
      askPrice = fulcrumExchangeRate.plus(spreadSizeOneSided);
      isBidOrderRecreateNeeded = true;
      isAskOrderRecreateNeeded = true;
    }

    // 5.4. user's orders don't exist, but channel orders do
    if (orderBookMidpoint && !orderBookMMMidpoint) {
      // doing nothing, as everything is already good
    }

    // waiting until (4) really happens
    await Promise.all(depositPromises);

    // 6. recreate bid/ask orders
    if (isBidOrderRecreateNeeded) {
      if (!bidPrice) {
        const spreadSizeOneSided = fulcrumExchangeRate.multipliedBy(tradeConfig.spreadPercentTarget).dividedBy(2);
        bidPrice = fulcrumExchangeRate.minus(spreadSizeOneSided);
      }
      const bidTargetExposure = orderBookMMExposures.bidExposure.plus(exposureBidOperationSum);
      const bidTargetAmount = bidTargetExposure.dividedBy(bidPrice);

      // recreate bid order at bidPrice with bidTargetAmount
    }

    if (isAskOrderRecreateNeeded) {
      if (!askPrice) {
        const spreadSizeOneSided = fulcrumExchangeRate.multipliedBy(tradeConfig.spreadPercentTarget).dividedBy(2);
        askPrice = fulcrumExchangeRate.plus(spreadSizeOneSided);
      }
      const askTargetExposure = orderBookMMExposures.askExposure.plus(exposureAskOperationSum);
      const askTargetAmount = askTargetExposure.dividedBy(askPrice);

      // recreate ask order at askPrice with askTargetAmount
    }

    // 7. withdraw funds we don't need anymore
    const withdrawPromises = new Array<Promise<void>>();
    if (isToken1WithdrawalNeeded) {
      const token1DFiLockedBalance = await getOnExchangeBalance(efx, token1);
      if (token1DFiLockedBalance.isGreaterThan(tradeConfig.onExchangeMaxBufferBalance)) {
        withdrawPromises.push(
          withdraw(efx, contractsSource, token1, token1DFiLockedBalance.minus(tradeConfig.onExchangeMaxBufferBalance))
        );
      }
    }

    if (isToken2WithdrawalNeeded) {
      const token2DFiLockedBalance = await getOnExchangeBalance(efx, token2);
      if (token2DFiLockedBalance.isGreaterThan(tradeConfig.onExchangeMaxBufferBalance)) {
        withdrawPromises.push(
          withdraw(efx, contractsSource, token2, token2DFiLockedBalance.minus(tradeConfig.onExchangeMaxBufferBalance))
        );
      }
    }

    // waiting until (7) happens
    await Promise.all(withdrawPromises);

  } catch (e) {
    console.log(e);
  }
};
