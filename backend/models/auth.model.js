import pool from "../config/db.js";

// export const findUserByEmail = async (email) => {
//   const result = await pool.query(
//     `SELECT * FROM users WHERE email=$1`,
//     [email]
//   );
//   return result.rows[0];
// };

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER($1)`,
    [email.trim()]
  );
  return result.rows[0];
};

export const createInvitedUser = async (email, password, createdBy) => {
  const result = await pool.query(
    `INSERT INTO users (email, password, is_verified, created_by, role)
     VALUES ($1, $2, true, $3, 'user')
     RETURNING *`,
    [email.trim(), password, createdBy]
  );
  return result.rows[0];
};



export const updateUserPassword = async (email, password, createdBy) => {
  const result = await pool.query(
    `UPDATE users
     SET password = $1,
         created_by = COALESCE(created_by, $2)
     WHERE LOWER(email) = LOWER($3)
     RETURNING *`,
    [password, createdBy, email.trim()]
  );

  return result.rows[0];
};



export const createUser = async (
  username,
  email,
  password,
  role = "user",
  createdBy = null
) => {

  const defaultPermissions = [];

  const result = await pool.query(
    `INSERT INTO users(username,email,password,role,created_by,permissions)
     VALUES($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [username, email, password, role, createdBy, defaultPermissions]
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
  expiresAt,
  role = "user"
) => {
  const result = await pool.query(
    `INSERT INTO user_invitations(email, invite_token, invited_by, expires_at, role)
     VALUES($1,$2,$3,$4,$5)
     RETURNING *`,
    [email, token, invitedBy, expiresAt, role]
  );

  return result.rows[0];
};


export const findInviteToken = async (token) => {
  const result = await pool.query(
    `SELECT * FROM user_invitations WHERE invite_token=$1`,
    [token]
  );

  return result.rows[0];
};


export const markInviteUsed = async (id) => {
  await pool.query(
    `UPDATE user_invitations SET is_used=true WHERE id=$1`,
    [id]
  );
};

