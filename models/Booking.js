const mongoose = require('mongoose');
const { Decimal128 } = require('mongodb');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  parkingSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSlot',
    required: true,
  },
  carNumber: {
    type: String,
    required: true,
  },
  bookingTime: {
    type: String,
    default: Date.now,
  },
  bookingDate: {
    type: String,
    required: true,
  },
  arrivalTime:{
    type: String,
    default: null
  },
  departureTime:{
    type: String
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  bookingFee:{
    type: Decimal128,
  }
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;