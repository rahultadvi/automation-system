import pool from "../config/db.js";

export const saveMessage = async (
  phoneNumber,
  messageText,
  status,
  responseId
) => {
  const query = `
    INSERT INTO messages 
    (phone_number, message_text, message_status, response_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [phoneNumber, messageText, status, responseId];

  const result = await pool.query(query, values);
  return result.rows[0];
};
