import { verifyJwtToken } from "../utils/jwt.js";
import { findUserByEmail } from "../models/auth.model.js";

export const authMiddleware = async (req, res, next) => {
console.log("Cookies:", req.cookies);

  try {

    const token = req.cookies.token;

    if (!token)
      return res.status(401).json({ message: "Token missing" });

    const decoded = verifyJwtToken(token);

    if (!decoded)
      return res.status(403).json({ message: "Invalid token" });

    // ⭐ DB se fresh user lo
    const user = await findUserByEmail(decoded.email);

    if (!user)
      return res.status(401).json({ message: "User not found" });

    req.user = user;

    next();

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
