import { syncSubscriberToBrevo, isBrevoConfigured } from "./brevo.mjs";
import { getSupabase, isSupabaseConfigured } from "./supabase.mjs";

const PREFERENCES = new Set(["email", "text", "both"]);

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function normalizeEmail(value) {
  const email = value?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }
  return email;
}

function normalizePhone(value) {
  if (!value) return null;

  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (trimmed.startsWith("+") && digits.length >= 10) return `+${digits}`;

  return null;
}

const MIN_FILL_TIME_MS = 2500;

/**
 * Cheap bot filter. Real visitors never fill the hidden "website" field and
 * take more than a couple of seconds to fill in the form. Bots that trip this
 * get a fake success so they don't learn what to change.
 */
function looksLikeBot(body) {
  if (typeof body?.website === "string" && body.website.trim() !== "") return true;
  const elapsed = Number(body?.elapsedMs);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_TIME_MS) return true;
  return false;
}

function parseSignupBody(body) {
  const firstName = body?.firstName?.trim();
  const preferences = body?.preferences;
  const email = body?.email ? normalizeEmail(body.email) : null;
  const phone = body?.phone ? normalizePhone(body.phone) : null;

  if (!firstName) {
    return { error: "First name is required." };
  }

  if (!PREFERENCES.has(preferences)) {
    return { error: "Invalid notification preference." };
  }

  if ((preferences === "email" || preferences === "both") && !email) {
    return { error: "A valid email address is required." };
  }

  if ((preferences === "text" || preferences === "both") && !phone) {
    return { error: "A valid phone number is required." };
  }

  if (!email && !phone) {
    return { error: "Email or phone is required." };
  }

  return {
    subscriber: {
      first_name: firstName,
      email,
      phone,
      preferences,
      source: "website",
    },
  };
}

async function findExistingSubscriber(supabase, { email, phone }) {
  if (email) {
    const { data } = await supabase
      .from("subscribers")
      .select("id")
      .ilike("email", email)
      .maybeSingle();
    if (data) return data;
  }

  if (phone) {
    const { data } = await supabase
      .from("subscribers")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();
    if (data) return data;
  }

  return null;
}

async function saveSubscriber(subscriber) {
  const supabase = getSupabase();
  const existing = await findExistingSubscriber(supabase, subscriber);

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

async function markBrevoSync(subscriberId, { contactId, error }) {
  const supabase = getSupabase();
  const patch = contactId
    ? {
        brevo_contact_id: contactId,
        brevo_synced_at: new Date().toISOString(),
        brevo_sync_error: null,
      }
    : {
        brevo_sync_error: error ?? "Unknown Brevo sync error",
      };

  await supabase.from("subscribers").update(patch).eq("id", subscriberId);
}

export async function handleSignup(req, res) {
  if (!isSupabaseConfigured()) {
    sendJson(res, 503, { error: "Signup is not configured yet." });
    return;
  }

  let body = req.body;
  if (!body || typeof body !== "object") {
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      sendJson(res, 400, { error: "Invalid JSON body." });
      return;
    }
  }

  if (looksLikeBot(body)) {
    console.warn("Signup rejected as likely bot");
    sendJson(res, 200, { ok: true });
    return;
  }

  const parsed = parseSignupBody(body);
  if (parsed.error) {
    sendJson(res, 400, { error: parsed.error });
    return;
  }

  try {
    const saved = await saveSubscriber(parsed.subscriber);

    if (isBrevoConfigured()) {
      try {
        const { contactId } = await syncSubscriberToBrevo(saved);
        await markBrevoSync(saved.id, { contactId });
      } catch (error) {
        console.error("Brevo sync error:", error.message);
        await markBrevoSync(saved.id, { error: error.message });
      }
    }

    sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error("Signup error:", error.message);
    sendJson(res, 500, { error: "Unable to save signup. Please try again." });
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 32_000) {
        reject(new Error("Body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

/** Express middleware */
export function signupExpressHandler(req, res) {
  handleSignup(req, res);
}

/** Vite dev server middleware (Node HTTP, no Express body parser) */
export function signupApiMiddleware(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end("Method Not Allowed");
    return;
  }

  handleSignup(req, res);
}
