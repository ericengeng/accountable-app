import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ToDo.css';
import { auth } from '../configs/firebaseConfig';
import 'firebase/auth';

function ToDo() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [rank, setRank] = useState(1);
  const [hour, setHour] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdToken(true);
          // Updated URL to include the user ID
          const response = await fetch(`http://localhost:3001/api/users/${user.uid}/tasks`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setTodos(data);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      } else {
        console.error('No user is signed in.');
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    const user = auth.currentUser;
    if (user && task && rank) {
      try {
        const token = await user.getIdToken(true);
        const newTask = { task_description: task, rank, hour };
        // Updated URL to include the user ID
        const response = await fetch(`http://localhost:3001/api/users/${user.uid}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newTask),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.message) {
          alert(data.message);
        } else {
          setTodos([...todos, data]);
          setTask('');
          setRank(1);
          setHour(0);
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    } else {
      console.error('User is not authenticated or task data is missing.');
    }
  };

  const removeTask = async (id) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken(true);
        // Updated URL to include the user ID and task ID
        const response = await fetch(`http://localhost:3001/api/users/${user.uid}/tasks/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await response.json();
        setTodos(todos.filter(todo => todo._id !== id));
      } catch (error) {
        console.error('Error removing task:', error);
      }
    } else {
      console.error('User is not authenticated.');
    }
  };

  const handleSubmit = () => {
    console.log('Submitting to-do list:', todos);
    navigate('/schedule', { state: { todos } });
  };

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Task"
      />
      <input
        type="number"
        value={rank}
        onChange={(e) => setRank(Number(e.target.value))}
        placeholder="Rank"
        min="1"
      />
      <select value={hour} onChange={(e) => setHour(Number(e.target.value))}>
        {Array.from({ length: 24 }).map((_, index) => (
          <option key={index} value={index}>
            {index % 12 === 0 ? 12 : index % 12} {index < 12 ? 'AM' : 'PM'}
          </option>
        ))}
      </select>
      <button onClick={addTask}>Add Task</button>
      {todos.length === 0 ? (
        <p>No tasks available. Add a task to get started.</p>
      ) : (
        <ul>
          {todos.sort((a, b) => a.rank - b.rank).map((todo) => (
            <li key={todo._id}>
              {todo.task_description} (Rank: {todo.rank}, Hour: {todo.hour}){' '}
              <button onClick={() => removeTask(todo._id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleSubmit}>Submit To-Do List</button>
    </div>
  );
}

export default ToDo;
