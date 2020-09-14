import { iTokens } from '../config/iTokens';
import { pTokens } from '../config/pTokens';

import BigNumber from 'bignumber.js';
import { DappHelperJson, mainnetAddress as dappHelperAddress } from '../contracts/DappHelperContract'
import { mainnetAddress as oracleAddress, oracleJson } from '../contracts/OracleContract'
import { erc20Json } from '../contracts/erc20Contract'
import { iTokenJson } from '../contracts/iTokenContract';
import { pTokenJson } from '../contracts/pTokenContract';
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
        // await this.storage.setItem("reserve_data", reserve_data);
        this.logger.info("reserve_data updated");

        const itoken = await this.updateITokensPrices();
        // await this.storage.setItem("itoken-prices", itoken);
        this.logger.info("itoken-prices updated");

        const ptoken = await this.updatePTokensPrices();
        // await this.storage.setItem("ptoken-prices", ptoken);
        this.logger.info("ptoken-prices updated");

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

    async getFulcrumLendRates() {
        const reserveData = await this.getReserveData();
        let lendRates = [];
        let borrowRates = [];
        reserveData.filter(item => item.token !== "all" && item.token !== "ethv1").forEach(item => {
            const lendApr = item.supplyInterestRate / 100;
            const lendApy = this.convertAPRtoAPY(lendApr);
            const tokenSymbol = item.token.toUpperCase();
            lendRates.push({
                apr: lendApr,
                apy: lendApy,
                tokenSymbol
            });
        });

        return { lendRates };
    }

    async getTorqueBorrowRates() {
        const reserveData = await this.getReserveData();

        let borrowRates = [];
        reserveData.filter(item => item.token !== "all" && item.token !== "ethv1").forEach(item => {
            const borrowApr = item.torqueBorrowInterestRate / 100;
            const borrowApy = this.convertAPRtoAPY(borrowApr);
            const tokenSymbol = item.token.toUpperCase();
            borrowRates.push({
                apr: borrowApr,
                apy: borrowApy,
                tokenSymbol
            });
        });

        return { borrowRates };
    }

    convertAPRtoAPY(apr) {
        const periodicRate = 365;
        // APY = (1 + APR / n)^n - 1 
        return Math.pow(1 + apr / periodicRate, periodicRate) - 1;
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

    async getITokensPrices() {
        const lastITokenPrices = (await iTokenPricesModel.find().sort({ _id: -1 }).select({ iTokenPrices: 1 }).lean().limit(1))[0];
        if (!lastITokenPrices) {

            this.logger.info("No itoken-prices in db!");
            await this.updateITokensPrices();
            // result = await this.updateITokensPrices();

            // await this.storage.setItem("itoken-prices", result);
            // console.dir(`itoken-prices:`);
            // console.dir(result);
        }
        let result = {}
        lastITokenPrices.iTokenPrices.forEach(iTokenPrice => {
            result[iTokenPrice.token] = {
                symbol: iTokenPrice.symbol,
                address: iTokenPrice.address,
                price_usd: iTokenPrice.priceUsd,
                price_asset: iTokenPrice.priceAsset,
            };
        })
        return result;
    }

    async updateITokensPrices() {
        const usdRates = await this.getUsdRates();
        let iTokenPrices = new iTokenPricesModel();
        iTokenPrices.iTokenPrices = [];
        for (const token in iTokens) {
            const iToken = iTokens[token];
            const iTokenContract = new this.web3.eth.Contract(iTokenJson.abi, iToken.address);
            this.logger.info("call iTokenContract");
            const tokenPrice = await iTokenContract.methods.tokenPrice().call();

            //price is in loanAsset of iToken contract
            const priceUsd = new BigNumber(tokenPrice).multipliedBy(usdRates[iToken.name === "ethv1" ? "eth" : iToken.name]).dividedBy(10 ** 18);
            const priceAsset = new BigNumber(tokenPrice).dividedBy(10 ** 18);
            const iTokenPrice = new iTokenPriceModel({
                token: iToken.iTokenName.toLowerCase(),
                symbol: iToken.iTokenName,
                address: iToken.address.toLowerCase(),
                priceUsd: priceUsd.toNumber(),
                priceAsset: priceAsset.toNumber()
            });
            iTokenPrices.iTokenPrices.push(iTokenPrice);
        }
        await iTokenPrices.save();
    }

    async getPTokensPrices() {
        const lastPTokenPrices = (await pTokenPricesModel.find().sort({ _id: -1 }).select({ pTokenPrices: 1 }).lean().limit(1))[0];
        if (!lastPTokenPrices) {

            this.logger.info("No ptoken-prices in db!");
            await this.updatePTokensPrices();
            // await this.storage.setItem("ptoken-prices", result);
            // console.dir(`ptoken-prices:`);
            // console.dir(result);
        }
        let result = {};
        lastPTokenPrices.pTokenPrices.forEach(pTokenPrice => {
            result[pTokenPrice.token] = {
                symbol: pTokenPrice.symbol,
                address: pTokenPrice.address,
                price_usd: pTokenPrice.priceUsd
            };
        })
        return result;
    }

    async updatePTokensPrices() {
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
                //price is in loanAsset of iToken contract
                const baseAsset = this.getBaseAsset(pToken);
                //const swapPrice = await this.getSwapToUsdRate(baseAsset);
                const price = new BigNumber(tokenPrice).multipliedBy(usdRates[baseAsset.toLowerCase()]).dividedBy(10 ** 18);
                const pTokenPrice = new pTokenPriceModel({
                    token: pToken.ticker.toLowerCase(),
                    symbol: pToken.ticker,
                    address: pToken.address,
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
        if (srcAsset === destAsset || (srcAsset === "USDC" && destAsset === "DAI")
            || (srcAsset === "DAI" && destAsset === "USDC")) {
            return new BigNumber(1);
        }

        let result = new BigNumber(0);
        const srcAssetErc20Address = iTokens.find(token => token.name === srcAsset.toLowerCase()).erc20Address;
        const destAssetErc20Address = iTokens.find(token => token.name === destAsset.toLowerCase()).erc20Address;
        if (!srcAmount) {
            srcAmount = UNLIMITED_ALLOWANCE_IN_BASE_UNITS;
        } else {
            srcAmount = new BigNumber(srcAmount.toFixed(0, 1));
        }

        if (srcAssetErc20Address && destAssetErc20Address) {
            const oracleContract = new this.web3.eth.Contract(oracleJson.abi, oracleAddress);

            const srcAssetDecimals = iTokens.find(e => e.name === srcAsset.toLowerCase()).decimals;
            const srcAssetPrecision = new BigNumber(10 ** (18 - srcAssetDecimals));
            const destAssetDecimals = iTokens.find(e => e.name === destAsset.toLowerCase()).decimals;
            const destAssetPrecision = new BigNumber(10 ** (18 - destAssetDecimals));
            try {
                this.logger.info("call oracleContract");

                const swapPriceData = await oracleContract.methods.queryRate(
                    srcAssetErc20Address,
                    destAssetErc20Address
                ).call({ from: "0x4abB24590606f5bf4645185e20C4E7B97596cA3B" });
                result = swapPriceData[0].times(srcAssetPrecision).div(destAssetPrecision).dividedBy(10 ** 18)
                    .multipliedBy(swapPriceData[1].dividedBy(10 ** 18));
            } catch (e) {
                this.logger.info(e)
                result = new BigNumber(0);
            }
        }
        return result;
    }


    async getReserveData() {
        const lastReserveData = (await statsModel.find().sort({ _id: -1 }).select({ tokensStats: 1, allTokensStats: 1 }).lean().limit(1))[0];

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

    async getHistoryTVL(startDate, endDate, estimatedPointsNumber) {
        const dbStatsDocuments = (await statsModel.find({
            "date": {
                $lt: endDate,
                $gte: startDate
            }
        }, { date: 1, allTokensStats: 1 }).sort({ date: 1 }).lean());
        const arrayLength = dbStatsDocuments.length;
        const desiredlength = dbStatsDocuments.length > estimatedPointsNumber
            ? estimatedPointsNumber - 1
            : dbStatsDocuments.length;

        //pick every n-th element to get normal scale of data
        const timeBetweenTwoArrayElements = (new Date(dbStatsDocuments[0].date).getTime() - new Date(dbStatsDocuments[arrayLength - 1].date).getTime()) / arrayLength;
        const timeBetweenTwoOutputElements = (new Date(dbStatsDocuments[0].date).getTime() - new Date(dbStatsDocuments[arrayLength - 1].date).getTime()) / desiredlength;
        const offset = Math.floor(timeBetweenTwoOutputElements / timeBetweenTwoArrayElements);
        const reducedArray = dbStatsDocuments.filter((e, i) => i % offset === 0);

        let result = [];
        reducedArray.forEach((document, index, documents) => {
            let diffWithPrevPrecents = 0;
            if (index > 0)
                diffWithPrevPrecents = (document.allTokensStats.usdTotalLocked - documents[index - 1].allTokensStats.usdTotalLocked) / documents[index - 1].allTokensStats.usdTotalLocked * 100;
            result.push({
                timestamp: new Date(document.date).getTime(),
                tvl: document.allTokensStats.usdTotalLocked,
                diffWithPrevPrecents: diffWithPrevPrecents
            });
        });
        return result;
    }

    async getAssetStatsHistory(asset, startDate, endDate, estimatedPointsNumber, metrics) {
        const dbStatsDocuments = await statsModel.find({
            "date": {
                $lt: endDate,
                $gte: startDate
            },
            tokensStats: { $elemMatch: { token: asset } }

        }, { date: 1, tokensStats: 1, "tokensStats.$": asset }).sort({ date: 1 }).lean()

        const arrayLength = dbStatsDocuments.length;
        const desiredlength = dbStatsDocuments.length > estimatedPointsNumber
            ? estimatedPointsNumber - 1
            : dbStatsDocuments.length;

        //pick every n-th element to get normal scale of data
        const timeBetweenTwoArrayElements = (new Date(dbStatsDocuments[0].date).getTime() - new Date(dbStatsDocuments[arrayLength - 1].date).getTime()) / arrayLength;
        const timeBetweenTwoOutputElements = (new Date(dbStatsDocuments[0].date).getTime() - new Date(dbStatsDocuments[arrayLength - 1].date).getTime()) / desiredlength;
        const offset = Math.floor(timeBetweenTwoOutputElements / timeBetweenTwoArrayElements);
        const reducedArray = dbStatsDocuments.filter((e, i) => i % offset === 0);

        let result = [];
        reducedArray.forEach((document, index, documents) => {
            const assetStats = document.tokensStats[0]
            let tvlChange24h = 0;
            let aprChange24h = 0;
            let utilizationChange24h = 0;
            const utilization = assetStats.totalBorrow / assetStats.totalSupply * 100;
            if (index > 0) {
                const prevAssetStats = documents[index - 1].tokensStats[0];
                const prevAssetUtilization = prevAssetStats.totalBorrow / prevAssetStats.totalSupply * 100;

                tvlChange24h = (assetStats.usdTotalLocked - prevAssetStats.usdTotalLocked) / prevAssetStats.usdTotalLocked;
                aprChange24h = (assetStats.supplyInterestRate - prevAssetStats.supplyInterestRate) / prevAssetStats.supplyInterestRate;
                utilizationChange24h = (utilization - prevAssetUtilization) / prevAssetUtilization;
            }
            result.push({
                timestamp: new Date(document.date).getTime(),
                token: assetStats.token,
                supplyInterestRate: assetStats.supplyInterestRate,
                tvl: assetStats.vaultBalance,
                tvlUsd: assetStats.usdTotalLocked,
                utilization: utilization,
                tvlChange24h,
                aprChange24h,
                utilizationChange24h
            });
        });
        return result;
    }

    async getAssetHistoryPrice(asset, date) {
        const dbStatsDocuments = await statsModel.find({
            "date": {
                $lt: new Date(date.getTime() + 1000 * 60 * 60),
                $gte: new Date(date.getTime() - 1000 * 60 * 60)
            },
            tokensStats: { $elemMatch: { token: asset } }

        }, { date: 1, tokensStats: 1, "tokensStats.$": asset }).sort({ date: 1 }).lean()

        return {
            swapToUSDPrice: dbStatsDocuments[0].tokensStats[0].swapToUSDPrice,
            timestamp: dbStatsDocuments[0].date.getTime()
        };
    }

    async updateReservedData() {
        var result = [];
        var tokenAddresses = iTokens.map(x => (x.address));
        var swapRates = (await this.getSwapToUsdRateBatch(iTokens.find(x => x.name === "dai")))[0];
        const reserveData = await this.DappHeperContract.methods.reserveDetails(tokenAddresses).call({ from: "0x4abB24590606f5bf4645185e20C4E7B97596cA3B" });
        let usdTotalLockedAll = new BigNumber(0);
        let usdSupplyAll = new BigNumber(0);
        let stats = new statsModel();
        stats.tokensStats = [];
        if (reserveData && reserveData.totalAssetSupply.length > 0) {
            await Promise.all(iTokens.map(async (token, i) => {
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

                if (token.name == "ethv1") {
                    vaultBalance = await this.getAssetTokenBalanceOfUser(token.name, "0x8b3d70d628ebd30d4a2ea82db95ba2e906c71633");
                }

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
            }));

            stats.allTokensStats = new allTokensStatsModel({
                token: "all",
                usdSupply: usdSupplyAll.dividedBy(10 ** 18).toFixed(),
                usdTotalLocked: usdTotalLockedAll.dividedBy(10 ** 18).toFixed()
            });
            await stats.save();
        }
        return result;
    }

    async getAssetTokenBalanceOfUser(asset, account) {
        let result = new BigNumber(0);
        const token = iTokens.find(x => x.name === asset)
        const precision = token.decimals || 18;
        const assetErc20Address = token.erc20Address;
        if (assetErc20Address) {
            result = await this.getErc20BalanceOfUser(assetErc20Address, account);
            result = result.times(10 ** (18 - precision));
        }
        return result;
    }

    async getErc20BalanceOfUser(addressErc20, account) {
        let result = new BigNumber(0);
        const tokenContract = new this.web3.eth.Contract(erc20Json.abi, addressErc20);
        if (tokenContract) {
            result = new BigNumber(await tokenContract.methods.balanceOf(account).call());
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

        result = await this.DappHeperContract.methods.assetRates(usdTokenAddress, underlyings, amounts).call({ from: "0x4abB24590606f5bf4645185e20C4E7B97596cA3B" });

        return result;
    }

}
