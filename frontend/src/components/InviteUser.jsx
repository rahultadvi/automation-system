import { useState } from "react";
import axios from "axios";

const InviteUser = ({setShowInvite }) => {

    
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {

    if (!email || !password) {
      alert("Enter Email & Password");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://automation-system-f5p2.onrender.com/api/invite/invite",
        { email, password },
        { withCredentials: true }
      );

      alert("Invite Sent ✅");

      setEmail("");
      setPassword("");

    } catch (error) {
      alert(error.response?.data?.message || "Invite Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="bg-white p-8 rounded-2xl shadow-lg w-96 max-w-md relative">
  {/* Close Button */}
  <button
    onClick={() => setShowInvite(false)}
    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
    aria-label="Close invite modal"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  {/* Header */}
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Invite User</h2>
    <p className="text-sm text-gray-500">Send an invitation to join your team</p>
  </div>

  {/* Form */}
  <div className="space-y-4">
    {/* Email Input */}
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
        Email Address
      </label>
      <input
        id="email"
        type="email"
        placeholder="colleague@example.com"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    {/* Password Input */}
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
        Temporary Password
      </label>
      <input
        id="password"
        type="password"
        placeholder="Enter temporary password"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    {/* Submit Button */}
    <button
      onClick={handleInvite}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Sending Invite...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Send Invite
        </>
      )}
    </button>
  </div>

  {/* Helper Text */}
  <p className="mt-4 text-xs text-gray-500 text-center">
    The user will receive an email with login instructions
  </p>
</div>
  );
};

export default InviteUser;
