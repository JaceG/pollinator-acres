import { useEffect, useRef, useState } from "react";
import img1 from "../../imports/521972797_17972773484913209_8124882467985080564_n.jpg";
import img2 from "../../imports/470140810_534416859595358_413278406777417445_n.jpg";
import img3 from "../../imports/470137550_534417092928668_1895397030731147054_n.jpg";
import img4 from "../../imports/470231102_534417049595339_9073513923345906416_n.jpg";
import img5 from "../../imports/470226930_536030769433967_2821949021420051323_n.jpg";
import img6 from "../../imports/471273554_541228838914160_3640666498425958693_n.jpg";
import img7 from "../../imports/469276193_17946065156913209_9067507296650311873_n.jpg";
import img8 from "../../imports/471286839_541235565580154_443679304919461019_n.jpg";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const photos = [
  { src: img1, alt: "Fresh cut flowers in mason jars with a price sign", span: "col-span-2" },
  { src: img2, alt: "Tall sunflower growing at Pollinator Acres", span: "" },
  { src: img3, alt: "Colorful pastured eggs in a wire basket", span: "" },
  { src: img4, alt: "Chickens in the coop", span: "" },
  { src: img5, alt: "Beekeeper holding honeycomb covered in bees", span: "" },
  { src: img6, alt: "Colorful flowers and summer squash", span: "col-span-2" },
  { src: img7, alt: "Farm produce — tomatoes, sunflower, eggs, herbs", span: "" },
  { src: img8, alt: "Butterfly flying over wildflower field", span: "" },
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
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.97)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function Gallery() {
  return (
    <section
      id="gallery"
      className="w-full py-24 px-6"
      style={{ backgroundColor: "#1C1C1C" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
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
            Life on the Farm
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 600,
              color: "#FAF7F0",
              lineHeight: 1.2,
            }}
          >
            Photo Gallery
          </h2>
        </div>

        {/* Mosaic grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div
                className={`overflow-hidden rounded-xl group cursor-pointer ${photo.span}`}
                style={{ height: photo.span === "col-span-2" ? 300 : 280 }}
              >
                <ImageWithFallback
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="text-center mt-10">
          <p
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.85rem",
              color: "rgba(250, 247, 240, 0.5)",
              letterSpacing: "0.05em",
            }}
          >
            Follow us on social media for seasonal updates and availability
          </p>
        </div>
      </div>
    </section>
  );
}
