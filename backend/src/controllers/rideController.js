const Ride = require('../models/Ride');

// Helper to move driver closer to target with more realism
const moveDriver = (current, target, lastUpdate) => {
  if (!current || !target) return current;
  
  // Calculate distance
  const dLat = target.lat - current.lat;
  const dLng = target.lng - current.lng;
  const distance = Math.sqrt(dLat * dLat + dLng * dLng);
  
  if (distance < 0.0001) return target; // Already there

  // Move a fixed step for demo purposes, but we could make it time-based
  // Here we'll stick to a slightly larger step to make the demo "fast"
  const step = 0.0008; 
  const ratio = Math.min(step / distance, 1);
  
  return {
    lat: current.lat + dLat * ratio,
    lng: current.lng + dLng * ratio
  };
};

// @desc    Request a new ride
// @route   POST /api/rides/request
const requestRide = async (req, res) => {
  try {
    const { pickup, drop, date, time, pickupLocation, dropLocation } = req.body;
    const userId = req.user.userId;

    // Strict validation: Coordinates must be provided by the geocoded frontend request
    if (!pickupLocation || !dropLocation || !pickupLocation.lat || !dropLocation.lat) {
      return res.status(400).json({ message: "Strategic error: Geocoding failed or location data missing." });
    }

    // 1. Check for existing active ride
    const activeRide = await Ride.findOne({ 
      user: userId, 
      status: { $ne: "completed" } 
    });

    if (activeRide) {
      return res.status(400).json({ 
        message: "You already have an active ride request.",
        ride: activeRide 
      });
    }

    // 2. Generate driver location (Simulated near pickup)
    // Driver starts a bit away from pickup (within ~500m)
    const driverLoc = { 
      lat: pickupLocation.lat + (Math.random() - 0.5) * 0.005, 
      lng: pickupLocation.lng + (Math.random() - 0.5) * 0.005 
    };

    const newRide = new Ride({
      user: userId,
      pickup,
      drop,
      date,
      time,
      status: "searching",
      pickupLocation: pickupLocation,
      dropLocation: dropLocation,
      driverLocation: driverLoc
    });

    const savedRide = await newRide.save();

    res.status(201).json({
      message: "Ride request initiated",
      ride: savedRide
    });
  } catch (error) {
    res.status(500).json({ message: "Error booking ride", error: error.message });
  }
};

// @desc    Get current active ride
// @route   GET /api/rides/active
const getActiveRide = async (req, res) => {
  try {
    const userId = req.user.userId;
    let ride = await Ride.findOne({ 
      user: userId, 
      status: { $ne: "completed" } 
    });

    if (!ride) {
      return res.status(200).json({ ride: null });
    }

    // 3. Driver Simulation Logic (Updates on each fetch for demo simplicity)
    let hasChanges = false;
    
    // Auto-transition for demo flow
    if (ride.status === "searching") {
      ride.status = "assigned";
      hasChanges = true;
    } else if (ride.status === "assigned") {
      ride.status = "arriving";
      hasChanges = true;
    }

    if (ride.status === "arriving") {
      const newLoc = moveDriver(ride.driverLocation, ride.pickupLocation);
      if (newLoc.lat === ride.pickupLocation.lat && newLoc.lng === ride.pickupLocation.lng) {
        ride.status = "ongoing"; // Driver reached pickup, start ride
      }
      ride.driverLocation = newLoc;
      hasChanges = true;
    } else if (ride.status === "ongoing") {
      const newLoc = moveDriver(ride.driverLocation, ride.dropLocation);
      if (newLoc.lat === ride.dropLocation.lat && newLoc.lng === ride.dropLocation.lng) {
        ride.status = "completed"; // Driver reached destination
      }
      ride.driverLocation = newLoc;
      hasChanges = true;
    }

    if (hasChanges) {
      await ride.save();
    }

    res.status(200).json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ message: "Error fetching active ride", error: error.message });
  }
};

// @desc    Update ride status (Lifecycle Control)
// @route   PUT /api/rides/:id/status
const updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const validStatuses = ["searching", "assigned", "arriving", "ongoing", "completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid lifecycle status" });
    }

    const updatedRide = await Ride.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedRide) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.status(200).json({ success: true, ride: updatedRide });
  } catch (error) {
    res.status(500).json({ message: "Error updating ride status", error: error.message });
  }
};

const getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, rides });
  } catch (error) {
    res.status(500).json({ message: "Error fetching history", error: error.message });
  }
};

module.exports = {
  requestRide,
  getActiveRide,
  getRideHistory,
  updateRideStatus
};
