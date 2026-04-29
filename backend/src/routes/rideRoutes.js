const express = require('express');
const router = express.Router();
const { requestRide, getRideHistory, updateRideStatus, getActiveRide } = require('../controllers/rideController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/rides/active (Must be before parameterized routes)
router.get('/active', authMiddleware, getActiveRide);

// POST /api/rides/request
router.post('/request', authMiddleware, requestRide);

// GET /api/rides/history
router.get('/history', authMiddleware, getRideHistory);

// PUT /api/rides/:id/status
router.put('/:id/status', authMiddleware, updateRideStatus);

module.exports = router;
