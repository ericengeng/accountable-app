import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import ToDo from './ToDo';
import Schedule from './Schedule';
import Auth from './Auth';
import { auth } from '../configs/firebaseConfig';

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
        {/* Redirect to login if no user is logged in */}
        <Route path="/" element={user ? <ToDo /> : <Navigate to="/login" replace />} />
        <Route path="/schedule" element={user ? <Schedule /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
