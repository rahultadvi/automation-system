import express from "express";
import { getMessagesController, sendMessageController } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send-message", sendMessageController);

router.get("/messages", getMessagesController);

export default router;  
