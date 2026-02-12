import bcrypt from "bcryptjs";
import crypto from "crypto";

import {
  createUser,
  saveVerificationToken,
  findToken,
  verifyUserEmail,
  markTokenUsed,
  findUserByEmail,
  findInviteToken,
  markInviteUsed
} from "../models/auth.model.js";

import { sendVerificationEmail } from "../services/email.service.js";
import { generateToken } from "../utils/jwt.js";
import pool from "../config/db.js";


// ================= REGISTER =================
// export const registerUser = async (req, res) => {
//   try {

//     const { email, password, inviteToken } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ message: "All fields required" });


//     const existingUser = await findUserByEmail(email);

//     if (existingUser)
//       return res.status(400).json({ message: "Email already exists" });


//     // ⭐ Invite OPTIONAL
//     let invite = null;

//     if (inviteToken) {

//       invite = await findInviteToken(inviteToken);

//       if (!invite)
//         return res.status(400).json({ message: "Invalid invite" });

//       if (invite.is_used)
//         return res.status(400).json({ message: "Invite already used" });

//       if (new Date() > invite.expires_at)
//         return res.status(400).json({ message: "Invite expired" });

//       if (invite.email !== email)
//         return res.status(400).json({ message: "Invite email mismatch" });
//     }


//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await createUser(email, hashedPassword,"admin");


//     // ⭐ Invite used mark
//     if (invite) {
//       await markInviteUsed(invite.id);
//     }


//     // ⭐ Email verification
//     const token = crypto.randomBytes(32).toString("hex");
//     const expiresAt = new Date(Date.now() + 86400000);

//     await saveVerificationToken(user.id, token, expiresAt);

//     const link = `http://localhost:5000/api/auth/verify-email?token=${token}`;

//     await sendVerificationEmail(email, link);

//     res.json({ message: "User Registered" });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const registerUser = async (req, res) => {
//   try {

//     const { email, password, inviteToken } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ message: "All fields required" });

//     const existingUser = await findUserByEmail(email);

//     if (existingUser)
//       return res.status(400).json({ message: "Email already exists" });

//     let invite = null;

//     if (inviteToken) {

//       invite = await findInviteToken(inviteToken);

//       if (!invite)
//         return res.status(400).json({ message: "Invalid invite" });

//       if (invite.is_used)
//         return res.status(400).json({ message: "Invite already used" });

//       if (new Date() > invite.expires_at)
//         return res.status(400).json({ message: "Invite expired" });

//       if (invite.email !== email)
//         return res.status(400).json({ message: "Invite email mismatch" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // ⭐ Admin exist check
//     const adminCheck = await pool.query(
//       "SELECT id FROM users WHERE role='admin' LIMIT 1"
//     );

//     let role = "user";
// let createdBy = null;

// if (invite) {

//   role = invite.role;
//   createdBy = invite.invited_by;

// } else {

//   const adminCheck = await pool.query(
//     "SELECT id FROM users WHERE role='admin' LIMIT 1"
//   );

//   if (adminCheck.rows.length === 0) {
//     role = "admin";
//   }
// }


//     const user = await createUser(
//       email,
//       hashedPassword,
//       role,
//       createdBy
//     );

//     // ⭐ Email verification
//     const token = crypto.randomBytes(32).toString("hex");
//     const expiresAt = new Date(Date.now() + 86400000);

//     await saveVerificationToken(user.id, token, expiresAt);

//     const link = `http://localhost:5173/verify-email?token=${token}`;

//     await sendVerificationEmail(email, link);

//     res.json({ message: "User Registered" });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// ================= VERIFY EMAIL =================

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existingUser = await findUserByEmail(email);

    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 Always admin
    const role = "admin";
    const createdBy = null;

    const user = await createUser(
      email,
      hashedPassword,
      role,
      createdBy
    );

    // Email verification
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 86400000);

    await saveVerificationToken(user.id, token, expiresAt);

    const link = `http://localhost:5173/verify-email?token=${token}`;
    await sendVerificationEmail(email, link);

    res.json({ message: "User Registered as Admin" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const verifyEmail = async (req, res) => {
  try {

    const { token } = req.query;

    // 🔹 1. Normal verification token
    const verification = await findToken(token);

    if (verification) {

      if (verification.is_used)
        return res.status(400).json({ message: "Token already used" });

      if (new Date() > verification.expires_at)
        return res.status(400).json({ message: "Token expired" });

      await verifyUserEmail(verification.user_id);
      await markTokenUsed(verification.id);

      return res.json({ message: "Email verified successfully" });
    }

    // 🔹 2. Invite token check
    const invite = await findInviteToken(token);

    if (invite) {

      if (invite.is_used)
        return res.status(400).json({ message: "Invite already used" });

      if (new Date() > invite.expires_at)
        return res.status(400).json({ message: "Invite expired" });

      const user = await findUserByEmail(invite.email);

      if (!user)
        return res.status(400).json({ message: "User not found" });

      await verifyUserEmail(user.id);
      await markInviteUsed(invite.id);

      return res.json({ message: "Invite verified successfully" });
    }

    // 🔴 No token found
    return res.status(400).json({ message: "Invalid token" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// export const verifyEmail = async (req, res) => {
//   try {

//     const { token } = req.query;

//     // 🔹 1. Normal email verification token
//     const verification = await findToken(token);

//     if (verification) {

//       if (verification.is_used)
//         return res.status(400).json({ message: "Token already used" });

//       if (new Date() > verification.expires_at)
//         return res.status(400).json({ message: "Token expired" });

//       await verifyUserEmail(verification.user_id);
//       await markTokenUsed(verification.id);

//       return res.json({ message: "Email verified successfully" });
//     }

//     // 🔹 2. Invite token verification
//     const invite = await findInviteToken(token);

//     if (invite) {

//       if (invite.is_used)
//         return res.status(400).json({ message: "Invite already used" });

//       if (new Date() > invite.expires_at)
//         return res.status(400).json({ message: "Invite expired" });

//       // find user by invited email
//       const user = await findUserByEmail(invite.email);

//       if (!user)
//         return res.status(400).json({ message: "User not found for invite" });

//       await verifyUserEmail(user.id);
//       await markInviteUsed(invite.id);

//       return res.json({ message: "Invite verified successfully" });
//     }

//     // 🔴 No token matched
//     return res.status(400).json({ message: "Invalid token" });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
 


// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await findUserByEmail(email);

    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (!user.is_verified)
      return res.status(400).json({ message: "Please verify your email first" });

    if (!user.password) {
  return res.status(400).json({
    message: "Please complete registration using invite link"
  });
}

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

const token = generateToken(user);

const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000
});

res.json({
  message: "Login successful",
  user: {
    id: user.id,
    email: user.email,
    role: user.role
  }
});


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 export const logoutUser = async (req, res) => {

  res.clearCookie("token");

  res.json({ message: "Logged out successfully" });

};


export const getAllUsers = async (req, res) => {

  try {

    // ⭐ Check authentication
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role === "super_admin") {

    const result = await pool.query(
      "SELECT id,email,role FROM users"
    );

    return res.json(result.rows);
  }

    // ⭐ Only admin allowed
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
const result = await pool.query(
  `SELECT id,email,role
   FROM users
   WHERE created_by = $1`,
  [req.user.id]
);

    res.json(result.rows);

  } catch (error) {

    console.error("Get Users Error:", error.message);

    res.status(500).json({
      message: "Server error"
    });
  }

};


export const setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users SET password=$1 WHERE email=$2`,
      [hashed, email]
    );

    res.json({ message: "Password set successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
