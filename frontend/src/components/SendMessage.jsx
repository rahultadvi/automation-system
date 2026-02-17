import { useState } from "react";
import axios from "axios";
import { FiSend, FiSmartphone, FiMessageSquare, FiLoader } from "react-icons/fi";

const SendMessage = ({onMessageSent,role,setShowInvite,  setShowUsers}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

const handleSend = async () => {
  if (!phoneNumber || !messageText) {
    alert("Please enter phone number and message");
    return;
  }

  try {
    setLoading(true);

    let formattedNumber = phoneNumber.replace(/\D/g, "");

    // 🇮🇳 Agar sirf 10 digit dala hai
    if (formattedNumber.length === 10) {
      formattedNumber = "91" + formattedNumber;
    }

    // 🇮🇳 Agar 0 se start ho raha hai
    if (formattedNumber.length === 11 && formattedNumber.startsWith("0")) {
      formattedNumber = "91" + formattedNumber.substring(1);
    }

    // Final validation (India number = 12 digits including 91)
    if (formattedNumber.length !== 12) {
      alert("Invalid phone number. Please enter valid Indian number.");
      return;
    }

    const res = await axios.post(
      "https://automation-system-f5p2.onrender.com/api/send-message",
      {
        phoneNumber: formattedNumber,
        messageText
      },
      {
        withCredentials: true
      }
    );

    alert("Message Sent ✅");

    setPhoneNumber("");
    setMessageText("");
    if (onMessageSent) onMessageSent();
    setCharCount(0);

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


  const handleMessageChange = (e) => {
    const text = e.target.value;
    setMessageText(text);
    setCharCount(text.length);
  };

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-green-100 p-3 rounded-full mr-3">
          <FiMessageSquare className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Send WhatsApp Message
        </h2>
      </div>

      <div className="space-y-6">
        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <FiSmartphone className="w-4 h-4 mr-2 text-gray-500" />
              Phone Number
            </div>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">+</span>
            </div>
            <input
              type="text"
              placeholder="1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Enter phone number with country code (digits only)
          </p>
        </div>

        {/* Message Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <FiMessageSquare className="w-4 h-4 mr-2 text-gray-500" />
              Message
            </div>
          </label>
          <div className="relative">
            <textarea
              placeholder="Type your message here..."
              value={messageText}
              onChange={handleMessageChange}
              rows={5}
              maxLength={1000}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200 resize-none"
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {charCount}/1000
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Maximum 1000 characters
            </p>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => {
                  const templates = [
                    "Hello! This is a reminder for your appointment tomorrow at 10 AM.",
                    "Thank you for your order! Your tracking number is: #12345",
                    "Welcome to our service! We're excited to have you onboard."
                  ];
                  setMessageText(templates[Math.floor(Math.random() * templates.length)]);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                Try template
              </button>
            </div>
          </div>
        </div>

        {/* Send Button */}
        <div className="pt-4">
          <button
            onClick={handleSend}
            disabled={loading || !phoneNumber || !messageText}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin w-5 h-5 mr-2" />
                Sending Message...
              </>
            ) : (
              <>
                <FiSend className="w-5 h-5 mr-2" />
                Send Message
              </>
            )}
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              💡 Important Notes
            </h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Ensure the phone number includes country code</li>
              <li>• Messages are sent via WhatsApp Business API</li>
              <li>• Delivery reports will be available in logs</li>
              <li>• Standard messaging rates may apply</li>
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPhoneNumber("")}
            className="py-2 px-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            Clear Number
          </button>
          <button
            type="button"
            onClick={() => setMessageText("")}
            className="py-2 px-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            Clear Message
          </button>
           {role === "admin" && (
  <button
    type="button"
    onClick={() => setShowInvite(true)}
    className="py-2 px-3 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
  >
    Send Invite
  </button>
)}
<button
  onClick={() => setShowUsers(true)}
  className="bg-blue-500 text-white px-4 py-2 rounded"
>
  Users
</button>



        </div>
      </div>
    </div>
  );
};

export default SendMessage;