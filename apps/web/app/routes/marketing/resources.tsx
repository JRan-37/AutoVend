import { PageHeader } from "../../components/primitives";

export function meta() {
  return [
    { title: "Resources — AutoVend Systems" },
    {
      name: "description",
      content: "Whitepapers, case studies, and field notes from the AutoVend team.",
    },
  ];
}

const ITEMS = [
  {
    tag: "WHITEPAPER",
    t: "Predictive Retail · A Field Manual",
    d: "How AI-driven assortment, telemetry, and ad inventory turn vending into infrastructure.",
    status: "Q3 2026 · placeholder",
  },
  {
    tag: "CASE STUDY",
    t: "Equinox Buckhead · 90-day pilot",
    d: "Stockout-rate reduction, basket-size lift, and operator hours saved across a 4-unit pilot.",
    status: "draft · placeholder",
  },
  {
    tag: "ARTICLE",
    t: "Vending in 2026: 6 shifts to watch",
    d: "Cashless-first, ad-network plays, fresh formats, and the operational stack to run them.",
    status: "placeholder",
  },
  {
    tag: "FAQ",
    t: "Operator FAQ",
    d: "Answers for property managers, HR teams, and venue ops on placement, share, and service.",
    status: "placeholder",
  },
  {
    tag: "MEDIA KIT",
    t: "Advertising specs & rate card",
    d: "32″ HD specs, daypart rates, prohibited categories, IO templates.",
    status: "Q2 2026 · placeholder",
  },
  {
    tag: "WHITEPAPER",
    t: "Cashless-capable payments",
    d: "How the platform supports modern cashless and biometric-capable payment ecosystems.",
    status: "draft · placeholder",
  },
];

export default function ResourcesPage() {
  return (
    <main>
      <PageHeader
        kicker="RESOURCES · LIBRARY"
        title="Whitepapers, case studies, and field notes."
        lead="A growing library of public material from the AutoVend team. Items marked placeholder will be filled in as content clears review."
      />
      <section className="section">
        <div className="container">
          <div className="grid-12">
            {ITEMS.map((it) => (
              <article
                key={it.t}
                className="card card-pad"
                style={{
                  gridColumn: "span 4",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  minHeight: 260,
                }}
              >
                <span className="meta" style={{ color: "var(--accent)" }}>
                  {it.tag}
                </span>
                <h3 style={{ fontSize: 20 }}>{it.t}</h3>
                <p style={{ color: "var(--ink-3)", fontSize: 13.5, margin: 0, flex: 1 }}>{it.d}</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 16,
                    borderTop: "1px solid var(--rule)",
                  }}
                >
                  <span className="tag">{it.status.toUpperCase()}</span>
                  <span
                    style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}
                  >
                    READ →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
