import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Products } from "./components/Products";
import { SignupSection } from "./components/SignupSection";
import { InstagramFeed } from "./components/InstagramFeed";
import { FindUs } from "./components/FindUs";
import { Footer } from "./components/Footer";
import { ClarityTracker } from "./components/Clarity";

export default function App() {
  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "#FAF7F0" }}>
      <ClarityTracker />
      <Nav />
      <Hero />
      <About />
      <Products />
      <SignupSection />
      <InstagramFeed />
      <FindUs />
      <Footer />
    </div>
  );
}
