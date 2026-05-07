const { Task } = require('../../models');
const { getCategoryMetadata } = require('../../utils').categoryMetadata;
const taskAIService = require('./task-ai.service');

function toPlainObject(task) {
  if (!task) return null;
  return task.toObject ? task.toObject() : { ...task };
}

function formatTask(task) {
  const plainTask = toPlainObject(task);
  if (!plainTask) return null;

  const categoryName = plainTask.oCategoryMeta?.sName || plainTask.sCategory;
  const categoryMetadata = getCategoryMetadata(categoryName);

  return {
    ...plainTask,
    sCategory: categoryMetadata.sCategory,
    oCategoryMeta: {
      ...categoryMetadata.oCategoryMeta,
      ...plainTask.oCategoryMeta,
      sName: plainTask.oCategoryMeta?.sName || categoryMetadata.oCategoryMeta.sName,
      sColor: plainTask.oCategoryMeta?.sColor || categoryMetadata.oCategoryMeta.sColor,
      sIcon: plainTask.oCategoryMeta?.sIcon || categoryMetadata.oCategoryMeta.sIcon,
    },
    sCategoryColor: plainTask.oCategoryMeta?.sColor || categoryMetadata.sCategoryColor,
    sCategoryIcon: plainTask.oCategoryMeta?.sIcon || categoryMetadata.sCategoryIcon,
  };
}

async function createTask({ sTitle, sDescription, iUserId }) {
  const aiAnalysis = await taskAIService.analyzeTaskDescription(sDescription);
  const categoryMetadata = getCategoryMetadata(aiAnalysis.sCategory);

  const newTask = await Task.create({
    sTitle,
    sDescription,
    nDifficultyScore: aiAnalysis.nDifficultyScore,
    sCategory: categoryMetadata.sCategory,
    oCategoryMeta: categoryMetadata.oCategoryMeta,
    iUserId,
  });

  return formatTask(newTask);
}

async function getTasksByUserId(iUserId) {
  const tasks = await Task.find({ iUserId }).sort({ dCreatedAt: -1 }).lean();
  return tasks.map(formatTask);
}

async function getTaskByIdForUser(taskId, iUserId) {
  const task = await Task.findOne({ _id: taskId, iUserId });
  return task;
}

async function toggleTask(taskId, iUserId) {
  const task = await getTaskByIdForUser(taskId, iUserId);
  if (!task) return null;

  task.bIsCompleted = !task.bIsCompleted;
  await task.save();

  return formatTask(task);
}

async function deleteTask(taskId, iUserId) {
  return Task.findOneAndDelete({ _id: taskId, iUserId });
}

module.exports = {
  createTask,
  deleteTask,
  formatTask,
  getTaskByIdForUser,
  getTasksByUserId,
  toggleTask,
};
