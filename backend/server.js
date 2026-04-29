const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const rideRoutes = require('./src/routes/rideRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./src/config/db");

// ✅ Production-grade CORS — allows specific Vercel domains + localhost
const allowedOrigins = [
  "https://shuttle-elite.vercel.app",
  "https://shuttle-elite-529qxi5sh-harshilpatels-projects-e1a200a3.vercel.app",
  "https://shuttleelite.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight OPTIONS requests globally
app.options("/*", cors());

app.use(express.json());

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ShuttleElite Backend Running', env: process.env.NODE_ENV });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
