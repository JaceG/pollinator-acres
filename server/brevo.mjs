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
    // Brevo returns 201 + {id} for a new contact, but 204 with an empty body
    // when updateEnabled updates an existing contact.
    const text = await response.text();
    if (!text) return { contactId: null };
    try {
      const payload = JSON.parse(text);
      return { contactId: payload.id ?? null };
    } catch {
      return { contactId: null };
    }
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

/**
 * Email the farm when someone new signs up, so nobody has to watch the
 * Brevo dashboard. Recipient comes from SIGNUP_NOTIFY_EMAIL; sender must be a
 * verified Brevo sender (SIGNUP_NOTIFY_FROM, defaults to the recipient).
 */
export async function notifyNewSignup(subscriber) {
  const to = process.env.SIGNUP_NOTIFY_EMAIL;
  const apiKey = process.env.BREVO_API_KEY;
  if (!to || !apiKey) return;

  const from = process.env.SIGNUP_NOTIFY_FROM || to;
  const lines = [
    `Name: ${subscriber.first_name}`,
    `Email: ${subscriber.email ?? "—"}`,
    `Phone: ${subscriber.phone ?? "—"}`,
    `Wants: ${subscriber.preferences}`,
  ];

  const response = await fetch(`${BREVO_API}/smtp/email`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Pollinator Acres Website", email: from },
      to: [{ email: to }],
      subject: `New signup: ${subscriber.first_name}`,
      textContent: lines.join("\n"),
    }),
  });

  if (!response.ok) {
    throw new Error(`Brevo notify failed (${response.status}): ${await response.text()}`);
  }
}
