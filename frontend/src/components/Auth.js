import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, signOutUser } from '../services/auth-service';
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await signUp(email, password);
      const user = response.user;
      console.log("Signed up successfully!", user);


      const token = await user.getIdToken();
      const backendResponse = await fetch('http://localhost:3001/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firebaseID: user.uid,

        })
      });

      if (!backendResponse.ok) throw new Error('Failed to register user in backend.');

      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      console.log("Signed in successfully!");
      navigate('/');
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      console.log("Signed out successfully!");
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Authentication</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Auth;
