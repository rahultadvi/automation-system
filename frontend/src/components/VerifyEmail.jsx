import { useEffect, useRef } from "react";
import axios from "axios";

const VerifyEmail = () => {
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const verify = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        alert("Invalid verification link");
        return;
      }

      try {
        await axios.get(
  `https://automation-system-f5p2.onrender.com/api/auth/verify-email?token=${token}`,
  { withCredentials: true }
);  

        alert("Email verified successfully");
        window.location.href = "/login";

      } catch (error) {
        alert(error.response?.data?.message || "Verification failed");
      }
    };

    verify();
  }, []);

  return <h2>Verifying Email...</h2>;
};

export default VerifyEmail;
