const mongoose = require('mongoose');

const Transaction = new mongoose.Schema(
  {
    iUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    iDoneBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    iGameId: { type: mongoose.Schema.Types.ObjectId },
    nAmount: { type: Number, required: true },
    nBundle: { type: Number },
    sDescription: String,
    eType: {
      type: String,
      enum: ['debit', 'credit'],
      default: 'credit',
    },
    eMode: {
      type: String,
      enum: ['admin', 'game', 'manual', 'iap'],
      default: 'game',
    },
    nInvoiceId: { type: Number },
    eGameType: {
      type: String,
      enum: ['private', 'solo', 'open'],
    },
    eStatus: {
      type: String,
      enum: ['Pending', 'Success', 'Failed', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
);

Transaction.index({ iUserId: 1, eStatus: 1 });
Transaction.index({ dUpdatedDate: 1 });
Transaction.index({ eStatus: 1, eType: 1 });
Transaction.index({ eMode: 1 });

module.exports = mongoose.model('transaction', Transaction);
