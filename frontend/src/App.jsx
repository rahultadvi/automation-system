import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
axios.defaults.withCredentials = true;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import SendMessage from "./components/SendMessage";
import MessageList from "./components/MessageList";
import Login from "./components/Login";
import Register from "./components/Register";
import InviteUser from "./components/InviteUser";
import LogOut from "./components/LogOut";
import Headding from "./components/Headding";
import Users from "./components/Users";
import VerifyEmail from "./components/VerifyEmail";
import AdminMessageList from "./components/AdminMessageList";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res = await axios.get(
  //         "http://localhost:5000/api/auth/me",
  //         { withCredentials: true }
  //       );
  //       setIsLoggedIn(true);
  //       setRole(res.data.user.role);
  //     } catch {
  //       setIsLoggedIn(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   checkAuth();
  // }, []);
useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/me",
        { withCredentials: true }
      );
      setIsLoggedIn(true);
      setRole(res.data.user.role);
    } catch {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };
  checkAuth();
}, []);

  const handleLogout = async () => {
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold">Checking session...</h2>
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        {/* 🔐 Verify */}
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* 🔓 Login */}
        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to="/" />
              : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        {/* 🔓 Register */}
        <Route
          path="/register"
          element={
            isLoggedIn
              ? <Navigate to="/" />
              : <Register />
          }
        />

        {/* 🧠 Dashboard */}
        <Route
          path="/"
          element={
            !isLoggedIn
              ? <Navigate to="/login" />
              : (
                <div style={{ padding: "20px" }}>
                  <Headding />
                  <LogOut handleLogout={handleLogout} />

                  <SendMessage
                    role={role}
                    setShowInvite={setShowInvite}
                    setShowUsers={setShowUsers}
                  />

                  {role === "admin" && showInvite && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                      <InviteUser setShowInvite={setShowInvite} />
                    </div>
                  )}

                  {role === "admin" && showUsers && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
                      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
                        <button
                          onClick={() => setShowUsers(false)}
                          className="absolute top-3 right-3 text-xl font-bold"
                        >
                          ✕
                        </button>
                        <Users />
                      </div>
                    </div>
                  )}

                  <MessageList />
                  {role === "admin" && <AdminMessageList />}
                </div>
              )
          }
        />

        {/* ❌ Unknown */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
