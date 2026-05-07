class MessageBuilder {
  static STATUS_CODES = Object.freeze({
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
  });

  custom = Object.freeze({
    required_field: { EN: 'Enter required fields.', AR: 'Enter required fields.' },
    already_exists_email: { EN: 'Email already exists.', AR: 'Email already exists.' },
    already_exists_username: { EN: 'Username already exists.', AR: 'Username already exists.' },
    user_not_found: { EN: 'User not found.', AR: 'User not found.' },
    invalid_token: { EN: 'Invalid authentication token.', AR: 'Invalid authentication token.' },
    login_success: { EN: 'Login successful.', AR: 'Login successful.' },
    server_error: { EN: 'Internal server error.', AR: 'Internal server error.' },
    user_created: { EN: 'User created successfully. Please check your email for activation.', AR: 'User created successfully. Please check your email for activation.' },
    wrong_credentials: { EN: 'Wrong credentials.', AR: 'Wrong credentials.' },
    duplicate_password: { EN: 'Duplicate password.', AR: 'Duplicate password.' },
    profile_get: { EN: 'Profile get successfully.', AR: 'Profile get successfully.' },
    profile_update: { EN: 'Profile update successfully.', AR: 'Profile update successfully.' },
    logout_success: { EN: 'Logout successfully.', AR: 'Logout successfully.' },
    password_change_success: { EN: 'Password change successfully.', AR: 'Password change successfully.' },
    list_success: { EN: 'List retrieved successfully.', AR: 'List retrieved successfully.' },
  });

  successCM(message) {
    return { code: MessageBuilder.STATUS_CODES.SUCCESS, message };
  }

  unauthorizedCM(message) {
    return { code: MessageBuilder.STATUS_CODES.UNAUTHORIZED, message };
  }

  notFoundCM(message) {
    return { code: MessageBuilder.STATUS_CODES.NOT_FOUND, message };
  }

  badRequestCM(message) {
    return { code: MessageBuilder.STATUS_CODES.BAD_REQUEST, message };
  }

  alreadyExistsCM(message) {
    return { code: MessageBuilder.STATUS_CODES.CONFLICT, message };
  }

  serverErrorCM(message) {
    return { code: MessageBuilder.STATUS_CODES.SERVER_ERROR, message };
  }
}

module.exports = new MessageBuilder();
