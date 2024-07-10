import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory from react-router-dom
import './ToDo.css';

function ToDo() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [rank, setRank] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/tasks')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = () => {
    if (task && rank) {
      const newTask = { task_description: task, rank };
      fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Rank already exists') {
            alert(data.message);
          } else {
            setTodos([...todos, data]);
            setTask('');
            setRank(1);
          }
        })
        .catch(error => console.error('Error adding task:', error));
    }
  };

  const removeTask = (id) => {
    fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => setTodos(todos.filter(todo => todo._id !== id)))
      .catch(error => console.error('Error removing task:', error));
  };

  const handleSubmit = () => {
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
      <button onClick={addTask}>Add Task</button>
      <ul>
        {todos.sort((a, b) => a.rank - b.rank).map((todo) => (
          <li key={todo._id}>
            {todo.task_description} (Rank: {todo.rank}){' '}
            <button onClick={() => removeTask(todo._id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Submit To-Do List</button>
    </div>
  );
}

export default ToDo;
