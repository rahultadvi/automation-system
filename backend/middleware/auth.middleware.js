import { verifyJwtToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  try {

    // ✅ Authorization header se token lena
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Format: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // ✅ Token verify
    const decoded = verifyJwtToken(token);

    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // ✅ User data request me store karna
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
