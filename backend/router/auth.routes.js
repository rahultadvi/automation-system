import express from "express";
import { getAllUsers, getCurrentUser, loginUser, logoutUser, registerUser, setPassword, verifyEmail } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);
router.post("/login", loginUser);

router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", logoutUser);
router.get("/users", authMiddleware, getAllUsers);
router.post("/set-password", setPassword);

app.get("/test-email", async (req, res) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "rahultadvi8143@gmail.com",
      subject: "DIRECT TEST",
      html: "<h1>Working?</h1>"
    });

    console.log("Response:", response);
    res.json(response);

  } catch (error) {
    console.log("Error full:", error);
    res.json(error);
  }
});

export default router;
