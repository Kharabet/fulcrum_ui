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
    const tradingPairName = `${token1}${token2}`;
    const bfxTradingPairName = `t${token1}${token2}`;
    console.log(`tradingPairName: ${tradingPairName}`);

    // we need these prices for calculations later
    // getTokenPriceInDAI supports only ETH, DAI and pTokens!!!
    const ethPriceInDai = await getEthPriceInDAI(contractsSource, networkId);
    const token1PriceInDai = await getTokenPriceInDAI(contractsSource, networkId, "dsETH2x_v2", ethPriceInDai);
    // TODO: replace line above with line below (replace "dsETH2x_v2" with token1) - now token 1 is MLN for test environment
    // const token1PriceInDai = await getTokenPriceInDAI(contractsSource, networkId, token1, ethPriceInDai);
    const token2PriceInDai = await getTokenPriceInDAI(contractsSource, networkId, token2, ethPriceInDai);
    // At the current moment we use USD as test token2, as fulcrum tokens are not listed yet
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
    let token1DFiLockedBalance = await getOnExchangeBalance(efx, token1);
    let token2DFiLockedBalance = await getOnExchangeBalance(efx, token2);
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
    const orderBookData = await getOrderBookData(bfxTradingPairName);
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
    console.log(`expectedOneSidedExposure: ${expectedOneSidedExposure.toFixed()}`);
    console.log(`maxOneSidedDiff: ${maxOneSidedDiff.toFixed()}`);

    // 1. we are looking for excessive orders to be able to free some funds before provisioning
    // looking for excessive bid exposure
    const excessiveBidExposureSum =
      expectedOneSidedExposure.plus(maxOneSidedDiff).isLessThan(orderBookMMExposures.bidExposure)
        ? orderBookMMExposures.bidExposure.minus(expectedOneSidedExposure)
        : new BigNumber(0);
    let isBidOrderRecreateNeeded: boolean = excessiveBidExposureSum.gt(0);
    console.log(`excessiveBidExposureSum: ${excessiveBidExposureSum.toFixed()}`);
    console.log(`isBidOrderRecreateNeeded: ${isBidOrderRecreateNeeded}`);

    // looking for excessive ask exposure
    const excessiveAskExposureSum =
      expectedOneSidedExposure.plus(maxOneSidedDiff).isLessThan(orderBookMMExposures.askExposure)
        ? orderBookMMExposures.askExposure.minus(expectedOneSidedExposure)
        : new BigNumber(0);
    let isAskOrderRecreateNeeded: boolean = excessiveAskExposureSum.gt(0);
    console.log(`excessiveAskExposureSum: ${excessiveAskExposureSum.toFixed()}`);
    console.log(`isAskOrderRecreateNeeded: ${isAskOrderRecreateNeeded}`);

    // 2. we are looking for scarce orders we will need to feed during provisioning
    // looking for scarce bid exposure
    const scarceBidExposureSum =
      expectedOneSidedExposure.minus(maxOneSidedDiff).isGreaterThan(orderBookMMExposures.bidExposure)
        ? expectedOneSidedExposure.minus(orderBookMMExposures.bidExposure)
        : new BigNumber(0);
    isBidOrderRecreateNeeded = isBidOrderRecreateNeeded || scarceBidExposureSum.gt(0);
    console.log(`scarceBidExposureSum: ${scarceBidExposureSum.toFixed()}`);
    console.log(`isBidOrderRecreateNeeded: ${isBidOrderRecreateNeeded}`);

    // looking for scarce ask exposure
    const scarceAskExposureSum =
      expectedOneSidedExposure.minus(maxOneSidedDiff).isGreaterThan(orderBookMMExposures.askExposure)
        ? expectedOneSidedExposure.minus(orderBookMMExposures.askExposure)
        : new BigNumber(0);
    isAskOrderRecreateNeeded = isAskOrderRecreateNeeded || scarceAskExposureSum.gt(0);
    console.log(`scarceAskExposureSum: ${scarceAskExposureSum.toFixed()}`);
    console.log(`isAskOrderRecreateNeeded: ${isAskOrderRecreateNeeded}`);

    // 3. calculating locked funds exposure balance diff after bid/ask exposure fix operations
    const lockedBalanceExposureDiffSumAfterBidOperations = excessiveBidExposureSum.minus(scarceBidExposureSum);
    const lockedBalanceExposureDiffSumAfterAskOperations = excessiveAskExposureSum.minus(scarceAskExposureSum);
    console.log(`lockedBalanceExposureDiffSumAfterBidOperations: ${lockedBalanceExposureDiffSumAfterBidOperations.toFixed()}`);
    console.log(`lockedBalanceExposureDiffSumAfterAskOperations: ${lockedBalanceExposureDiffSumAfterAskOperations.toFixed()}`);

    // 4. calculating locked funds balance after provisioning will happen
    // token1 + Ask (amount of token1 proposed)
    const nextToken1DFiLockedExposure = token1DFiLockedExposure.plus(lockedBalanceExposureDiffSumAfterAskOperations);
    const isToken1DepositNeeded = nextToken1DFiLockedExposure.isLessThan(tradeConfig.onExchangeMinBufferBalance);
    const isToken1WithdrawalNeeded = nextToken1DFiLockedExposure.isGreaterThan(tradeConfig.onExchangeMaxBufferBalance);
    console.log(`nextToken1DFiLockedExposure: ${nextToken1DFiLockedExposure.toFixed()}`);
    console.log(`isToken1DepositNeeded: ${isToken1DepositNeeded}`);
    console.log(`isToken1WithdrawalNeeded: ${isToken1WithdrawalNeeded}`);

    // token2 + Bid (amount of token2 proposed)
    const nextToken2DFiLockedExposure = token2DFiLockedExposure.plus(lockedBalanceExposureDiffSumAfterBidOperations);
    const isToken2DepositNeeded = nextToken2DFiLockedExposure.isLessThan(tradeConfig.onExchangeMinBufferBalance);
    const isToken2WithdrawalNeeded = nextToken2DFiLockedExposure.isGreaterThan(tradeConfig.onExchangeMaxBufferBalance);
    console.log(`nextToken2DFiLockedExposure: ${nextToken2DFiLockedExposure.toFixed()}`);
    console.log(`isToken2DepositNeeded: ${isToken2DepositNeeded}`);
    console.log(`isToken2WithdrawalNeeded: ${isToken2WithdrawalNeeded}`);

    // 4. depositing funds we need
    const onExchangeTargetBufferBalance =
      new BigNumber(tradeConfig.onExchangeMinBufferBalance + tradeConfig.onExchangeMaxBufferBalance).dividedBy(2);
    console.log(`onExchangeTargetBufferBalance: ${onExchangeTargetBufferBalance.toFixed()}`);
    const depositPromises = new Array<Promise<void>>();
    if (isToken1DepositNeeded) {
      const token1DepositSumInDai = onExchangeTargetBufferBalance.minus(nextToken1DFiLockedExposure);
      console.log(`token1DepositSumInDai: ${token1DepositSumInDai.toFixed()}`);
      // we don't want to deposit micro-amount of tokens, so checking for lower operation limit
      // this should not happen (only if exposureSumDiffMax < minDepositWithdrawOperationAmount)
      if (token1DepositSumInDai.gte(tradeConfig.minDepositWithdrawOperationAmount)) {
        const token1DepositAmount = token1DepositSumInDai.dividedBy(token1PriceInDai);
        console.log(`token1DepositAmount: ${token1DepositAmount.toFixed()}`);
        depositPromises.push(
          deposit(efx, contractsSource, ethPriceInDai, token1, token1DepositAmount, forTimeInHours)
        );
      } else {
        console.log("token1DepositAmount is too small");
      }
    }

    if (isToken2DepositNeeded) {
      const token2DepositSumInDai = onExchangeTargetBufferBalance.minus(nextToken2DFiLockedExposure);
      console.log(`token2DepositSumInDai: ${token2DepositSumInDai.toFixed()}`);
      // we don't want to deposit micro-amount of tokens, so checking for lower operation limit
      if (token2DepositSumInDai.gte(tradeConfig.minDepositWithdrawOperationAmount)) {
        const token2DepositAmount = token2DepositSumInDai.dividedBy(token2PriceInDai);
        console.log(`token2DepositAmount: ${token2DepositAmount.toFixed()}`);
        depositPromises.push(
          deposit(efx, contractsSource, ethPriceInDai, token2, token2DepositAmount, forTimeInHours)
        );
      } else {
        console.log("token2DepositSumInDai is too small");
      }
    }
    // waiting until deposits (4) really happens
    await Promise.all(depositPromises);

    // TODO: recalc exposures, since price has been changed while we were minting pTokens (slippage)

    // 5. checking midpoint (if current midpoint is far from target midpoint, we should recreate bid and ask with new price)
    // don't try to follow market midpoint
    let bidPrice: BigNumber | null = null;
    let askPrice: BigNumber | null = null;

    // don't follow market midpoint. just create market around current fulcrum pToken price.
    if (orderBookMMMidpoint) {
      console.log("mm orders (both) exist");
      const midpointDiff = fulcrumExchangeRate.minus(orderBookMMMidpoint).abs();
      const spreadSizeOneSided = fulcrumExchangeRate.multipliedBy(tradeConfig.spreadPercentTarget).dividedBy(100).dividedBy(2);
      const midpointDiffPercent = midpointDiff.dividedBy(spreadSizeOneSided).multipliedBy(100);
      if ((midpointDiffPercent || new BigNumber(0)).isGreaterThan(tradeConfig.midpointDiffMaxPercent)) {
        console.log("midpointDiffMaxPercent exceeded");
        bidPrice = fulcrumExchangeRate.minus(spreadSizeOneSided);
        askPrice = fulcrumExchangeRate.plus(spreadSizeOneSided);
        isBidOrderRecreateNeeded = true;
        isAskOrderRecreateNeeded = true;
      } else {
        console.log("midpointDiffMaxPercent don't exceeded");
      }
    } else {
      console.log("mm orders (one ore both) don't exist");
      const spreadSizeOneSided = fulcrumExchangeRate.multipliedBy(tradeConfig.spreadPercentTarget).dividedBy(100).dividedBy(2);
      bidPrice = fulcrumExchangeRate.minus(spreadSizeOneSided);
      askPrice = fulcrumExchangeRate.plus(spreadSizeOneSided);
      isBidOrderRecreateNeeded = true;
      isAskOrderRecreateNeeded = true;
    }

    // if we want to follow market
    // // 5.1. user's orders exist, but channel orders don't
    // if (orderBookMidpoint && !orderBookMMMidpoint) {
    //   const spreadSizeOneSided = orderBookMidpoint.multipliedBy(tradeConfig.spreadPercentTarget).dividedBy(100).dividedBy(2);
    //   bidPrice = orderBookMidpoint.minus(spreadSizeOneSided);
    //   askPrice = orderBookMidpoint.plus(spreadSizeOneSided);
    //   isBidOrderRecreateNeeded = true;
    //   isAskOrderRecreateNeeded = true;
    // }
    //
    // 5.2. user's orders exist and channel orders exist
    // if (orderBookMidpoint && orderBookMMMidpoint) {
    //   // next check is always true (orderBookMMMidpoint not null), but linter want's explicit check
    //   if (orderBookMMSpread && orderBookMMSpread.maxBidPrice && orderBookMMSpread.minAskPrice) {
    //     const midpointDiff = orderBookMMMidpoint.minus(orderBookMidpoint).abs();
    //     const spreadSizeOneSided =
    //       orderBookMidpoint.multipliedBy(tradeConfig.spreadPercentTarget).dividedBy(100).dividedBy(2);
    //     const midpointDiffPercent = midpointDiff.dividedBy(spreadSizeOneSided).multipliedBy(100);
    //     if ((midpointDiffPercent || new BigNumber(0)).isGreaterThan(tradeConfig.midpointDiffMaxPercent)) {
    //       bidPrice = orderBookMidpoint.minus(spreadSizeOneSided);
    //       askPrice = orderBookMidpoint.plus(spreadSizeOneSided);
    //       isBidOrderRecreateNeeded = true;
    //       isAskOrderRecreateNeeded = true;
    //     }
    //   }
    // }
    //
    // // 5.3. nor user's nor channel orders exist
    // if (!orderBookMidpoint && !orderBookMMMidpoint) {
    //   const spreadSizeOneSided = fulcrumExchangeRate.multipliedBy(tradeConfig.spreadPercentTarget).dividedBy(100).dividedBy(2);
    //   bidPrice = fulcrumExchangeRate.minus(spreadSizeOneSided);
    //   askPrice = fulcrumExchangeRate.plus(spreadSizeOneSided);
    //   isBidOrderRecreateNeeded = true;
    //   isAskOrderRecreateNeeded = true;
    // }
    //
    // 5.4. user's orders don't exist, but channel orders do
    // if (!orderBookMidpoint && orderBookMMMidpoint) {
    //   const midpointDiff = fulcrumExchangeRate.minus(orderBookMMMidpoint).abs();
    //   const spreadSizeOneSided = fulcrumExchangeRate.multipliedBy(tradeConfig.spreadPercentTarget).dividedBy(100).dividedBy(2);
    //   const midpointDiffPercent = midpointDiff.dividedBy(spreadSizeOneSided).multipliedBy(100);
    //   if ((midpointDiffPercent || new BigNumber(0)).isGreaterThan(tradeConfig.midpointDiffMaxPercent)) {
    //     bidPrice = fulcrumExchangeRate.minus(spreadSizeOneSided);
    //     askPrice = fulcrumExchangeRate.plus(spreadSizeOneSided);
    //     isBidOrderRecreateNeeded = true;
    //     isAskOrderRecreateNeeded = true;
    //   }
    // }

    // 6. recreate bid/ask orders
    const cancelBidPromises: Array<Promise<void>> = [];
    if (isBidOrderRecreateNeeded) {
      if (!bidPrice) {
        const spreadSizeOneSided = fulcrumExchangeRate.multipliedBy(tradeConfig.spreadPercentTarget).dividedBy(100).dividedBy(2);
        bidPrice = fulcrumExchangeRate.minus(spreadSizeOneSided);
      }
      const bidTargetExposure = orderBookMMExposures.bidExposure.plus(lockedBalanceExposureDiffSumAfterBidOperations.times(-1));
      let bidTargetAmount = bidTargetExposure.dividedBy(token2PriceInDai);

      // recreate bid order at bidPrice with bidTargetAmount
      // cancelling existing bid orders
      for (const bid of orderBookMMData.bids) {
        console.log(`cancelling bid order: ${bid.id}`);
        cancelBidPromises.push(
          efx.contract.cancel(bid.id)
        );
      }
      console.log(`bid orders: await cancelling`);
      await Promise.all(cancelBidPromises);
      console.log(`bid orders: were cancelled`);


      // creating new order
      token2DFiLockedBalance = await getOnExchangeBalance(efx, token2);
      bidTargetAmount = BigNumber.min(bidTargetAmount, token2DFiLockedBalance);

      console.log("submitOrder: bid");
      console.log(`token2DFiLockedBalance: ${token2DFiLockedBalance.toFixed()}`);
      console.log(`tradingPairName: ${tradingPairName}`);
      console.log(`bidPrice: ${bidPrice.toPrecision(8)}`);
      console.log(`bidTargetAmount: ${bidTargetAmount.toPrecision(8)}`);
      const submitResult =
        await efx.submitOrder(
          tradingPairName,
          bidTargetAmount.precision(8).toNumber(),
          bidPrice.precision(8).toNumber()
        );
      console.log(submitResult);
    }

    const cancelAskPromises: Array<Promise<void>> = [];
    if (isAskOrderRecreateNeeded) {
      if (!askPrice) {
        const spreadSizeOneSided = fulcrumExchangeRate.multipliedBy(tradeConfig.spreadPercentTarget).dividedBy(100).dividedBy(2);
        askPrice = fulcrumExchangeRate.plus(spreadSizeOneSided);
      }
      const askTargetExposure = orderBookMMExposures.askExposure.plus(lockedBalanceExposureDiffSumAfterAskOperations.times(-1));
      let askTargetAmount = askTargetExposure.dividedBy(token1PriceInDai);

      // recreate ask order at askPrice with askTargetAmount
      // cancelling existing ask orders
      for (const ask of orderBookMMData.asks) {
        console.log(`cancelling ask order: ${ask.id}`);
        cancelAskPromises.push(
          efx.contract.cancel(ask.id)
        );
      }
      console.log(`ask orders: await cancelling`);
      await Promise.all(cancelAskPromises);
      console.log(`ask orders: were cancelled`);

      // creating new order
      token1DFiLockedBalance = await getOnExchangeBalance(efx, token1);
      askTargetAmount = BigNumber.min(askTargetAmount, token1DFiLockedBalance);

      console.log("submitOrder: ask");
      console.log(`token1DFiLockedBalance: ${token1DFiLockedBalance.toFixed()}`);
      console.log(`tradingPairName: ${tradingPairName}`);
      console.log(`askPrice: ${askPrice.toPrecision(8)}`);
      console.log(`askTargetAmount: ${askTargetAmount.multipliedBy(-1).toPrecision(8)}`);
      // askTargetAmount.multipliedBy(-1) is negative. this indicates a `sell` order
      const submitResult =
        await efx.submitOrder(
          tradingPairName,
          askTargetAmount.multipliedBy(-1).precision(8).toNumber(),
          askPrice.precision(8).toNumber()
        );
      console.log(submitResult);
    }

    // 7. withdraw funds we don't need anymore
    const withdrawPromises = new Array<Promise<void>>();
    if (isToken1WithdrawalNeeded) {
      const token1DFiLockedBalance = await getOnExchangeBalance(efx, token1);
      if (token1DFiLockedBalance.isGreaterThan(tradeConfig.onExchangeMaxBufferBalance)) {
        const token1WithdrawSumInDai = token1DFiLockedBalance.minus(onExchangeTargetBufferBalance);
        console.log(`token1WithdrawSumInDai: ${token1WithdrawSumInDai.toFixed()}`);
        if (token1WithdrawSumInDai.gte(tradeConfig.minDepositWithdrawOperationAmount)) {
          const token1WithdrawAmount = token1WithdrawSumInDai.dividedBy(token1PriceInDai);
          console.log(`token1WithdrawAmount: ${token1WithdrawAmount.toFixed()}`);
          withdrawPromises.push(
            withdraw(efx, contractsSource, token1, token1WithdrawAmount.precision(8))
          );
        }
      } else {
        console.log("token1WithdrawAmount is too small");
      }
    }

    if (isToken2WithdrawalNeeded) {
      const token2DFiLockedBalance = await getOnExchangeBalance(efx, token2);
      if (token2DFiLockedBalance.isGreaterThan(tradeConfig.onExchangeMaxBufferBalance)) {
        const token2WithdrawSumInDai = token2DFiLockedBalance.minus(onExchangeTargetBufferBalance);
        console.log(`token1DepositSumInDai: ${token2WithdrawSumInDai.toFixed()}`);
        if (token2WithdrawSumInDai.gte(tradeConfig.minDepositWithdrawOperationAmount)) {
          const token2WithdrawAmount = token2WithdrawSumInDai.dividedBy(token2PriceInDai);
          console.log(`token2WithdrawAmount: ${token2WithdrawAmount.toFixed()}`);
          withdrawPromises.push(
            withdraw(efx, contractsSource, token2, token2WithdrawAmount.precision(8))
          );
        }
      } else {
        console.log("token2WithdrawSumInDai is too small");
      }
    }

    // waiting until (7) happens
    await Promise.all(withdrawPromises);

  } catch (e) {
    console.log(e);
  }
};
