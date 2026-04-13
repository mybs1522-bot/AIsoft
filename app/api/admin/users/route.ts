import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllUsers, TRIAL_GENERATION_LIMIT } from "@/lib/usage";
import { verifyToken } from "@/app/api/adminrob/auth/route";

export async function GET(request: Request) {
  // Accept either the session cookie (adminrob dashboard) or a Bearer secret
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("adminrob_session")?.value ?? "";
  const sessionValid = verifyToken(sessionToken);

  const secret = process.env.ADMIN_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  const provided = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const bearerValid = secret ? provided === secret : false;

  if (!sessionValid && !bearerValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await getAllUsers();

  const totalRenders = users.reduce((sum, u) => sum + u.count, 0);
  const trialUsers = users.filter((u) => u.count < TRIAL_GENERATION_LIMIT).length;
  const exhaustedUsers = users.filter(
    (u) => u.count >= TRIAL_GENERATION_LIMIT
  ).length;

  return NextResponse.json({
    stats: {
      totalUsers: users.length,
      totalRenders,
      trialUsers,
      exhaustedUsers,
      trialLimit: TRIAL_GENERATION_LIMIT,
    },
    users,
  });
}
