export const generatePKCE = async () => {
  // Generate secure random string for code verifier
  const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomValues = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(randomValues)
      .map((byte) => possible[byte % possible.length])
      .join('');
  };

  const codeVerifier = generateRandomString(64);
  
  // Generate code challenge
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to base64 URL-safe string
  const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)));
  const codeChallenge = base64Digest
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Remove any trailing '=' characters
    
  return {
    codeVerifier,
    codeChallenge
  };
};