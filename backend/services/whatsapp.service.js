import axios from "axios";
import pool from "../config/db.js";

export const sendWhatsAppMessage = async (phoneNumber, messageText) => {
  console.log("👉 Phone Number:", phoneNumber);
  console.log("👉 Message Text:", messageText);
  // const cred = await pool.query(
  //   "SELECT * FROM whatsapp_credentials LIMIT 1"
  // );
const cred = await pool.query(
  "SELECT whatsapp_token, phone_number_id FROM whatsapp_credentials WHERE user_id = $1",
  [userId]
);
  if (!cred.rows.length) {
    throw new Error("WhatsApp credentials not found");
  }

  const { whatsapp_token, phone_number_id } = cred.rows[0];

    console.log("👉 Token:", whatsapp_token);
  console.log("👉 Phone ID:", phone_number_id);

  const url = `https://graph.facebook.com/v18.0/${phone_number_id}/messages`;

  // 👉 Template Message (Conversation Start)
const response = await axios.post(
    
  url,
  {
    messaging_product: "whatsapp",
    to: phoneNumber,
    type: "text",
    text: {
      body: messageText
    }
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
