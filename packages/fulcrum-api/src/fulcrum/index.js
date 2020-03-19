import { iTokens } from '../config/iTokens';
import { pTokens } from '../config/pTokens';

import BigNumber from 'bignumber.js';
import { DappHelperJson, mainnetAddress as dappHelperAddress } from './contracts/DappHelperContract'
import { mainnetAddress as oracleAddress, oracleJson } from './contracts/OracleContract'
import { iTokenJson } from './contracts/iTokenContract';
import { pTokenJson } from './contracts/pTokenContract';

const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2)
    .pow(256)
    .minus(1);

export default class Fulcrum {
    constructor(web3, cache) {
        this.web3 = web3;
        this.cache = cache;
        this.cache.on("expired", this.setReserveData.bind(this));
        // this.iTokenContract = new this.web3.eth.Contract(iTokenJson.abi, token.address);
        this.DappHeperContract = new this.web3.eth.Contract(DappHelperJson.abi, dappHelperAddress);
    }

    async setReserveData(key, value) {
        if (key == "reserve_data") {
            const result = await this.updateReservedData();
            this.cache.set("reserve_data", result);
        }
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
        let result = {};
        const usdRates = await this.getUsdRates();
        for (const token in iTokens) {
            const iToken = iTokens[token];
            const iTokenContract = new this.web3.eth.Contract(iTokenJson.abi, iToken.address);
            const tokenPrice = await iTokenContract.methods.tokenPrice().call();

            //price is in loanAsset of iToken contract
            const price = new BigNumber(tokenPrice).multipliedBy(usdRates[iToken.name]).dividedBy(10 ** iToken.decimals);
            result[iToken.iTokenName.toLowerCase()] = price.toNumber();
        }
        return result;
    }

    async getPTokensPricesUsd() {
        let result = {};
        const usdRates = await this.getUsdRates();
        try {
            for (const token in pTokens) {
                const pToken = pTokens[token];
                const pTokenContract = new this.web3.eth.Contract(pTokenJson.abi, pToken.address);
                const tokenPrice = await pTokenContract.methods.tokenPrice().call({ from: "0x4abB24590606f5bf4645185e20C4E7B97596cA3B" });
                const decimals = await pTokenContract.methods.decimals().call({ from: "0x4abB24590606f5bf4645185e20C4E7B97596cA3B" });
                //price is in loanAsset of iToken contract
                const baseAsset = this.getBaseAsset(pToken);
                const swapPrice = await this.getSwapToUsdRate(baseAsset);
                const price = new BigNumber(tokenPrice).multipliedBy(usdRates[pToken.asset.toLowerCase()]).dividedBy(10 ** decimals);
                result[pToken.symbol.toLowerCase()] = price.toNumber();
            }
        }
        catch (e) {
            console.log(e);
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
                const swapPriceData = await oracleContract.methods.getTradeData(
                    srcAssetErc20Address,
                    destAssetErc20Address,
                    srcAmount
                ).call({ from: "0x4abB24590606f5bf4645185e20C4E7B97596cA3B" });
                result = new BigNumber(swapPriceData[0]).dividedBy(10 ** 18);
            } catch (e) {
                console.log(e)
                result = new BigNumber(0);
            }
        }


        return result;
    }


    async  getReserveData() {
        var result = this.cache.get("reserve_data");
        if (!result) {

            console.warn("No reserve_data in cache!")
            result = await this.updateReservedData();

            this.cache.set("reserve_data", result);
            console.dir(`reserve_data:`);
            console.dir(result);
        }
        return result;
    }

    async updateReservedData() {
        var result = [];
        var tokenAddresses = iTokens.map(x => (x.address));
        var swapRates = await this.getSwapToUsdRateBatch(iTokens.find(x => x.name === "dai"));
        const reserveData = await this.DappHeperContract.methods.reserveDetails(tokenAddresses).call({ from: "0x4abB24590606f5bf4645185e20C4E7B97596cA3B" });

        let usdTotalLockedAll = new BigNumber(0);
        let usdSupplyAll = new BigNumber(0);
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

                result.push({
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
                });
            });
            result.push({
                token: "all",
                usdSupply: usdSupplyAll.dividedBy(10 ** 18).toFixed(),
                usdTotalLocked: usdTotalLockedAll.dividedBy(10 ** 18).toFixed()
            })

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