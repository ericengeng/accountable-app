import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../configs/firebaseConfig';

const ProtectedRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("ProtectedRoute error:", error);
    return <div>Error: {error.message}</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
