const { User } = require('../../../../models');

const controllers = {};

controllers.register = async (req, res) => {
  try {
    const body = _.pick(req.body, ['sEmail', 'sPassword']);
    if (!body.sEmail) return res.reply(messages.badRequestCM(messages.custom.required_field['EN']));
    if (!body.sPassword) return res.reply(messages.badRequestCM(messages.custom.required_field['EN']));
    const query = { sEmail: body.sEmail };
    const user = await User.findOne(query);

    if (user) {
      if (user.sEmail === body.sEmail) return res.reply(messages.alreadyExistsCM(messages.custom.already_exists_email['EN']));
    }
    body.sPassword = await _.encryptPassword(body.sPassword);
    body.isEmailVerified = true;
    body.sUserName = body.sEmail.split('@')[0];
    await User.create(body);
    return res.reply(messages.successCM(messages.custom.user_created['EN']), {});
  } catch (error) {
    return res.reply(messages.serverErrorCM(messages.custom.server_error['EN']), error.toString());
  }
};

controllers.login = async (req, res) => {
  try {
    const body = _.pick(req.body, ['sEmail', 'sPassword']);
    if (!body.sEmail) return res.reply(messages.badRequestCM(messages.custom.required_field['EN']));
    if (!body.sPassword) return res.reply(messages.badRequestCM(messages.custom.required_field['EN']));

    const query = { sEmail: body.sEmail };

    const user = await User.findOne(query);
    if (!user) return res.reply(messages.notFoundCM(messages.custom.user_not_found['EN']));
    if ((await _.encryptPassword(body.sPassword)) !== user.sPassword) return res.reply(messages.unauthorizedCM(messages.custom.wrong_credentials['EN']));

    user.sToken = _.encodeToken({ _id: user._id.toString() });
    await user.updateOne({ $set: { sToken: user.sToken } });

    // Return user info with role and permissions
    const userInfo = {
      _id: user._id,
      sUserName: user.sUserName,
      sEmail: user.sEmail,
    };

    return res.reply(messages.successCM(messages.custom.login_success['EN']), userInfo, { authorization: user.sToken });
  } catch (error) {
    return res.reply(messages.serverErrorCM(messages.custom.server_error['EN']), error.toString());
  }
};

module.exports = controllers;
