import {
  ensureFreshAccessToken,
  getAccessToken,
  refreshAccessToken,
} from "./instagram-token.mjs";

const CACHE_TTL_MS = 30 * 60 * 1000;
const POST_LIMIT = 12;

let cache = { posts: null, expiresAt: 0 };

export function clearInstagramCache() {
  cache = { posts: null, expiresAt: 0 };
}

function imageUrlForPost(post) {
  if (post.media_type === "VIDEO") return post.thumbnail_url;
  return post.media_url;
}

async function requestInstagramPosts(token) {
  const fields = [
    "id",
    "caption",
    "media_url",
    "thumbnail_url",
    "permalink",
    "timestamp",
    "like_count",
    "comments_count",
    "media_type",
  ].join(",");

  const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${POST_LIMIT}&access_token=${encodeURIComponent(token)}`;
  return fetch(url);
}

export async function fetchInstagramPosts() {
  if (!getAccessToken()) {
    throw new Error("INSTAGRAM_ACCESS_TOKEN is not configured");
  }

  const now = Date.now();
  if (cache.posts && now < cache.expiresAt) {
    return cache.posts;
  }

  await ensureFreshAccessToken();
  let token = getAccessToken();
  let response = await requestInstagramPosts(token);

  if (response.status === 401 || response.status === 400) {
    await refreshAccessToken(token);
    clearInstagramCache();
    token = getAccessToken();
    response = await requestInstagramPosts(token);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Instagram API error (${response.status}): ${body}`);
  }

  const payload = await response.json();
  const posts = (payload.data ?? [])
    .map((post) => {
      const src = imageUrlForPost(post);
      if (!src) return null;

      const caption = post.caption ?? "";
      return {
        id: post.id,
        src,
        alt: caption.slice(0, 120) || "Instagram post from Pollinator Acres",
        caption,
        likes: post.like_count ?? 0,
        comments: post.comments_count ?? 0,
        permalink: post.permalink,
      };
    })
    .filter(Boolean);

  cache = { posts, expiresAt: now + CACHE_TTL_MS };
  return posts;
}

export function instagramApiMiddleware(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  fetchInstagramPosts()
    .then((posts) => {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "public, max-age=300");
      res.end(JSON.stringify({ posts }));
    })
    .catch((error) => {
      console.error("Instagram feed error:", error.message);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Failed to fetch Instagram posts" }));
    });
}
