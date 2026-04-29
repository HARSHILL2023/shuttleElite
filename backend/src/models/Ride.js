const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickup: {
    type: String,
    required: true
  },
  drop: {
    type: String,
    required: true
  },
  date: {
    type: String, // Keeping as String as requested
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["searching", "assigned", "arriving", "ongoing", "completed"],
    default: "searching"
  },
  driverLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  pickupLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  dropLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  driverInfo: {
    name: { type: String, default: "Rajesh Kumar" },
    phone: { type: String, default: "+91 9876543210" },
    rating: { type: Number, default: 4.8 },
    shuttlePlate: { type: String, default: "KA-01-MJ-5542" }
  }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
