const MarketMaker = artifacts.require("MarketMaker");

module.exports = (deployer) => {
  deployer.then(async () => {
    await deployer.deploy(MarketMaker, []);
    console.log(`   > MarketMaker deploy: #done`);
  });
};
