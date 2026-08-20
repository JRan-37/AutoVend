import { Link, NavLink } from "react-router";

const LINKS = [
  { to: "/features", label: "Features" },
  { to: "/solutions/location-partner", label: "Location partners" },
  { to: "/solutions/advertising-partner", label: "Advertising" },
  { to: "/reach", label: "Reach" },
  { to: "/dashboard-demo", label: "Dashboard" },
  { to: "/resources", label: "Resources" },
];

export function Header() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" aria-label="AutoVend Systems · Home">
          <span className="mark">AV</span>
          <span>
            AutoVend<span className="dim">/Systems</span>
          </span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <span className="nav-spacer" />
        <div className="nav-cta">
          <Link to="/contact" className="btn btn-ghost btn-sm">
            Contact
          </Link>
          <Link to="/contact?form=placement" className="btn btn-accent btn-sm">
            Request placement
          </Link>
        </div>
      </div>
    </header>
  );
}
