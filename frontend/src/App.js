import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ToDo from './components/ToDo';
import Schedule from './components/Schedule';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ToDo />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </Router>
  );
}

export default App;
