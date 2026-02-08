import bcrypt from "bcryptjs";
import crypto from "crypto";

import {
  createUser,
  saveVerificationToken,
  findToken,
  verifyUserEmail,
  markTokenUsed,
  findUserByEmail
} from "../models/auth.model.js";

import { sendVerificationEmail } from "../services/email.service.js";
import { generateToken } from "../utils/jwt.js";  


// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existingUser = await findUserByEmail(email);

    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(email, hashedPassword);

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 86400000);

    await saveVerificationToken(user.id, token, expiresAt);

    const link = `http://localhost:5000/api/auth/verify-email?token=${token}`;

    await sendVerificationEmail(email, link);

    res.json({ message: "User Registered" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ================= VERIFY EMAIL =================
export const verifyEmail = async (req, res) => {
  try {

    const { token } = req.query;

    const verification = await findToken(token);

    if (!verification)
      return res.status(400).json({ message: "Invalid token" });

    if (verification.is_used)
      return res.status(400).json({ message: "Token already used" });

    if (new Date() > verification.expires_at)
      return res.status(400).json({ message: "Token expired" });

    await verifyUserEmail(verification.user_id);
    await markTokenUsed(verification.id);

    res.json({ message: "Email Verified" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    // ✅ User check
    const user = await findUserByEmail(email);

    if (!user)
      return res.status(400).json({ message: "User not found" });

    // ✅ Email verified check
    if (!user.is_verified)
      return res.status(400).json({ message: "Please verify your email first" });

    // ✅ Password match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    // ✅ Generate JWT token
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
