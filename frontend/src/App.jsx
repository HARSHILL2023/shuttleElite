
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import RideRequestPage from './pages/RideRequestPage';
import RideConfirmationPage from './pages/RideConfirmationPage';
import LiveTrackingPage from './pages/LiveTrackingPage';
import RideHistoryPage from './pages/RideHistoryPage';
import ProfilePage from './pages/ProfilePage';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        </Route>


        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/request" element={<ProtectedRoute><RideRequestPage /></ProtectedRoute>} />
          <Route path="/confirm" element={<ProtectedRoute><RideConfirmationPage /></ProtectedRoute>} />
          <Route path="/tracking" element={<ProtectedRoute><LiveTrackingPage /></ProtectedRoute>} />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <RideHistoryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;