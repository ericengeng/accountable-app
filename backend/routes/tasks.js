const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Route to get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ rank: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add a new task
router.post('/tasks', async (req, res) => {
  const { task_description, rank, hour } = req.body;  // Include 'hour' in the destructuring

  // Check if the rank already exists
  const existingTask = await Task.findOne({ rank });
  if (existingTask) {
    return res.status(400).json({ message: 'Rank already exists' });
  }

  // Create a new task with task description, rank, and hour
  const newTask = new Task({ task_description, rank, hour });

  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;