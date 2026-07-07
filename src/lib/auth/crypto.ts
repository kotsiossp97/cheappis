import crypto from "crypto";

export function generateVerificationCode() {
  return crypto
    .randomBytes(18) // 18 bytes → 24 chars after Base64
    .toString("base64")
    .replace(/\+/g, "-") // URL-safe
    .replace(/\//g, "_") // URL-safe
    .replace(/=/g, ""); // remove padding
}
