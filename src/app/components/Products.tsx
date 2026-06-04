import { useEffect, useRef, useState } from "react";
import flowersImg from "../../imports/521972797_17972773484913209_8124882467985080564_n.jpg";
import eggsImg from "../../imports/470137550_534417092928668_1895397030731147054_n.jpg";
import duckImg from "../../imports/491446112_17963453975913209_8717655448177418295_n__1_.jpg";
import { ImageWithFallback } from "./figma/ImageWithFallback";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface ProductCardProps {
  image: string;
  imageAlt: string;
  tag: string;
  title: string;
  description: string;
  items: { label: string; price: string }[];
  note?: string;
  delay?: number;
  ctaLabel?: string;
  ctaTarget?: string;
}

function ProductCard({
  image, imageAlt, tag, title, description, items, note, delay = 0, ctaLabel = "Reserve Yours", ctaTarget = "#signup",
}: ProductCardProps) {
  const handleCta = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelector(ctaTarget)?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <FadeIn delay={delay}>
      <div
        className="rounded-2xl overflow-hidden flex flex-col h-full"
        style={{
          backgroundColor: "#FFF",
          boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div className="relative overflow-hidden" style={{ height: 260 }}>
          <ImageWithFallback
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full"
            style={{ backgroundColor: "#E8A020" }}
          >
            <span
              style={{
                fontFamily: "'Lato', sans-serif",
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#FFF",
              }}
            >
              {tag}
            </span>
          </div>
        </div>

        <div className="p-7 flex flex-col flex-1">
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#1C1C1C",
              marginBottom: "0.75rem",
              lineHeight: 1.2,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: "#5C3D1E",
              marginBottom: "1.25rem",
              flex: 1,
            }}
          >
            {description}
          </p>

          <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: "#FAF7F0" }}>
            {items.map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", color: "#3D2B0F" }}>
                  {item.label}
                </span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#E8A020", fontWeight: 700 }}>
                  {item.price}
                </span>
              </div>
            ))}
          </div>

          {note && (
            <p className="mt-3 text-center" style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", color: "#9B7A4A", fontStyle: "italic" }}>
              {note}
            </p>
          )}

          <button
            onClick={handleCta}
            className="mt-5 w-full py-3 rounded-full border-2 transition-all duration-200 hover:bg-amber-50"
            style={{
              fontFamily: "'Lato', sans-serif",
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderColor: "#E8A020",
              color: "#E8A020",
            }}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </FadeIn>
  );
}

export function Products() {
  return (
    <section
      id="products"
      className="w-full py-24 px-6"
      style={{ background: "linear-gradient(180deg, #F0E8D8 0%, #FAF7F0 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#E8A020", marginBottom: "0.75rem" }}>
              Fresh from the Farm
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 600, color: "#1C1C1C", lineHeight: 1.2, marginBottom: "1rem" }}>
              What We Offer
            </h2>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "1rem", color: "#5C3D1E", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              Everything is grown or raised here in small batches. Join our list to get notified when things are available and reserve your order.
            </p>
            <div className="w-16 h-0.5 mx-auto mt-6" style={{ backgroundColor: "#E8A020" }} />
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          <ProductCard
            image={flowersImg}
            imageAlt="Fresh cut flower bouquets in mason jars — sunflowers, zinnias, echinacea"
            tag="Cut Flowers"
            title="Fresh-Cut Bouquets"
            description="Seasonal cut flowers bursting with color — sunflowers, zinnias, echinacea, and more. Arranged in mason jars or by the stem. Varieties change weekly as the season unfolds."
            items={[
              { label: "Jar Bouquet", price: "$10" },
              { label: "Single Stem", price: "$1" },
            ]}
            note="Varieties change with the season"
            delay={100}
            ctaLabel="Join the List"
            ctaTarget="#signup"
          />
          <ProductCard
            image={eggsImg}
            imageAlt="Colorful pastured eggs — blue, pink, tan — in a wire basket"
            tag="Farm Eggs"
            title="Pastured Eggs"
            description="Our hens and ducks live happy, free lives on the farm. They lay eggs in beautiful shades of blue, sage, pink, and cream — with rich, golden yolks that speak for themselves."
            items={[
              { label: "Chicken Eggs", price: "$5/dz" },
              { label: "Duck Eggs", price: "$5/dz" },
            ]}
            note="Washed and ready for pickup near 42 / S Section Line Rd"
            delay={200}
            ctaLabel="Join the List"
            ctaTarget="#signup"
          />
          <ProductCard
            image={duckImg}
            imageAlt="Ducks roaming freely at Pollinator Acres farm"
            tag="Come Visit"
            title="Meet the Flock"
            description="Our chickens, ducks, and farm residents are a beloved part of life here. Come for the eggs and flowers — stay to say hello to the flock. A little farm magic is good for the soul."
            items={[
              { label: "Pickup visits", price: "Always welcome" },
              { label: "Farm experience", price: "Come say hi" },
            ]}
            note="Message us to arrange a visit"
            delay={300}
            ctaLabel="Get in Touch"
            ctaTarget="#find-us"
          />
        </div>

        {/* CTA banner */}
        <FadeIn delay={200}>
          <div
            className="mt-16 rounded-2xl p-8 md:p-12 text-center"
            style={{ background: "linear-gradient(135deg, #2D5A27 0%, #3A7A30 100%)" }}
          >
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 600, color: "#FAF7F0", marginBottom: "0.75rem" }}>
              Don't Miss Out — Join Our List
            </h3>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.95rem", color: "rgba(250,247,240,0.8)", marginBottom: "1.75rem", maxWidth: 500, margin: "0 auto 1.75rem", lineHeight: 1.7 }}>
              We send quick updates when flowers and eggs are available, so you're never left guessing. Sign up for email or text — or both.
            </p>
            <button
              onClick={() => {
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                document.querySelector("#signup")?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
              }}
              className="px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-105"
              style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", backgroundColor: "#E8A020", color: "#FFF", boxShadow: "0 4px 20px rgba(232,160,32,0.35)" }}
            >
              Sign Up for Updates
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
