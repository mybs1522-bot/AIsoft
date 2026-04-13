import { getSupabaseAdmin } from "@/lib/supabase";

export const TRIAL_GENERATION_LIMIT = 3;

export interface UserRecord {
  count: number;
  signedUpAt: string;
  lastActiveAt: string;
}

export async function getGenerationCount(email: string): Promise<number> {
  const { data } = await getSupabaseAdmin()
    .from("user_usage")
    .select("count")
    .eq("email", email)
    .single();

  if (!data) {
    // First time we see this user — insert with count 0
    await getSupabaseAdmin().from("user_usage").upsert({
      email,
      count: 0,
      signed_up_at: new Date().toISOString(),
      last_active_at: new Date().toISOString(),
    });
    return 0;
  }

  return (data as { count: number }).count;
}

export async function incrementGenerationCount(email: string): Promise<number> {
  const current = await getGenerationCount(email);
  const next = current + 1;

  await getSupabaseAdmin().from("user_usage").upsert({
    email,
    count: next,
    last_active_at: new Date().toISOString(),
  });

  return next;
}

export async function getAllUsers(): Promise<
  Array<{ email: string } & UserRecord>
> {
  const { data } = await getSupabaseAdmin()
    .from("user_usage")
    .select("*")
    .order("signed_up_at", { ascending: false });

  return (data ?? []).map(
    (row: {
      email: string;
      count: number;
      signed_up_at: string;
      last_active_at: string;
    }) => ({
      email: row.email,
      count: row.count,
      signedUpAt: row.signed_up_at,
      lastActiveAt: row.last_active_at,
    })
  );
}
