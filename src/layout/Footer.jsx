import footerData from "../api/FooterData.json";
import { MdPlace } from "react-icons/md";
import { IoCallSharp } from "react-icons/io5";
import { TbMailPlus } from "react-icons/tb";
import { NavLink } from "react-router-dom";

// ============================================================
// Footer
//
// Site-wide footer rendered on every page via AppLayout.
// Split into two horizontal bands:
//
//   1. Contact strip — three contact cards (location, phone,
//      email) loaded from FooterData.json. Each card's icon
//      is specified as a string key in the JSON and resolved
//      to the actual React icon component via the footerIcon
//      lookup map below.
//
//   2. Copyright bar — left side has the copyright notice,
//      right side has the navigation links.
//
// This component is purely presentational — no props,
// no state, no side effects.
// ============================================================
export const Footer = () => {
  // ── Icon lookup map ──────────────────────────────────────
  // FooterData.json stores icon names as plain strings (e.g.
  // "MdPlace") because JSON cannot hold JSX. This map converts
  // each string key into the actual rendered icon component so
  // the data file stays clean and easy to edit.
  const footerIcon = {
    MdPlace: <MdPlace />,
    IoCallSharp: <IoCallSharp />,
    TbMailPlus: <TbMailPlus />,
  };

  return (
    <footer className="footer-section">
      {/* ── Contact strip ─────────────────────────────────
          Maps over FooterData.json to render one contact
          card per entry. index is safe as a key here because
          this list never reorders or filters dynamically.   */}
      <div className="container grid grid-three-cols">
        {footerData.map((currentData, index) => {
          const { icon, title, details } = currentData;

          return (
            <div className="footer-contact" key={index}>
              {/* Resolve the icon string from JSON to a React component */}
              <div className="icon">{footerIcon[icon]}</div>

              <div className="footer-contact-text">
                {/* title — e.g. "Find us", "Call us", "Mail us" */}
                <p>{title}</p>
                {/* details — e.g. the address, phone, or email value */}
                <p>{details}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Copyright bar ─────────────────────────────────
          Two-column layout: copyright notice on the left,
          nav links on the right. Collapses to a single
          column on mobile via CSS.                         */}
      <div className="copyright-area">
        <div className="container">
          <div className="grid grid-two-cols">
            {/* Copyright notice — &copy; renders the © symbol */}
            <div className="copyright-text">
              <p>
                Copyright &copy; 2026, All Right Reserved
                <NavLink to="/" target="_blank">
                  WorldAtlas
                </NavLink>
              </p>
            </div>

            {/* Footer navigation links */}
            <div className="footer-menu">
              <ul>
                <li>
                  <NavLink to="/">Home</NavLink>
                </li>
                <li>
                  <NavLink to="/">Social</NavLink>
                </li>
                <li>
                  <NavLink to="/">Source Code</NavLink>
                </li>
                <li>
                  <NavLink to="/contact">Contact</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
