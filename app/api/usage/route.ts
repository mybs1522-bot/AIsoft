import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGenerationCount, TRIAL_GENERATION_LIMIT } from "@/lib/usage";
import { getGuestId, guestUsageKey } from "@/lib/guest-trial";

export async function GET() {
  const session = await getServerSession(authOptions);
  const usageKey = session?.user?.email
    ? session.user.email
    : guestUsageKey(await getGuestId());
  const count = await getGenerationCount(usageKey);
  return NextResponse.json({ count, limit: TRIAL_GENERATION_LIMIT });
}
