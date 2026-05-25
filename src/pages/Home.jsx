import { HeroSection } from "../components/HeroSection";
import { About } from "./About";

// ============================================================
// Home
//
// The root page rendered at the "/" route.
// Acts as a simple composition layer — it owns no state or
// logic of its own, it just assembles the two sections that
// make up the home page in the correct order:
//
//   1. HeroSection — full-width banner with headline and CTA
//   2. About       — interesting country facts card grid
//
// Wrapping both in <main> gives the page a single landmark
// element for accessibility (screen readers use it to jump
// straight to the page content, skipping the header).
// ============================================================
export const Home = () => {
  return (
    <main>
      {/* Landing banner with headline, description, and CTA button */}
      <HeroSection />

      {/* Interesting country facts section */}
      <About />
    </main>
  );
};
