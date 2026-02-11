import express from "express";
// import { inviteUser } from "../controllers/invite.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { inviteUser, verifyInviteEmail } from "../controllers/inviteUser.controller.js";
// import { verifyInviteEmail } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/invite", authMiddleware, inviteUser);
router.get("/verify-email", verifyInviteEmail);

export default router;
