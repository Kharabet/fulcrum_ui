import { iTokens } from './config';

import BigNumber from 'bignumber.js';
import { DappHelperJson, mainnetAddress as dappHelperAddress } from './contracts/DappHelperContract'
import { mainnetAddress as oracleAddress } from './contracts/OracleContract'
import { iTokenJson } from './contracts/iTokenContract';



export default class Fulcrum {
    constructor(web3, cache) {
        this.web3 = web3;
        this.cache = cache
        this.cache.on( "expired", async function( key, value ){
            if(key == "reserve_data")
            {
                var result = await this.updateReservedData();
                this.cache.set("reserve_data", result);
            }
        });
        // this.iTokenContract = new this.web3.eth.Contract(iTokenJson.abi, token.address);
        this.DappHeperContract = new this.web3.eth.Contract(DappHelperJson.abi, dappHelperAddress);
    }

    async getAPR() {
        var reserveData = await this.getReserveData()
        var apr = {};
        reserveData.forEach(item => apr[item.token] = item.supplyInterestRate);

        return apr;
    }

    async getTVL() {
        var reserveData = await this.getReserveData()
        var tvl = {};
        reserveData.forEach(item => tvl[item.token] = item.usdTotalLocked);
        return tvl;
    }
    async getUsdRates() {
        var reserveData = await this.getReserveData()
        var usdRates = {};
        reserveData.forEach(item => usdRates[item.token] = item.swapToUSDPrice);
        return usdRates;
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

    async updateReservedData(){
        var result = [];
        var tokenAddresses = iTokens.map(x => (x.address));
        var swapRates = await this.getSwapToUsdRateBatch(iTokens.find(x => x.name === "dai"));
        var reserveData = await this.DappHeperContract.methods.reserveDetails(tokenAddresses).call();

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
            default:
                return new BigNumber(10 ** 16);
        }
    }

    async getSwapToUsdRateBatch(usdToken) {
        let result = [];
        const usdTokenAddress = usdToken.erc20Address;
        const underlyings = iTokens.map(e => (e.erc20Address));
        const amounts = iTokens.map(e => (this.getGoodSourceAmountOfAsset(e.name).toFixed()));

        result = await this.DappHeperContract.methods.assetRates(oracleAddress, usdTokenAddress, underlyings, amounts).call();

        return result;
    }

}

