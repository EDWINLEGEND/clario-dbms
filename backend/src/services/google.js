import { OAuth2Client } from "google-auth-library";
import { config } from "../config/env.js";

export async function exchangeCodeForProfile({ code, redirectUri, codeVerifier }) {
  console.log('🔍 Google OAuth Debug:', { code: code?.substring(0, 20) + '...', redirectUri, codeVerifier });
  
  // For auth-code flow, we need to use the exact same redirect_uri that was used in the initial request
  // The redirect_uri here should match what's configured in Google Console
  const oauth2Client = new OAuth2Client(
    config.googleClientId, 
    config.googleClientSecret, 
    redirectUri // This must match the redirect_uri used in the frontend
  );

  try {
    console.log('🔍 Attempting token exchange with redirect_uri:', redirectUri);
    const tokenResponse = await oauth2Client.getToken({ 
      code, 
      codeVerifier,
      redirect_uri: redirectUri // Explicitly pass redirect_uri to getToken
    });
    const idToken = tokenResponse.tokens.id_token;
  if (!idToken) {
      throw new Error("Missing id_token in Google response");
    }

    const ticket = await oauth2Client.verifyIdToken({ idToken, audience: config.googleClientId });
    const payload = ticket.getPayload();
    // payload contains: sub (Google user id), email, name, picture, email_verified
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified,
    };
  } catch (error) {
    console.error('❌ Google OAuth Error:', error.message);
    throw error;
  }
}