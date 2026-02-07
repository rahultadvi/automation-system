import { useEffect, useState } from "react";
import axios from "axios";

const MessageList = () => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/messages"
      );

      setMessages(res.data);

    } catch (error) {
      console.log(error);
      alert("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Message History</h2>

      {loading && <p>Loading messages...</p>}

      {!loading && messages.length === 0 && (
        <p>No Messages Found</p>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{ borderBottom: "1px solid #ccc", padding: "10px" }}
        >
          <p><b>Phone:</b> {msg.phone_number}</p>
          <p><b>Message:</b> {msg.message_text}</p>
          <p><b>Status:</b> {msg.message_status}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
