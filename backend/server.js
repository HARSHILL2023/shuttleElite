const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const rideRoutes = require('./src/routes/rideRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./src/config/db");

// ✅ Production-grade CORS — allows Vercel frontend + localhost dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://shuttle-elite.vercel.app',
  'https://shuttleelite.vercel.app',
  // Allow any Vercel preview deployments
  /\.vercel\.app$/,
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, Render health checks)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some((allowed) =>
      typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight OPTIONS requests globally
app.options('*', cors());

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
