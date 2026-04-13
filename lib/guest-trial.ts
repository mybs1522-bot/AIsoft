import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "guest_session";
const COOKIE_TTL = 60 * 60 * 24 * 30; // 30 days

/** Returns a stable guest ID from the request cookie, creating one if needed. */
export async function getGuestId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;
  if (existing && /^[0-9a-f-]{36}$/.test(existing)) return existing;
  return crypto.randomUUID();
}

/** Attaches the guest session cookie to a NextResponse. */
export function attachGuestCookie(res: NextResponse, guestId: string): void {
  res.cookies.set(COOKIE_NAME, guestId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_TTL,
    secure: process.env.NODE_ENV === "production",
  });
}

/** The usage key used in Supabase for a guest session. */
export function guestUsageKey(guestId: string): string {
  return `guest:${guestId}`;
}
