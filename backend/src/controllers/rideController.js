const Ride = require('../models/Ride');

// Helper to move driver along a road path
const moveDriverAlongPath = (current, path) => {
  if (!path || path.length === 0) return current;
  
  // Find the next point in the path that we haven't reached yet
  // We'll move towards the first point in the array and remove it once reached
  const target = path[0];
  const dLat = target.lat - current.lat;
  const dLng = target.lng - current.lng;
  const distance = Math.sqrt(dLat * dLat + dLng * dLng);
  
  if (distance < 0.00005) {
    path.shift(); // Reached this waypoint
    return path.length > 0 ? path[0] : target;
  }

  // Even slower, smooth movement for extreme shuttle realism
  const step = 0.00004; 
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
    const { pickup, drop, pickupName, dropName, date, time } = req.body;
    const userId = req.user.userId;

    // 1. Strict validation for coordinates (As requested: ensure lat exists)
    if (!pickup?.lat || !drop?.lat || !pickup?.lng || !drop?.lng) {
      return res.status(400).json({ message: "Strategic error: Invalid tactical coordinates." });
    }

    if (pickupName === dropName) {
      return res.status(400).json({ message: "Strategic failure: Pickup and Destination cannot be identical." });
    }

    // 2. Check for existing active ride
    const activeRide = await Ride.findOne({ 
      user: userId, 
      status: { $ne: "completed" } 
    });

    if (activeRide) {
      return res.status(400).json({ 
        message: "You already have an active tactical operation in progress.",
        ride: activeRide 
      });
    }

    // 3. Generate driver location (Simulated near pickup)
    const driverLoc = { 
      lat: pickup.lat + (Math.random() - 0.5) * 0.002, 
      lng: pickup.lng + (Math.random() - 0.5) * 0.002 
    };

    // 4. Tactical Road Path Initialization
    // For this demo, we'll create a realistic road path between Home and Office
    // Instead of a straight line, we follow an L-shaped street pattern
    const roadPath = [
      { lat: 23.0225, lng: 72.5714 }, // Home
      { lat: 23.0250, lng: 72.5714 }, // Turn 1
      { lat: 23.0250, lng: 72.5800 }, // Turn 2
      { lat: 23.0300, lng: 72.5800 }, // Office
    ];

    const newRide = new Ride({
      user: userId,
      pickup,
      drop,
      pickupName,
      dropName,
      date,
      time,
      status: "searching",
      driverLocation: driverLoc,
      routePath: roadPath
    });

    const savedRide = await newRide.save();

    res.status(201).json({
      message: "Tactical deployment initiated",
      ride: savedRide
    });
  } catch (error) {
    res.status(500).json({ message: "Strategic failure during deployment", error: error.message });
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

    let hasChanges = false;
    
    // Auto-transition for demo flow
    if (ride.status === "searching") {
      ride.status = "assigned";
      hasChanges = true;
    } else if (ride.status === "assigned") {
      ride.status = "arriving";
      hasChanges = true;
    }

    if (ride.status === "arriving" || ride.status === "ongoing") {
      const newLoc = moveDriverAlongPath(ride.driverLocation, ride.routePath);
      
      // If path is empty, we reached the target of that phase
      if (ride.routePath.length === 0) {
        if (ride.status === "arriving") {
          ride.status = "ongoing";
          // Re-initialize road path for the trip to destination
          ride.routePath = [
            { lat: 23.0225, lng: 72.5714 }, // Pickup (Home)
            { lat: 23.0250, lng: 72.5714 }, // Mid 1
            { lat: 23.0250, lng: 72.5800 }, // Mid 2
            { lat: 23.0300, lng: 72.5800 }, // Drop (Office)
          ];
          hasChanges = true;
        } else {
          ride.status = "completed";
          hasChanges = true;
        }
      }
      
      ride.driverLocation = newLoc;
      hasChanges = true;
    }

    if (hasChanges) {
      ride.markModified('routePath'); // Ensure array changes are saved
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
