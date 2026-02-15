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


export default router;
