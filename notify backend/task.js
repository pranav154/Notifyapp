const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
      }, 
  title: {
    type: String,
    required: true,
  },
  targetDate: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
