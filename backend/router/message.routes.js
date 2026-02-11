import express from "express";
import { getAdminMessages, getMessagesController, getTeamMessages, sendMessageController } from "../controllers/message.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send-message",authMiddleware, sendMessageController);

router.get("/messages",authMiddleware, getMessagesController);
router.get("/admin/messages", authMiddleware, getAdminMessages);
router.get("/team-messages", authMiddleware, getTeamMessages);

export default router;  
