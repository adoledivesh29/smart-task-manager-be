const mongoose = require('mongoose');

const User = new mongoose.Schema(
  {
    // Normal user basics
    sUserName: { type: String, unique: true },
    sEmail: { type: String },
    sPassword: { type: String },
    sToken: String,
    sVerificationToken: String, // used for forgot-password verification link
    isEmailVerified: { type: Boolean, default: false },
    sProfilePic: { type: String, default: '' },
    // For push notifications
    sFCMToken: String,
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
);

User.index({ sEmail: 1 });

module.exports = mongoose.model('users', User);
