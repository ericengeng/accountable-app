const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  firebaseID: {
    type: String,
    required: true,
    unique: true
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  postings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Posting'
  }],

});

const User = mongoose.model('User', userSchema);

module.exports = User;
