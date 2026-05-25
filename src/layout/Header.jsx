import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";

// ============================================================
// Header
//
// Sticky top navigation bar rendered on every page via
// AppLayout. Contains the site logo and the main nav links.
//
// Responsive behaviour:
//   Desktop (>998px) — horizontal nav links visible, hamburger
//                      hidden (controlled by CSS).
//   Tablet / Mobile  — nav links hidden, hamburger icon shown.
//                      Clicking the hamburger toggles a full-
//                      width dropdown menu below the header.
//
// State:
//   showMenu — toggles between the "menu-web" (horizontal) and
//              "menu-mobile" (dropdown) CSS classes on the nav.
//              Starts false so the dropdown is closed on load.
// ============================================================
export const Header = () => {
  // Controls whether the mobile dropdown menu is open or closed
  const [showMenu, setShowMenu] = useState(false);

  // ── Hamburger toggle ─────────────────────────────────────
  // Flips showMenu on every click — same button opens and
  // closes the menu.
  const handleButtonToggle = () => {
    setShowMenu(!showMenu);
  };

  // ── Nav link click handler ───────────────────────────────
  // Closes the mobile menu when the user taps a nav link so
  // they aren't left with an open dropdown after navigating.
  const handleNavClick = () => setShowMenu(false);

  return (
    <header>
      <div className="container">
        <div className="grid navbar-grid">
          {/* ── Logo ────────────────────────────────────────
              Clicking the logo always navigates back to the
              home page.                                      */}
          <div className="logo">
            <NavLink to={"/"}>
              <h1>WorldAtlas</h1>
            </NavLink>
          </div>

          {/* ── Navigation ──────────────────────────────────
              CSS class swaps between "menu-web" (horizontal,
              desktop) and "menu-mobile" (dropdown, mobile)
              based on the showMenu state.
              NavLink's className callback adds the "active"
              class automatically when the route matches,
              which triggers the underline animation in CSS.  */}
          <nav className={showMenu ? "menu-mobile" : "menu-web"}>
            <ul>
              <li>
                <NavLink
                  to={"/"}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={handleNavClick}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/about"}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={handleNavClick}
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/country"}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={handleNavClick}
                >
                  Country
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/contact"}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={handleNavClick}
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* ── Hamburger button ────────────────────────────
              Only visible on tablet/mobile (CSS hides it on
              desktop). aria-expanded tells screen readers
              whether the dropdown is currently open.         */}
          <div className="ham-menu">
            <button
              onClick={handleButtonToggle}
              aria-label="Toggle menu"
              aria-expanded={showMenu}
            >
              <GiHamburgerMenu />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
