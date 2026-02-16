// import pool from "../config/db.js";
import { saveMessage } from "../models/messages.model.js";

export const saveMessage = async (
  userId,
  phoneNumber,
  messageText,
  status,
  responseId
) => {

  const result = await pool.query(
    `
    INSERT INTO messages
    (user_id, phone_number, message_text, status, whatsapp_message_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [userId, phoneNumber, messageText, status, responseId]
  );

  return result.rows[0];
};



// import { saveMessage } from "../models/messages.model.js";

// export const saveMessageService = async (
//   userId,
//   phoneNumber,
//   messageText,
//   status,
//   responseId
// ) => {

//   const savedMessage = await saveMessage(
//     userId,
//     phoneNumber,
//     messageText,
//     status,
//     responseId
//   );

//   return savedMessage;
// };
