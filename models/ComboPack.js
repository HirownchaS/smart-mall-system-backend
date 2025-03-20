const mongoose = require('mongoose');

const ComboPackSchema = new mongoose.Schema({
  comboPackName: {
    type: String,
    required: true,
    trim: true,
  },
  stores: [{
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    pricePerStore: {
      type: Number,
      required: true, // Each store should have a price associated with it
      min: 0,
    },
  }],
  offerPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0, // Default offer is 0%
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('ComboPack', ComboPackSchema);
