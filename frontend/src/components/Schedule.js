import React from 'react';
import { useLocation } from 'react-router-dom';
import './Schedule.css';

function Schedule() {
  const location = useLocation();
  const { state } = location;
  const { todos } = state || { todos: [] };

  console.log('Received todos in schedule:', todos); // Debug log

  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let i = 0; i < 24; i++) {
      const hour = i % 12 === 0 ? 12 : i % 12;
      const period = i < 12 ? 'AM' : 'PM';
      timeSlots.push(`${hour} ${period}`);
    }
    return timeSlots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="schedule-page">
      <div className="schedule-container">
        <h1>24 Hour Schedule</h1>
        <ul>
          {timeSlots.map((timeSlot, index) => (
            <li key={index}>
              <div className="time-slot">{timeSlot}</div>
              <ul>
                {todos
                  .filter((todo) => todo.hour === index)
                  .map((todo) => (
                    <li key={todo._id}>
                      {todo.task_description} (Rank: {todo.rank})
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div className="todo-list-container">
        <h1>To-Do List</h1>
        <ul>
          {todos.sort((a, b) => a.rank - b.rank).map((todo) => (
            <li key={todo._id}>
              {todo.task_description} (Rank: {todo.rank}, Hour: {todo.hour})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Schedule;
