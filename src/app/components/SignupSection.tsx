import { useState, useEffect, useRef } from "react";
import { Mail, MessageSquare, Smartphone, Bell, CheckCircle2, Sparkles } from "lucide-react";

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
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

type Mode = "email" | "text" | "both";

export function SignupSection() {
  const [mode, setMode] = useState<Mode>("both");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const apiEndpoint = import.meta.env.VITE_FORM_API_URL || "/api/signup";
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          email: showEmail ? email : undefined,
          phone: showPhone ? phone : undefined,
          preferences: mode,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Signup failed");
      }

      setLoading(false);
      setSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFirstName('');
        setEmail('');
        setPhone('');
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Signup error:', error);
      setLoading(false);
      alert(error instanceof Error ? error.message : "Sorry, there was an error signing you up. Please try again or contact us directly.");
    }
  };

  const showEmail = mode === "email" || mode === "both";
  const showPhone = mode === "text" || mode === "both";

  return (
    <section
      id="signup"
      className="w-full py-24 px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a3a17 0%, #2D5A27 50%, #1C3A18 100%)" }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #E8A020 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #E8A020 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

      <div className="max-w-5xl mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: "rgba(232, 160, 32, 0.2)", border: "1px solid rgba(232, 160, 32, 0.4)" }}>
              <Bell size={13} style={{ color: "#E8A020" }} />
              <span style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#E8A020" }}>
                Stay in the Loop
              </span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 600, color: "#FAF7F0", lineHeight: 1.2, marginBottom: "1rem" }}>
              Be the First to Know<br />When Things Are Available
            </h2>
            <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "1rem", color: "rgba(250,247,240,0.75)", maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
              Flowers go fast. Eggs go faster. Sign up for email or text updates so you can grab what you need before it's gone — and reserve orders directly with us.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Signup form */}
          <FadeIn delay={100}>
            <div className="rounded-2xl p-8" style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
              {submitted ? (
                <div className="flex flex-col items-center text-center py-8 gap-4">
                  <CheckCircle2 size={52} style={{ color: "#E8A020" }} />
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 600, color: "#FAF7F0" }}>
                    You're on the list!
                  </h3>
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.95rem", color: "rgba(250,247,240,0.7)", lineHeight: 1.7 }}>
                    We'll reach out the next time flowers or eggs are available. Thank you for supporting Pollinator Acres!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(250,247,240,0.6)", display: "block", marginBottom: "0.4rem" }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                      style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#FAF7F0", fontFamily: "'Lato', sans-serif", fontSize: "0.95rem" }}
                    />
                  </div>

                  {/* Mode toggle */}
                  <div>
                    <label style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(250,247,240,0.6)", display: "block", marginBottom: "0.6rem" }}>
                      How would you like updates?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { value: "email", label: "Email", icon: Mail },
                        { value: "text", label: "Text", icon: MessageSquare },
                        { value: "both", label: "Both", icon: Sparkles },
                      ] as const).map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setMode(value)}
                          className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200"
                          style={{
                            backgroundColor: mode === value ? "#E8A020" : "rgba(255,255,255,0.08)",
                            border: `1px solid ${mode === value ? "#E8A020" : "rgba(255,255,255,0.15)"}`,
                          }}
                        >
                          <Icon size={16} style={{ color: mode === value ? "#FFF" : "rgba(250,247,240,0.6)" }} />
                          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: mode === value ? "#FFF" : "rgba(250,247,240,0.6)" }}>
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {showEmail && (
                    <div>
                      <label style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(250,247,240,0.6)", display: "block", marginBottom: "0.4rem" }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={showEmail}
                        className="w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                        style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#FAF7F0", fontFamily: "'Lato', sans-serif", fontSize: "0.95rem" }}
                      />
                    </div>
                  )}

                  {showPhone && (
                    <div>
                      <label style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(250,247,240,0.6)", display: "block", marginBottom: "0.4rem" }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required={showPhone}
                        className="w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                        style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#FAF7F0", fontFamily: "'Lato', sans-serif", fontSize: "0.95rem" }}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-70"
                    style={{ backgroundColor: "#E8A020", fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#FFF", boxShadow: "0 4px 20px rgba(232,160,32,0.3)" }}
                  >
                    {loading ? "Signing you up…" : "Sign Me Up"}
                  </button>

                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.72rem", color: "rgba(250,247,240,0.4)", textAlign: "center", lineHeight: 1.6 }}>
                    No spam, ever. Just quick updates when something fresh is ready. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </FadeIn>

          {/* Value props + App coming soon */}
          <FadeIn delay={200}>
            <div className="space-y-6">
              {/* Why sign up */}
              <div className="space-y-4">
                {[
                  { icon: Bell, title: "Availability alerts", desc: "Know the moment eggs, flowers, or seasonal extras are ready — before they sell out." },
                  { icon: MessageSquare, title: "Easy reservations", desc: "Reply to a text or email to reserve your order. No app needed (yet)." },
                  { icon: Mail, title: "Weekly news", desc: "Seasonal updates, farm happenings, and the occasional photo of something amazing from the fields." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(232,160,32,0.2)" }}>
                      <Icon size={18} style={{ color: "#E8A020" }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600, color: "#FAF7F0", marginBottom: "0.2rem" }}>{title}</p>
                      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.88rem", color: "rgba(250,247,240,0.6)", lineHeight: 1.65 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* App coming soon */}
              <div
                className="rounded-2xl p-6"
                style={{ background: "linear-gradient(135deg, rgba(232,160,32,0.15) 0%, rgba(232,160,32,0.05) 100%)", border: "1px solid rgba(232,160,32,0.3)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Smartphone size={20} style={{ color: "#E8A020" }} />
                  <div className="flex items-center gap-2">
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 600, color: "#FAF7F0" }}>
                      Pollinator Acres App
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold tracking-wider"
                      style={{ backgroundColor: "#E8A020", color: "#FFF", fontFamily: "'Lato', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
                    >
                      Coming Soon
                    </span>
                  </div>
                </div>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.88rem", color: "rgba(250,247,240,0.65)", lineHeight: 1.7, marginBottom: "1rem" }}>
                  We're building a dedicated app so you can browse what's in season, place orders, and get push notifications — all from your phone. Signing up now puts you first in line.
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#E8A020" }} />
                  <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.75rem", color: "#E8A020", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    In Development
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
