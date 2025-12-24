const mongoose = require("mongoose");
const { Schema } = mongoose;

const TournamentSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "title field is required."],
            trim: true,
        },
        sportType: {
            type: String,
            required: [true, "sportType field is required."],
            trim: true,
        },
        mode: {
            type: String,
            enum: ["solo", "team", "both"],
            required: [true, "mode field is required."],
        },
        startDate: {
            type: Date,
            required: [true, "startDate field is required."],
        },
        endDate: {
            type: Date,
            required: [true, "endDate field is required."],
        },
        status: {
            type: String,
            enum: ["draft", "open", "ongoing", "finished"],
            default: "draft",
        },
        rules: {
            type: String,
            trim: true,
        },
        maxParticipants: {
            type: Number,
        },
        maxTeams: {
            type: Number,
        },
        createdByAdminId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        participantsUsers: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        participantsTeams: [{
            type: Schema.Types.ObjectId, // Assuming you have a 'Team' model
            ref: "Team",
        }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tournament", TournamentSchema, "tournaments");