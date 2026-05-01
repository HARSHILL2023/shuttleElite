const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickup: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  drop: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  pickupName: {
    type: String,
    required: true
  },
  dropName: {
    type: String,
    required: true
  },
  date: {
    type: String,
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
  routePath: [{
    lat: { type: Number },
    lng: { type: Number }
  }],
  driverLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  // Legacy fields - keeping for backward compatibility if needed, but we'll use pickup/drop
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
