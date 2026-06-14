import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import ScrollToTop from "../components/ScrollToTop";
import { AIChatBot } from "../components/AIChatBot";

// ============================================================
// AppLayout
//
// The root layout wrapper that wraps every page in the app.
// React Router renders this once and swaps only the <Outlet>
// content when the user navigates between routes — Header,
// Footer, ScrollToTop, and AIChatBot stay mounted the entire
// time, so they never re-initialize on page changes.
//
// Render order (top to bottom in the DOM):
//   Header      — sticky top navigation bar
//   Outlet      — active page content (Home, Country, About…)
//   Footer      — site-wide footer with contact and links
//   ScrollToTop — fixed floating button (bottom-left on mobile,
//                 bottom-right on desktop, below the chatbot)
//   AIChatBot   — fixed floating AI assistant (bottom-right,
//                 always on top via z-index: 1000)
//
// ScrollToTop and AIChatBot are placed after Footer in the DOM
// so they render on top of all page content without needing
// a React portal.
// ============================================================
export const AppLayout = () => {
  return (
    <>
      {/* Global sticky header — stays visible on scroll */}
      <Header />

      {/* Page content injected here by React Router */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Site-wide footer */}
      <Footer />

      {/* Floating scroll-to-top button — appears after 300px of scroll */}
      <ScrollToTop />

      {/* Floating AI chat assistant — available on every page */}
      <AIChatBot />
    </>
  );
};
