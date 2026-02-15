import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { inviteUser, verifyInviteEmail } from "../controllers/inviteUser.controller.js";


const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/invite", authMiddleware, inviteUser);
router.get("/verify-email", verifyInviteEmail);



export default router;
