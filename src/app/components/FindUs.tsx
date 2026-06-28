import { useEffect, useRef, useState, type ReactNode } from "react";
import { MapPin, Clock, MessageCircle, Flower2, Egg } from "lucide-react";
import produceImg from "../../imports/469276193_17946065156913209_9067507296650311873_n.jpg";
import { ImageWithFallback } from "./figma/ImageWithFallback";

function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
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
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function FindUs() {
  return (
    <section
      id="find-us"
      className="w-full py-24 px-6"
      style={{ backgroundColor: "#FAF7F0" }}
    >
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#E8A020",
                marginBottom: "0.75rem",
              }}
            >
              Come Visit
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 600,
                color: "#1C1C1C",
                lineHeight: 1.2,
                marginBottom: "1rem",
              }}
            >
              Find Us &amp; Place an Order
            </h2>
            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "1rem",
                color: "#5C3D1E",
                maxWidth: 480,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              We're a farm stand pickup — no storefront. Message us to reserve, and we'll arrange a time for you to swing by.
            </p>
            <div className="w-16 h-0.5 mx-auto mt-6" style={{ backgroundColor: "#E8A020" }} />
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Info cards */}
          <div className="space-y-5">
            <FadeIn delay={100}>
              <div
                className="flex gap-5 p-6 rounded-2xl"
                style={{ backgroundColor: "#FFF", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#FEF3DC" }}
                >
                  <MapPin size={20} style={{ color: "#E8A020" }} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "#1C1C1C",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Pickup Location
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontSize: "0.95rem",
                      color: "#5C3D1E",
                      lineHeight: 1.6,
                    }}
                  >
                    West side of Delaware, Ohio<br />
                    Near 42 / S Section Line Rd
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={150}>
              <div
                className="flex gap-5 p-6 rounded-2xl"
                style={{ backgroundColor: "#FFF", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#FEF3DC" }}
                >
                  <Clock size={20} style={{ color: "#E8A020" }} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "#1C1C1C",
                      marginBottom: "0.3rem",
                    }}
                  >
                    How to Order
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontSize: "0.95rem",
                      color: "#5C3D1E",
                      lineHeight: 1.6,
                    }}
                  >
                    Send us a message to reserve. We'll confirm what's available and arrange a convenient pickup time.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div
                className="flex gap-5 p-6 rounded-2xl"
                style={{ backgroundColor: "#FFF", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#FEF3DC" }}
                >
                  <Flower2 size={20} style={{ color: "#E8A020" }} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "#1C1C1C",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Flowers
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontSize: "0.95rem",
                      color: "#5C3D1E",
                      lineHeight: 1.6,
                    }}
                  >
                    Fresh-cut stems — starting at <strong>$1 each</strong> &nbsp;·&nbsp; Prearranged jars — starting at <strong>$5</strong><br />
                    Mix and match or grab a jar for pickup — varieties change weekly with the season.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={250}>
              <div
                className="flex gap-5 p-6 rounded-2xl"
                style={{ backgroundColor: "#FFF", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#FEF3DC" }}
                >
                  <Egg size={20} style={{ color: "#E8A020" }} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "#1C1C1C",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Eggs
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontSize: "0.95rem",
                      color: "#5C3D1E",
                      lineHeight: 1.6,
                    }}
                  >
                    Farm fresh eggs from our hens — starting at <strong>$5/dozen</strong><br />
                    Unwashed and ready for pickup.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div
                className="p-6 rounded-2xl flex flex-col gap-4"
                style={{
                  background: "linear-gradient(135deg, #E8A020 0%, #C8860A 100%)",
                  boxShadow: "0 4px 24px rgba(232, 160, 32, 0.3)",
                }}
              >
                <div className="flex items-center gap-3">
                  <MessageCircle size={22} style={{ color: "#FFF" }} />
                  <h4
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      color: "#FFF",
                    }}
                  >
                    Send Us a Message
                  </h4>
                </div>
                <p
                  style={{
                    fontFamily: "'Lato', sans-serif",
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.6,
                  }}
                >
                  Reach out on Facebook or Instagram to check current availability and reserve your order. We respond as quickly as we can!
                </p>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href="https://www.facebook.com/people/Pollinator-Acres/100090811465945/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full border-2 border-white/60 text-white hover:bg-white/15 transition-colors"
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/pollinatoracres/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full border-2 border-white/60 text-white hover:bg-white/15 transition-colors"
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Image + map placeholder */}
          <div className="space-y-6">
            <FadeIn delay={150}>
              <ImageWithFallback
                src={produceImg}
                alt="Farm produce — tomatoes, sunflower, eggs, herbs from Pollinator Acres"
                className="w-full rounded-2xl object-cover shadow-xl"
                style={{ height: 320 }}
              />
            </FadeIn>

            <FadeIn delay={250}>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ height: 280, backgroundColor: "#E8E0D0" }}
              >
                <iframe
                  title="Pollinator Acres location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47800.79490657893!2d-83.12!3d40.30!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8838d7b6ef4c4dbf%3A0x81c01b8c39b7c3a3!2sDelaware%2C%20OH!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "sepia(0.2) saturate(0.9)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
