const mongoose = require("mongoose");
const { Schema } = mongoose;

const JoinRequestSchema = new Schema(
    {
        tournamentId: {
            type: Schema.Types.ObjectId,
            ref: "Tournament",
            required: true,
        },
        requestType: {
            type: String,
            enum: ["solo", "team"],
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        teamId: {
            type: Schema.Types.ObjectId,
            ref: "Team", 
        },
        status: {
            type: String,
            enum: ["pending", "confirm_sent", "confirmed", "approved", "rejected"],
            default: "pending",
        },
        userConfirmedAt: {
            type: Date,
        },
        adminNotes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("JoinRequest", JoinRequestSchema, "joinRequests");