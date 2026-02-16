import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../services/email.service.js";

import {
  findUserByEmail,
  createInvitedUser,
  updateUserPassword,
  saveInviteToken,
  findInviteToken,
  verifyUserEmail,
  markInviteUsed
} from "../models/auth.model.js";

export const inviteUser = async (req, res) => {
  try {
    const { email, password } = req.body;

        if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

let user = await findUserByEmail(email);

if (!user) {
  // ⭐ completely new user
  user = await createInvitedUser(
    email,
    hashedPassword,
    req.user.id
  );

} else {
  // ⭐ user exists (any case)

  await updateUserPassword(
    email,
    hashedPassword,
    req.user.id
  );
}

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 86400000);

    await saveInviteToken(email, token, req.user.id, expiresAt,  "user"  );

    const link = `https://automation-system-f5p2.onrender.com/verify-email?token=${token}`;
    await sendVerificationEmail(email, link);

    res.json({ message: "Invite sent successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const verifyInviteEmail = async (req, res) => {

  const { token } = req.query;

  if (!token)
    return res.status(400).json({ message: "Token missing" });

  const invite = await findInviteToken(token);

  if (!invite)
    return res.status(400).json({ message: "Invalid invite" });

  if (invite.is_used)
    return res.status(400).json({ message: "Invite already used" });

  if (new Date() > invite.expires_at)
    return res.status(400).json({ message: "Invite expired" });

  // ⭐ user fetch karo
  const user = await findUserByEmail(invite.email);

  // ⭐ USER VERIFIED KARO
  await verifyUserEmail(user.id);

  // ⭐ invite used mark karo
  await markInviteUsed(invite.id);

  res.json({ message: "Email verified successfully" });
};


  

  // export const inviteUser = async (req, res) => {
  //   try {

  //     const { email } = req.body;

  //     if (!email)
  //       return res.status(400).json({ message: "Email required" });

  //     const token = crypto.randomBytes(32).toString("hex");

  //     const expiresAt = new Date(Date.now() + 86400000);

  //     await saveInviteToken(
  //       email,
  //       token,
  //       req.user.id,
  //       expiresAt
  //     );

  //     // const link = `http://localhost:5173/register?invite=${token}`;
  //     const link = `http://localhost:5173/register?invite=${token}`;

  //     await sendVerificationEmail(email, link);

  //     res.json({ message: "Invite sent successfully" });

  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // };

