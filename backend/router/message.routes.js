import express from "express";
import { getMessagesController, sendMessageController } from "../controllers/message.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send-message",authMiddleware, sendMessageController);

router.get("/messages",authMiddleware, getMessagesController);

export default router;  
