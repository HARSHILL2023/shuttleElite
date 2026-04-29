import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Lazy Loaded Pages (Performance optimization)
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RideRequestPage = lazy(() => import('./pages/RideRequestPage'));
const RideConfirmationPage = lazy(() => import('./pages/RideConfirmationPage'));
const LiveTrackingPage = lazy(() => import('./pages/LiveTrackingPage'));
const RideHistoryPage = lazy(() => import('./pages/RideHistoryPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Loading Fallback
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <Loader2 className="w-10 h-10 text-primary animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#0F172A',
          color: '#F8FAFC',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '1rem',
          fontWeight: 'bold',
        },
        success: {
          iconTheme: {
            primary: '#22C55E',
            secondary: '#0F172A',
          },
        },
      }} />
      
      <Suspense fallback={<PageLoader />}>
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
            <Route path="/history" element={<ProtectedRoute><RideHistoryPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;