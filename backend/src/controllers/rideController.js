const Ride = require('../models/Ride');

// @desc    Request a new ride
// @route   POST /api/rides/request
// @access  Public (for now)
const requestRide = async (req, res) => {
  try {
    const { pickup, drop, date, time } = req.body;

    // Basic validation
    if (!pickup || !drop || !date || !time) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const userId = req.user.userId;

    // Create new ride
    const newRide = new Ride({
      user: userId,
      pickup,
      drop,
      date,
      time,
      status: "pending"
    });

    // Save in MongoDB
    const savedRide = await newRide.save();

    res.status(201).json({
      message: "Ride booked successfully",
      ride: savedRide
    });
  } catch (error) {
    res.status(500).json({
      message: "Error booking ride",
      error: error.message
    });
  }
};

// @desc    Get all ride history
// @route   GET /api/rides/history
// @access  Public (for now)
const getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      rides
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching ride history",
      error: error.message
    });
  }
};

// @desc    Update ride status
// @route   PUT /api/rides/:id/status
// @access  Private
const updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["pending", "confirmed", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedRide = await Ride.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRide) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.status(200).json({
      success: true,
      ride: updatedRide
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating ride status",
      error: error.message
    });
  }
};

module.exports = {
  requestRide,
  getRideHistory,
  updateRideStatus
};
