const mongoose = require('mongoose');

const CategoryMetaSchema = new mongoose.Schema(
  {
    sName: {
      type: String,
      default: '',
    },
    sColor: {
      type: String,
      default: '',
    },
    sIcon: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

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
    oCategoryMeta: {
      type: CategoryMetaSchema,
      default: undefined,
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
