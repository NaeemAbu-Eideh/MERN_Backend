const mongoose = require("mongoose");

const StadiumSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name field is required."],
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        mapLink: {
            type: String,
            trim: true,
        },
        capacity: {
            type: Number,
        },
        facilities: {
            type: [String], 
            default: [],
        },
        status: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Stadium", StadiumSchema, "stadiums");