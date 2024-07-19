import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, signOutUser } from '../services/auth-service';

const Auth = () => {
  const navigate = useNavigate(); // Set up the navigate function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await signUp(email, password);  // Attempt to sign up
      console.log("Signed up successfully!");
      navigate('/');  // Navigate to ToDo page on successful signup
    } catch (error) {
      console.error("Error signing up:", error); // Handle any errors
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      console.log("Signed in successfully!");
      navigate('/');  // Optionally navigate on sign in as well
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      console.log("Signed out successfully!");
      navigate('/login'); // Navigate to login on sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div>
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
