import { useEffect, useRef, useState } from "react";
import sunflowerImg from "../../imports/470140810_534416859595358_413278406777417445_n.jpg";
import fieldImg from "../../imports/471286839_541235565580154_443679304919461019_n.jpg";
import { ImageWithFallback } from "./figma/ImageWithFallback";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function About() {
  return (
    <section
      id="about"
      className="w-full py-24 px-6"
      style={{ backgroundColor: "#FAF7F0" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#E8A020", marginBottom: "0.75rem" }}>
              Our Story
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 600, color: "#1C1C1C", lineHeight: 1.2, marginBottom: "1.5rem" }}>
              A Farm Built for Butterflies,<br />Bees &amp; Every Living Thing
            </h2>
            <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: "#E8A020" }} />
          </div>
        </FadeIn>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          <FadeIn delay={100}>
            <div className="space-y-6">
              <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 400, fontSize: "1.1rem", lineHeight: 1.8, color: "#3D2B0F" }}>
                Pollinator Acres is a small farm nestled just outside of city limits in Delaware, Ohio. We grow cut flowers, veggies and herbs. We are also the forever home for a variety of hens and a turkey.
              </p>
              <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 400, fontSize: "1.1rem", lineHeight: 1.8, color: "#3D2B0F" }}>
                Every sunflower and zinnia is grown with intention — not just for a vase on your table, but to create habitat for monarchs, honeybees, and hundreds of other pollinators that visit our fields each season.
              </p>
              <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 400, fontSize: "1.1rem", lineHeight: 1.8, color: "#3D2B0F" }}>
                Our birds are farm residents, not livestock. They roam, forage, and live good lives here. The eggs they lay are a natural gift — gathered gently and shared with neighbors who appreciate where they come from.
              </p>
              <div className="flex items-center gap-6 pt-2 flex-wrap">
                {[
                  { value: "100%", label: "Naturally Grown" },
                  { value: "Local", label: "Delaware, Ohio" },
                  { value: "Seasonal", label: "Fresh & Rotating" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7rem", fontWeight: 700, color: "#E8A020", lineHeight: 1 }}>
                      {stat.value}
                    </span>
                    <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.72rem", color: "#5C3D1E", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="relative">
              <ImageWithFallback
                src={sunflowerImg}
                alt="Sunflower growing tall at Pollinator Acres"
                className="w-full rounded-2xl object-cover shadow-xl"
                style={{ height: 420 }}
              />
            </div>
          </FadeIn>
        </div>

        {/* Field / pollinators section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeIn delay={100}>
            <div className="relative order-2 md:order-1">
              <ImageWithFallback
                src={fieldImg}
                alt="Butterfly flying over wildflower teasel field at Pollinator Acres"
                className="w-full rounded-2xl object-cover shadow-xl"
                style={{ height: 400 }}
              />
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="space-y-5 order-1 md:order-2">
              <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#E8A020" }}>
                The Mission
              </p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", fontWeight: 600, color: "#1C1C1C", lineHeight: 1.3 }}>
                Living closer to nature &amp; learning as we go
              </h3>
              <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 400, fontSize: "1rem", lineHeight: 1.8, color: "#3D2B0F" }}>
              We are growing a haven for pollinators. Monarch butterflies, honeybees, swallowtails, hoverflies — we plant for all of them. Our meadow strategy means less mowing, more blooming, and a living landscape that shifts and surprises us season after season.
              </p>
              <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 400, fontSize: "1rem", lineHeight: 1.8, color: "#3D2B0F" }}>
                When you pick up a handful of fresh-cut stems or a dozen eggs, you're part of that story — supporting a farm that believes good things grow when you give life room to thrive.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
