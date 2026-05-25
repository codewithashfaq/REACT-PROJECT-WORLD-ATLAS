import { useState, useEffect } from "react";

// ============================================================
// ScrollToTop
//
// A fixed floating button that appears once the user has
// scrolled more than 300px down the page. Clicking it smoothly
// scrolls the viewport back to the top.
//
// Visibility is driven by a scroll event listener that is
// cleaned up on unmount to prevent memory leaks.
//
// The button's position and styling are handled entirely in
// CSS (.scroll-to-top) — see the SCROLL-TO-TOP BUTTON section
// in App.css for the responsive positioning logic.
//
// This component is used once in AppLayout.jsx so it's
// available on every page without re-mounting on navigation.
// ============================================================
const ScrollToTop = () => {
  // Tracks whether the button should be visible or hidden
  const [isVisible, setIsVisible] = useState(false);

  // ── Scroll listener ──────────────────────────────────────
  // Attaches on mount, removes on unmount.
  // Shows the button after 300px of scroll — enough distance
  // that the user clearly needs a way back to the top.
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Cleanup: removing the listener prevents it from running
    // after the component has been removed from the DOM
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []); // Empty dependency array — only runs on mount/unmount

  // ── Scroll handler ───────────────────────────────────────
  // behavior: "smooth" gives a native animated scroll instead
  // of an instant jump to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Only render the button when the user has scrolled far enough */}
      {isVisible && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
