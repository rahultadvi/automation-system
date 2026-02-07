import { useState } from "react";
import axios from "axios";

const SendMessage = () => {

  const [phoneNumber, setPhoneNumber] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {

    if (!phoneNumber || !messageText) {
      alert("Please enter phone number and message");
      return;
    }

    try {
      setLoading(true);

      // ✅ Remove all non-numbers
      const formattedNumber = phoneNumber.replace(/\D/g, "");

      const res = await axios.post(
        "http://localhost:5000/api/send-message",
        {
          phoneNumber: formattedNumber,
          messageText
        }
      );

      console.log(res.data);

      alert("Message Sent ✅");

      // ✅ Clear fields after sending
      setPhoneNumber("");
      setMessageText("");

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Message Failed ❌"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid gray", padding: "20px", width: "300px" }}>
      <h2>Send WhatsApp Message</h2>

      <input
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />

      <br /><br />

      <textarea
        placeholder="Message Text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />

      <br /><br />

      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          cursor: "pointer"
        }}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default SendMessage;
