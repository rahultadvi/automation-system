// import { sendWhatsAppMessage } from "../services/whatsapp.service.js";
// import { saveMessageService } from "../services/message.service.js";

// export const webhookController = async (req, res) => {
//   try {

//     const entry = req.body.entry?.[0];
//     const changes = entry?.changes?.[0];
//     const value = changes?.value;
//     const message = value?.messages?.[0];

//     if (message) {
//       const from = message.from;
//       const text = message.text?.body;

//       console.log("Incoming:", from, text);

//       // ✅ AUTO REPLY
//       await sendWhatsAppMessage(from, "Hello Rahul 👋");

//       // ✅ Save Incoming Message
//       await saveMessageService(from, text, "received", null);
//     }

//     res.sendStatus(200);

//   } catch (error) {
//     console.log("Webhook Error:", error);
//     res.sendStatus(500);
//   }
// };
