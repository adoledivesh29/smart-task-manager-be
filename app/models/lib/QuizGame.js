const mongoose = require('mongoose');

const QuizGame = new mongoose.Schema(
  {
    sPrivateCode: String,
    nMaxPlayer: Number,
    eState: String,
    eGameType: { type: String, enum: ['private', 'solo', 'open'], default: 'private' },
    sGameName: String,
    sTeamAName: String,
    sTeamBName: String,
    sTeamAScore: { type: Number, default: 0 },
    sTeamBScore: { type: Number, default: 0 },
    sWinnerTeam: { type: String, enum: ['A', 'B', null], default: null },
    sPassword: String,
    aCategory: Array,
    oSetting: Object,
    aParticipant: [
      {
        _id: false,
        iUserId: mongoose.Schema.Types.ObjectId,
        iHostId: mongoose.Schema.Types.ObjectId,
        iGameEntryFeeTxnId: mongoose.Schema.Types.ObjectId,
        nSeat: Number,
        sTeam: String,
        eUserType: String,
        sUserName: String,
        eState: String,
        sProfilePic: String,
      },
    ],
    aTeamAPlayers: { type: Array },
    aTeamBPlayers: { type: Array },
    aTeamALifelines: { type: Array },
    aTeamBLifelines: { type: Array },
    dStartTime: Date,
    dEndTime: Date,
  },
  { timestamps: { createdAt: 'dCreatedDate', updatedAt: 'dUpdatedDate' } }
);

module.exports = mongoose.model('quiz_game', QuizGame);
