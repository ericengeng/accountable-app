import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../configs/firebaseConfig';
import './Profile.css';


function Profile() {
  const [user] = useAuthState(auth);

  if (!user) {
    return <div>Please login to view your profile.</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <p>Welcome, {user.displayName || "User"}!</p>
      <p>Email: {user.email}</p>
      <ul>
        <li><Link to="/todo">Todo List</Link></li>
        <li><Link to="/schedule">Schedule</Link></li>
      </ul>
    </div>
  );

}

export default Profile;
