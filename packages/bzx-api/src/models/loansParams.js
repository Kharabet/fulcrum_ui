const mongoose = require('mongoose')

const loanParamsSchema = new mongoose.Schema({
  principal: {
    type: String,
    required: true
  },
  collateral: {
    type: String,
    required: true
    
  },
  platform: {
    type: String,
    required: true
  },
  loanId: {
    type: String,
    required: true
  },
  initialMargin: {
    type: Number,
    required: true
  },
  maintenanceMargin: {
    type: Number,
    required: true
  },  
  liquidationPenalty: {
    type: Number,
    required: false
  }
})

const loansParamsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  loanParams: {
    type: [loanParamsSchema],
    required: true,
    default: undefined
  }
})

exports.loanParamsModel = mongoose.model('loan_params', loanParamsSchema)
exports.loansParamsModel = mongoose.model('loans_params', loansParamsSchema)
