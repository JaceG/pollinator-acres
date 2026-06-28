import { createClient } from "@supabase/supabase-js";

let client;

function resolveServiceRoleKey() {
  const candidates = [
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.SUPABASE_SECRET_KEY,
    process.env.SUPABASE_PROJECT_SECRET_KEY,
  ].filter((value) => value && value !== "...");

  for (const key of candidates) {
    if (key.startsWith("sb_publishable_")) {
      continue;
    }
    if (key.startsWith("eyJ") || key.startsWith("sb_secret_")) {
      return key;
    }
  }

  return null;
}

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = resolveServiceRoleKey();

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and a secret API key (SUPABASE_SERVICE_ROLE_KEY) must be configured",
    );
  }

  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return client;
}

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && resolveServiceRoleKey());
}
