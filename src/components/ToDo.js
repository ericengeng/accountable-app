import React, { useState } from 'react';
import './ToDo.css';

function ToDo() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [rank, setRank] = useState(1);

  const addTask = () => {
    if (task) {
      const newTask = { task, rank };
      setTodos([...todos, newTask]);
      setTask('');
      setRank(1);
    }
  };

  const removeTask = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div>
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
        {todos
          .sort((a, b) => a.rank - b.rank)
          .map((todo, index) => (
            <li key={index}>
              {todo.task} (Rank: {todo.rank}){' '}
              <button onClick={() => removeTask(index)}>Remove</button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default ToDo;
