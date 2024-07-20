const mongoose = require('mongoose');

const postingSchema = new mongoose.Schema({

  firebaseID: {
    type: String,
    required: true,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],

});

const Posting = mongoose.model('Posting', postingSchema);

module.exports = Posting;