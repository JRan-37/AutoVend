import { PageHeader } from "../../components/primitives";
import { FEATURES } from "../../features/marketing/content";

export function meta() {
  return [
    { title: "Features — AutoVend Systems" },
    {
      name: "description",
      content:
        "The predictive retail stack: hardware, telemetry, payments, ad surface, operator dashboard, and assortment intelligence.",
    },
  ];
}

export default function FeaturesPage() {
  return (
    <main>
      <PageHeader
        kicker="PLATFORM · 06 SYSTEMS"
        title="The predictive retail stack."
        lead="Every AutoVend unit is a node in a connected platform — hardware, telemetry, payments, ad surface, operator dashboard, and assortment intelligence. Built to run as one."
      />
      <section className="section">
        <div className="container">
          {FEATURES.map((f) => (
            <div
              key={f.code}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr 280px",
                gap: 32,
                padding: "40px 0",
                borderTop: "1px solid var(--rule)",
                alignItems: "start",
              }}
            >
              <div className="meta" style={{ color: "var(--accent)" }}>
                {f.code} / 06
              </div>
              <div>
                <h2 className="h2" style={{ fontSize: 28, marginBottom: 12 }}>
                  {f.title}
                </h2>
                <p
                  style={{
                    color: "var(--ink-2)",
                    fontSize: 15.5,
                    maxWidth: "60ch",
                    lineHeight: 1.55,
                  }}
                >
                  {f.body}
                </p>
              </div>
              <div
                style={{
                  background: "var(--bg-elev)",
                  border: "1px solid var(--rule)",
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <div className="stat-num" style={{ color: "var(--accent)", fontSize: 36 }}>
                  {f.metric.v}
                </div>
                <div className="stat-label" style={{ marginTop: 8 }}>
                  {f.metric.l}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
