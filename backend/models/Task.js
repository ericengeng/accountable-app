const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task_description: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    unique: true,
    required: true,
  },
  hour: {
    type: Number,
    required: true,
    min: 0,
    max: 23,
  },
  start_time: {
    type: Date,
    default: Date.now,
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;