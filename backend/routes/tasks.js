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
  const { task_description, rank } = req.body;

  // Check if the rank already exists
  const existingTask = await Task.findOne({ rank });
  if (existingTask) {
    return res.status(400).json({ message: 'Rank already exists' });
  }

  const newTask = new Task({ task_description, rank });

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
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
