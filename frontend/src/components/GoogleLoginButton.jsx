import React from "react";
import { Button } from "./ui/button";
import { generatePKCE } from "@/lib/auth";

const GoogleLoginButton = ({ className }) => {
  const handleGoogleLogin = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI);
    const scope = encodeURIComponent("openid profile email");
    
    try {
      // Generate PKCE code verifier and challenge
      const { codeVerifier, codeChallenge } = await generatePKCE();
      
      // Store the verifier in session storage
      sessionStorage.setItem("code_verifier", codeVerifier);
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `response_type=code&` +
        `scope=${scope}&` +
        `code_challenge=${codeChallenge}&` +
        `code_challenge_method=S256&` +
        `access_type=offline&` +
        `prompt=consent`;
      
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error generating PKCE:", error);
      // Handle error appropriately
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleLogin}
      className={`w-full ${className}`}
    >
      {/* Google icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
      >
        <path
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          fill="currentColor"
        />
      </svg>
      <span>Login with Google</span>
    </Button>
  );
};

export default GoogleLoginButton;