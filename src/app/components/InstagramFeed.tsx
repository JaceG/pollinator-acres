import { useEffect, useRef, useState } from "react";
import { Instagram, Heart, MessageCircle, ExternalLink } from "lucide-react";
import img1 from "../../imports/521972797_17972773484913209_8124882467985080564_n.jpg";
import img2 from "../../imports/470140810_534416859595358_413278406777417445_n.jpg";
import img3 from "../../imports/470137550_534417092928668_1895397030731147054_n.jpg";
import img4 from "../../imports/470231102_534417049595339_9073513923345906416_n.jpg";
import img5 from "../../imports/470226930_536030769433967_2821949021420051323_n.jpg";
import img6 from "../../imports/471273554_541228838914160_3640666498425958693_n.jpg";
import img7 from "../../imports/471286839_541235565580154_443679304919461019_n.jpg";
import img8 from "../../imports/469276193_17946065156913209_9067507296650311873_n.jpg";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// ─── Data shape ──────────────────────────────────────────────────────────────
// In the Next.js implementation, this data is fetched server-side via the
// Instagram Graph API (requires a connected Facebook Business account):
//   GET https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp,like_count
// The API response maps directly to the shape below.
// Access token should be stored as an environment variable (INSTAGRAM_ACCESS_TOKEN).

interface IGPost {
  id: string;
  src: string;
  alt: string;
  caption: string;
  likes: number;
  comments: number;
  permalink: string;
}

// Mocked posts — replace with live API data in Next.js
const POSTS: IGPost[] = [
  {
    id: "p1",
    src: img1,
    alt: "Fresh cut flower bouquets in mason jars with pricing sign",
    caption: "Flowers, eggs & good vibes 🌻 Jar bouquets $10, stems $1, eggs $5/dz. Message to reserve! #pollinatoracres #cutflowers #farmfresh",
    likes: 147,
    comments: 18,
    permalink: "https://www.instagram.com/",
  },
  {
    id: "p2",
    src: img2,
    alt: "Tall sunflower reaching for the sky",
    caption: "She reached 8 feet this week. Our sunflowers are absolutely thriving ☀️ #sunflower #farmlife #pollinator",
    likes: 203,
    comments: 24,
    permalink: "https://www.instagram.com/",
  },
  {
    id: "p3",
    src: img3,
    alt: "Colorful pastured eggs in a wire basket",
    caption: "Sage blue, blush pink, warm tan — nature's palette in a wire basket 🥚 Chicken eggs $5/dz #farmfresh #eggs #happyhens",
    likes: 318,
    comments: 41,
    permalink: "https://www.instagram.com/",
  },
  {
    id: "p4",
    src: img4,
    alt: "Chickens in the coop",
    caption: "The ladies checking in on today's situation. They approve. 🐓 #chickens #farmlife #pollinatoracres",
    likes: 291,
    comments: 33,
    permalink: "https://www.instagram.com/",
  },
  {
    id: "p5",
    src: img5,
    alt: "Beekeeper holding honeycomb covered with bees",
    caption: "Hive inspection day 🐝 The girls are doing amazing this season. So grateful for every one of them. #beekeeper #honeybees #pollinators",
    likes: 404,
    comments: 56,
    permalink: "https://www.instagram.com/",
  },
  {
    id: "p6",
    src: img6,
    alt: "Echinacea and summer squash on a dark surface",
    caption: "Late summer harvest 🌸 Echinacea, zinnias, and the first summer squash. Farmers market vibes at home. #farmharvest #echinacea #fresh",
    likes: 185,
    comments: 22,
    permalink: "https://www.instagram.com/",
  },
  {
    id: "p7",
    src: img7,
    alt: "Butterfly flying over wildflower teasel field",
    caption: "Caught this swallowtail mid-flight over the teasel. Days like this are why we do this. 🦋 #butterfly #wildflowers #pollinator #nature",
    likes: 512,
    comments: 68,
    permalink: "https://www.instagram.com/",
  },
  {
    id: "p8",
    src: img8,
    alt: "Farm produce — tomatoes, eggs, sunflower, herb garden",
    caption: "A little bit of everything from this week's harvest 🍅🌻🥚🌿 #farmlife #homegrown #pollinatoracres #ohio",
    likes: 234,
    comments: 29,
    permalink: "https://www.instagram.com/",
  },
];

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
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
            opacity: hovered ? 1 : 0,
          }}
        >
          <p
            className="line-clamp-3 mb-2"
            style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}
          >
            {post.caption}
          </p>
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
  return (
    <section
      id="instagram"
      className="w-full py-24 px-6"
      style={{ backgroundColor: "#1C1C1C" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 flex-shrink-0"
            style={{ border: "1px solid rgba(232,160,32,0.5)", color: "#E8A020", fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            <Instagram size={16} />
            Follow Us
          </a>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {POSTS.map((post, i) => (
            <PostTile key={post.id} post={post} delay={i * 50} />
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: "rgba(232,160,32,0.15)", border: "1px solid rgba(232,160,32,0.4)", color: "#E8A020", fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            <Instagram size={16} />
            See All Posts on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
