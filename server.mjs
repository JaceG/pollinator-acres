import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { instagramApiMiddleware, clearInstagramCache } from "./server/instagram.mjs";
import { refreshAccessToken, persistTokenToRender } from "./server/instagram-token.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT) || 3000;

app.get("/api/instagram", instagramApiMiddleware);

app.post("/api/instagram/refresh-token", async (req, res) => {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!cronSecret || token !== cronSecret) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { accessToken, expiresIn } = await refreshAccessToken();
    clearInstagramCache();
    const persisted = await persistTokenToRender(accessToken);

    res.json({
      ok: true,
      expiresIn,
      persistedToRender: persisted,
    });
  } catch (error) {
    console.error("Token refresh error:", error.message);
    res.status(500).json({ error: "Failed to refresh Instagram token" });
  }
});

app.use(express.static(path.join(__dirname, "dist")));

app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
