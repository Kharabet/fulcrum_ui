const mongoose = require('mongoose')

const statsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  tokensStats: {
    type: [tokenStatsSchema],
    required: true,
    default: undefined
  },
  allStats: {
    type: allTokenTokensStatsSchema,
    required: true,
    default: Date.now
  }
});

const tokenStatsSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  liquidity: {
    type: String,
    required: true
  },
  totalSupply: {
    type: String,
    required: true
  },
  totalBorrow: {
    type: String,
    required: true
  },
  supplyInterestRate: {
    type: String,
    required: true
  },
  borrowInterestRate: {
    type: String,
    required: true
  },
  torqueBorrowInterestRate: {
    type: String,
    required: true
  },
  vaultBalance: {
    type: String,
    required: true
  },
  swapRates: {
    type: String,
    required: true
  },
  lockedAssets: {
    type: String,
    required: true
  },
  swapToUSDPrice: {
    type: String,
    required: true
  },
  usdSupply: {
    type: String,
    required: true
  },
  usdTotalLocked: {
    type: String,
    required: true
  }
})

const allTokenTokensStatsSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  usdSupply: {
    type: String,
    required: true
  },
  usdTotalLocked: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('stats', statsSchema)