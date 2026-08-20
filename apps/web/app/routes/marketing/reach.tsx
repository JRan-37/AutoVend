import { useState } from "react";
import { Link } from "react-router";
import type { RegionView } from "@autovend/contracts";
import { PageHeader, SectionHeader } from "../../components/primitives";
import { ReachMap } from "../../components/ReachMap";
import { DEMO_REGIONS } from "../../features/demo/demoData";

export function meta() {
  return [
    { title: "Reach — AutoVend Systems" },
    {
      name: "description",
      content:
        "AutoVend operates in 15 active metropolitan regions with 7 expansion zones — regional footprint only, no granular addresses.",
    },
  ];
}

export default function ReachPage() {
  const [sel, setSel] = useState<RegionView | null>(null);
  const active = DEMO_REGIONS.filter((r) => r.status === "active");
  const expansion = DEMO_REGIONS.filter((r) => r.status === "expansion");

  return (
    <main>
      <PageHeader
        kicker="OUR REACH · 15 ACTIVE / 7 EXPANSION"
        title="Coast to coast, growing inland."
        lead="High-level density only. Specific venues, partner names, and machine addresses are kept private — disclosed under NDA to prospective location and advertising partners."
      />
      <section className="section">
        <div className="container">
          <ReachMap regions={DEMO_REGIONS} onSelect={setSel} selected={sel} />
        </div>
      </section>
      <section
        className="section"
        style={{ borderTop: "1px solid var(--rule)", background: "var(--bg-elev)" }}
      >
        <div className="container grid-12">
          <div style={{ gridColumn: "span 7" }}>
            <SectionHeader eyebrow="ACTIVE HUBS · 15" title="Where we operate today." />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
                background: "var(--rule)",
                border: "1px solid var(--rule)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {active.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSel(r)}
                  style={{
                    background: sel?.id === r.id ? "var(--accent-soft)" : "var(--bg)",
                    border: 0,
                    padding: 16,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div
                    className="meta"
                    style={{ color: sel?.id === r.id ? "var(--accent)" : "var(--ink-3)" }}
                  >
                    {r.state}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{r.name}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ gridColumn: "span 5" }}>
            <SectionHeader eyebrow="EXPANSION · 07" title="Where we're heading next." />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                border: "1px solid var(--rule)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {expansion.map((r, i) => (
                <li
                  key={r.id}
                  style={{
                    padding: 16,
                    background: "var(--bg)",
                    borderTop: i ? "1px solid var(--rule)" : "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500 }}>
                    {r.name}, {r.state}
                  </span>
                  <span className="tag warn">COMING SOON</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 24 }}>
              <Link to="/contact?form=suggest" className="btn btn-ghost btn-arrow">
                Suggest a location
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
