const Ride = require('../models/Ride');

// @desc    Request a new ride
// @route   POST /api/rides/request
// @access  Public (for now)
const requestRide = async (req, res) => {
  try {
    const { pickup, drop, date, time, userId } = req.body;

    // Basic validation
    if (!pickup || !drop || !date || !time) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Create new ride
    const newRide = new Ride({
      user: userId || null, // Optional dummy userId
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

module.exports = {
  requestRide
};
