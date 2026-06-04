import { useEffect, useRef, useState } from "react";
import { Mail, MessageSquare, Clock } from "lucide-react";

// ─── Data shape ─────────────────────────────────────────────────────────────
// In the Next.js implementation, this data would be fetched server-side from
// your CMS / database on each request so it updates automatically whenever a
// new email or text blast goes out.
// e.g.  export async function getServerSideProps() { ... }
//        or  const updates = await fetchUpdates();  inside a Server Component.

type UpdateKind = "email" | "text";

interface FarmUpdate {
  id: string;
  kind: UpdateKind;
  date: string;          // ISO 8601
  subject?: string;       // email subject line
  body: string;
  tags: string[];
}

const UPDATES: FarmUpdate[] = [
  {
    id: "u1",
    kind: "text",
    date: "2025-08-20T10:15:00",
    body: "We have several dozen washed duck eggs this week! $5/dz — pickup on the west side of Delaware near 42/S Section Line Rd. Reply to reserve 🦆",
    tags: ["Duck Eggs", "Available Now"],
  },
  {
    id: "u2",
    kind: "email",
    date: "2025-08-17T08:30:00",
    subject: "Fresh zinnias + sunflowers are here 🌻",
    body: "This week we have gorgeous jar bouquets bursting with zinnias, sunflowers, and echinacea. $10/jar, $1/stem. Quantities are limited — message us to set one aside. Also: a few dozen chicken eggs available.",
    tags: ["Flowers", "Chicken Eggs"],
  },
  {
    id: "u3",
    kind: "text",
    date: "2025-08-09T16:00:00",
    body: "Bouquets are BACK 💐 Zinnias in salmon, orange, coral & magenta. Jars $10. Message to reserve before they're gone!",
    tags: ["Flowers"],
  },
  {
    id: "u4",
    kind: "email",
    date: "2025-08-01T09:00:00",
    subject: "August on the farm — what's growing",
    body: "The hives are thriving, the sunflowers are taller than ever, and the flock is keeping us busy. We're heading into peak flower season — expect frequent availability updates through August. Sign up for texts if you want instant alerts!",
    tags: ["Farm Update", "Flowers", "Bees"],
  },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function UpdateCard({ update, delay }: { update: FarmUpdate; delay: number }) {
  const isEmail = update.kind === "email";
  const Icon = isEmail ? Mail : MessageSquare;
  const kindLabel = isEmail ? "Email Update" : "Text Blast";
  const accentColor = isEmail ? "#2D5A27" : "#E8A020";

  return (
    <FadeIn delay={delay}>
      <article
        className="rounded-2xl p-6 flex flex-col gap-4 h-full"
        style={{ backgroundColor: "#FFF", boxShadow: "0 2px 20px rgba(0,0,0,0.07)", borderTop: `3px solid ${accentColor}` }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isEmail ? "rgba(45,90,39,0.1)" : "rgba(232,160,32,0.12)" }}>
              <Icon size={15} style={{ color: accentColor }} />
            </div>
            <span style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: accentColor }}>
              {kindLabel}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} style={{ color: "#9B7A4A" }} />
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", color: "#9B7A4A" }}>
              {formatDate(update.date)}
            </span>
          </div>
        </div>

        {/* Subject (email only) */}
        {update.subject && (
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "#1C1C1C", lineHeight: 1.3 }}>
            {update.subject}
          </h4>
        )}

        {/* Body */}
        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.92rem", lineHeight: 1.75, color: "#3D2B0F", flex: 1 }}>
          {update.body}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {update.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: "#FAF7F0", fontFamily: "'Lato', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5C3D1E" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </FadeIn>
  );
}

export function RecentNews() {
  return (
    <section
      id="news"
      className="w-full py-24 px-6"
      style={{ backgroundColor: "#F0E8D8" }}
    >
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#E8A020", marginBottom: "0.75rem" }}>
              Fresh from the Farm
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 600, color: "#1C1C1C", lineHeight: 1.2, marginBottom: "1rem" }}>
              Recent Updates
            </h2>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.95rem", color: "#5C3D1E", maxWidth: 460, margin: "0 auto", lineHeight: 1.75 }}>
              These are our latest email and text blasts — the same updates our subscribers get first. Join the list to never miss an availability window.
            </p>
            <div className="w-16 h-0.5 mx-auto mt-6" style={{ backgroundColor: "#E8A020" }} />
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {UPDATES.map((update, i) => (
            <UpdateCard key={update.id} update={update} delay={i * 80} />
          ))}
        </div>

        <FadeIn delay={300}>
          <div className="text-center mt-12">
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.85rem", color: "#9B7A4A", marginBottom: "1rem" }}>
              Want updates like these delivered straight to your inbox or phone?
            </p>
            <button
              onClick={() => document.querySelector("#signup")?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3 rounded-full transition-all duration-200 hover:scale-105"
              style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", backgroundColor: "#E8A020", color: "#FFF", boxShadow: "0 3px 16px rgba(232,160,32,0.3)" }}
            >
              Join the List
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
