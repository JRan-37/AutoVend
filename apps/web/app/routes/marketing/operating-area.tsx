import { Link } from "react-router";
import { PageHeader } from "../../components/primitives";
import { ReachMap } from "../../components/ReachMap";
import { DEMO_REGIONS } from "../../features/demo/demoData";

export function meta() {
  return [
    { title: "Operating area — AutoVend Systems" },
    {
      name: "description",
      content:
        "AutoVend serves 15 active metropolitan regions and is expanding into 7 more. Suggest your venue if it isn't in the footprint yet.",
    },
  ];
}

export default function OperatingAreaPage() {
  return (
    <main>
      <PageHeader
        kicker="OPERATING AREA"
        title="Service regions and growth zones."
        lead="AutoVend serves 15 active metropolitan regions and is expanding into 7 more this year. If your venue isn't in our footprint yet, suggest it — we prioritize new regions by density of inbound interest."
      />
      <section className="section">
        <div className="container">
          <ReachMap regions={DEMO_REGIONS} />
          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            <div className="card card-pad">
              <div className="stat-num">15</div>
              <div className="stat-label" style={{ marginTop: 6 }}>
                active regions
              </div>
              <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 12 }}>
                Metropolitan service areas with full route coverage and same-day field response.
              </p>
            </div>
            <div className="card card-pad">
              <div className="stat-num">07</div>
              <div className="stat-label" style={{ marginTop: 6 }}>
                expansion zones · 2026
              </div>
              <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 12 }}>
                Routes, partner pipeline, and warehouse staging in progress. Pre-launch placements
                available.
              </p>
            </div>
            <div className="card card-pad">
              <div className="stat-num">∞</div>
              <div className="stat-label" style={{ marginTop: 6 }}>
                suggested by you
              </div>
              <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 12 }}>
                We weight new region launches by density of inbound venue suggestions.
              </p>
              <Link
                to="/contact?form=suggest"
                className="btn btn-ghost btn-sm btn-arrow"
                style={{ marginTop: 12 }}
              >
                Suggest a location
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
