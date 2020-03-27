import { iTokens } from '../config/iTokens';
import { pTokens } from '../config/pTokens';

import BigNumber from 'bignumber.js';
import { DappHelperJson, mainnetAddress as dappHelperAddress } from './contracts/DappHelperContract'
import { mainnetAddress as oracleAddress, oracleJson } from './contracts/OracleContract'
import { iTokenJson } from './contracts/iTokenContract';
import { pTokenJson } from './contracts/pTokenContract';
import config from '../config.json';
import { pTokenPricesModel, pTokenPriceModel } from "../models/pTokenPrices"
import { iTokenPricesModel, iTokenPriceModel } from "../models/iTokenPrices"
import { statsModel, tokenStatsModel, allTokensStatsModel } from "../models/stats"


const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2)
    .pow(256)
    .minus(1);

export default class Fulcrum {
    constructor(web3, storage, logger) {
        this.web3 = web3;
        this.logger = logger;
        this.storage = storage;
        setInterval(this.updateCache.bind(this), config.cache_ttl_sec * 1000);
        this.DappHeperContract = new this.web3.eth.Contract(DappHelperJson.abi, dappHelperAddress);
        this.updateCache();

    }

    async updateCache(key, value) {
        const reserve_data = await this.updateReservedData();
        await this.storage.setItem("reserve_data", reserve_data);
        this.logger.info("reserve_data updated");

        const itoken = await this.updateITokensPricesUsd();
        await this.storage.setItem("itoken-prices-usd", itoken);
        this.logger.info("itoken-prices-usd updated");

        const ptoken = await this.updatePTokensPricesUsd();
        await this.storage.setItem("ptoken-prices-usd", ptoken);
        this.logger.info("ptoken-prices-usd updated");

        return;
    }

    async getTotalAssetSupply() {
        const reserveData = await this.getReserveData()
        let totalAssetSupply = {};
        reserveData.forEach(item => totalAssetSupply[item.token] = item.totalSupply);

        return totalAssetSupply;
    }

    async getTotalAssetBorrow() {
        const reserveData = await this.getReserveData()
        let totalAssetBorrow = {};
        reserveData.forEach(item => totalAssetBorrow[item.token] = item.totalBorrow);

        return totalAssetBorrow;
    }

    async getSupplyRateAPR() {
        const reserveData = await this.getReserveData()
        let apr = {};
        reserveData.forEach(item => apr[item.token] = item.supplyInterestRate);

        return apr;
    }

    async getBorrowRateAPR() {
        const reserveData = await this.getReserveData()
        let apr = {};
        reserveData.forEach(item => apr[item.token] = item.borrowInterestRate);

        return apr;
    }

    async getTorqueBorrowRateAPR() {
        const reserveData = await this.getReserveData()
        let torqueBorrowRates = {};
        reserveData.forEach(item => torqueBorrowRates[item.token] = item.torqueBorrowInterestRate);
        return torqueBorrowRates;
    }

    async getVaultBalance() {
        const reserveData = await this.getReserveData()
        let vaultBalance = {};
        reserveData.forEach(item => vaultBalance[item.token] = item.vaultBalance);
        return vaultBalance;
    }

    async getFreeLiquidity() {
        const reserveData = await this.getReserveData()
        let freeLiquidity = {};
        reserveData.forEach(item => freeLiquidity[item.token] = item.liquidity);
        return freeLiquidity;
    }

    async getTVL() {
        const reserveData = await this.getReserveData()
        let tvl = {};
        reserveData.forEach(item => tvl[item.token] = item.usdTotalLocked);
        return tvl;
    }
    async getUsdRates() {
        const reserveData = await this.getReserveData()
        let usdRates = {};
        reserveData.forEach(item => usdRates[item.token] = item.swapToUSDPrice);
        return usdRates;
    }

    async getITokensPricesUsd() {
        const lastITokenPrices = (await iTokenPricesModel.find().sort({ _id: -1 }).select({ iTokenPrices: 1 }).limit(1))[0];
        if (!lastITokenPrices) {

            this.logger.info("No itoken-prices-usd in db!");
            await this.updateITokensPricesUsd();
            // result = await this.updateITokensPricesUsd();

            // await this.storage.setItem("itoken-prices-usd", result);
            // console.dir(`itoken-prices-usd:`);
            // console.dir(result);
        }
        let result = {}
        lastITokenPrices.iTokenPrices.forEach(iTokenPrice => {
            result[iTokenPrice.token] = iTokenPrice.priceUsd;
        })
        return result;
    }

    async updateITokensPricesUsd() {
        let result = {};
        const usdRates = await this.getUsdRates();
        let iTokenPrices = new iTokenPricesModel();
        iTokenPrices.iTokenPrices = [];
        for (const token in iTokens) {
            const iToken = iTokens[token];
            const iTokenContract = new this.web3.eth.Contract(iTokenJson.abi, iToken.address);
            this.logger.info("call iTokenContract");
            const tokenPrice = await iTokenContract.methods.tokenPrice().call();

            //price is in loanAsset of iToken contract
            const price = new BigNumber(tokenPrice).multipliedBy(usdRates[iToken.name]).dividedBy(10 ** iToken.decimals);
            result[iToken.iTokenName.toLowerCase()] = price.toNumber();
            const iTokenPrice = new iTokenPriceModel({
                token: iToken.iTokenName.toLowerCase(),
                priceUsd: price.toNumber()
            });
            iTokenPrices.iTokenPrices.push(iTokenPrice);
        }
        await iTokenPrices.save();
        return result;
    }

    async getPTokensPricesUsd() {
        const lastPTokenPrices = (await pTokenPricesModel.find().sort({ _id: -1 }).select({ pTokenPrices: 1 }).limit(1))[0];
        if (!lastPTokenPrices) {

            this.logger.info("No ptoken-prices-usd in db!");
            await this.updatePTokensPricesUsd();
            // await this.storage.setItem("ptoken-prices-usd", result);
            // console.dir(`ptoken-prices-usd:`);
            // console.dir(result);
        }
        let result = {};
        lastPTokenPrices.pTokenPrices.forEach(pTokenPrice => {
            result[pTokenPrice.token] = pTokenPrice.priceUsd;
        })
        return result;
    }

    async updatePTokensPricesUsd() {
        let result = {};
        const usdRates = await this.getUsdRates();
        let pTokenPrices = new pTokenPricesModel();
        pTokenPrices.pTokenPrices = [];
        try {
            for (const token in pTokens) {
                const pToken = pTokens[token];
                const pTokenContract = new this.web3.eth.Contract(pTokenJson.abi, pToken.address);
                this.logger.info("call pTokenContract");

                const tokenPrice = await pTokenContract.methods.tokenPrice().call({ from: "0x4abB24590606f5bf4645185e20C4E7B97596cA3B" });
                const decimals = await pTokenContract.methods.decimals().call({ from: "0x4abB24590606f5bf4645185e20C4E7B97596cA3B" });
                //price is in loanAsset of iToken contract
                const baseAsset = this.getBaseAsset(pToken);
                //const swapPrice = await this.getSwapToUsdRate(baseAsset);
                const price = new BigNumber(tokenPrice).multipliedBy(usdRates[baseAsset.toLowerCase()]).dividedBy(10 ** decimals);
                result[pToken.ticker.toLowerCase()] = price.toNumber();
                const pTokenPrice = new pTokenPriceModel({
                    token: pToken.ticker.toLowerCase(),
                    priceUsd: price.toNumber()
                });
                pTokenPrices.pTokenPrices.push(pTokenPrice);
            };
            await pTokenPrices.save();
        }
        catch (e) {
            this.logger.error(e);
        }
        return result;
    }

    getBaseAsset(pToken) {
        return pToken.direction === "SHORT" ? pToken.unit : pToken.asset;

    }

    async getSwapToUsdRate(asset) {
        if (asset === "SAI" || asset === "DAI" || asset === "USDC" || asset === "SUSD" || asset === "USDT") {
            return new BigNumber(1);
        }

        /*const swapRates = await this.getSwapToUsdRateBatch(
          [asset],
          process.env.REACT_APP_ETH_NETWORK === "mainnet" ?
            Asset.DAI :
            Asset.SAI
        );
    
        return swapRates[0];*/
        return this.getSwapRate(
            asset,
            "DAI"
        );
    }

    async getSwapRate(srcAsset, destAsset, srcAmount) {
        if (srcAsset === destAsset) {
            return new BigNumber(1);
        }

        let result = new BigNumber(0);

        if (!srcAmount) {
            srcAmount = UNLIMITED_ALLOWANCE_IN_BASE_UNITS;
        } else {
            srcAmount = new BigNumber(srcAmount.toFixed(0, 1));
        }

        const srcAssetErc20Address = iTokens.find(token => token.name === srcAsset.toLowerCase()).erc20Address;
        const destAssetErc20Address = iTokens.find(token => token.name === destAsset.toLowerCase()).erc20Address;
        if (srcAssetErc20Address && destAssetErc20Address) {
            const oracleContract = new this.web3.eth.Contract(oracleJson.abi, oracleAddress);

            try {
                this.logger.info("call oracleContract");

                const swapPriceData = await oracleContract.methods.getTradeData(
                    srcAssetErc20Address,
                    destAssetErc20Address,
                    srcAmount
                ).call({ from: "0x4abB24590606f5bf4645185e20C4E7B97596cA3B" });
                result = new BigNumber(swapPriceData[0]).dividedBy(10 ** 18);
            } catch (e) {
                this.logger.info(e)
                result = new BigNumber(0);
            }
        }


        return result;
    }


    async  getReserveData() {
        const lastReserveData = (await statsModel.find().sort({ _id: -1 }).select({ tokensStats: 1, allTokensStats: 1 }).limit(1))[0];

        if (!lastReserveData) {

            this.logger.info("No reserve_data in db!")
            result = await this.updateReservedData();
            // await this.storage.setItem("reserve_data", result);
            // console.dir(`reserve_data:`);
            // console.dir(result);
        }
        let result = [];
        lastReserveData.tokensStats.forEach(tokensStat => {
            result.push(tokensStat);
        });
        result.push(lastReserveData.allTokensStats);
        return result;
    }

    async updateReservedData() {
        var result = [];
        var tokenAddresses = iTokens.map(x => (x.address));
        var swapRates = await this.getSwapToUsdRateBatch(iTokens.find(x => x.name === "dai"));
        const reserveData = await this.DappHeperContract.methods.reserveDetails(tokenAddresses).call({ from: "0x4abB24590606f5bf4645185e20C4E7B97596cA3B" });

        let usdTotalLockedAll = new BigNumber(0);
        let usdSupplyAll = new BigNumber(0);
        let stats = new statsModel();
        stats.tokensStats = [];
        if (reserveData && reserveData.totalAssetSupply.length > 0) {
            iTokens.forEach((token, i) => {
                let totalAssetSupply = new BigNumber(reserveData.totalAssetSupply[i]);
                let totalAssetBorrow = new BigNumber(reserveData.totalAssetBorrow[i]);
                let supplyInterestRate = new BigNumber(reserveData.supplyInterestRate[i]);
                let borrowInterestRate = new BigNumber(reserveData.borrowInterestRate[i]);
                let torqueBorrowInterestRate = new BigNumber(reserveData.torqueBorrowInterestRate[i]);
                let vaultBalance = new BigNumber(reserveData.vaultBalance[i]);

                let marketLiquidity = totalAssetSupply.minus(totalAssetBorrow);

                const decimals = token.decimals;
                let usdSupply = new BigNumber(0);
                let usdTotalLocked = new BigNumber(0);

                const precision = new BigNumber(10 ** (18 - decimals));
                totalAssetSupply = totalAssetSupply.times(precision);
                totalAssetBorrow = totalAssetBorrow.times(precision);
                marketLiquidity = marketLiquidity.times(precision);
                vaultBalance = vaultBalance.times(precision);

                if (swapRates[i]) {
                    usdSupply = totalAssetSupply.times(swapRates[i]).dividedBy(10 ** 18);
                    usdSupplyAll = usdSupplyAll.plus(usdSupply);

                    usdTotalLocked = marketLiquidity.plus(vaultBalance).times(swapRates[i]).dividedBy(10 ** 18);
                    usdTotalLockedAll = usdTotalLockedAll.plus(usdTotalLocked);
                }

                stats.tokensStats.push(new tokenStatsModel({
                    token: token.name,
                    liquidity: marketLiquidity.dividedBy(10 ** 18).toFixed(),
                    totalSupply: totalAssetSupply.dividedBy(10 ** 18).toFixed(),
                    totalBorrow: totalAssetBorrow.dividedBy(10 ** 18).toFixed(),
                    supplyInterestRate: supplyInterestRate.dividedBy(10 ** 18).toFixed(),
                    borrowInterestRate: borrowInterestRate.dividedBy(10 ** 18).toFixed(),
                    torqueBorrowInterestRate: torqueBorrowInterestRate.dividedBy(10 ** 18).toFixed(),
                    vaultBalance: vaultBalance.dividedBy(10 ** 18).toFixed(),
                    swapRates: swapRates[i],
                    lockedAssets: vaultBalance.dividedBy(10 ** 18).toFixed(),
                    swapToUSDPrice: new BigNumber(swapRates[i]).dividedBy(10 ** 18).toFixed(),
                    usdSupply: usdSupply.dividedBy(10 ** 18).toFixed(),
                    usdTotalLocked: usdTotalLocked.dividedBy(10 ** 18).toFixed(),
                }));
            });
            stats.allTokensStats = new allTokensStatsModel({
                token: "all",
                usdSupply: usdSupplyAll.dividedBy(10 ** 18).toFixed(),
                usdTotalLocked: usdTotalLockedAll.dividedBy(10 ** 18).toFixed()
            });
            await stats.save();
        }
        return result;
    }


    getGoodSourceAmountOfAsset(assetName) {
        switch (assetName) {
            case "wbtc":
                return new BigNumber(10 ** 6);
            case "usdc":
                return new BigNumber(10 ** 4);
            case "usdt":
                return new BigNumber(10 ** 4);
            default:
                return new BigNumber(10 ** 16);
        }
    }

    async getSwapToUsdRateBatch(usdToken) {
        let result = [];
        const usdTokenAddress = usdToken.erc20Address;
        const underlyings = iTokens.map(e => (e.erc20Address));
        const amounts = iTokens.map(e => (this.getGoodSourceAmountOfAsset(e.name).toFixed()));

        result = await this.DappHeperContract.methods.assetRates(oracleAddress, usdTokenAddress, underlyings, amounts).call({ from: "0x4abB24590606f5bf4645185e20C4E7B97596cA3B" });

        return result;
    }

}