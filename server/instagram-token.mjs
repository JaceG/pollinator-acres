const REFRESH_URL = "https://graph.instagram.com/refresh_access_token";

let tokenExpiresAt = 0;

export function getAccessToken() {
  return process.env.INSTAGRAM_ACCESS_TOKEN ?? "";
}

export function setAccessToken(token, expiresInSeconds) {
  process.env.INSTAGRAM_ACCESS_TOKEN = token;
  if (expiresInSeconds) {
    tokenExpiresAt = Date.now() + expiresInSeconds * 1000;
  }
}

export function isTokenNearExpiry() {
  if (!tokenExpiresAt) return false;
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() > tokenExpiresAt - sevenDaysMs;
}

export async function refreshAccessToken(currentToken = getAccessToken()) {
  if (!currentToken) {
    throw new Error("INSTAGRAM_ACCESS_TOKEN is not configured");
  }

  const url = `${REFRESH_URL}?grant_type=ig_refresh_token&access_token=${encodeURIComponent(currentToken)}`;
  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Instagram token refresh failed (${response.status}): ${body}`);
  }

  const payload = await response.json();
  if (!payload.access_token) {
    throw new Error("Instagram token refresh response did not include access_token");
  }

  setAccessToken(payload.access_token, payload.expires_in);
  return {
    accessToken: payload.access_token,
    expiresIn: payload.expires_in ?? null,
  };
}

export async function ensureFreshAccessToken() {
  if (!isTokenNearExpiry()) {
    return getAccessToken();
  }

  await refreshAccessToken();
  return getAccessToken();
}

export async function persistTokenToRender(accessToken) {
  const apiKey = process.env.RENDER_API_KEY;
  const serviceIds = [
    process.env.RENDER_SERVICE_ID,
    process.env.RENDER_CRON_SERVICE_ID,
  ].filter(Boolean);

  if (!apiKey || serviceIds.length === 0) {
    console.warn("RENDER_API_KEY or service IDs not set — skipping Render env update");
    return false;
  }

  for (const serviceId of serviceIds) {
    const response = await fetch(
      `https://api.render.com/v1/services/${serviceId}/env-vars/INSTAGRAM_ACCESS_TOKEN`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: accessToken }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Render env update failed for ${serviceId} (${response.status}): ${body}`);
    }
  }

  const webServiceId = process.env.RENDER_SERVICE_ID;
  if (webServiceId) {
    const deployResponse = await fetch(
      `https://api.render.com/v1/services/${webServiceId}/deploys`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    if (!deployResponse.ok) {
      const body = await deployResponse.text();
      console.warn(`Render deploy trigger failed (${deployResponse.status}): ${body}`);
    }
  }

  return true;
}
