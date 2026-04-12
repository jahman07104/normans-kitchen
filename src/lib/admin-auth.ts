import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "nk_admin_session";

function readEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`${name} is required for admin authentication.`);
  }
  return value.trim();
}

export function getAdminPassword(): string {
  return readEnv("ADMIN_PASSWORD");
}

function getSessionSecret(): string {
  return readEnv("ADMIN_SESSION_SECRET");
}

function sessionSignature(): string {
  const secret = getSessionSecret();
  return createHmac("sha256", secret).update("normans-kitchen-admin").digest("hex");
}

export function createAdminSessionValue(): string {
  return sessionSignature();
}

export function isValidAdminSessionValue(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  const expected = Buffer.from(sessionSignature());
  const received = Buffer.from(value);

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}
