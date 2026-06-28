import "dotenv/config";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationPath = join(__dirname, "../supabase/migrations/001_subscribers.sql");
const projectRef = "ttbxfxzneiiezntggvis";

async function runViaManagementApi(accessToken) {
  const sql = readFileSync(migrationPath, "utf8");
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Management API failed (${response.status}): ${body}`);
  }

  return response.json();
}

async function runViaPostgres(connectionString) {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    await client.query(readFileSync(migrationPath, "utf8"));
  } finally {
    await client.end();
  }
}

async function verifyViaManagementApi(accessToken) {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query:
          "select count(*)::int as column_count from information_schema.columns where table_schema = 'public' and table_name = 'subscribers';",
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Verification query failed (${response.status}): ${body}`);
  }

  const rows = await response.json();
  const columnCount = rows?.[0]?.column_count ?? 0;
  if (columnCount < 10) {
    throw new Error(`Expected subscribers table columns, found ${columnCount}.`);
  }
}

async function verifySetup(accessToken) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasServiceRole = key && key !== "..." && key.length > 20;

  if (hasServiceRole && url) {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from("subscribers").select("id").limit(1);
    if (!error) return;
    console.warn(`Service role verification failed (${error.message}); trying Management API...`);
  }

  if (accessToken) {
    await verifyViaManagementApi(accessToken);
    return;
  }

  throw new Error(
    "Could not verify setup. Add SUPABASE_SERVICE_ROLE_KEY or keep SUPABASE_ACCESS_TOKEN in .env.",
  );
}

async function main() {
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  const dbUrl = process.env.SUPABASE_DB_URL;

  if (accessToken) {
    console.log("Running migration via Supabase Management API...");
    await runViaManagementApi(accessToken);
  } else if (dbUrl) {
    console.log("Running migration via direct Postgres connection...");
    await runViaPostgres(dbUrl);
  } else {
    console.error(
      [
        "No migration credentials found.",
        "Add one of these to .env:",
        "  SUPABASE_ACCESS_TOKEN  (from https://supabase.com/dashboard/account/tokens)",
        "  SUPABASE_DB_URL        (Database settings → Connection string → URI)",
      ].join("\n"),
    );
    process.exit(1);
  }

  console.log("Migration applied.");
  await verifySetup(accessToken);
  console.log("Verified: public.subscribers table is accessible.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
