import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RideRequestPage from './pages/RideRequestPage';
import RideConfirmationPage from './pages/RideConfirmationPage';
import LiveTrackingPage from './pages/LiveTrackingPage';
import RideHistoryPage from './pages/RideHistoryPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/request" element={<RideRequestPage />} />
          <Route path="/confirm" element={<RideConfirmationPage />} />
          <Route path="/tracking" element={<LiveTrackingPage />} />
          <Route path="/history" element={<RideHistoryPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;