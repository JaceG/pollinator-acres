import { getSupabase, isSupabaseConfigured } from "./supabase.mjs";

/**
 * Lightweight health check that also touches the Supabase database.
 *
 * Supabase pauses free-tier projects after ~7 days without activity, which
 * takes the signup form down with it. A scheduled request to this endpoint
 * (see .github/workflows/supabase-keepalive.yml) keeps the project awake.
 */
export async function handleHealth(_req, res) {
  const result = { ok: true, supabase: "not-configured", time: new Date().toISOString() };

  if (isSupabaseConfigured()) {
    try {
      const { error } = await getSupabase()
        .from("subscribers")
        .select("id", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      result.supabase = "ok";
    } catch (error) {
      console.error("Health check: Supabase error:", error.message);
      result.ok = false;
      result.supabase = "error";
    }
  }

  res.statusCode = result.ok ? 200 : 503;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(result));
}
