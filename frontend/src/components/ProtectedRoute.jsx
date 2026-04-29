import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login page if no token is found
    // Using "/" as the login path based on App.jsx
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
