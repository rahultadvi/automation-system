import { useState, useEffect } from "react";

import SendMessage from "./components/SendMessage";
import MessageList from "./components/MessageList";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  // ⭐ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // ✅ If not logged in
  if (!isLoggedIn) {
    return showLogin
      ? <Login setIsLoggedIn={setIsLoggedIn} setShowLogin={setShowLogin} />
      : <Register setShowLogin={setShowLogin} />;
  }

  // ✅ Dashboard
  return (
    <div style={{ padding: "20px" }}>

      {/* ⭐ Header */}
      <div className="flex justify-between items-center mb-8">

        <div className="text-center w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.99 6.99l-6.01 6.01-6.01-6.01h12.02z"/>
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            WhatsApp Messaging App
          </h1>

          <p className="text-gray-500">
            Secure • Fast • Reliable
          </p>
        </div>

        {/* ⭐ Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>

      <SendMessage />
      <MessageList />

    </div>
  );
}

export default App;
