import axios from "axios";
import pool from "../config/db.js";

export const sendWhatsAppMessage = async (userId, phoneNumber, messageText) => {

  console.log("WHATSAPP API SENDING TO:", phoneNumber);
  console.log("USER ID RECEIVED:", userId);

  // 🔎 Step 1: Check credentials in DB
  let cred = await pool.query(
    "SELECT whatsapp_token, phone_number_id FROM whatsapp_credentials WHERE user_id = $1",
    [userId]
  );

  // 🔥 Step 2: If not found → Auto create from ENV
  if (!cred.rows.length) {

    console.log("No credentials found. Auto creating...");

    const defaultToken = process.env.WHATSAPP_TOKEN;
    const defaultPhoneId = process.env.PHONE_NUMBER_ID;

    if (!defaultToken || !defaultPhoneId) {
      throw new Error("WhatsApp ENV variables missing");
    }

    await pool.query(
      `INSERT INTO whatsapp_credentials
       (user_id, whatsapp_token, phone_number_id)
       VALUES ($1,$2,$3)`,
      [userId, defaultToken, defaultPhoneId]
    );

    console.log("Credentials auto-created");

    // 🔄 Re-fetch credentials
    cred = await pool.query(
      "SELECT whatsapp_token, phone_number_id FROM whatsapp_credentials WHERE user_id = $1",
      [userId]
    );
  }

  const { whatsapp_token, phone_number_id } = cred.rows[0];

  // 🚀 Step 3: Send message
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




// import axios from "axios";
// import pool from "../config/db.js";


// export const sendWhatsAppMessage = async (userId, phoneNumber, messageText) => {
//   console.log("WHATSAPP API SENDING TO:", phoneNumber);


//   console.log("USER ID RECEIVED:", userId);

//   const cred = await pool.query(
//     "SELECT whatsapp_token, phone_number_id FROM whatsapp_credentials WHERE user_id = $1",
//     [userId]
//   );

//   if (!cred.rows.length) {
//     throw new Error("WhatsApp credentials not found");
//   }

//   const { WHATSAPP_TOKEN, PHONE_NUMBER_ID } = cred.rows[0];

//   const response = await axios.post(
//     `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
//     {
//       messaging_product: "whatsapp",
//       to: phoneNumber,
//       type: "text",
//       text: { body: messageText }
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${WHATSAPP_TOKEN}`,
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   return response.data;
// };
