const mongoose = require('mongoose')


const iTokenPriceSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  priceUsd: {
    type: Number,
    required: true
  }
})

const iTokenPricesSchema = new mongoose.Schema({
    date: {
      type: Date,
      default: Date.now
    },
    iTokenPrices: {
      type: [iTokenPriceSchema],
      required: true,
      default: undefined
    }
});


exports.iTokenPricesModel = mongoose.model('iTokenPrices', iTokenPricesSchema);
exports.iTokenPriceModel = mongoose.model('iTokenPrice', iTokenPriceSchema);