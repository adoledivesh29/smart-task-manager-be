const { Task } = require('../../models');
const { resolveCategoryPresentation } = require('../../utils').categoryMetadata;
const taskAIService = require('./task-ai.service');

function toPlainObject(task) {
  if (!task) return null;
  return task.toObject ? task.toObject() : { ...task };
}

function formatTask(task) {
  const plainTask = toPlainObject(task);
  if (!plainTask) return null;

  const categoryPresentation = resolveCategoryPresentation({
    category: plainTask.oCategoryMeta?.sName || plainTask.sCategory,
    color: plainTask.oCategoryMeta?.sColor,
    icon: plainTask.oCategoryMeta?.sIcon,
  });

  return {
    ...plainTask,
    ...categoryPresentation,
  };
}

async function createTask({ sTitle, sDescription, iUserId }) {
  const aiAnalysis = await taskAIService.analyzeTaskDescription(sDescription);
  const categoryPresentation = resolveCategoryPresentation({
    category: aiAnalysis.sCategory,
    color: aiAnalysis.sCategoryColor,
  });

  const newTask = await Task.create({
    sTitle,
    sDescription,
    nDifficultyScore: aiAnalysis.nDifficultyScore,
    sCategory: categoryPresentation.sCategory,
    oCategoryMeta: categoryPresentation.oCategoryMeta,
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
