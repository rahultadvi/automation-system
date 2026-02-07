import pool from "../config/db.js";

export const saveCredentials = async (token, phoneId, accountId) => {
  const query = `
    INSERT INTO whatsapp_credentials 
    (whatsapp_token, phone_number_id, whatsapp_account_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [token, phoneId, accountId];

  const result = await pool.query(query, values);
  return result.rows[0];
};
