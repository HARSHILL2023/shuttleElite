const express = require('express');
const router = express.Router();
const { requestRide, getRideHistory } = require('../controllers/rideController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/rides/request
router.post('/request', authMiddleware, requestRide);

// GET /api/rides/history
router.get('/history', authMiddleware, getRideHistory);

module.exports = router;
