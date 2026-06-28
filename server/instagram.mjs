import {
  ensureFreshAccessToken,
  getAccessToken,
  refreshAccessToken,
} from "./instagram-token.mjs";

const CACHE_TTL_MS = 30 * 60 * 1000;
const POST_LIMIT = 12;
const MEDIA_FETCH_LIMIT = 25;
const MAX_MEDIA_PAGES = 4;
const FRESHCUT_HASHTAG = "freshcut";
const FRESHEGGS_HASHTAG = "fresheggs";
const FLOCK_HASHTAG = "flock";

let cache = { posts: null, freshcut: null, fresheggs: null, flock: null, expiresAt: 0 };

export function clearInstagramCache() {
  cache = { posts: null, freshcut: null, fresheggs: null, flock: null, expiresAt: 0 };
}

function captionHasHashtag(caption, tag) {
  const normalized = tag.toLowerCase().replace(/^#/, "");
  return new RegExp(`#${normalized}\\b`, "i").test(caption ?? "");
}

function mapRawPost(post) {
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
    timestamp: post.timestamp ?? null,
  };
}

function findLatestHashtagPost(posts, hashtag) {
  return posts
    .filter((post) => captionHasHashtag(post.caption, hashtag))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] ?? null;
}

function toFeaturedImage(post) {
  return post ? { src: post.src, alt: post.alt } : null;
}

function imageUrlForPost(post) {
  if (post.media_type === "VIDEO") return post.thumbnail_url;
  return post.media_url;
}

async function requestInstagramMedia(token, { limit = MEDIA_FETCH_LIMIT, after } = {}) {
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

  const params = new URLSearchParams({
    fields,
    limit: String(limit),
    access_token: token,
  });
  if (after) params.set("after", after);

  const url = `https://graph.instagram.com/me/media?${params}`;
  return fetch(url);
}

async function fetchAllInstagramMedia(token) {
  const rawPosts = [];
  let after;

  for (let page = 0; page < MAX_MEDIA_PAGES; page++) {
    const response = await requestInstagramMedia(token, { after });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Instagram API error (${response.status}): ${body}`);
    }

    const payload = await response.json();
    rawPosts.push(...(payload.data ?? []));

    after = payload.paging?.cursors?.after;
    if (!after) break;
  }

  return rawPosts;
}

export async function fetchInstagramPosts() {
  if (!getAccessToken()) {
    throw new Error("INSTAGRAM_ACCESS_TOKEN is not configured");
  }

  const now = Date.now();
  if (cache.posts && now < cache.expiresAt) {
    return { posts: cache.posts, freshcut: cache.freshcut, fresheggs: cache.fresheggs, flock: cache.flock };
  }

  await ensureFreshAccessToken();
  let token = getAccessToken();
  let rawPosts;

  try {
    rawPosts = await fetchAllInstagramMedia(token);
  } catch (error) {
    if (!String(error.message).includes("Instagram API error (401)") &&
        !String(error.message).includes("Instagram API error (400)")) {
      throw error;
    }

    await refreshAccessToken(token);
    clearInstagramCache();
    token = getAccessToken();
    rawPosts = await fetchAllInstagramMedia(token);
  }

  const mappedPosts = rawPosts.map(mapRawPost).filter(Boolean);
  const posts = mappedPosts.slice(0, POST_LIMIT);
  const freshcut = toFeaturedImage(findLatestHashtagPost(mappedPosts, FRESHCUT_HASHTAG));
  const fresheggs = toFeaturedImage(findLatestHashtagPost(mappedPosts, FRESHEGGS_HASHTAG));
  const flock = toFeaturedImage(findLatestHashtagPost(mappedPosts, FLOCK_HASHTAG));

  cache = { posts, freshcut, fresheggs, flock, expiresAt: now + CACHE_TTL_MS };
  return { posts, freshcut, fresheggs, flock };
}

export function instagramApiMiddleware(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  fetchInstagramPosts()
    .then(({ posts, freshcut, fresheggs, flock }) => {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "public, max-age=300");
      res.end(JSON.stringify({ posts, freshcut, fresheggs, flock }));
    })
    .catch((error) => {
      console.error("Instagram feed error:", error.message);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Failed to fetch Instagram posts" }));
    });
}
