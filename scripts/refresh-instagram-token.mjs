import "dotenv/config";
import {
  refreshAccessToken,
  persistTokenToRender,
} from "../server/instagram-token.mjs";

async function main() {
  const { accessToken, expiresIn } = await refreshAccessToken();
  const days = expiresIn ? Math.round(expiresIn / 86400) : "unknown";

  console.log(`Instagram token refreshed (expires in ~${days} days)`);

  const persisted = await persistTokenToRender(accessToken);
  if (persisted) {
    console.log("Render service env var updated — web service will redeploy with the new token");
  } else {
    console.log("Set RENDER_API_KEY and RENDER_SERVICE_ID to persist the token across deploys");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
