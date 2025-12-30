// src/controllers/chat.controller.js
const Chat = require("./../models/ChatMessage.model");

// GET /api/chat/history/:otherId
const getChatHistory = async (req, res) => {
    try {
        const me = req.user.id;
        const other = req.params.otherId;

        const messages = await Chat.find({
            $or: [
                { sender: me, receiver: other },
                { sender: other, receiver: me },
            ],
        })
            .sort({ createdAt: 1 })
            .limit(300);

        return res.json({ success: true, messages });
    } catch (err) {
        console.log("getChatHistory error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const markChatRead = async (req, res) => {
    try {
        const me = req.user.id;
        const other = req.params.otherId;

        await Chat.updateMany(
            { sender: other, receiver: me, isRead: false },
            { $set: { isRead: true } }
        );

        return res.json({ success: true });
    } catch (err) {
        console.log("markChatRead error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// GET /api/admin/chat/inbox
const getAdminInbox = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const adminId = req.user.id;

        const items = await Chat.aggregate([
            {
                $match: {
                    $or: [{ receiver: adminId }, { sender: adminId }],
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    sender: 1,
                    receiver: 1,
                    message: 1,
                    isRead: 1,
                    createdAt: 1,
                    otherUser: {
                        $cond: [{ $eq: ["$sender", adminId] }, "$receiver", "$sender"],
                    },
                },
            },
            {
                $group: {
                    _id: "$otherUser",
                    lastMessage: { $first: "$message" },
                    lastAt: { $first: "$createdAt" },
                },
            },
            { $sort: { lastAt: -1 } },
            { $limit: 100 },
        ]);

        return res.json({ success: true, items });
    } catch (err) {
        console.log("getAdminInbox error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const getAdminConversations = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        // ملاحظة: عندك auth بستخدم req.user.id مش _id
        const adminId = req.user.id;

        const rows = await Chat.aggregate([
            { $match: { $or: [{ sender: adminId }, { receiver: adminId }] } },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    otherUserId: {
                        $cond: [{ $eq: ["$sender", adminId] }, "$receiver", "$sender"],
                    },
                },
            },
            {
                $group: {
                    _id: "$otherUserId",
                    lastMessage: { $first: "$message" },
                    lastAt: { $first: "$createdAt" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$receiver", adminId] },
                                        { $eq: ["$isRead", false] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            { $sort: { lastAt: -1 } },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    lastMessage: 1,
                    updatedAt: "$lastAt",
                    unreadCount: 1,
                },
            },
        ]);

        return res.json({ conversations: rows });
    } catch (err) {
        console.log("getAdminConversations error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getChatHistory,
    markChatRead,
    getAdminInbox,
    getAdminConversations,
};

