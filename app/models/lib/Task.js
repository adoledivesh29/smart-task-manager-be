const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    sTitle: {
      type: String,
      required: true,
    },
    sDescription: {
      type: String,
      required: true,
    },
    nDifficultyScore: {
      type: Number,
      min: 1,
      max: 10,
    },
    sCategory: {
      type: String,
    },
    bIsCompleted: {
      type: Boolean,
      default: false,
    },
    iUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } }
);

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
