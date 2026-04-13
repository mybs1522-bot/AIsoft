import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/api/adminrob/auth/route";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminrob_session")?.value ?? "";
  return NextResponse.json({ valid: verifyToken(token) });
}
