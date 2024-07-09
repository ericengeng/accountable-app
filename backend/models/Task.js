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
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
