const EFX = require("efx-api-node");
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

const orderBook = require("./orderBook");
const tradeConfig = require("./tradeConfig");
const utils = require("./utils.js");

const privateKey = "";
const infuraKey = "";
const infuraURL = "https://mainnet.infura.io/v3/" + infuraKey;

const provider = new HDWalletProvider(privateKey, infuraURL);
const web3 = new Web3(provider);

const mainAsync = async symbol => {
  const efx = await EFX(web3, { api: "https://test.ethfinex.com/trustless/v1" });
  efx.set("gasPrice", web3.utils.toWei("2", "gwei"));

  const tokenPrice = await utils.getTokenPriceInEth();
  const ethPrice = await utils.getEthPriceInUSD();

  const marketMakingSpread = tradeConfig.exposureSumTarget * tradeConfig.spreadPercent / 100;

  const orderBookMMData = await orderBook.getMMData(efx, symbol);
  const orderBookMMExposures = await orderBook.calculateOrderBookExposures(orderBookMMData, tokenPrice, ethPrice);
  const orderBookMMSpread = await orderBook.calculateOrderBookSpread(orderBookMMData, tokenPrice, ethPrice);

  const orderExposureBidDiff = orderBookMMExposures.bidExposure - (tradeConfig.exposureSumTarget / 2);
  const orderExposureAskDiff = orderBookMMExposures.askExposure - (tradeConfig.exposureSumTarget / 2);

  const orderBookData = await orderBook.getData(symbol);
  const orderBookExposures = await orderBook.calculateOrderBookExposures(orderBookData, tokenPrice, ethPrice);
  const orderBookSpread = await orderBook.calculateOrderBookSpread(orderBookData, tokenPrice, ethPrice);

  console.dir(orderBookMMData);
  console.dir(orderBookMMExposures);
  console.dir(orderBookMMSpread);

  console.dir(orderBookData);
  console.dir(orderBookExposures);
  console.dir(orderBookSpread);
};

mainAsync("MKRETH");
