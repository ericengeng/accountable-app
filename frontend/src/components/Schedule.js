import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Schedule.css';

function Schedule() {
  const location = useLocation();
  const { state } = location;
  const { todos } = state || { todos: [] };

  const [editableTask, setEditableTask] = useState(null);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskRank, setTaskRank] = useState(1);
  const [taskHour, setTaskHour] = useState(0);

  const handleEditClick = (task) => {
    setEditableTask(task._id);
    setTaskDescription(task.task_description);
    setTaskRank(task.rank);
    setTaskHour(task.hour);
  };

  const handleSaveClick = (id) => {
    const updatedTask = {
      task_description: taskDescription,
      rank: taskRank,
      hour: taskHour,
    };

    fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        } else {
          // Update the task in the local state
          const updatedTodos = todos.map((todo) =>
            todo._id === id ? { ...todo, ...updatedTask } : todo
          );
          setEditableTask(null);
          setTaskDescription('');
          setTaskRank(1);
          setTaskHour(0);
          location.state.todos = updatedTodos;
        }
      })
      .catch((error) => console.error('Error updating task:', error));
  };

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
                      {editableTask === todo._id ? (
                        <>
                          <input
                            type="text"
                            value={taskDescription}
                            onChange={(e) =>
                              setTaskDescription(e.target.value)
                            }
                          />
                          <input
                            type="number"
                            value={taskRank}
                            onChange={(e) => setTaskRank(Number(e.target.value))}
                            min="1"
                          />
                          <select
                            value={taskHour}
                            onChange={(e) => setTaskHour(Number(e.target.value))}
                          >
                            {Array.from({ length: 24 }).map((_, idx) => (
                              <option key={idx} value={idx}>
                                {idx % 12 === 0 ? 12 : idx % 12}{' '}
                                {idx < 12 ? 'AM' : 'PM'}
                              </option>
                            ))}
                          </select>
                          <button onClick={() => handleSaveClick(todo._id)}>
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          {todo.task_description} (Rank: {todo.rank})
                          <button onClick={() => handleEditClick(todo)}>
                            Edit
                          </button>
                        </>
                      )}
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
          {todos
            .sort((a, b) => a.rank - b.rank)
            .map((todo) => (
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
