import express from "express";
import pool from "../config/db.js";
import { sendWhatsAppMessage } from "../services/whatsapp.service.js";

const router = express.Router();


// ==================
// Webhook Verification
// ==================
router.get("/webhook", (req, res) => {

  const VERIFY_TOKEN = "mytoken123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook Verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }

});


// ==================
// Webhook Receive Message
// ==================
// router.post("/webhook", async (req, res) => {

//   try {

//     const body = req.body;

//     if (body.entry?.[0]?.changes?.[0]?.value?.messages) {

//       const messageData = body.entry[0].changes[0].value.messages[0];

//       const phoneNumber = messageData.from;
//       const messageText = messageData.text?.body;
//       const messageId = messageData.id;

//       console.log("Incoming Message:", phoneNumber, messageText);


//       // ✅ Save Incoming Message
//       // await pool.query(
//       //   `INSERT INTO messages 
//       //   (phone_number, message_text, message_status, response_id) 
//       //   VALUES ($1,$2,$3,$4)`,
//       //   [phoneNumber, messageText, "received", messageId]
//       // );
// // await pool.query(
// //   `INSERT INTO messages 
// //    (phone_number, content, message_status, response_id) 
// //    VALUES ($1,$2,$3,$4)`,
// //   [phoneNumber, messageText, "received", messageId]
// // );

// await pool.query(
//   `INSERT INTO messages 
//    (phone_number, message_text, message_status, response_id) 
//    VALUES ($1,$2,$3,$4)`,
//   [phoneNumber, messageText, "received", messageId]
// );



//       // ✅ AUTO REPLY (IMPORTANT)
//       await sendWhatsAppMessage(phoneNumber, "Hello Rahul 👋");

//     }

//     res.sendStatus(200);

//   } catch (error) {
//     console.log("Webhook Error:", error);
//     res.sendStatus(500);
//   }

// });

router.post("/webhook", async (req, res) => {
  try {

    const value = req.body.entry?.[0]?.changes?.[0]?.value;

    // ===============================
    // 1️⃣ Incoming Message
    // ===============================
    if (value?.messages) {

      const messageData = value.messages[0];

      const phoneNumber = messageData.from;
      const messageText = messageData.text?.body || null;
      const messageId = messageData.id;

      console.log("Incoming Message:", phoneNumber, messageText);

      await pool.query(
        `INSERT INTO messages 
         (phone_number, message_text, message_status, response_id) 
         VALUES ($1,$2,$3,$4)`,
        [phoneNumber, messageText, "received", messageId]
      );

      await sendWhatsAppMessage(phoneNumber, "Hello 👋");

    }

    // ===============================
    // 2️⃣ Status Update (Delivered/Read)
    // ===============================
    if (value?.statuses) {

  const statusData = value.statuses[0];

  const messageId = statusData.id;
  const status = statusData.status;
  const error = statusData.errors?.[0]?.title || null;

  console.log("Status Update:", messageId, status, error);

  await pool.query(
    `UPDATE messages
     SET message_status = $1,
         error_message = $2
     WHERE response_id = $3`,
    [status, error, messageId]
  );
}
    res.sendStatus(200);

  } catch (error) {
    console.log("Webhook Error:", error);
    res.sendStatus(500);
  }
});


export default router;
