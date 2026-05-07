const { Task } = require('../../../../models');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const controllers = {};

controllers.createTask = async (req, res) => {
  try {
    const { sTitle, sDescription } = req.body;

    if (!sTitle) return res.reply(messages.badRequestCM(messages.custom.required_field['EN']));
    if (!sDescription) return res.reply(messages.badRequestCM(messages.custom.required_field['EN']));

    let nDifficultyScore;
    let sCategory;

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: { responseMimeType: 'application/json' } });

      const prompt = `Analyze the following task description and provide a difficulty score (1-10) and a suitable category (e.g., Coding, Personal, Finance, Work, Health, Home). 
Task Description: "${sDescription}"
Respond exactly with a JSON object in this format: {"difficultyScore": number, "category": string}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsed = JSON.parse(responseText);

      if (!parsed.difficultyScore || !parsed.category) {
        return res.reply(messages.serverErrorCM('AI did not return a valid difficulty score or category. Task not saved.'));
      }

      nDifficultyScore = parsed.difficultyScore;
      sCategory = parsed.category;
    } catch (aiError) {
      console.error('Error generating AI metadata for task:', aiError);
      return res.reply(messages.serverErrorCM('Failed to get AI response. Task not saved.'));
    }

    const newTask = await Task.create({
      sTitle,
      sDescription,
      nDifficultyScore,
      sCategory,
      iUserId: req.user._id,
    });

    return res.reply(messages.successCM('Task created successfully.'), newTask);
  } catch (error) {
    return res.reply(messages.serverErrorCM(messages.custom.server_error['EN']), error.toString());
  }
};


controllers.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ iUserId: req.user._id }).sort({ dCreatedAt: -1 });
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
    const task = await Task.findOne({ _id: req.params.id, iUserId: req.user._id });
    if (!task) return res.reply(messages.notFoundCM('Task not found.'));

    task.bIsCompleted = !task.bIsCompleted;
    await task.save();

    return res.reply(messages.successCM(`Task marked as ${task.bIsCompleted ? 'completed' : 'incomplete'}.`), task);
  } catch (error) {
    return res.reply(messages.serverErrorCM(messages.custom.server_error['EN']), error.toString());
  }
};

controllers.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, iUserId: req.user._id });
    if (!task) return res.reply(messages.notFoundCM('Task not found.'));

    return res.reply(messages.successCM('Task deleted successfully.'));
  } catch (error) {
    return res.reply(messages.serverErrorCM(messages.custom.server_error['EN']), error.toString());
  }
};

module.exports = controllers;
