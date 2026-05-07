const { Task } = require('../../../../models');
const { taskService } = require('../../../../services');

const controllers = {};

controllers.createTask = async (req, res) => {
  try {
    const { sTitle, sDescription } = req.body;

    if (!sTitle) return res.reply(messages.badRequestCM(messages.custom.required_field['EN']));
    if (!sDescription) return res.reply(messages.badRequestCM(messages.custom.required_field['EN']));

    const newTask = await taskService.createTask({
      sTitle,
      sDescription,
      iUserId: req.user._id,
    });

    return res.reply(messages.successCM('Task created successfully.'), newTask);
  } catch (error) {
    return res.reply(messages.serverErrorCM(messages.custom.server_error['EN']), error.toString());
  }
};


controllers.getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByUserId(req.user._id);
    return res.reply(messages.successCM('Tasks fetched successfully.'), tasks);
  } catch (error) {
    return res.reply(messages.serverErrorCM(messages.custom.server_error['EN']), error.toString());
  }
};

controllers.getTaskMetadata = async (req, res) => {
  try {
    const [metadata] = await Task.aggregate([
      {
        $match: {
          iUserId: req.user._id,
        },
      },
      {
        $group: {
          _id: null,
          nTotalTasks: { $sum: 1 },
          nCompletedTasks: {
            $sum: { $cond: [{ $eq: ['$bIsCompleted', true] }, 1, 0] },
          },
          nPendingTasks: {
            $sum: { $cond: [{ $eq: ['$bIsCompleted', false] }, 1, 0] },
          },
          nAverageDifficulty: {
            $avg: '$nDifficultyScore',
          },
        },
      },
      {
        $project: {
          _id: false,
          nTotalTasks: true,
          nCompletedTasks: true,
          nPendingTasks: true,
          nAverageDifficulty: {
            $round: [{ $ifNull: ['$nAverageDifficulty', 0] }, 1],
          },
        },
      },
    ]);

    const nTotalTasks = metadata?.nTotalTasks || 0;
    const nCompletedTasks = metadata?.nCompletedTasks || 0;
    const nPendingTasks = metadata?.nPendingTasks || 0;
    const nAverageDifficulty = metadata?.nAverageDifficulty || 0;
    const nCompletionPercentage = nTotalTasks ? Math.round((nCompletedTasks / nTotalTasks) * 100) : 0;

    return res.reply(messages.successCM('Task metadata fetched successfully.'), {
      nTotalTasks,
      nCompletedTasks,
      nPendingTasks,
      nAverageDifficulty,
      nCompletionPercentage,
      sCompletionLabel: `${nCompletedTasks} of ${nTotalTasks} tasks finished`,
    });
  } catch (error) {
    return res.reply(messages.serverErrorCM(messages.custom.server_error['EN']), error.toString());
  }
};

controllers.toggleComplete = async (req, res) => {
  try {
    const task = await taskService.toggleTask(req.params.id, req.user._id);
    if (!task) return res.reply(messages.notFoundCM('Task not found.'));

    return res.reply(messages.successCM(`Task marked as ${task.bIsCompleted ? 'completed' : 'incomplete'}.`), task);
  } catch (error) {
    return res.reply(messages.serverErrorCM(messages.custom.server_error['EN']), error.toString());
  }
};

controllers.deleteTask = async (req, res) => {
  try {
    const task = await taskService.deleteTask(req.params.id, req.user._id);
    if (!task) return res.reply(messages.notFoundCM('Task not found.'));

    return res.reply(messages.successCM('Task deleted successfully.'));
  } catch (error) {
    return res.reply(messages.serverErrorCM(messages.custom.server_error['EN']), error.toString());
  }
};

module.exports = controllers;
