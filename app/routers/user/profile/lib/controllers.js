const { User, QuizGame } = require('../../../../models/index.js');

const controllers = {};

controllers.getProfile = async (req, res) => {
  try {
    const lan = req.user?.sLan || 'EN';
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    await QuizGame.updateMany(
      { eState: 'playing', dCreatedDate: { $lte: oneHourAgo } },
      { $set: { eState: 'finished', dEndTime: new Date() } }
    );

    const project = {
      sUserName: true,
      sEmail: true,
      sProfilePic: true,
    };
    const userData = await User.findById(req.user._id, project).lean();
    return res.reply(messages.successCM(messages.custom.profile_get[lan]), userData);
  } catch (error) {
    const lan = req.user?.sLan || 'EN';
    return res.reply(messages.serverErrorCM(messages.custom.server_error[lan]), error.toString());
  }
};

controllers.updateProfile = async (req, res) => {
  try {
    const lan = req.user?.sLan || 'EN';
    const body = _.pick(req.body, ['sUserName', 'sEmail']);
    const query = { _id: req.user._id };
    const user = await User.findOne(query);

    if (body.sUserName) {
      const userNameAdmin = await User.findOne({ sUserName: body.sUserName });
      if (userNameAdmin) return res.reply(messages.alreadyExistsCM(messages.custom.already_exists_username[lan]));
      user.sUserName = body.sUserName;
    }
    if (body.sEmail && body.sEmail !== user.sEmail) user.sEmail = body.sEmail;
    await user.save();
    return res.reply(messages.successCM(messages.custom.profile_update[lan]), body);
  } catch (error) {
    const lan = req.user?.sLan || 'EN';
    return res.reply(messages.serverErrorCM(messages.custom.server_error[lan]), error.toString());
  }
};

controllers.changePassword = async (req, res) => {
  try {
    const lan = req.user?.sLan || 'EN';
    const body = _.pick(req.body, ['currentPassword', 'newPassword', 'sPassword', 'sNewPassword']);
    const currentPassword = body.currentPassword || body.sPassword;
    const newPassword = body.newPassword || body.sNewPassword;

    if (!currentPassword) return res.reply(messages.badRequestCM('Current password is required.'));
    if (!newPassword) return res.reply(messages.badRequestCM('New password is required.'));
    if (req.user.sPassword !== _.encryptPassword(currentPassword)) return res.reply(messages.unauthorizedCM(messages.custom.wrong_credentials[lan]));
    if (currentPassword === newPassword) return res.reply(messages.badRequestCM(messages.custom.duplicate_password[lan]));

    const query = { _id: req.user._id };
    const updateQuery = { sPassword: _.encryptPassword(newPassword), sToken: '' };

    await User.updateOne(query, { $set: updateQuery });
    return res.reply(messages.successCM(messages.custom.password_change_success[lan]), {});
  } catch (error) {
    const lan = req.user?.sLan || 'EN';
    return res.reply(messages.serverErrorCM(messages.custom.server_error[lan]), error.toString());
  }
};

controllers.logout = async (req, res) => {
  try {
    const lan = req.user?.sLan || 'EN';
    const query = { _id: req.user._id };
    await User.updateOne(query, { $unset: { sToken: true } });
    return res.reply(messages.successCM(messages.custom.logout_success[lan]), {});
  } catch (error) {
    const lan = req.user?.sLan || 'EN';
    return res.reply(messages.serverErrorCM(messages.custom.server_error[lan]), error.toString());
  }
};
module.exports = controllers;
