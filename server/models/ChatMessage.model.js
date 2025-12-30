const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
    {
        resource: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resource",
            index: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
        isRead: {type: Boolean, default: false},
        message: String,
    },
    {
        timestamps: true,
    }
);
module.exports = Chat = mongoose.model("Chat", chatSchema, "chats");