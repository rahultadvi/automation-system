import pool from "../config/db.js";   // ⭐ Ye missing tha
import { sendWhatsAppMessage } from "../services/whatsapp.service.js";
import { saveMessageService } from "../services/message.service.js";


// ⭐ Send Message
// export const sendMessageController = async (req, res) => {
//   try {

//     const { phoneNumber, messageText } = req.body;
//     const { id: userId } = req.user;

//     if (!phoneNumber || !messageText) {
//       return res.status(400).json({
//         message: "Phone number and message text are required"
//       });
//     }

//     const whatsappResponse = await sendWhatsAppMessage(phoneNumber, messageText);

//     const whatsappMessageId =
//       whatsappResponse?.messages?.[0]?.id || null;

//     const savedMessage = await saveMessageService(
//       userId,
//       phoneNumber,
//       messageText,
//       "sent",
//       whatsappMessageId
//     );

//     res.status(200).json({
//       message: "Message sent successfully",
//       data: savedMessage
//     });

//   } catch (error) {

//     console.error("Send Message Error:", error);

//     res.status(500).json({
//       message: "Failed to send message",
//       error: error.message
//     });
//   }
// };
export const sendMessageController = async (req, res) => {
  try {
    const { phoneNumber, messageText } = req.body;

    const userId = req.user.id;

    console.log("CORRECT USER ID:", userId);
    console.log("PHONE:", phoneNumber);

    const response = await sendWhatsAppMessage(
      userId,
      phoneNumber,
      messageText
    );

    await saveMessageService(
      userId,
      phoneNumber,
      messageText,
      "sent",
      response?.messages?.[0]?.id || null
    );

    res.status(200).json({
      message: "Message sent successfully",
      data: response
    });

  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({
      message: error.message
    });
  }
};

// ⭐ Get All Messages
export const getMessagesController = async (req, res) => {

  try {

    const { id, role } = req.user;

    let result;

    if (role === "admin") {

      result = await pool.query(
        "SELECT * FROM messages ORDER BY id DESC"
      );

    } else {

      result = await pool.query(
        "SELECT * FROM messages WHERE user_id=$1 ORDER BY id DESC",
        [id]
      );

    }

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAdminMessages = async (req, res) => {
  try {

    if (!req.user)
      return res.status(401).json({ message: "Unauthorized" });

     // ⭐ SUPER ADMIN → sab messages
    if (req.user.role === "super_admin") {

      const messages = await pool.query(
        `SELECT 
            m.id,
            m.phone_number,
            m.message_text,
            m.created_at AS timestamp,
            u.email AS sender_email
         FROM messages m
         JOIN users u ON m.user_id = u.id
         ORDER BY m.created_at DESC`
      );

      return res.json(messages.rows);
    }

    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const messages = await pool.query(
      `SELECT 
          m.id,
          m.phone_number,
          m.message_text,
          m.created_at AS timestamp,
          u.email AS sender_email
       FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE u.created_by = $1
       ORDER BY m.created_at DESC`,
      [req.user.id]
    );

    res.json(messages.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const getTeamMessages = async (req, res) => {
//   try {

//     if (!req.user)
//       return res.status(401).json({ message: "Unauthorized" });

//     let adminId;

//     if (req.user.role === "admin") {
//       adminId = req.user.id;
//     } else {

//       const user = await pool.query(
//         `SELECT created_by FROM users WHERE id = $1`,
//         [req.user.id]
//       );

//       adminId = user.rows[0].created_by;
//     }

//     const messages = await pool.query(
//       `
//       SELECT *
//       FROM messages
//       WHERE user_id = $1
//          OR user_id IN (
//             SELECT id FROM users WHERE created_by = $1
//          )
//       ORDER BY created_at DESC
//       `,
//       [adminId]
//     );

//     res.json(messages.rows);

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
export const getTeamMessages = async (req, res) => {
  try {

    if (!req.user)
      return res.status(401).json({ message: "Unauthorized" });

    // ⭐ SUPER ADMIN → sab messages
    if (req.user.role === "super_admin") {

      const messages = await pool.query(`
        SELECT *
        FROM messages
        ORDER BY created_at DESC
      `);

      return res.json(messages.rows);
    }

    let adminId;

    if (req.user.role === "admin") {
      adminId = req.user.id;
    } else {

      const user = await pool.query(
        `SELECT created_by FROM users WHERE id = $1`,
        [req.user.id]
      );

      if (!user.rows.length || !user.rows[0].created_by) {
        return res.json([]);
      }

      adminId = user.rows[0].created_by;
    }

    const messages = await pool.query(`
      SELECT *
      FROM messages
      WHERE user_id = $1
         OR user_id IN (
            SELECT id FROM users WHERE created_by = $1
         )
      ORDER BY created_at DESC
    `, [adminId]);

    res.json(messages.rows);

  } catch (error) {
    console.error("Team Messages Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
