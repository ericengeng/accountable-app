import React from 'react';
import { useLocation } from 'react-router-dom';
import './Schedule.css';

function Schedule() {
  const location = useLocation();
  const { state } = location;
  const { todos } = state || { todos: [] };

  return (
    <div className="schedule-container">
      <h1>12 am - 12 pm Schedule</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {todo.task_description} (Rank: {todo.rank})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Schedule;
