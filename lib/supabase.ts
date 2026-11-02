import { createClient } from "@supabase/supabase-js";

/**
 * The dashboard offers the project URL in several shapes: the bare origin, but also
 * the REST endpoint (`.../rest/v1`) that the "Connect" dialog shows. Only the origin
 * is usable here — keeping a path would send Realtime to `/rest/v1/realtime/v1/...`
 * and the socket would be rejected. So reduce whatever was pasted to its origin.
 */
function normalizeUrl(raw: string | undefined): string | undefined {
  const trimmed = raw?.trim().replace(/^["']|["']$/g, "");
  if (!trimmed) return undefined;
  try {
    return new URL(trimmed).origin;
  } catch {
    return undefined;
  }
}

const url = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/^["']|["']$/g, "");

export const isConfigured = Boolean(url && anonKey);

/**
 * Realtime-only client: the app keeps no rows, it uses Presence for the
 * participants and Broadcast for the room state. No table, no RLS policy.
 */
export const supabase = createClient(url ?? "http://localhost", anonKey ?? "public-anon-key", {
  auth: { persistSession: false },
  realtime: { params: { eventsPerSecond: 20 } },
});
