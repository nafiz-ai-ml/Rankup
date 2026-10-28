import crypto from "crypto";

/**
 * Verifies Paddle Billing webhook signature using HMAC-SHA256
 * Format: Paddle-Signature: ts=1672531199;h1=abcdef12345...
 */
export function verifyPaddleWebhook(
  rawBody: string,
  signatureHeader: string,
  webhookSecretKey: string
): boolean {
  try {
    if (!signatureHeader || !webhookSecretKey) {
      return false;
    }

    // Parse ts and h1 components
    const parts = signatureHeader.split(";");
    const tsPart = parts.find((p) => p.trim().startsWith("ts="));
    const h1Part = parts.find((p) => p.trim().startsWith("h1="));

    if (!tsPart || !h1Part) {
      return false;
    }

    const timestamp = tsPart.split("=")[1].trim();
    const signature = h1Part.split("=")[1].trim();

    // Prevent replay attacks (allow up to 5 minutes clock drift)
    const currentTime = Math.floor(Date.now() / 1000);
    const parsedTs = parseInt(timestamp, 10);
    if (isNaN(parsedTs) || Math.abs(currentTime - parsedTs) > 300) {
      return false;
    }

    // Recreate signed payload: timestamp:rawBody
    const signedPayload = `${timestamp}:${rawBody}`;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecretKey)
      .update(signedPayload)
      .digest("hex");

    // Timing-safe comparison to prevent side-channel timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch (err) {
    console.error("Paddle webhook signature verification error:", err);
    return false;
  }
}
