// 📂 client/src/pages/OAuthCallback.jsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";

const OAuthCallback = () => {
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { googleLogin } = useAuthStore();

  useEffect(() => {
    const handleAuth = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        console.error("OAuth Error:", error);
        navigate("/login");
        return;
      }

      if (code) {
        const codeVerifier = sessionStorage.getItem("code_verifier");
        try {
          const result = await googleLogin({ code, codeVerifier, redirectUri });
          navigate(result? "/" : "/login");
        } catch (err) {
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    handleAuth(); 
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex gap-2">
        <Loader2 className="animate-spin" />
        <span>Logging in</span>
      </div>
    </div>
  );
};

export default OAuthCallback;
