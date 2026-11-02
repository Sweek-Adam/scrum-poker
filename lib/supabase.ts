import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(url && anonKey);

/**
 * Realtime-only client: the app keeps no rows, it uses Presence for the
 * participants and Broadcast for the room state. No table, no RLS policy.
 */
export const supabase = createClient(url ?? "http://localhost", anonKey ?? "public-anon-key", {
  auth: { persistSession: false },
  realtime: { params: { eventsPerSecond: 20 } },
});
