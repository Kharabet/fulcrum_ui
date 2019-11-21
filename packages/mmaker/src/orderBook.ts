import * as fetch from "node-fetch";
import { BigNumber } from "@0x/utils";

export interface IOrderBookRecord {
  id?: string;
  amount: BigNumber;
  price: BigNumber;
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
  const result: IOrderBook = { bids: [], asks: [] };

  // https://docs.bitfinex.com/reference#rest-public-book
  const response = await (fetch as any)(`https://staging-api.deversifi.com/bfx/v2/book/${symbol}/R0`);
  const orderBookRawData = await response.json();

  for (const order of orderBookRawData) {
    const orderId = order[0].toString();
    const price = new BigNumber(order[1]);
    const amount = new BigNumber(order[2]);

    if (amount.lte(0)) {
      result.asks.push({ id: orderId, amount: amount.multipliedBy(-1), price: price });
    } else {
      result.bids.push({ id: orderId, amount: amount, price: price });
    }
  }

  return result;
};

export const getMMOrdersData = async (efx: any, symbol: string): Promise<IOrderBook> => {
  const result: IOrderBook = { bids: [], asks: [] };
  const orders = await efx.getOrders();

  for (const order of orders) {
    const orderId = order.id.toString();
    const price = new BigNumber(order.price);
    const amount = new BigNumber(order.amount);

    if (order.amount > 0) {
      result.asks.push({
        id: orderId,
        amount: amount,
        price: price
      });
    } else {
      result.bids.push({
        id: order.id.toString(),
        amount: amount.multipliedBy(-1),
        price: price
      });
    }
  }

  return result;
};

export const getOrderBookWithoutMMOrders = async (
  orderBookData: IOrderBook,
  mmOrderBookData: IOrderBook
): Promise<IOrderBook> => {
  const result: IOrderBook = { bids: [], asks: [] };

  for (const order of orderBookData.asks) {
    const itemIndex = mmOrderBookData.asks.findIndex(e => e.id === order.id);
    if (itemIndex === -1) {
      result.asks.push(order);
    }
  }

  for (const order of orderBookData.bids) {
    const itemIndex = mmOrderBookData.bids.findIndex(e => e.id === order.id);
    if (itemIndex === -1) {
      result.bids.push(order);
    }
  }

  return result;
};

export const calculateOrderBookExposures = (
  orderBookData: IOrderBook,
  tokenPriceInDai: BigNumber
): IOrderBookExposure => {
  const bidExposure = orderBookData.bids
    .map((e: IOrderBookRecord) => e.amount.multipliedBy(e.price).multipliedBy(tokenPriceInDai))
    .reduce((accumulator: BigNumber, currentValue: BigNumber) => accumulator.plus(currentValue), new BigNumber(0));

  const askExposure = orderBookData.asks
    .map((e: IOrderBookRecord) => e.amount.multipliedBy(e.price).multipliedBy(tokenPriceInDai))
    .reduce((accumulator: BigNumber, currentValue: BigNumber) => accumulator.plus(currentValue), new BigNumber(0));

  return { bidExposure: bidExposure, askExposure: askExposure };
};

export const calculateOrderBookSpread = (orderBookData: IOrderBook): IOrderBookSpread => {
  const maxBidPrice = orderBookData.bids
    .map((e: IOrderBookRecord) => e.price)
    .reduce(
      (accumulator: BigNumber, currentValue: BigNumber) => BigNumber.max(accumulator, currentValue),
      new BigNumber(0)
    );

  const minAskPrice = orderBookData.asks
    .map((e: IOrderBookRecord) => e.price)
    .reduce(
      (accumulator: BigNumber, currentValue: BigNumber) => BigNumber.min(accumulator, currentValue),
      new BigNumber(Number.MAX_SAFE_INTEGER)
    );

  return {
    minAskPrice: minAskPrice.eq(Number.MAX_SAFE_INTEGER) ? null : minAskPrice,
    maxBidPrice: maxBidPrice.eq(0) ? null : maxBidPrice
  };
};
