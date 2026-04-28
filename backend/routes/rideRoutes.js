const express = require('express');
const router = express.Router();
const { requestRide } = require('../controllers/rideController');

// POST /api/rides/request
router.post('/request', requestRide);

module.exports = router;
