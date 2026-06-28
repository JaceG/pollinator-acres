import { useEffect, useRef, useState } from "react";
import { Instagram, Heart, MessageCircle, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/pollinatoracres/";
const POST_COUNT = 12;

interface IGPost {
  id: string;
  src: string;
  alt: string;
  caption: string;
  likes: number;
  comments: number;
  permalink: string;
}

type FeedStatus = "loading" | "live" | "error";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.96)", transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function PostSkeleton({ delay }: { delay: number }) {
  return (
    <FadeIn delay={delay}>
      <div
        className="rounded-xl animate-pulse"
        style={{ aspectRatio: "1 / 1", backgroundColor: "rgba(255,255,255,0.08)" }}
      />
    </FadeIn>
  );
}

function PostTile({ post, delay }: { post: IGPost; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <FadeIn delay={delay}>
      <a
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden rounded-xl group"
        style={{ aspectRatio: "1 / 1" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <ImageWithFallback
          src={post.src}
          alt={post.alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div
          className="absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
            opacity: hovered ? 1 : 0,
          }}
        >
          {post.caption && (
            <p
              className="line-clamp-3 mb-2"
              style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}
            >
              {post.caption}
            </p>
          )}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5" style={{ color: "#FFF", fontSize: "0.75rem", fontFamily: "'Lato', sans-serif" }}>
              <Heart size={13} style={{ fill: "#FFF" }} /> {post.likes}
            </span>
            <span className="flex items-center gap-1.5" style={{ color: "#FFF", fontSize: "0.75rem", fontFamily: "'Lato', sans-serif" }}>
              <MessageCircle size={13} /> {post.comments}
            </span>
            <ExternalLink size={13} style={{ color: "#FFF", marginLeft: "auto" }} />
          </div>
        </div>
      </a>
    </FadeIn>
  );
}

export function InstagramFeed() {
  const [posts, setPosts] = useState<IGPost[]>([]);
  const [status, setStatus] = useState<FeedStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      try {
        const response = await fetch("/api/instagram");
        const data = await response.json();

        if (cancelled) return;

        if (!response.ok || !Array.isArray(data.posts) || data.posts.length === 0) {
          setStatus("error");
          return;
        }

        setPosts(data.posts);
        setStatus("live");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    loadPosts();
    return () => { cancelled = true; };
  }, []);

  return (
    <section
      id="instagram"
      className="w-full py-24 px-6"
      style={{ backgroundColor: "#1C1C1C" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Instagram size={22} style={{ color: "#E8A020" }} />
              <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#E8A020" }}>
                @pollinatoracres
              </p>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 600, color: "#FAF7F0", lineHeight: 1.2 }}>
              Life at the Farm
            </h2>
          </div>
          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 flex-shrink-0"
            style={{ border: "1px solid rgba(232,160,32,0.5)", color: "#E8A020", fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            <Instagram size={16} />
            Follow Us
          </a>
        </div>

        {status === "error" && (
          <p
            className="text-center mb-8"
            style={{ fontFamily: "'Lato', sans-serif", color: "rgba(250,247,240,0.7)", fontSize: "0.95rem" }}
          >
            Could not load the latest posts right now. Visit us on Instagram for fresh farm updates.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {status === "loading" &&
            Array.from({ length: POST_COUNT }, (_, i) => (
              <PostSkeleton key={`skeleton-${i}`} delay={i * 50} />
            ))}

          {status === "live" &&
            posts.map((post, i) => (
              <PostTile key={post.id} post={post} delay={i * 50} />
            ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: "rgba(232,160,32,0.15)", border: "1px solid rgba(232,160,32,0.4)", color: "#E8A020", fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            <Instagram size={16} />
            {status === "live" ? "See All Posts on Instagram" : "Follow @pollinatoracres"}
          </a>
        </div>
      </div>
    </section>
  );
}
