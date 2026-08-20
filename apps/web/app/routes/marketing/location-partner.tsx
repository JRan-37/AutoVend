import { Link } from "react-router";
import { PageHeader, Placeholder, SectionHeader } from "../../components/primitives";

export function meta() {
  return [
    { title: "Location partners — AutoVend Systems" },
    {
      name: "description",
      content:
        "Host an AutoVend unit: we handle placement, restocking, maintenance, and assortment. You collect a partnership share.",
    },
  ];
}

const STEPS = [
  {
    n: "01",
    t: "We restock. Predictively.",
    b: "AI demand-forecast triggers route runs before stock hits threshold. No empty rows. No expired SKUs.",
  },
  {
    n: "02",
    t: "We maintain it.",
    b: "Onboard telemetry catches vend-fail, payment, temp, and door issues before customers do. Service tickets auto-dispatch.",
  },
  {
    n: "03",
    t: "We tune the assortment.",
    b: "Per-machine SKU mix tunes itself against velocity, demographics, and on-machine survey input. Better products. Bigger baskets.",
  },
  {
    n: "04",
    t: "You earn a share.",
    b: "Partnership terms are revenue-share or flat fee, structured around your venue's traffic and footprint.",
  },
];

const VENUES = [
  { t: "Office towers", d: "200–5,000 daily badge-ins" },
  { t: "Multifamily", d: "Lobby + amenity floors" },
  { t: "Gyms / studios", d: "Pre/post-workout traffic" },
  { t: "Hospitals", d: "Staff lounges + waiting" },
  { t: "Universities", d: "Student unions + libraries" },
  { t: "Hotels", d: "Lobbies + pool decks" },
  { t: "Airports", d: "Concourse + gate areas" },
  { t: "Retail / mall", d: "Common areas + transit hubs" },
];

export default function LocationPartnerPage() {
  return (
    <main>
      <PageHeader
        kicker="SOLUTIONS · 01 OF 02 · LOCATION PARTNERS"
        title="A modern amenity, without the operational load."
        lead="Property managers, HR directors, gym owners, hospitals, campuses, hotels — host an AutoVend unit and we handle placement, restocking, maintenance, and assortment. You collect a partnership share and a high-tech amenity your visitors actually use."
        meta={
          <>
            <span>
              <span className="dot" /> ZERO CAPEX · WE OWN THE HARDWARE
            </span>
            <span style={{ marginLeft: "auto" }}>
              FIT · 90 MIN INSTALL · 32″ PORTRAIT · 28″W × 78″H
            </span>
          </>
        }
      />

      <section className="section">
        <div className="container grid-12">
          <div style={{ gridColumn: "span 7" }}>
            <Placeholder label="UNIT IN-SITU · LOBBY PHOTO PLACEHOLDER" height={460} />
          </div>
          <div style={{ gridColumn: "span 5", display: "flex", flexDirection: "column", gap: 24 }}>
            {STEPS.map((s) => (
              <div
                key={s.n}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr",
                  gap: 16,
                  paddingTop: 16,
                  borderTop: "1px solid var(--rule)",
                }}
              >
                <span className="meta" style={{ color: "var(--accent)" }}>
                  {s.n}
                </span>
                <div>
                  <h3 style={{ fontSize: 18, marginBottom: 6 }}>{s.t}</h3>
                  <p style={{ color: "var(--ink-3)", fontSize: 14, margin: 0 }}>{s.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{ background: "var(--bg-elev)", borderTop: "1px solid var(--rule)" }}
      >
        <div className="container">
          <SectionHeader eyebrow="WHO HOSTS US" title="Built for high-traffic venues." />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 1,
              background: "var(--rule)",
              border: "1px solid var(--rule)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {VENUES.map((v) => (
              <div key={v.t} style={{ background: "var(--bg)", padding: 24 }}>
                <div className="meta" style={{ marginBottom: 8 }}>
                  VENUE
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{v.t}</div>
                <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{v.d}</div>
              </div>
            ))}
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
            Want a placement quote for your venue?
          </h2>
          <Link to="/contact?form=placement" className="btn btn-accent btn-arrow">
            Request Smart Placement
          </Link>
        </div>
      </section>
    </main>
  );
}
