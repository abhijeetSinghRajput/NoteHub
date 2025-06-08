// 📂 client/src/pages/OAuthCallback.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { googleLogin } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1)); // Get token from URL fragment
    const token = params.get("access_token");

    if (token) {
      console.log("OAuth Token:", token);
      googleLogin({ token }); // ✅ Authenticate user
      navigate("/dashboard"); // Redirect after login
    } else {
      console.error("OAuth Login Failed");
      navigate("/login");
    }
  }, []);

  return <div>Authenticating...</div>;
};

export default OAuthCallback;
