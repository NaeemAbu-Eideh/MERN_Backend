const jwt = require("jsonwebtoken");
const Chat = require("./models/ChatMessage.model");

const EVENTS = Object.freeze({
    DM_SEND_USER: "dm:user:send",       // user -> admin
    DM_SEND_ADMIN: "dm:admin:send",     // admin -> user
    DM_RECEIVE: "dm:receive",
    DM_NOTIFICATION: "dm:notification",
});

const USER_ROOM = (id) => `user:${String(id)}`;
const ADMINS_ROOM = "admins";

module.exports = function chatSocket(io) {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) return next(new Error("No token"));

            const payload = jwt.verify(token, process.env.JWT_SECRET);

            socket.userId = payload.id || payload._id;
            socket.role = payload.role; // "user" | "admin"
            next();
        } catch (e) {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.userId;

        socket.join(USER_ROOM(userId));

        if (socket.role === "admin") {
            socket.join(ADMINS_ROOM);
        }

        socket.on(EVENTS.DM_SEND_USER, async ({ message }) => {
            if (!message?.trim()) return;

            const adminId = process.env.ADMIN_ID;
            if (!adminId) return;

            const saved = await Chat.create({
                sender: userId,
                receiver: adminId,
                message: message,
                isRead: false,
            });

            io.to(ADMINS_ROOM).emit(EVENTS.DM_RECEIVE, {
                _id: saved._id,
                sender: saved.sender,
                receiver: saved.receiver,
                message: saved.message,
                createdAt: saved.createdAt,
            });

            io.to(USER_ROOM(userId)).emit(EVENTS.DM_RECEIVE, {
                _id: saved._id,
                sender: saved.sender,
                receiver: saved.receiver,
                message: saved.message,
                createdAt: saved.createdAt,
            });

            io.to(ADMINS_ROOM).emit(EVENTS.DM_NOTIFICATION, {
                fromUserId: userId,
                message: saved.message,
                createdAt: saved.createdAt,
            });
        });

        socket.on(EVENTS.DM_SEND_ADMIN, async ({ toUserId, message }) => {
            if (socket.role !== "admin") return;
            if (!toUserId || !message?.trim()) return;

            const saved = await Chat.create({
                sender: userId,
                receiver: toUserId,
                message: message.trim(),
                isRead: false,
            });

            io.to(USER_ROOM(toUserId)).emit(EVENTS.DM_RECEIVE, {
                _id: saved._id,
                sender: saved.sender,
                receiver: saved.receiver,
                message: saved.message,
                createdAt: saved.createdAt,
            });

            io.to(USER_ROOM(toUserId)).emit(EVENTS.DM_NOTIFICATION, {
                fromAdmin: true,
                message: saved.message,
                createdAt: saved.createdAt,
            });
        });
    });
};
