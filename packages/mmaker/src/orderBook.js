const fetch = require("node-fetch");

const getData = async symbol => {
  const response = await fetch(`https://api.ethfinex.com/v1/book/${symbol}`);
  return await response.json();
};

const getMMData = async (efx, symbol) => {
  const result = { bids: [], asks: [] };
  const orders = await efx.getOrders();

  for (const order of orders) {
    if (order.amount > 0) {
      result.asks.push({ id: order.id, amount: order.amount, price: order.price });
    } else {
      result.bids.push({ id: order.id, amount: order.amount, price: order.price });
    }
  }

  return result;
};

const calculateOrderBookExposures = (orderBookData, tokenPrice, ethPrice) => {
  const bidExposure = orderBookData.bids
    .map(e => e.amount * e.price * tokenPrice * ethPrice)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const askExposure = orderBookData.asks
    .map(e => e.amount * e.price * tokenPrice * ethPrice)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return { bidExposure: bidExposure, askExposure: askExposure };
};

const calculateOrderBookSpread = (orderBookData, tokenPrice, ethPrice) => {
  const maxBidPrice = orderBookData.bids
    .map(e => e.price * tokenPrice * ethPrice)
    .reduce((accumulator, currentValue) => Math.max(accumulator, currentValue), 0);

  const minAskPrice = orderBookData.asks
    .map(e => e.price * tokenPrice * ethPrice)
    .reduce((accumulator, currentValue) => Math.max(accumulator, currentValue), 0);

  return (minAskPrice - maxBidPrice) * tokenPrice * ethPrice;
};

module.exports = {
  getMMData,
  getData,
  calculateOrderBookExposures,
  calculateOrderBookSpread
};
