import heroImg from "../../imports/471286839_541235565580154_443679304919461019_n.jpg";
import logo from "../../imports/LOGO.jpg";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  const scrollToAbout = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelector("#about")?.scrollIntoView({ 
      behavior: prefersReducedMotion ? 'auto' : 'smooth' 
    });
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <ImageWithFallback
        src={heroImg}
        alt="Butterfly flying over wildflower fields at Pollinator Acres"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
        <div className="mb-6 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl"
          style={{ width: 140, height: 140 }}>
          <ImageWithFallback
            src={logo}
            alt="Pollinator Acres logo"
            className="w-full h-full object-cover"
          />
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#FAF7F0",
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            textShadow: "0 2px 20px rgba(0,0,0,0.4)",
            marginBottom: "0.5rem",
          }}
        >
          Pollinator Acres
        </h1>

        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#F5E6C8",
            fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
            fontStyle: "italic",
            fontWeight: 400,
            letterSpacing: "0.04em",
            textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            marginBottom: "2rem",
          }}
        >
          Fresh flowers, farm eggs &amp; a haven for every pollinator
        </p>

        <p
          style={{
            fontFamily: "'Lato', sans-serif",
            color: "rgba(250, 247, 240, 0.85)",
            fontSize: "clamp(0.85rem, 2vw, 1rem)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 300,
            marginBottom: "2.5rem",
          }}
        >
          Near Delaware, OH · West of 42 / S Section Line Rd
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => {
              const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              document.querySelector("#products")?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }}
            className="px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-105"
            style={{
              fontFamily: "'Lato', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              backgroundColor: "#E8A020",
              color: "#FFF",
              boxShadow: "0 4px 20px rgba(232, 160, 32, 0.4)",
            }}
          >
            What We Offer
          </button>
          <button
            onClick={scrollToAbout}
            className="px-8 py-3.5 rounded-full border-2 border-white/60 transition-all duration-200 hover:bg-white/10"
            style={{
              fontFamily: "'Lato', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#FAF7F0",
            }}
          >
            Our Story
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Scroll to about section"
      >
        <span
          style={{
            fontFamily: "'Lato', sans-serif",
            color: "#FAF7F0",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <div className="w-px h-8 bg-white/50 animate-pulse" />
      </button>
    </section>
  );
}
