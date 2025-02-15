import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import ToDo from './ToDo';
import Schedule from './Schedule';
import Auth from './Auth';
import { auth } from '../configs/firebaseConfig';
import Profile from './Profile';
import Friends from './Friends';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/todo" element={
          <ProtectedRoute>
            <ToDo />
          </ProtectedRoute>
        } />

        <Route path="/schedule" element={
          <ProtectedRoute>
            <Schedule />
          </ProtectedRoute>
        } />
        <Route path="/friends" element={
          <ProtectedRoute>
            <Friends />
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;
