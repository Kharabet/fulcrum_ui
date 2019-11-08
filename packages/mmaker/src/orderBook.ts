import * as fetch from "node-fetch";
import { BigNumber } from "@0x/utils";

export interface IOrderBookRecord {
  id?: string;
  amount: number;
  price: number;
}

export interface IOrderBook {
  bids: IOrderBookRecord[];
  asks: IOrderBookRecord[];
}

export interface IOrderBookExposure {
  bidExposure: BigNumber;
  askExposure: BigNumber;
}

export interface IOrderBookSpread {
  maxBidPrice: BigNumber | null;
  minAskPrice: BigNumber | null;
}

export const getOrderBookData = async (symbol: string): Promise<IOrderBook> => {
  const response = await (fetch as any)(`https://api.ethfinex.com/v1/book/${symbol}`);
  // const response = await (fetch as any)(`https://staging-api.deversifi.com/v1/trading/book/${symbol}`);
  return await response.json();
};

export const getMMOrdersData = async (efx: any, symbol: string): Promise<IOrderBook> => {
  const result: IOrderBook = { bids: [], asks: [] };
  const orders = await efx.getOrders();

  for (const order of orders) {
    if (order.amount > 0) {
      result.asks.push({ id: order.id, amount: order.amount, price: order.price });
    } else {
      result.bids.push({ id: order.id, amount: -order.amount, price: order.price });
    }
  }

  return result;
};

export const getOrderBookWithoutMMOrders = async (
  orderBookData: IOrderBook,
  mmOrderBookData: IOrderBook
): Promise<IOrderBook> => {
  const result: IOrderBook = { bids: [], asks: [] };

  // lookup by id doesn't work because we know id only for own own orders
  // so we will add our orders with negative amount to the list

  for (const order of orderBookData.asks) {
    result.asks.push(order);
  }

  for (const order of orderBookData.bids) {
    result.bids.push(order);
  }

  for (const order of mmOrderBookData.asks) {
    result.asks.push({ ...order, amount: -order.amount });
  }

  for (const order of mmOrderBookData.bids) {
    result.bids.push({ ...order, amount: -order.amount });
  }

  return result;
};

export const calculateOrderBookTotalExposure = (
  orderBookExposure: IOrderBookExposure
): BigNumber => {
  return orderBookExposure.bidExposure.plus(orderBookExposure.askExposure);
};


export const calculateOrderBookExposures = (
  orderBookData: IOrderBook,
  tokenPriceInDai: BigNumber
): IOrderBookExposure => {
  const bidExposure = orderBookData.bids
    .map((e: any) => new BigNumber(e.amount * e.price).multipliedBy(tokenPriceInDai))
    .reduce((accumulator: BigNumber, currentValue: BigNumber) => accumulator.plus(currentValue), new BigNumber(0));

  const askExposure = orderBookData.asks
    .map((e: any) => new BigNumber(e.amount * e.price).multipliedBy(tokenPriceInDai))
    .reduce((accumulator: BigNumber, currentValue: BigNumber) => accumulator.plus(currentValue), new BigNumber(0));

  return { bidExposure: bidExposure, askExposure: askExposure };
};

export const calculateOrderBookSpread = (orderBookData: IOrderBook): IOrderBookSpread => {
  const maxBidPrice = orderBookData.bids
    .map((e: any) => new BigNumber(e.price))
    .reduce(
      (accumulator: BigNumber, currentValue: BigNumber) => BigNumber.max(accumulator, currentValue),
      new BigNumber(0)
    );

  const minAskPrice = orderBookData.asks
    .map((e: any) => new BigNumber(e.price))
    .reduce(
      (accumulator: BigNumber, currentValue: BigNumber) => BigNumber.min(accumulator, currentValue),
      new BigNumber(Number.MAX_SAFE_INTEGER)
    );

  return {
    minAskPrice: minAskPrice.eq(Number.MAX_SAFE_INTEGER) ? null : minAskPrice,
    maxBidPrice: maxBidPrice.eq(0) ? null : maxBidPrice
  };
};
