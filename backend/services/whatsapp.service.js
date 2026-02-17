import axios from "axios";
import pool from "../config/db.js";


export const sendWhatsAppMessage = async (userId, phoneNumber, messageText) => {

  console.log("USER ID RECEIVED:", userId);

  const cred = await pool.query(
    "SELECT whatsapp_token, phone_number_id FROM whatsapp_credentials WHERE user_id = $1",
    [userId]
  );

  if (!cred.rows.length) {
    throw new Error("WhatsApp credentials not found");
  }

  const { whatsapp_token, phone_number_id } = cred.rows[0];

  const response = await axios.post(
    `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
    {
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "text",
      text: { body: messageText }
    },
    {
      headers: {
        Authorization: `Bearer ${whatsapp_token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};
