import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../configs/firebaseConfig';
import './Profile.css';

function Profile() {
  const [user] = useAuthState(auth);
  const [postings, setPostings] = useState([]);

  if (!user) {
    return <div>Please login to view your profile.</div>;
  }

  useEffect(() => {
    const fetchPostings = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(true);
          const response = await fetch(`http://localhost:3001/api/users/${currentUser.uid}/postings`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setPostings(data);
        } catch (error) {
          console.error('Error fetching postings:', error);
        }
      } else {
        console.error('No user is signed in.');
      }
    };

    fetchPostings();
  }, [user]);

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <p>Welcome, {user.displayName || "User"}!</p>
      <p>Email: {user.email}</p>
      <ul>
        <li><Link to="/todo">Todo List</Link></li>
        <li><Link to="/schedule">Schedule</Link></li>
        <li><Link to="/friends">Friends</Link></li>
      </ul>
      <h2>Posts</h2>
      {postings.length === 0 ? (
        <p>No postings available. Add a task to get started.</p>
      ) : (
        <ul>
          {postings.map((posting, index) => (
            <li key={posting._id}>
              <h3>Post {index + 1}</h3>
              <ul>
                {posting.tasks.sort((a, b) => a.rank - b.rank).map((task) => (
                  <li key={task._id}>
                    {task.task_description} (Rank: {task.rank}, Hour: {task.hour})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Profile;
