import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "rankup_admin_session";

export function getExpectedAdminToken(): string {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) return "";
  return crypto.createHash("sha256").update(secret + "_rankup_session_salt_2026").digest("hex");
}

export function verifyAdminSession(token: string | undefined | null): boolean {
  if (!token) return false;
  const expected = getExpectedAdminToken();
  if (!expected) return false;
  return token === expected;
}

export function validateAdminPassword(password: string): boolean {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) return false;
  return password === secret;
}
