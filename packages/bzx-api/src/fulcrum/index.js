import { iTokens } from '../config/iTokens'
import { pTokens } from '../config/pTokens'

import BigNumber from 'bignumber.js'
import {
  DappHelperJson,
  mainnetAddress as dappHelperAddress
} from '../contracts/DappHelperContract'
import Web3Utils from 'web3-utils'
import { mainnetAddress as oracleAddress, oracleJson } from '../contracts/OracleContract'
import { erc20Json } from '../contracts/erc20Contract'
import { iTokenJson } from '../contracts/iTokenContract'
import { pTokenJson } from '../contracts/pTokenContract'
import { mainnetAddress as iBZxAddress, iBZxJson } from '../contracts/iBZxContract'
import config from '../config.json'
import { pTokenPricesModel, pTokenPriceModel } from '../models/pTokenPrices'
import { iTokenPricesModel, iTokenPriceModel } from '../models/iTokenPrices'
import { statsModel, tokenStatsModel, allTokensStatsModel } from '../models/stats'
import { loansParamsModel, loanParamsModel } from '../models/loansParams'

const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1)

export default class Fulcrum {
  constructor(web3, storage, logger) {
    this.web3 = web3
    this.logger = logger
    this.storage = storage
    setInterval(this.updateCache.bind(this), config.cache_ttl_sec * 1000)
    setInterval(this.updateParamsCache.bind(this), config.cache_ttl_day * 1000)
    this.DappHeperContract = new this.web3.eth.Contract(DappHelperJson.abi, dappHelperAddress)
    this.updateCache()
    this.updateParamsCache()
  }

  async updateCache(key, value) {
    await this.updateReservedData()
    // await this.storage.setItem("reserve_data", reserve_data);
    this.logger.info('reserve_data updated')

    await this.updateITokensPrices()
    // await this.storage.setItem("itoken-prices", itoken);
    this.logger.info('itoken-prices updated')

    await this.updatePTokensPrices()
    // await this.storage.setItem("ptoken-prices", ptoken);
    this.logger.info('ptoken-prices updated')
  }

  async updateParamsCache(key, value) {
    await this.updateLoansParams()
    // await this.storage.setItem("loan_params", params);
    this.logger.info('loan_params updated')
  }


  async getTotalAssetSupply() {
    const reserveData = await this.getReserveData()
    const totalAssetSupply = {}
    reserveData.forEach((item) => (totalAssetSupply[item.token] = item.totalSupply))

    return totalAssetSupply
  }

  async getTotalAssetBorrow() {
    const reserveData = await this.getReserveData()
    const totalAssetBorrow = {}
    reserveData.forEach((item) => (totalAssetBorrow[item.token] = item.totalBorrow))

    return totalAssetBorrow
  }

  async getSupplyRateAPR() {
    const reserveData = await this.getReserveData()
    const apr = {}
    reserveData.forEach((item) => (apr[item.token] = item.supplyInterestRate))

    return apr
  }

  async getBorrowRateAPR() {
    const reserveData = await this.getReserveData()
    const apr = {}
    reserveData.forEach((item) => (apr[item.token] = item.borrowInterestRate))

    return apr
  }

  async getYieldFarmingAPY() {
    const reserveData = await this.getReserveData()
    const apy = {}
    reserveData.forEach((item) => (apy[item.token] = item.yieldFarmingAPR))

    return apy
  }

  async getFulcrumLendRates() {
    const reserveData = await this.getReserveData()
    const lendRates = []
    const borrowRates = []
    reserveData
      .filter((item) => item.token !== 'all' && item.token !== 'ethv1')
      .forEach((item) => {
        const lendApr = item.supplyInterestRate / 100
        const lendApy = this.convertAPRtoAPY(lendApr)
        const tokenSymbol = item.token.toUpperCase()
        lendRates.push({
          apr: lendApr,
          apy: lendApy,
          tokenSymbol
        })
      })

    return { lendRates, borrowRates }
  }

  async getTorqueBorrowRates() {
    const reserveData = await this.getReserveData()

    const borrowRates = []
    reserveData
      .filter((item) => item.token !== 'all' && item.token !== 'ethv1')
      .forEach((item) => {
        const borrowApr = item.torqueBorrowInterestRate / 100
        const borrowApy = this.convertAPRtoAPY(borrowApr)
        const tokenSymbol = item.token.toUpperCase()
        borrowRates.push({
          apr: borrowApr,
          apy: borrowApy,
          tokenSymbol
        })
      })

    return { borrowRates, lendRates: [] }
  }

  async getFulcrumLendAndTorqueBorrowAndYieldRates() {
    const reserveData = await this.getReserveData()
    const rates = {}
    reserveData
      .filter((item) => item.token !== 'all' && item.token !== 'ethv1')
      .forEach((item) => {
        const yieldFarmingAPR = item.yieldFarmingAPR / 100
        const lendApr = item.supplyInterestRate / 100
        const lendApy = this.convertAPRtoAPY(lendApr)
        const borrowApr = item.torqueBorrowInterestRate / 100
        const borrowApy = this.convertAPRtoAPY(borrowApr)
        rates[item.token] = {
          lendApr,
          lendApy,
          borrowApr,
          borrowApy,
          yieldFarmingAPR
        }
      })
    return rates
  }

  convertAPRtoAPY(apr) {
    const periodicRate = 365
    // APY = (1 + APR / n)^n - 1
    return Math.pow(1 + apr / periodicRate, periodicRate) - 1
  }

  async getTorqueBorrowRateAPR() {
    const reserveData = await this.getReserveData()
    const torqueBorrowRates = {}
    reserveData.forEach((item) => (torqueBorrowRates[item.token] = item.torqueBorrowInterestRate))
    return torqueBorrowRates
  }

  async getVaultBalance() {
    const reserveData = await this.getReserveData()
    const vaultBalance = {}
    reserveData.forEach((item) => (vaultBalance[item.token] = item.vaultBalance))
    return vaultBalance
  }

  async getFreeLiquidity() {
    const reserveData = await this.getReserveData()
    const freeLiquidity = {}
    reserveData.forEach((item) => (freeLiquidity[item.token] = item.liquidity))
    return freeLiquidity
  }

  async getTVL() {
    const reserveData = await this.getReserveData()
    const tvl = {}
    reserveData.forEach((item) => (tvl[item.token] = item.usdTotalLocked))
    return tvl
  }

  async getUsdRates() {
    const reserveData = await this.getReserveData()
    const usdRates = {}
    reserveData.forEach((item) => (usdRates[item.token] = item.swapToUSDPrice))
    return usdRates
  }

  async getITokensPrices() {
    const lastITokenPrices = (
      await iTokenPricesModel
        .find()
        .sort({ _id: -1 })
        .select({ iTokenPrices: 1 })
        .lean()
        .limit(1)
    )[0]
    if (!lastITokenPrices) {
      this.logger.info('No itoken-prices in db!')
      await this.updateITokensPrices()
      // result = await this.updateITokensPrices();

      // await this.storage.setItem("itoken-prices", result);
      // console.dir(`itoken-prices:`);
      // console.dir(result);
    }
    const result = {}
    lastITokenPrices.iTokenPrices.forEach((iTokenPrice) => {
      result[iTokenPrice.token] = {
        symbol: iTokenPrice.symbol,
        address: iTokenPrice.address,
        price_usd: iTokenPrice.priceUsd,
        price_asset: iTokenPrice.priceAsset
      }
    })
    return result
  }

  async updateITokensPrices() {
    const usdRates = await this.getUsdRates()
    const iTokenPrices = new iTokenPricesModel()
    iTokenPrices.iTokenPrices = []
    for (const token in iTokens) {
      const iToken = iTokens[token]
      const iTokenContract = new this.web3.eth.Contract(iTokenJson.abi, iToken.address)
      this.logger.info('call iTokenContract')
      const tokenPrice = await iTokenContract.methods.tokenPrice().call()

      // price is in loanAsset of iToken contract
      const priceUsd = new BigNumber(tokenPrice)
        .multipliedBy(usdRates[iToken.name === 'ethv1' ? 'eth' : iToken.name])
        .dividedBy(10 ** 18)
      const priceAsset = new BigNumber(tokenPrice).dividedBy(10 ** 18)
      const iTokenPrice = new iTokenPriceModel({
        token: iToken.iTokenName.toLowerCase(),
        symbol: iToken.iTokenName,
        address: iToken.address.toLowerCase(),
        priceUsd: priceUsd.toNumber(),
        priceAsset: priceAsset.toNumber()
      })
      iTokenPrices.iTokenPrices.push(iTokenPrice)
    }
    await iTokenPrices.save()
  }

  async getPTokensPrices() {
    const lastPTokenPrices = (
      await pTokenPricesModel
        .find()
        .sort({ _id: -1 })
        .select({ pTokenPrices: 1 })
        .lean()
        .limit(1)
    )[0]
    if (!lastPTokenPrices) {
      this.logger.info('No ptoken-prices in db!')
      await this.updatePTokensPrices()
      // await this.storage.setItem("ptoken-prices", result);
      // console.dir(`ptoken-prices:`);
      // console.dir(result);
    }
    const result = {}
    lastPTokenPrices.pTokenPrices.forEach((pTokenPrice) => {
      result[pTokenPrice.token] = {
        symbol: pTokenPrice.symbol,
        address: pTokenPrice.address,
        price_usd: pTokenPrice.priceUsd
      }
    })
    return result
  }

  async updatePTokensPrices() {
    const result = {}
    const usdRates = await this.getUsdRates()
    const pTokenPrices = new pTokenPricesModel()
    pTokenPrices.pTokenPrices = []
    try {
      for (const token in pTokens) {
        const pToken = pTokens[token]
        const pTokenContract = new this.web3.eth.Contract(pTokenJson.abi, pToken.address)
        this.logger.info('call pTokenContract')

        const tokenPrice = await pTokenContract.methods
          .tokenPrice()
          .call({ from: '0x4abB24590606f5bf4645185e20C4E7B97596cA3B' })
        // price is in loanAsset of iToken contract
        const baseAsset = this.getBaseAsset(pToken)
        // const swapPrice = await this.getSwapToUsdRate(baseAsset);
        const price = new BigNumber(tokenPrice)
          .multipliedBy(usdRates[baseAsset.toLowerCase()])
          .dividedBy(10 ** 18)
        const pTokenPrice = new pTokenPriceModel({
          token: pToken.ticker.toLowerCase(),
          symbol: pToken.ticker,
          address: pToken.address,
          priceUsd: price.toNumber()
        })
        pTokenPrices.pTokenPrices.push(pTokenPrice)
      }
      await pTokenPrices.save()
    }
    catch (e) {
      this.logger.error(e)
    }
    return result
  }

  async getLoansParams() {
    const lastLoansParams = (
      await loansParamsModel
        .find()
        .sort({ _id: -1 })
        .select({ loanParams: 1 })
        .lean()
        .limit(1)
    )[0]
    if (!lastLoansParams) {
      this.logger.info('No loan-params in db!')
      await this.updateLoansParams()
      // await this.storage.setItem("loan-params", result);
      // console.dir(`loan-params:`);
      // console.dir(result);
    }
    return lastLoansParams.loanParams
  }

  async updateLoansParams() {
    const result = {}
    const loansParams = new loansParamsModel()
    loansParams.loanParams = []
    try {
      const iBZxContract = new this.web3.eth.Contract(iBZxJson.abi, iBZxAddress)
      // console.log('call iBZxContract')
      if (!iBZxContract) return null

      const tokens = iTokens.filter(token => token.name !== 'ethv1')

      for (const loan in tokens) {
        // console.log('call iTokenContract')
        this.logger.info('call iTokenContract')
        const loanTokenAddress = tokens[loan].erc20Address
        const iTokenContract = new this.web3.eth.Contract(iTokenJson.abi, tokens[loan].address)
        if (!iTokenContract) return null

        for (const collateral in tokens) {
          if (loan !== collateral) {
            const collateralTokenAddress = tokens[collateral].erc20Address

            if (!collateralTokenAddress) return null
            const fulcrumId = new BigNumber(Web3Utils.soliditySha3(collateralTokenAddress, false))
            const liquidationIncentivePercent = await iBZxContract.methods
              .liquidationIncentivePercent(loanTokenAddress, collateralTokenAddress)
              .call()
            let loanId = await iTokenContract.methods
              .loanParamsIds(fulcrumId)
              .call()
            let loanParams = await iBZxContract.methods
              .loanParams(loanId)
              .call()
            loanParams[3] !== "0x0000000000000000000000000000000000000000" &&
              loansParams.loanParams.push(new loanParamsModel({
                loanId: loanParams[0],
                principal: this.getAssetFromAddress(loanParams[3]),
                collateral: this.getAssetFromAddress(loanParams[4]),
                platform: "Fulcrum",
                initialMargin: new BigNumber(loanParams[5]).div(10 ** 18),
                maintenanceMargin: new BigNumber(loanParams[6]).div(10 ** 18),
                liquidationPenalty: new BigNumber(liquidationIncentivePercent).div(10 ** 18)
              }))

            const torqueId = new BigNumber(Web3Utils.soliditySha3(collateralTokenAddress, true))
            loanId = await iTokenContract.methods
              .loanParamsIds(torqueId)
              .call()
            loanParams = await iBZxContract.methods
              .loanParams(loanId)
              .call()
            loanParams[3] !== "0x0000000000000000000000000000000000000000" && loansParams.loanParams.push(new loanParamsModel({
              loanId: loanParams[0],
              principal: this.getAssetFromAddress(loanParams[3]),
              collateral: this.getAssetFromAddress(loanParams[4]),
              platform: "Torque",
              initialMargin: new BigNumber(loanParams[5]).div(10 ** 18),
              maintenanceMargin: new BigNumber(loanParams[6]).div(10 ** 18),
              liquidationPenalty: new BigNumber(liquidationIncentivePercent).div(10 ** 18)
            }
            ))
          }
        }
      }

      if (loansParams.loanParams)
        await loansParams.save()
    }
    catch (e) {
      this.logger.error(e)
    }
    return result
  }

  getAssetFromAddress(addressErc20) {
    let asset = "UNKNOWN"
    addressErc20 = addressErc20.toLowerCase()
    switch (addressErc20) {
      case '0x56d811088235f11c8920698a204a5010a788f4b3':
        asset = 'BZRX'
        break
      case '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e':
        asset = 'YFI'
        break
      case '0x80fb784b7ed66730e8b1dbd9820afd29931aab03':
        asset = 'LEND'
        break
      case '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2':
        asset = 'ETH'
        break
      case '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359':
        asset = 'SAI'
        break
      case '0x6b175474e89094c44da98b954eedeac495271d0f':
        asset = 'DAI'
        break
      case '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48':
        asset = 'USDC'
        break
      case '0xdac17f958d2ee523a2206206994597c13d831ec7':
        asset = 'USDT'
        break
      case '0x57ab1ec28d129707052df4df418d58a2d46d5f51':
        asset = 'SUSD'
        break
      case '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599':
        asset = 'WBTC'
        break
      case '0x514910771af9ca656af840dff83e8264ecf986ca':
        asset = 'LINK'
        break
      case '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2':
        asset = 'MKR'
        break
      case '0xe41d2489571d322189246dafa5ebde1f4699f498':
        asset = 'ZRX'
        break
      case '0x0d8775f648430679a709e98d2b0cb6250d2887ef':
        asset = 'BAT'
        break
      case '0x1985365e9f78359a9b6ad760e32412f4a445e862':
        asset = 'REP'
        break
      case '0xdd974d5c2e2928dea5f71b9825b8b646686bd200':
        asset = 'KNC'
        break
      case '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9':
        asset = 'AAVE'
        break
      case '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984':
        asset = 'UNI'
        break
      case '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd':
        asset = 'LRC'
        break
      case '0xc00e94cb662c3520282e6f5717214004a7f26888':
        asset = 'COMP'
        break
      case '0x0000000000004946c0e9f43f4dee607b0ef1fa1c':
        asset = 'CHI'
        break
    }
    return asset
  }

  getBaseAsset(pToken) {
    return pToken.direction === 'SHORT' ? pToken.unit : pToken.asset
  }

  async getSwapToUsdRate(asset) {
    if (
      asset === 'SAI' ||
      asset === 'DAI' ||
      asset === 'USDC' ||
      asset === 'SUSD' ||
      asset === 'USDT'
    ) {
      return new BigNumber(1)
    }

    /* const swapRates = await this.getSwapToUsdRateBatch(
          [asset],
          process.env.REACT_APP_ETH_NETWORK === "mainnet" ?
            Asset.DAI :
            Asset.SAI
        );
    
        return swapRates[0]; */
    return this.getSwapRate(asset, 'DAI')
  }

  async getSwapRate(srcAsset, destAsset, srcAmount) {
    if (
      srcAsset === destAsset ||
      (srcAsset === 'USDC' && destAsset === 'DAI') ||
      (srcAsset === 'DAI' && destAsset === 'USDC')
    ) {
      return new BigNumber(1)
    }

    let result = new BigNumber(0)
    const srcAssetErc20Address = iTokens.find((token) => token.name === srcAsset.toLowerCase())
      .erc20Address
    const destAssetErc20Address = iTokens.find((token) => token.name === destAsset.toLowerCase())
      .erc20Address
    if (!srcAmount) {
      srcAmount = UNLIMITED_ALLOWANCE_IN_BASE_UNITS
    }
    else {
      srcAmount = new BigNumber(srcAmount.toFixed(0, 1))
    }

    if (srcAssetErc20Address && destAssetErc20Address) {
      const oracleContract = new this.web3.eth.Contract(oracleJson.abi, oracleAddress)

      const srcAssetDecimals = iTokens.find((e) => e.name === srcAsset.toLowerCase()).decimals
      const srcAssetPrecision = new BigNumber(10 ** (18 - srcAssetDecimals))
      const destAssetDecimals = iTokens.find((e) => e.name === destAsset.toLowerCase()).decimals
      const destAssetPrecision = new BigNumber(10 ** (18 - destAssetDecimals))
      try {
        this.logger.info('call oracleContract')

        const swapPriceData = await oracleContract.methods
          .queryRate(srcAssetErc20Address, destAssetErc20Address)
          .call({ from: '0x4abB24590606f5bf4645185e20C4E7B97596cA3B' })
        result = swapPriceData[0]
          .times(srcAssetPrecision)
          .div(destAssetPrecision)
          .dividedBy(10 ** 18)
          .multipliedBy(swapPriceData[1].dividedBy(10 ** 18))
      }
      catch (e) {
        this.logger.info(e)
        result = new BigNumber(0)
      }
    }
    return result
  }

  async getReserveData() {
    let result = []
    const lastReserveData = (
      await statsModel
        .find()
        .sort({ _id: -1 })
        .select({ tokensStats: 1, allTokensStats: 1 })
        .lean()
        .limit(1)
    )[0]

    if (!lastReserveData) {
      this.logger.info('No reserve_data in db!')
      result = await this.updateReservedData()
      // await this.storage.setItem("reserve_data", result);
      // console.dir(`reserve_data:`);
      // console.dir(result);
    }

    lastReserveData.tokensStats.forEach((tokensStat) => {
      result.push(tokensStat)
    })
    result.push(lastReserveData.allTokensStats)
    return result
  }

  async getHistoryTVL(startDate, endDate, estimatedPointsNumber) {
    const dbStatsDocuments = await statsModel
      .find(
        {
          date: {
            $lt: endDate,
            $gte: startDate
          }
        },
        { date: 1, allTokensStats: 1 }
      )
      .sort({ date: 1 })
      .lean()
    const arrayLength = dbStatsDocuments.length
    const desiredlength =
      dbStatsDocuments.length > estimatedPointsNumber
        ? estimatedPointsNumber - 1
        : dbStatsDocuments.length

    // pick every n-th element to get normal scale of data
    const timeBetweenTwoArrayElements =
      (new Date(dbStatsDocuments[0].date).getTime() -
        new Date(dbStatsDocuments[arrayLength - 1].date).getTime()) /
      arrayLength
    const timeBetweenTwoOutputElements =
      (new Date(dbStatsDocuments[0].date).getTime() -
        new Date(dbStatsDocuments[arrayLength - 1].date).getTime()) /
      desiredlength
    const offset = Math.floor(timeBetweenTwoOutputElements / timeBetweenTwoArrayElements)
    const reducedArray = dbStatsDocuments.filter((e, i) => i % offset === 0)

    const result = []
    reducedArray.forEach((document, index, documents) => {
      let diffWithPrevPrecents = 0
      if (index > 0)
        diffWithPrevPrecents =
          ((document.allTokensStats.usdTotalLocked -
            documents[index - 1].allTokensStats.usdTotalLocked) /
            documents[index - 1].allTokensStats.usdTotalLocked) *
          100
      result.push({
        timestamp: new Date(document.date).getTime(),
        tvl: document.allTokensStats.usdTotalLocked,
        diffWithPrevPrecents: diffWithPrevPrecents
      })
    })
    return result
  }

  async getAssetStatsHistory(asset, startDate, endDate, estimatedPointsNumber, metrics) {
    const dbStatsDocuments = await statsModel
      .find(
        {
          date: {
            $lt: endDate,
            $gte: startDate
          },
          tokensStats: { $elemMatch: { token: asset } }
        },
        { date: 1, tokensStats: 1, 'tokensStats.$': asset }
      )
      .sort({ date: 1 })
      .lean()

    const arrayLength = dbStatsDocuments.length
    const desiredlength =
      dbStatsDocuments.length > estimatedPointsNumber
        ? estimatedPointsNumber - 1
        : dbStatsDocuments.length

    // pick every n-th element to get normal scale of data
    const timeBetweenTwoArrayElements =
      (new Date(dbStatsDocuments[0].date).getTime() -
        new Date(dbStatsDocuments[arrayLength - 1].date).getTime()) /
      arrayLength
    const timeBetweenTwoOutputElements =
      (new Date(dbStatsDocuments[0].date).getTime() -
        new Date(dbStatsDocuments[arrayLength - 1].date).getTime()) /
      desiredlength
    const offset = Math.floor(timeBetweenTwoOutputElements / timeBetweenTwoArrayElements)
    const reducedArray = dbStatsDocuments.filter((e, i) => i % offset === 0)

    const result = []
    reducedArray.forEach((document, index, documents) => {
      const assetStats = document.tokensStats[0]
      let tvlChange24h = 0
      let aprChange24h = 0
      let utilizationChange24h = 0
      const utilization = (assetStats.totalBorrow / assetStats.totalSupply) * 100
      if (index > 0) {
        const prevAssetStats = documents[index - 1].tokensStats[0]
        const prevAssetUtilization = (prevAssetStats.totalBorrow / prevAssetStats.totalSupply) * 100

        tvlChange24h =
          (assetStats.usdTotalLocked - prevAssetStats.usdTotalLocked) /
          prevAssetStats.usdTotalLocked
        aprChange24h =
          (assetStats.supplyInterestRate - prevAssetStats.supplyInterestRate) /
          prevAssetStats.supplyInterestRate
        utilizationChange24h = (utilization - prevAssetUtilization) / prevAssetUtilization
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
      })
    })
    return result
  }

  async getAssetHistoryPrice(asset, date) {
    const dbStatsDocuments = await statsModel
      .find(
        {
          date: {
            $lt: new Date(date.getTime() + 1000 * 60 * 60),
            $gte: new Date(date.getTime() - 1000 * 60 * 60)
          },
          tokensStats: { $elemMatch: { token: asset } }
        },
        { date: 1, tokensStats: 1, 'tokensStats.$': asset }
      )
      .sort({ date: 1 })
      .lean()

    return {
      swapToUSDPrice: dbStatsDocuments[0].tokensStats[0].swapToUSDPrice,
      timestamp: dbStatsDocuments[0].date.getTime()
    }
  }

  async updateReservedData() {
    const result = []
    const tokenAddresses = iTokens.map((x) => x.address)
    const swapRates = (await this.getSwapToUsdRateBatch(iTokens.find((x) => x.name === 'dai')))[0]
    const reserveData = await this.DappHeperContract.methods
      .reserveDetails(tokenAddresses)
      .call({ from: '0x4abB24590606f5bf4645185e20C4E7B97596cA3B' })
    let usdTotalLockedAll = new BigNumber(0)
    let usdSupplyAll = new BigNumber(0)
    const stats = new statsModel()
    stats.tokensStats = []
    const bzrxUsdPrice = new BigNumber(
      swapRates[iTokens.map((x) => x.name).indexOf('bzrx')]
    ).dividedBy(10 ** 18)
    const monthlyReward = new BigNumber(10300000).times(bzrxUsdPrice)

    if (reserveData && reserveData.totalAssetSupply.length > 0) {
      await Promise.all(
        iTokens.map(async (token, i) => {
          let totalAssetSupply = new BigNumber(reserveData.totalAssetSupply[i])
          let totalAssetBorrow = new BigNumber(reserveData.totalAssetBorrow[i])
          const supplyInterestRate = new BigNumber(reserveData.supplyInterestRate[i])
          const borrowInterestRate = new BigNumber(reserveData[4][i])
          const torqueBorrowInterestRate = new BigNumber(reserveData.torqueBorrowInterestRate[i])
          let vaultBalance = new BigNumber(reserveData.vaultBalance[i])

          let marketLiquidity = totalAssetSupply.minus(totalAssetBorrow)

          const decimals = token.decimals
          let usdSupply = new BigNumber(0)
          let usdTotalLocked = new BigNumber(0)

          if (token.name === 'ethv1') {
            vaultBalance = await this.getAssetTokenBalanceOfUser(
              token.name,
              '0x8b3d70d628ebd30d4a2ea82db95ba2e906c71633'
            )
          }

          const precision = new BigNumber(10 ** (18 - decimals))
          totalAssetSupply = totalAssetSupply.times(precision)
          totalAssetBorrow = totalAssetBorrow.times(precision)
          marketLiquidity = marketLiquidity.times(precision)
          vaultBalance = vaultBalance.times(precision)

          if (token.name === 'bzrx') {
            const vbzrxLockedAmount = await this.getErc20BalanceOfUser(
              '0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F',
              '0xD8Ee69652E4e4838f2531732a46d1f7F584F0b7f'
            )
            vaultBalance = vaultBalance.plus(vbzrxLockedAmount.times(precision))
          }

          if (swapRates[i]) {
            usdSupply = totalAssetSupply.times(swapRates[i]).dividedBy(10 ** 18)
            usdSupplyAll = usdSupplyAll.plus(usdSupply)

            usdTotalLocked = marketLiquidity
              .plus(vaultBalance)
              .times(swapRates[i])
              .dividedBy(10 ** 18)
            usdTotalLockedAll = usdTotalLockedAll.plus(usdTotalLocked)
          }

          // const totalBorrowUSD = totalAssetBorrow.dividedBy(10 ** 18).times(new BigNumber(swapRates[i]).dividedBy(10 ** 18))
          // const fees = totalBorrowUSD.times(0.09/100);
          // const rebate = fees.div(2);
          // const borrowCost = totalBorrowUSD.times(borrowInterestRate.dividedBy(10 ** 20).div(12))
          // const reward = rebate.plus(monthlyReward);
          // const yieldMonthlyRate = (reward.minus(borrowCost)).div(totalBorrowUSD);
          // const yieldYearlyPercents = yieldMonthlyRate.times(12).times(100)

          stats.tokensStats.push(
            new tokenStatsModel({
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
              yieldFarmingAPR: new BigNumber(0)
            })
          )
        })
      )

      let totalBorrowAmountAllAssetsUsd = new BigNumber(0)

      // collecting total asset borrow and interest fees for all assets
      stats.tokensStats.forEach((tokenStat) => {
        const totalAssetBorrowUSD = new BigNumber(tokenStat.totalBorrow).times(
          new BigNumber(tokenStat.swapToUSDPrice)
        )
        totalBorrowAmountAllAssetsUsd = totalBorrowAmountAllAssetsUsd.plus(totalAssetBorrowUSD)
      })

      stats.tokensStats.forEach((tokenStat) => {
        let totalBorrowUSD = new BigNumber(tokenStat.totalBorrow).times(
          new BigNumber(tokenStat.swapToUSDPrice)
        )
        if (totalBorrowUSD.eq(0)) totalBorrowUSD = new BigNumber(1)
        const fees = totalBorrowUSD.times(0.09 / 100)
        const rebate = fees.div(2)
        const monthlyRewardPerToken = totalBorrowUSD
          .div(totalBorrowAmountAllAssetsUsd)
          .times(monthlyReward)

        const reward = rebate.plus(monthlyRewardPerToken)
        const yieldMonthlyRate = reward.div(totalBorrowUSD)
        const yieldYearlyPercents = yieldMonthlyRate.times(12).times(100).div(2)

        tokenStat.yieldFarmingAPR =
          isNaN(yieldYearlyPercents.toFixed()) || yieldYearlyPercents.toFixed() === 'Infinity'
            ? '0'
            : yieldYearlyPercents.toFixed()
      })

      stats.allTokensStats = new allTokensStatsModel({
        token: 'all',
        usdSupply: usdSupplyAll.dividedBy(10 ** 18).toFixed(),
        usdTotalLocked: usdTotalLockedAll.dividedBy(10 ** 18).toFixed()
      })
      await stats.save()
    }
    return result
  }

  async getAssetTokenBalanceOfUser(asset, account) {
    let result = new BigNumber(0)
    const token = iTokens.find((x) => x.name === asset)
    const precision = token.decimals || 18
    const assetErc20Address = token.erc20Address
    if (assetErc20Address) {
      result = await this.getErc20BalanceOfUser(assetErc20Address, account)
      result = result.times(10 ** (18 - precision))
    }
    return result
  }

  async getErc20BalanceOfUser(addressErc20, account) {
    let result = new BigNumber(0)
    const tokenContract = new this.web3.eth.Contract(erc20Json.abi, addressErc20)
    if (tokenContract) {
      result = new BigNumber(await tokenContract.methods.balanceOf(account).call())
    }
    return result
  }

  getGoodSourceAmountOfAsset(assetName) {
    switch (assetName) {
      case 'wbtc':
        return new BigNumber(10 ** 6)
      case 'usdc':
        return new BigNumber(10 ** 4)
      case 'usdt':
        return new BigNumber(10 ** 4)
      default:
        return new BigNumber(10 ** 16)
    }
  }

  async getSwapToUsdRateBatch(usdToken) {
    let result = []
    const usdTokenAddress = usdToken.erc20Address
    const underlyings = iTokens.map((e) => e.erc20Address)
    const amounts = iTokens.map((e) => this.getGoodSourceAmountOfAsset(e.name).toFixed())

    result = await this.DappHeperContract.methods
      .assetRates(usdTokenAddress, underlyings, amounts)
      .call({ from: '0x4abB24590606f5bf4645185e20C4E7B97596cA3B' })

    return result
  }
}
