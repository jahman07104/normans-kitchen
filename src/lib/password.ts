import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

function normalize(input: string): string {
  return input.trim();
}

export function hashPassword(password: string): string {
  const clean = normalize(password);
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(clean, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const clean = normalize(password);
  const [salt, expectedHex] = stored.split(":");

  if (!salt || !expectedHex) {
    return false;
  }

  const expected = Buffer.from(expectedHex, "hex");
  const actual = scryptSync(clean, salt, 64);

  if (expected.length !== actual.length) {
    return false;
  }

  return timingSafeEqual(expected, actual);
}
