import { useState, useEffect } from "react";
import logo from "../../imports/LOGO.jpg";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "What We Offer", href: "#products" },
  { label: "Instagram", href: "#instagram" },
  { label: "Find Us", href: "#find-us" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(250, 247, 240, 0.97)" : "transparent",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => handleNav("#hero")}
          className="flex items-center gap-3 focus:outline-none"
        >
          <ImageWithFallback
            src={logo}
            alt="Pollinator Acres Logo"
            className="h-12 w-12 rounded-full object-cover"
          />
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              color: scrolled ? "#1C1C1C" : "#FAF7F0",
              textShadow: scrolled ? "none" : "0 1px 4px rgba(0,0,0,0.4)",
              fontSize: "1.1rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              lineHeight: 1.2,
            }}
          >
            Pollinator<br />Acres
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNav(link.href)}
                className="transition-colors duration-200 focus:outline-none"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: scrolled ? "#5C3D1E" : "#FAF7F0",
                  textShadow: scrolled ? "none" : "0 1px 4px rgba(0,0,0,0.4)",
                }}
              >
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => handleNav("#signup")}
              className="px-5 py-2 rounded-full transition-all duration-200"
              style={{
                fontFamily: "'Lato', sans-serif",
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                backgroundColor: "#E8A020",
                color: "#FFF",
              }}
            >
              Join the List
            </button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-6 h-0.5 transition-all duration-200"
              style={{ backgroundColor: scrolled ? "#1C1C1C" : "#FAF7F0" }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-2"
          style={{ backgroundColor: "rgba(250, 247, 240, 0.98)" }}
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNav(link.href)}
                  className="w-full text-left focus:outline-none"
                  style={{
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#5C3D1E",
                  }}
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => handleNav("#find-us")}
                className="w-full py-2.5 rounded-full"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  backgroundColor: "#E8A020",
                  color: "#FFF",
                }}
              >
                Order Now
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
