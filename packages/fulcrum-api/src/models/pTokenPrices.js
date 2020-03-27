const mongoose = require('mongoose')


const pTokenPriceSchema = new mongoose.Schema({
  token: {
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
      default: Date.now
    },
    pTokenPrices: {
      type: [pTokenPriceSchema],
      required: true,
      default: undefined
    }
});


exports.pTokenPricesModel = mongoose.model('pTokenPrices', pTokenPricesSchema);
exports.pTokenPriceModel = mongoose.model('pTokenPrice', pTokenPriceSchema);