import { OAuth2Client } from "google-auth-library";
import { config } from "../config/env.js";

export async function exchangeCodeForProfile({ code, redirectUri, codeVerifier }) {
  const oauth2Client = new OAuth2Client(config.googleClientId, config.googleClientSecret, redirectUri);

  const tokenResponse = await oauth2Client.getToken({ code, codeVerifier });
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
}