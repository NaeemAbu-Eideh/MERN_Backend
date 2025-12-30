// src/routes/chat.routes.js
const router = require("express").Router();
const auth = require("../middleware/auth");

const chatController = require("../controllers/chat.controller");

router.get("/api/chat/history/:otherId", auth, chatController.getChatHistory);
router.patch("/api/chat/read/:otherId", auth, chatController.markChatRead);
router.get("/api/admin/chat/inbox", auth, chatController.getAdminInbox);
router.get("/conversations", auth, chatController.getAdminConversations);



module.exports = router;
