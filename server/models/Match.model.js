const mongoose = require("mongoose");
const { Schema } = mongoose;

const MatchSchema = new Schema(
    {
        tournamentId: {
            type: Schema.Types.ObjectId,
            ref: "Tournament",
            required: true,
        },
        stadiumId: {
            type: Schema.Types.ObjectId,
            ref: "Stadium",
            required: true,
        },
        startTime: {
            type: Date,
            required: [true, "startTime is required."],
        },
        endTime: {
            type: Date,
            required: [true, "endTime is required."],
        },
        
        sideA: {
            type: {
                type: String,
                enum: ["user", "team"],
                required: true,
            },
            refId: {
                type: Schema.Types.ObjectId,
                required: true, 
                refPath: 'sideA.type' 
            },
        },
        
        sideB: {
            type: {
                type: String,
                enum: ["user", "team"],
                required: true,
            },
            refId: {
                type: Schema.Types.ObjectId,
                required: true,
                refPath: 'sideB.type'
            },
        },
        scoreA: {
            type: Number,
            default: 0,
        },
        scoreB: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["scheduled", "live", "finished", "cancelled"],
            default: "scheduled",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Match", MatchSchema, "matches");