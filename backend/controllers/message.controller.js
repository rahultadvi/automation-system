import pool from "../config/db.js";   // ⭐ Ye missing tha
import { sendWhatsAppMessage } from "../services/whatsapp.service.js";
import { saveMessageService } from "../services/message.service.js";


// ⭐ Send Message
export const sendMessageController = async (req, res) => {

  try {

    const { phoneNumber, messageText } = req.body;

    if (!phoneNumber || !messageText) {
      return res.status(400).json({
        message: "Phone number and message text are required"
      });
    }

    const whatsappResponse = await sendWhatsAppMessage(phoneNumber, messageText);

    const savedMessage = await saveMessageService(
      phoneNumber,
      messageText,
      "sent",
      whatsappResponse.messages[0].id
    );

    res.status(200).json({
      message: "Message sent successfully",
      data: savedMessage
    });

  } catch (error) {

    console.error("Send Message Error:", error.message);

    res.status(500).json({
      message: "Failed to send message",
      error: error.message
    });

  }

};


// ⭐ Get All Messages
export const getMessagesController = async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM messages ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }

};
