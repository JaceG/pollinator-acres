const BREVO_API = "https://api.brevo.com/v3";

export function isBrevoConfigured() {
  return Boolean(process.env.BREVO_API_KEY);
}

function brevoListIds() {
  const raw = process.env.BREVO_LIST_ID ?? "";
  return raw
    .split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);
}

function extIdForSubscriber({ email, phone }) {
  if (email) return `email:${email}`;
  return `phone:${phone}`;
}

/**
 * Create or update a contact in Brevo so non-technical operators can manage
 * the list from the Brevo dashboard.
 */
export async function syncSubscriberToBrevo(subscriber) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured");
  }

  const attributes = {
    FIRSTNAME: subscriber.first_name,
    PREFERENCES: subscriber.preferences,
  };

  if (subscriber.phone) {
    attributes.SMS = subscriber.phone;
  }

  const body = {
    attributes,
    updateEnabled: true,
    ext_id: extIdForSubscriber(subscriber),
  };

  if (subscriber.email) {
    body.email = subscriber.email;
  }

  const listIds = brevoListIds();
  if (listIds.length > 0) {
    body.listIds = listIds;
  }

  const response = await fetch(`${BREVO_API}/contacts`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const payload = await response.json();
    return { contactId: payload.id ?? null };
  }

  const errorBody = await response.text();

  // Brevo returns duplicate contact errors when updateEnabled misses edge cases.
  if (response.status === 400 && errorBody.includes("duplicate")) {
    const identifier = subscriber.email
      ? `email/${encodeURIComponent(subscriber.email)}`
      : `ext_id/${encodeURIComponent(body.ext_id)}`;

    const updateResponse = await fetch(`${BREVO_API}/contacts/${identifier}`, {
      method: "PUT",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        attributes,
        listIds: listIds.length > 0 ? listIds : undefined,
      }),
    });

    if (!updateResponse.ok) {
      throw new Error(`Brevo update failed (${updateResponse.status}): ${await updateResponse.text()}`);
    }

    return { contactId: null };
  }

  throw new Error(`Brevo sync failed (${response.status}): ${errorBody}`);
}
