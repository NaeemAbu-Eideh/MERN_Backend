const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "firstName field is required."],
            minlength: [3, "firstName must be at least 3 chars."],
            trim: true,
        },

        lastName: {
            type: String,
            required: [true, "lastName field is required."],
            minlength: [3, "lastName must be at least 3 chars."],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "email field is required."],
            unique: true,
            index: true,
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "please enter a valid email address.",
            ],
        },

        password: {
            type: String,
            required: [true, "password field is required."],
            minlength: [8, "password must be at least 8 chars."],
            select: false,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema, "users");
