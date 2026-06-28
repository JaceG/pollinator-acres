import logo from "../../imports/LOGO.jpg";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart } from "lucide-react";

export function Footer() {
  const handleNav = (href: string) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelector(href)?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <footer
      className="w-full py-14 px-6"
      style={{ backgroundColor: "#1C1C1C" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12 items-start">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={logo}
                alt="Pollinator Acres Logo"
                className="w-14 h-14 rounded-full object-cover border-2"
                style={{ borderColor: "rgba(232, 160, 32, 0.4)" }}
              />
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#FAF7F0",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                Pollinator<br />Acres
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "0.88rem",
                color: "rgba(250, 247, 240, 0.55)",
                lineHeight: 1.7,
              }}
            >
              A small farm near Delaware, Ohio — growing flowers, raising hens, and learning as we go.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4
              style={{
                fontFamily: "'Lato', sans-serif",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#E8A020",
                marginBottom: "1rem",
              }}
            >
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "#about" },
                { label: "What We Offer", href: "#products" },
                { label: "Gallery", href: "#gallery" },
                { label: "Find Us", href: "#find-us" },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="focus:outline-none hover:underline"
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontSize: "0.9rem",
                      color: "rgba(250, 247, 240, 0.65)",
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Prices quick ref */}
          <div>
            <h4
              style={{
                fontFamily: "'Lato', sans-serif",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#E8A020",
                marginBottom: "1rem",
              }}
            >
              Quick Prices
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Fresh-Cut Stem", price: "Starting at $1" },
                { label: "Prearranged Jar", price: "Starting at $5" },
                { label: "Farm Fresh Eggs", price: "Starting at $5/dz" },
              ].map((item) => (
                <li key={item.label} className="flex justify-between">
                  <span
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontSize: "0.88rem",
                      color: "rgba(250, 247, 240, 0.6)",
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.95rem",
                      color: "#E8A020",
                      fontWeight: 600,
                    }}
                  >
                    {item.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px mb-8" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.78rem",
              color: "rgba(250, 247, 240, 0.35)",
              letterSpacing: "0.05em",
            }}
          >
            © {new Date().getFullYear()} Pollinator Acres · Delaware, Ohio
          </p>
          <p
            className="flex items-center gap-1.5"
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.78rem",
              color: "rgba(250, 247, 240, 0.35)",
            }}
          >
            Made with <Heart size={12} style={{ color: "#E8A020", fill: "#E8A020" }} /> for butterflies, bees &amp; you
          </p>
        </div>
      </div>
    </footer>
  );
}
