import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );
  return result.rows[0];
};

export const createUser = async (email, password) => {
  const result = await pool.query(
    `INSERT INTO users(email,password)
     VALUES($1,$2)
     RETURNING *`,
    [email, password]
  );
  return result.rows[0];
};

export const saveVerificationToken = async (userId, token, expiresAt) => {
  await pool.query(
    `INSERT INTO email_verifications(user_id,token,expires_at)
     VALUES($1,$2,$3)`,
    [userId, token, expiresAt]
  );
};

export const findToken = async (token) => {
  const result = await pool.query(
    `SELECT * FROM email_verifications
     WHERE token=$1`,
    [token]
  );
  return result.rows[0];
};

export const verifyUserEmail = async (userId) => {
  await pool.query(
    `UPDATE users SET is_verified=true WHERE id=$1`,
    [userId]
  );
};

export const markTokenUsed = async (id) => {
  await pool.query(
    `UPDATE email_verifications SET is_used=true WHERE id=$1`,
    [id]
  );
};

export const saveInviteToken = async (
  email,
  token,
  invitedBy,
  expiresAt
) => {

  const result = await pool.query(
    `INSERT INTO user_invitations(email, invite_token, invited_by, expires_at)
     VALUES($1,$2,$3,$4)
     RETURNING *`,
    [email, token, invitedBy, expiresAt]
  );

  return result.rows[0];
};

