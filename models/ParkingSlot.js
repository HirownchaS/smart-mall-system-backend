const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  slot: {
    type: String, // Reference to the ParkingSlot model
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

const ParkingSlot = mongoose.model('ParkingSlot', parkingSchema);
module.exports = ParkingSlot;
