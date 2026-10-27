import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();
export async function verifyGoogleCredential(credential: string) {
  const audience = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!audience) throw new Error("GOOGLE_NOT_CONFIGURED");
  const ticket = await client.verifyIdToken({ idToken: credential, audience });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email || !payload.email_verified)
    throw new Error("Unverified Google account");
  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name ?? payload.email.split("@")[0],
    authoritative: payload.email.endsWith("@gmail.com") || Boolean(payload.hd),
  };
}
