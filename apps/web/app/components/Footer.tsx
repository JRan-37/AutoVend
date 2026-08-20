import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <img
              src="/assets/autovend-logo-trans.png"
              alt="AutoVend Systems"
              className="brand-logo brand-logo-footer"
              width={64}
              height={64}
              loading="lazy"
              style={{ marginBottom: 16, marginLeft: -8 }}
            />
            <p className="footer-blurb">
              Predictive automated retail. Smart vending hardware, fleet telemetry, and an HD ad
              surface — operated as one platform.
            </p>
          </div>
          <div>
            <h4>Platform</h4>
            <ul>
              <li>
                <Link to="/features">Features</Link>
              </li>
              <li>
                <Link to="/dashboard-demo">Dashboard demo</Link>
              </li>
              <li>
                <Link to="/reach">Reach map</Link>
              </li>
              <li>
                <Link to="/operating-area">Operating area</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Partner with us</h4>
            <ul>
              <li>
                <Link to="/solutions/location-partner">Location partners</Link>
              </li>
              <li>
                <Link to="/solutions/advertising-partner">Advertising partners</Link>
              </li>
              <li>
                <Link to="/survey">Product survey</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/resources">Resources</Link>
              </li>
              <li>
                <span style={{ color: "var(--ink-4)", fontSize: 13.5 }}>Careers · soon</span>
              </li>
              <li>
                <span style={{ color: "var(--ink-4)", fontSize: 13.5 }}>Privacy · soon</span>
              </li>
              <li>
                <span style={{ color: "var(--ink-4)", fontSize: 13.5 }}>Terms · soon</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <span>© 2026 AutoVend Systems · Operated by Supremacy Links Software</span>
          <span>autovendsystems.com · status · all systems</span>
        </div>
      </div>
    </footer>
  );
}
