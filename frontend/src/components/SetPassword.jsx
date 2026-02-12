import { useState } from "react";
import axios from "axios";

const SetPassword = () => {

  const [password, setPassword] = useState("");

  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");

  const handleSubmit = async () => {
    try {
      await axios.post("https://automation-system-f5p2.onrender.com/api/auth/set-password", {
        email,
        password
      });

      alert("Password set successfully");
      window.location.href = "/login";

    } catch (err) {
      alert("Failed to set password");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Set Password</h2>

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Save Password
      </button>
    </div>
  );
};

export default SetPassword;
