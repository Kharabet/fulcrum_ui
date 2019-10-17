const getTokenPriceInEth = async (tokenName) => {
  return 2.51;  // 2.51 ETH PER MKR
};

const getEthPriceInUSD = async () => {
  return 179.50;  // 179.50 USD PER ETH
};

module.exports = {
  getTokenPriceInEth,
  getEthPriceInUSD
};
