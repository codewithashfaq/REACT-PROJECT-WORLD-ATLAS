import { NavLink } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";

// ============================================================
// HeroSection
//
// The landing section at the top of the home page.
// Renders a two-column layout: headline + CTA on the left,
// world map illustration on the right.
//
// On screens below 990px the columns stack vertically —
// the image moves above the text (controlled by CSS order).
//
// This component is purely presentational — no props,
// no state, no side effects.
// ============================================================
export const HeroSection = () => {
  return (
    <main className="hero-section main">
      <div className="container grid grid-two-cols">
        {/* ── Left column: headline, description, CTA ── */}
        <div className="hero-content">
          {/* Main heading — font size scales fluidly via clamp() in CSS */}
          <h1 className="heading-xl">
            Explore the world, One Country at a Time
          </h1>

          <p className="paragraph">
            Discover the history, culture, and beauty of every nation. Sort,
            search and filter through countries to find the details you need.
          </p>

          {/* CTA button — NavLink handles the routing, inline style
              overrides the default anchor color set globally in CSS */}
          <button className="explore-btn">
            <NavLink
              to="/country"
              style={{ color: "white", textDecoration: "none" }}
            >
              Start Exploring <FaLongArrowAltRight />
            </NavLink>
          </button>
        </div>

        {/* ── Right column: decorative world map image ── */}
        <div className="hero-image">
          <img
            src="/images/world.webp"
            className="banner-image"
            fetchPriority="high"
            width="500"
            height="500"
            alt="world atlas banner"
          />
        </div>
      </div>
    </main>
  );
};
