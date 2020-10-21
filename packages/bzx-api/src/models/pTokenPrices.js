const mongoose = require('mongoose')

const pTokenPriceSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  priceUsd: {
    type: Number,
    required: true
  }
})

const pTokenPricesSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  pTokenPrices: {
    type: [pTokenPriceSchema],
    required: true,
    default: undefined
  }
})

exports.pTokenPricesModel = mongoose.model('ptoken_prices', pTokenPricesSchema)
exports.pTokenPriceModel = mongoose.model('ptoken_price', pTokenPriceSchema)
