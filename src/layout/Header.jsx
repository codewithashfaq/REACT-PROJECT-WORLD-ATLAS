import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const handleButtonToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleNavClick = () => setShowMenu(false);

  return (
    <header>
      <div className="container">
        <div className="grid navbar-grid">
          <div className="logo">
            <NavLink to={"/"}>
              <h1>WorldAtlas</h1>
            </NavLink>
          </div>

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
