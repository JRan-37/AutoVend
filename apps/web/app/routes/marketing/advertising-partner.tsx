import { Link } from "react-router";
import { PageHeader, Placeholder } from "../../components/primitives";

export function meta() {
  return [
    { title: "Advertising partners — AutoVend Systems" },
    {
      name: "description",
      content:
        "32″ HD portrait displays at the point of purchase — full-motion creative, daypart scheduling, QR-paired activations across the AutoVend network.",
    },
  ];
}

const SPECS = [
  { v: "1080×1920", l: "creative spec · h.264 / mp4" },
  { v: "15s / 30s", l: "standard spot length" },
  { v: "QR-paired", l: "scan-to-activation · mobile" },
  { v: "Daypart", l: "morning / mid / evening blocks" },
  { v: "Per-venue", l: "buy by region or venue type" },
  { v: "Reportable", l: "imp · CTR · QR scans · weekly" },
];

export default function AdvertisingPartnerPage() {
  return (
    <main>
      <PageHeader
        kicker="SOLUTIONS · 02 OF 02 · ADVERTISING PARTNERS"
        title="Reach buyers at the moment of purchase."
        lead="Every AutoVend unit ships with a 32-inch HD portrait display calibrated for daylit lobbies. Brands run full-motion creative, schedule by daypart, and pair QR for mobile activations — placed in offices, gyms, hospitals, and campuses we already serve."
        meta={
          <>
            <span>
              <span className="dot" /> 32″ HD PORTRAIT · 1080×1920 · 60FPS
            </span>
            <span>
              <span className="dot" /> ~10K MO IMP. / UNIT · EST. *
            </span>
            <span style={{ marginLeft: "auto" }}>QR-PAIRED ACTIVATIONS · DAYPART SCHEDULING</span>
          </>
        }
      />

      <section className="section">
        <div className="container grid-12">
          <div style={{ gridColumn: "span 5" }}>
            <Placeholder label="32″ DISPLAY · CREATIVE MOCKUP" height={520} />
          </div>
          <div style={{ gridColumn: "span 7" }}>
            <h2 className="h2" style={{ marginBottom: 16 }}>
              The local network you can actually measure.
            </h2>
            <p className="lead">
              Out-of-home, but with attribution. Each unit reports impressions, daypart, and QR
              scans back to the AutoVend campaign console. Buy by region, by venue type, or by
              machine — and see what worked.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1,
                marginTop: 32,
                background: "var(--rule)",
                border: "1px solid var(--rule)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {SPECS.map((r) => (
                <div key={r.v} style={{ background: "var(--bg)", padding: 20 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {r.v}
                  </div>
                  <div className="stat-label" style={{ marginTop: 6 }}>
                    {r.l}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 24,
                padding: 16,
                border: "1px dashed var(--rule-2)",
                borderRadius: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                color: "var(--ink-3)",
                letterSpacing: ".03em",
                lineHeight: 1.6,
              }}
            >
              * Estimated ~10K monthly impressions per machine. Actuals depend on venue traffic and
              campaign schedule. Pricing, inventory, and prohibited categories confirmed at IO.
            </div>
          </div>
        </div>
      </section>

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
            Plan a campaign on the AutoVend network.
          </h2>
          <Link to="/contact?form=advertising" className="btn btn-accent btn-arrow">
            Explore advertising
          </Link>
        </div>
      </section>
    </main>
  );
}
