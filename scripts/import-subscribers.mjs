import "dotenv/config";
import { readFileSync } from "fs";
import { getSupabase } from "../server/supabase.mjs";
import { syncSubscriberToBrevo, isBrevoConfigured } from "../server/brevo.mjs";

const PREFERENCES = new Set(["email", "text", "both"]);

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    return row;
  });
}

function normalizeRow(row) {
  const first_name = row.first_name?.trim();
  const email = row.email?.trim().toLowerCase() || null;
  const phone = row.phone?.trim() || null;
  const preferences = row.preferences?.trim().toLowerCase();

  if (!first_name || !PREFERENCES.has(preferences)) return null;
  if (!email && !phone) return null;

  return { first_name, email, phone, preferences, source: "import" };
}

async function upsertSubscriber(subscriber) {
  const supabase = getSupabase();

  let existing = null;
  if (subscriber.email) {
    const { data } = await supabase
      .from("subscribers")
      .select("id")
      .ilike("email", subscriber.email)
      .maybeSingle();
    existing = data;
  }
  if (!existing && subscriber.phone) {
    const { data } = await supabase
      .from("subscribers")
      .select("id")
      .eq("phone", subscriber.phone)
      .maybeSingle();
    existing = data;
  }

  if (existing) {
    const { data, error } = await supabase
      .from("subscribers")
      .update(subscriber)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  const { data, error } = await supabase
    .from("subscribers")
    .insert(subscriber)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: npm run import-subscribers -- path/to/contacts.csv");
    process.exit(1);
  }

  const rows = parseCsv(readFileSync(csvPath, "utf8"));
  let imported = 0;
  let skipped = 0;
  let brevoSynced = 0;

  for (const row of rows) {
    const subscriber = normalizeRow(row);
    if (!subscriber) {
      skipped++;
      continue;
    }

    const saved = await upsertSubscriber(subscriber);
    imported++;

    if (isBrevoConfigured()) {
      try {
        const { contactId } = await syncSubscriberToBrevo(saved);
        await getSupabase()
          .from("subscribers")
          .update({
            brevo_contact_id: contactId,
            brevo_synced_at: new Date().toISOString(),
            brevo_sync_error: null,
          })
          .eq("id", saved.id);
        brevoSynced++;
      } catch (error) {
        console.error(`Brevo sync failed for ${saved.first_name}:`, error.message);
        await getSupabase()
          .from("subscribers")
          .update({ brevo_sync_error: error.message })
          .eq("id", saved.id);
      }
    }
  }

  console.log(`Imported ${imported} subscribers (${skipped} skipped).`);
  if (isBrevoConfigured()) {
    console.log(`Synced ${brevoSynced} contacts to Brevo.`);
  } else {
    console.log("Brevo not configured — skipped Brevo sync.");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
