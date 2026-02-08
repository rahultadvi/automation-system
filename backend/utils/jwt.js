import jwt from "jsonwebtoken";

// ✅ Generate JWT Token
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );
};

// ✅ Verify JWT Token
export const verifyJwtToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
