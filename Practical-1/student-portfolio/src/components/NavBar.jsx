import { NavLink } from "react-router-dom";

function NavBar({ isDarkMode, onToggleTheme }) {
  return (
    <nav className="navbar">
      <div className="brand">Gitanshu</div>
      <div className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>
      <button className="theme-toggle" onClick={onToggleTheme} type="button">
        {isDarkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </nav>
  );
}

export default NavBar;
