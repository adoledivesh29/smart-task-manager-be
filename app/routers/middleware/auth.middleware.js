const { User } = require('../../models');

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.header('authorization');
    if (!token) return res.reply(messages.unauthorizedCM(messages.custom.invalid_token['EN']));

    const decodedToken = _.decodeToken(token);
    if (!decodedToken) return res.reply(messages.unauthorizedCM(messages.custom.invalid_token['EN']));

    const query = { _id: decodedToken._id };
    const user = await User.findOne(query);
    if (!user) return res.reply(messages.notFoundCM(messages.custom.user_not_found['EN']));
    if (user.sToken !== token) return res.reply(messages.unauthorizedCM(messages.custom.invalid_token['EN']));

    req.user = user;
    next();
  } catch (error) {
    console.log('auth.middleware.js ~ error:', error);
    return res.reply(messages.serverErrorCM(messages.custom.server_error['EN']), error.toString());
  }
};

module.exports = isAuthenticated;
