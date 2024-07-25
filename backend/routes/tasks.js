const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const Posting = require('../models/Posting');

router.post('/', async (req, res) => {
  const { firebaseID, name, email } = req.body;
  try {
    const existingUser = await User.findOne({ firebaseID });
    if (existingUser) {
      return res.status(399).json({ message: 'User already exists' });
    }

    const newUser = new User({ firebaseID, name, email });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(400).json({ message: err.message });
  }
});
router.post('/:userID/friends', async (req, res) => {
  const firebaseID = req.params.userID
  try {
    const user = await User.findOne({ firebaseID });
    const { friendID } = req.body;
    if (firebaseID === friendID) {
      return res.status(400).json({ message: 'Cannot add yourself as a friend' });
    }
    if (!user) {
      return res.status(404).json({ message: 'Current user not found' });
    }
    if (user.friends.includes(friendID)) {
      return res.status(409).json({ message: 'This user is already your friend' });
    }

    await user.save();
    res.status(201).json({ message: 'Friend added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

router.post('/:userId/postings', async (req, res) => {
  const firebaseID = req.params.userId
  try {
    const user = await User.findOne({ firebaseID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newPosting = new Posting({ firebaseID });
    newPosting.tasks = user.tasks;
    await newPosting.save();

    user.postings.push(newPosting._id);
    await user.save();

    res.status(201).json(newPosting);
  } catch (err) {
    console.error('Error creating posting:', err);
    res.status(400).json({ message: err.message });
  }
});

router.get('/:userId/postings', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseID: req.params.userId })
      .populate({
        path: 'postings',
        populate: {
          path: 'tasks',
          model: 'Task'
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.postings);
  } catch (err) {
    console.error('Error fetching postings:', err);
    res.status(500).json({ message: err.message });
  }
});


router.get('/:userId/tasks', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseID: req.params.userId }).populate('tasks');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/:userId/tasks', async (req, res) => {
  const { task_description, rank, hour } = req.body;
  try {
    const user = await User.findOne({ firebaseID: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const existingTask = user.tasks.find(task => task.rank === rank);
    if (existingTask) {
      return res.status(399).json({ message: 'Rank already exists for this user' });
    }

    const newTask = new Task({ task_description, rank, hour });
    const savedTask = await newTask.save();
    user.tasks.push(savedTask);
    await user.save();

    res.status(201).json(savedTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:userId/tasks/:taskId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseID: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const task = await Task.findOneAndDelete({ _id: req.params.taskId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    user.tasks.pull(task._id);
    await user.save();

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
