const express = require('express');
const router = express.Router();
const { requestRide, getRideHistory, updateRideStatus } = require('../controllers/rideController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/rides/request
router.post('/request', authMiddleware, requestRide);

// GET /api/rides/history
router.get('/history', authMiddleware, getRideHistory);

// PUT /api/rides/:id/status
router.put('/:id/status', authMiddleware, updateRideStatus);

module.exports = router;
