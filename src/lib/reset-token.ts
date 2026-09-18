import { createHmac, timingSafeEqual } from "node:crypto";

function secret() {
  return process.env.PASSWORD_RESET_SECRET || process.env.RESEND_API_KEY || (process.env.NODE_ENV !== "production" ? "ranz-dev-reset" : "");
}

export function signResetToken(email: string) {
  const key = secret();
  if (!key) throw new Error("RESEND_API_KEY tanımlı değil.");
  const payload = Buffer.from(
    JSON.stringify({ e: email.trim().toLowerCase(), x: Date.now() + 2 * 60 * 60 * 1000 }),
  );
  const sig = createHmac("sha256", key).update(payload).digest();
  return `${payload.toString("base64url")}.${sig.toString("base64url")}`;
}

export function verifyResetToken(token: string): { email: string } | null {
  const key = secret();
  if (!key) return null;
  const [payloadPart, sigPart] = token.split(".");
  if (!payloadPart || !sigPart) return null;
  try {
    const payload = Buffer.from(payloadPart, "base64url");
    const expected = createHmac("sha256", key).update(payload).digest();
    const given = Buffer.from(sigPart, "base64url");
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
    const data = JSON.parse(payload.toString()) as { e?: string; x?: number };
    if (!data.e || typeof data.x !== "number" || data.x < Date.now()) return null;
    return { email: data.e };
  } catch {
    return null;
  }
}
