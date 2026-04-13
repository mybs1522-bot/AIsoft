import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Browser / public client — safe to use in client components */
export const supabase = createClient(url, anon);

/** Server-side admin client — never expose to browser */
export const supabaseAdmin = createClient(url, serviceRole ?? anon, {
  auth: { persistSession: false },
});
