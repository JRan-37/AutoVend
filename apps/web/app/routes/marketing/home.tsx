import { Link } from "react-router";
import { Placeholder, SectionHeader } from "../../components/primitives";
import { ReachMap } from "../../components/ReachMap";
import { DEMO_REGIONS } from "../../features/demo/demoData";
import { FEATURES } from "../../features/marketing/content";

export function meta() {
  return [
    { title: "AutoVend Systems — Vending, operated like infrastructure" },
    {
      name: "description",
      content:
        "AutoVend builds predictive, AI-driven automated retail: smart hardware, fleet telemetry, and a 32″ HD ad surface — operated as one platform.",
    },
  ];
}

const AUDIENCES = [
  {
    tag: "01 · LOCATION PARTNERS",
    t: "A modern amenity. Zero operational load.",
    d: "Property managers, gym owners, HR, hospitals, campuses, hotels. We place, restock, maintain, and pay you a partnership share. You get a high-tech amenity your visitors actually use.",
    cta: "Request Smart Placement demo →",
    to: "/solutions/location-partner",
  },
  {
    tag: "02 · ADVERTISING PARTNERS",
    t: "32″ HD screens at point-of-purchase.",
    d: "High-traffic offices, gyms, transit, and campuses become a measurable local digital media network. Full-motion creative, daypart scheduling, QR pairing.",
    cta: "Explore advertising →",
    to: "/solutions/advertising-partner",
  },
  {
    tag: "03 · END USERS",
    t: "Faster, healthier, more honest vending.",
    d: "Tap to pay. Better assortment. Tell us what you want and we'll get it stocked. No more dusty machines that eat your dollar.",
    cta: "Suggest products →",
    to: "/survey",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section
        style={{
          borderBottom: "1px solid var(--rule)",
          paddingTop: 64,
          paddingBottom: 64,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{ position: "relative", marginBottom: 16, paddingTop: 76, paddingBottom: 60 }}
          >
            <img
              src="/assets/autovend-logo-trans.png"
              alt=""
              aria-hidden="true"
              width={432}
              height={432}
              fetchPriority="high"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                height: 432,
                width: "auto",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 24,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-3)",
                letterSpacing: ".05em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span className="dot" /> AutoVend Systems · Predictive automated retail
              </span>
              <span>15 regions active · 7 expanding</span>
            </div>
          </div>
          <div className="grid-12" style={{ alignItems: "end", rowGap: 40 }}>
            <div style={{ gridColumn: "span 7" }}>
              <h1 className="display">
                Vending,
                <br />
                operated like
                <br />
                <span style={{ color: "var(--accent)" }}>infrastructure.</span>
              </h1>
              <p className="lead" style={{ marginTop: 28, fontSize: 19 }}>
                AutoVend builds predictive, AI-driven automated retail. Smart hardware, fleet
                telemetry, and a 32″ HD ad surface — operated as one platform. Your venue gets a
                modern amenity. We handle the rest.
              </p>
              <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/contact?form=placement" className="btn btn-primary btn-arrow">
                  Request Smart Placement demo
                </Link>
                <Link to="/dashboard-demo" className="btn btn-ghost">
                  View dashboard preview
                </Link>
              </div>
              <div
                style={{
                  marginTop: 40,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 32,
                  paddingTop: 28,
                  borderTop: "1px solid var(--rule)",
                }}
              >
                <div>
                  <div className="stat-num">15</div>
                  <div className="stat-label" style={{ marginTop: 6 }}>
                    active regions
                  </div>
                </div>
                <div>
                  <div className="stat-num">
                    99.9<span style={{ fontSize: ".5em", color: "var(--ink-3)" }}>%</span>
                  </div>
                  <div className="stat-label" style={{ marginTop: 6 }}>
                    uptime target *
                  </div>
                </div>
                <div>
                  <div className="stat-num">~10K</div>
                  <div className="stat-label" style={{ marginTop: 6 }}>
                    ad imp. / unit / mo *
                  </div>
                </div>
              </div>
            </div>
            <div style={{ gridColumn: "span 5", position: "relative" }}>
              <div
                style={{
                  height: 520,
                  background: "var(--bg-sunken)",
                  border: "1px solid var(--rule)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <img
                  src="/assets/machine-render.png"
                  alt="AutoVend SmartMart unit — product render"
                  width={1356}
                  height={1160}
                  fetchPriority="high"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: -16,
                  top: 24,
                  background: "var(--bg)",
                  border: "1px solid var(--rule)",
                  padding: "10px 12px",
                  borderRadius: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-3)",
                  letterSpacing: ".04em",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  boxShadow: "0 8px 24px rgba(0,0,0,.06)",
                }}
              >
                <span>UNIT · AV-0421</span>
                <span style={{ color: "var(--good)" }}>● ONLINE · STOCK 92%</span>
              </div>
              <div
                style={{
                  position: "absolute",
                  right: -8,
                  bottom: 32,
                  background: "var(--ink)",
                  color: "var(--bg)",
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: ".04em",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  boxShadow: "0 12px 32px rgba(0,0,0,.18)",
                }}
              >
                <span style={{ opacity: 0.6 }}>SALES TODAY</span>
                <span style={{ fontSize: 14 }}>$182.40 · 38 vends</span>
              </div>
            </div>
          </div>
          <div
            className="meta"
            style={{ marginTop: 56, display: "flex", justifyContent: "space-between" }}
          >
            <span>* TARGET METRICS · DEMO · SUBJECT TO VENUE & CAMPAIGN</span>
            <span>FIG · 01 — UNIT LV-4 · PRODUCT RENDER</span>
          </div>
        </div>
      </section>

      {/* Audience segmentation */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="WHO IT'S FOR · 03 PATHS"
            title="One platform. Three audiences."
            lead="AutoVend runs as connected hardware, software, and an HD ad surface. Each audience gets a tailored entry point — pick yours."
          />
          <div className="grid-12">
            {AUDIENCES.map((c) => (
              <div key={c.tag} className="aud-card" style={{ gridColumn: "span 4" }}>
                <span className="meta aud-tag">{c.tag}</span>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
                <Link to={c.to} className="aud-cta">
                  <span>{c.cta}</span>
                  <span style={{ color: "var(--accent)" }}>↗</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section
        className="section"
        style={{ borderTop: "1px solid var(--rule)", background: "var(--bg-elev)" }}
      >
        <div className="container">
          <SectionHeader
            eyebrow="THE STACK · 06 SYSTEMS"
            title="Predictive retail, end-to-end."
            lead="Hardware, telemetry, payments, ad surface, dashboard, assortment — built to run together."
            action={
              <Link to="/features" className="btn btn-ghost">
                All features →
              </Link>
            }
          />
          <div className="grid-12">
            {FEATURES.map((f) => (
              <div
                key={f.code}
                style={{
                  gridColumn: "span 4",
                  padding: "24px 0",
                  borderTop: "1px solid var(--rule-2)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  minHeight: 220,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span className="meta">{f.code} / 06</span>
                  <span className="stat-label" style={{ color: "var(--ink-4)" }}>
                    {f.metric.l}
                  </span>
                </div>
                <h3 style={{ fontSize: 22, lineHeight: 1.15, marginTop: 4 }}>{f.title}</h3>
                <p style={{ color: "var(--ink-3)", fontSize: 14, margin: 0 }}>{f.body}</p>
                <div
                  className="stat-num"
                  style={{ fontSize: 30, color: "var(--accent)", marginTop: "auto" }}
                >
                  {f.metric.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reach map teaser */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="OUR REACH · 15 ACTIVE · 7 EXPANSION"
            title="Operating coast to coast."
            lead="No granular addresses — only regional footprint and where we're growing next. Click through to see the full reach map."
            action={
              <Link to="/reach" className="btn btn-ghost">
                Open reach map →
              </Link>
            }
          />
          <ReachMap regions={DEMO_REGIONS} compact />
        </div>
      </section>

      {/* Dashboard teaser */}
      <section
        className="section"
        style={{ background: "var(--bg-sunken)", borderTop: "1px solid var(--rule)" }}
      >
        <div className="container">
          <SectionHeader
            eyebrow="OPERATOR CONSOLE · GATED PREVIEW"
            title="One pane of glass for the fleet."
            lead="Uptime, sales velocity, machine health, low-stock alerts, route priority, ad performance. Gated demo with sample data — request access to explore."
            action={
              <Link to="/dashboard-demo" className="btn btn-primary btn-arrow">
                Open dashboard demo
              </Link>
            }
          />
          <div
            style={{
              position: "relative",
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid var(--rule)",
            }}
          >
            <Placeholder label="OPERATOR DASHBOARD · OVERVIEW · DEMO" height={420} />
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--rule)" }}>
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <h2 className="h2" style={{ maxWidth: "26ch" }}>
            Bring AutoVend to your venue.
          </h2>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/contact?form=placement" className="btn btn-accent btn-arrow">
              Request placement
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              General contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
