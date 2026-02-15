import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { inviteUser, verifyInviteEmail } from "../controllers/inviteUser.controller.js";
import { Resend } from "resend";

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/invite", authMiddleware, inviteUser);
router.get("/verify-email", verifyInviteEmail);

router.get("/test-email", async (req, res) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "rahultadvi8143@gmail.com",
      subject: "FINAL TEST",
      html: "<h1>Working now?</h1>"
    });

    console.log("SUCCESS:", response);
    res.json(response);

  } catch (error) {
    console.log("FULL ERROR:", error);
    res.json(error);
  }
});

export default router;
