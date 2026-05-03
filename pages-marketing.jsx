/* AutoVend — Marketing pages: Home, Location Partner, Advertising Partner, Features, Reach, Operating Area, Resources */
const { useState: uS, useEffect: uE } = React;

// ── Homepage ────────────────────────────────────────────────────────
function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section style={{ borderBottom: "1px solid var(--rule)", paddingTop: 64, paddingBottom: 64, position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ position: "relative", marginBottom: 16, paddingTop: 76, paddingBottom: 60 }}>
              <img src="assets/autovend-logo-trans.png" alt="" aria-hidden="true" style={{
                position: "absolute", left: "50%", top: "50%",
                transform: "translate(-50%, -50%)",
                height: 432, width: "auto",
                opacity: 1, pointerEvents: "none",
                zIndex: 0,
              }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: ".05em", textTransform: "uppercase" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span className="dot" /> AutoVend Systems · v0.4 · May 2026
              </span>
              <span>Predictive automated retail · 15 regions active</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "end" }}>
            <div>
              <h1 className="display">
                Vending,<br />operated like<br /><span style={{ color: "var(--accent)" }}>infrastructure.</span>
              </h1>
              <p className="lead" style={{ marginTop: 28, fontSize: 19 }}>
                AutoVend builds predictive, AI-driven automated retail. Smart hardware, fleet telemetry, and a 32″ HD ad surface — operated as one platform. Your venue gets a modern amenity. We handle the rest.
              </p>
              <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/contact?form=placement" className="btn btn-primary btn-arrow">Request Smart Placement demo</Link>
                <Link to="/dashboard-demo" className="btn btn-ghost">View dashboard preview</Link>
              </div>
              <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, paddingTop: 28, borderTop: "1px solid var(--rule)" }}>
                <div><div className="stat-num">15</div><div className="stat-label" style={{ marginTop: 6 }}>active regions</div></div>
                <div><div className="stat-num">99.9<span style={{ fontSize: ".5em", color: "var(--ink-3)" }}>%</span></div><div className="stat-label" style={{ marginTop: 6 }}>uptime target *</div></div>
                <div><div className="stat-num">~10K</div><div className="stat-label" style={{ marginTop: 6 }}>ad imp. / unit / mo *</div></div>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ height: 520, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-2)", border: "1px solid var(--rule)", borderRadius: 12, overflow: "hidden", padding: 24 }}>
                <img src="assets/machine-render.png" alt="AutoVend SmartMart unit — portrait 32″ ad header, glass-front grab-and-go" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", display: "block" }} />
              </div>
              <div style={{ position: "absolute", left: -16, top: 24, background: "var(--bg)", border: "1px solid var(--rule)", padding: "10px 12px", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: ".04em", display: "flex", flexDirection: "column", gap: 4, boxShadow: "0 8px 24px rgba(0,0,0,.06)" }}>
                <span>UNIT · AV-0421</span><span style={{ color: "var(--good)" }}>● ONLINE · STOCK 92%</span>
              </div>
              <div style={{ position: "absolute", right: -8, bottom: 32, background: "var(--ink)", color: "var(--bg)", padding: "10px 14px", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".04em", display: "flex", flexDirection: "column", gap: 2, boxShadow: "0 12px 32px rgba(0,0,0,.18)" }}>
                <span style={{ opacity: 0.6 }}>SALES TODAY</span><span style={{ fontSize: 14 }}>$182.40 · 38 vends</span>
              </div>
            </div>
          </div>
          <div className="meta" style={{ marginTop: 56, display: "flex", justifyContent: "space-between" }}>
            <span>* TARGET METRICS · DEMO · SUBJECT TO VENUE & CAMPAIGN</span>
            <span>FIG · 01 — UNIT LV-4 · GLASS-FRONT GRAB &amp; GO</span>
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
            {[
              {
                tag: "01 · LOCATION PARTNERS",
                t: "A modern amenity. Zero operational load.",
                d: "Property managers, gym owners, HR, hospitals, campuses, hotels. We place, restock, maintain, and pay you a partnership share. You get a high-tech amenity your visitors actually use.",
                cta: "Request Smart Placement demo →", to: "/solutions/location-partner",
              },
              {
                tag: "02 · ADVERTISING PARTNERS",
                t: "32″ HD screens at point-of-purchase.",
                d: "High-traffic offices, gyms, transit, and campuses become a measurable local digital media network. Full-motion creative, daypart scheduling, QR pairing.",
                cta: "Explore advertising →", to: "/solutions/advertising-partner",
              },
              {
                tag: "03 · END USERS",
                t: "Faster, healthier, more honest vending.",
                d: "Tap to pay. Better assortment. Tell us what you want and we'll get it stocked. No more dusty machines that eat your dollar.",
                cta: "Suggest products →", to: "/survey",
              },
            ].map((c, i) => (
              <div key={i} className="aud-card" style={{ gridColumn: "span 4" }}>
                <span className="meta aud-tag">{c.tag}</span>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
                <Link to={c.to} className="aud-cta">
                  <span>{c.cta}</span><span style={{ color: "var(--accent)" }}>↗</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="section" style={{ borderTop: "1px solid var(--rule)", background: "var(--bg-elev)" }}>
        <div className="container">
          <SectionHeader
            eyebrow="THE STACK · 06 SYSTEMS"
            title="Predictive retail, end-to-end."
            lead="Hardware, telemetry, payments, ad surface, dashboard, assortment — built to run together."
            action={<Link to="/features" className="btn btn-ghost">All features →</Link>}
          />
          <div className="grid-12">
            {window.AV_DATA.FEATURES.slice(0, 6).map((f) => (
              <div key={f.code} style={{ gridColumn: "span 4", padding: "24px 0", borderTop: "1px solid var(--rule-2)", display: "flex", flexDirection: "column", gap: 12, minHeight: 220 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="meta">{f.code} / 06</span>
                  <span className="stat-label" style={{ color: "var(--ink-4)" }}>{f.metric.l}</span>
                </div>
                <h3 style={{ fontSize: 22, lineHeight: 1.15, marginTop: 4 }}>{f.title}</h3>
                <p style={{ color: "var(--ink-3)", fontSize: 14, margin: 0 }}>{f.body}</p>
                <div className="stat-num" style={{ fontSize: 30, color: "var(--accent)", marginTop: "auto" }}>{f.metric.v}</div>
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
            action={<Link to="/reach" className="btn btn-ghost">Open reach map →</Link>}
          />
          <ReachMap compact />
        </div>
      </section>

      {/* Dashboard teaser */}
      <section className="section" style={{ background: "var(--bg-sunken)", borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <SectionHeader
            eyebrow="OPERATOR CONSOLE · PHASE 2 PREVIEW"
            title="One pane of glass for the fleet."
            lead="Uptime, sales velocity, machine health, low-stock alerts, route priority, ad performance. Gated demo with sample data — request access to explore."
            action={<Link to="/dashboard-demo" className="btn btn-primary btn-arrow">Open dashboard demo</Link>}
          />
          <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: "1px solid var(--rule)" }}>
            <Placeholder label="OPERATOR DASHBOARD · OVERVIEW · DEMO" height={420} />
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="section-tight" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <h2 className="h2" style={{ maxWidth: "26ch" }}>Bring AutoVend to your venue.</h2>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/contact?form=placement" className="btn btn-accent btn-arrow">Request placement</Link>
            <Link to="/contact" className="btn btn-ghost">General contact</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Generic page header ─────────────────────────────────────────────
function PageHeader({ kicker, title, lead, meta }) {
  return (
    <section style={{ borderBottom: "1px solid var(--rule)", padding: "80px 0 56px" }}>
      <div className="container">
        <div className="eyebrow" style={{ marginBottom: 24 }}>{kicker}</div>
        <h1 className="h1" style={{ maxWidth: "20ch" }}>{title}</h1>
        {lead && <p className="lead" style={{ marginTop: 20, fontSize: 18 }}>{lead}</p>}
        {meta && <div className="meta-row" style={{ marginTop: 32 }}>{meta}</div>}
      </div>
    </section>
  );
}

// ── Location Partner ────────────────────────────────────────────────
function LocationPartnerPage() {
  return (
    <main>
      <PageHeader
        kicker="SOLUTIONS · 01 OF 02 · LOCATION PARTNERS"
        title="A modern amenity, without the operational load."
        lead="Property managers, HR directors, gym owners, hospitals, campuses, hotels — host an AutoVend unit and we handle placement, restocking, maintenance, and assortment. You collect a partnership share and a high-tech amenity your visitors actually use."
        meta={<>
          <span><span className="dot" /> ZERO CAPEX · WE OWN THE HARDWARE</span>
          <span style={{ marginLeft: "auto" }}>FIT · 90 MIN INSTALL · 32″ PORTRAIT · 28″W × 78″H</span>
        </>}
      />

      <section className="section">
        <div className="container grid-12">
          <div style={{ gridColumn: "span 7" }}>
            <Placeholder label="UNIT IN-SITU · LOBBY PHOTO PLACEHOLDER" height={460} />
          </div>
          <div style={{ gridColumn: "span 5", display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              { n: "01", t: "We restock. Predictively.", b: "AI demand-forecast triggers route runs before stock hits threshold. No empty rows. No expired SKUs." },
              { n: "02", t: "We maintain it.", b: "Onboard telemetry catches vend-fail, payment, temp, and door issues before customers do. Service tickets auto-dispatch." },
              { n: "03", t: "We tune the assortment.", b: "Per-machine SKU mix tunes itself against velocity, demographics, and on-machine survey input. Better products. Bigger baskets." },
              { n: "04", t: "You earn a share.", b: "Partnership terms are revenue-share or flat fee, structured around your venue's traffic and footprint." },
            ].map(s => (
              <div key={s.n} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 16, paddingTop: 16, borderTop: "1px solid var(--rule)" }}>
                <span className="meta" style={{ color: "var(--accent)" }}>{s.n}</span>
                <div>
                  <h3 style={{ fontSize: 18, marginBottom: 6 }}>{s.t}</h3>
                  <p style={{ color: "var(--ink-3)", fontSize: 14, margin: 0 }}>{s.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-elev)", borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          <SectionHeader eyebrow="WHO HOSTS US" title="Built for high-traffic venues." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)", borderRadius: 10, overflow: "hidden" }}>
            {[
              { t: "Office towers", d: "200–5,000 daily badge-ins" },
              { t: "Multifamily", d: "Lobby + amenity floors" },
              { t: "Gyms / studios", d: "Pre/post-workout traffic" },
              { t: "Hospitals", d: "Staff lounges + waiting" },
              { t: "Universities", d: "Student unions + libraries" },
              { t: "Hotels", d: "Lobbies + pool decks" },
              { t: "Airports", d: "Concourse + gate areas" },
              { t: "Retail / mall", d: "Common areas + transit hubs" },
            ].map(v => (
              <div key={v.t} style={{ background: "var(--bg)", padding: 24 }}>
                <div className="meta" style={{ marginBottom: 8 }}>VENUE</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{v.t}</div>
                <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{v.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <h2 className="h2" style={{ maxWidth: "26ch" }}>Want a placement quote for your venue?</h2>
          <Link to="/contact?form=placement" className="btn btn-accent btn-arrow">Request Smart Placement</Link>
        </div>
      </section>
    </main>
  );
}

// ── Advertising Partner ─────────────────────────────────────────────
function AdvertisingPartnerPage() {
  return (
    <main>
      <PageHeader
        kicker="SOLUTIONS · 02 OF 02 · ADVERTISING PARTNERS"
        title="Reach buyers at the moment of purchase."
        lead="Every AutoVend unit ships with a 32-inch HD portrait display calibrated for daylit lobbies. Brands run full-motion creative, schedule by daypart, and pair QR for mobile activations — placed in offices, gyms, hospitals, and campuses we already serve."
        meta={<>
          <span><span className="dot" /> 32″ HD PORTRAIT · 1080×1920 · 60FPS</span>
          <span><span className="dot" /> ~10K MO IMP. / UNIT · EST. *</span>
          <span style={{ marginLeft: "auto" }}>QR-PAIRED ACTIVATIONS · DAYPART SCHEDULING</span>
        </>}
      />

      <section className="section">
        <div className="container grid-12">
          <div style={{ gridColumn: "span 5" }}>
            <Placeholder label="32″ DISPLAY · CREATIVE MOCKUP" height={520} />
          </div>
          <div style={{ gridColumn: "span 7" }}>
            <h2 className="h2" style={{ marginBottom: 16 }}>The local network you can actually measure.</h2>
            <p className="lead">
              Out-of-home, but with attribution. Each unit reports impressions, daypart, and QR scans back to the AutoVend campaign console. Buy by region, by venue type, or by machine — and see what worked.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, marginTop: 32, background: "var(--rule)", border: "1px solid var(--rule)", borderRadius: 10, overflow: "hidden" }}>
              {[
                { v: "1080×1920", l: "creative spec · h.264 / mp4" },
                { v: "15s / 30s", l: "standard spot length" },
                { v: "QR-paired", l: "scan-to-activation · mobile" },
                { v: "Daypart", l: "morning / mid / evening blocks" },
                { v: "Per-venue", l: "buy by region or venue type" },
                { v: "Reportable", l: "imp · CTR · QR scans · weekly" },
              ].map((r, i) => (
                <div key={i} style={{ background: "var(--bg)", padding: 20 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>{r.v}</div>
                  <div className="stat-label" style={{ marginTop: 6 }}>{r.l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, padding: 16, border: "1px dashed var(--rule-2)", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-3)", letterSpacing: ".03em", lineHeight: 1.6 }}>
              * Estimated ~10K monthly impressions per machine. Actuals depend on venue traffic and campaign schedule. Pricing, inventory, and prohibited categories confirmed at IO.
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <h2 className="h2" style={{ maxWidth: "26ch" }}>Plan a campaign on the AutoVend network.</h2>
          <Link to="/contact?form=advertising" className="btn btn-accent btn-arrow">Explore advertising</Link>
        </div>
      </section>
    </main>
  );
}

// ── Features ────────────────────────────────────────────────────────
function FeaturesPage() {
  return (
    <main>
      <PageHeader
        kicker="PLATFORM · 06 SYSTEMS"
        title="The predictive retail stack."
        lead="Every AutoVend unit is a node in a connected platform — hardware, telemetry, payments, ad surface, operator dashboard, and assortment intelligence. Built to run as one."
      />
      <section className="section">
        <div className="container">
          {window.AV_DATA.FEATURES.map((f, i) => (
            <div key={f.code} style={{
              display: "grid", gridTemplateColumns: "120px 1fr 280px", gap: 32,
              padding: "40px 0", borderTop: "1px solid var(--rule)", alignItems: "start",
            }}>
              <div className="meta" style={{ color: "var(--accent)" }}>{f.code} / 06</div>
              <div>
                <h2 className="h2" style={{ fontSize: 28, marginBottom: 12 }}>{f.title}</h2>
                <p style={{ color: "var(--ink-2)", fontSize: 15.5, maxWidth: "60ch", lineHeight: 1.55 }}>{f.body}</p>
              </div>
              <div style={{ background: "var(--bg-elev)", border: "1px solid var(--rule)", borderRadius: 10, padding: 20 }}>
                <div className="stat-num" style={{ color: "var(--accent)", fontSize: 36 }}>{f.metric.v}</div>
                <div className="stat-label" style={{ marginTop: 8 }}>{f.metric.l}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// ── Reach ───────────────────────────────────────────────────────────
function ReachPage() {
  const { REGIONS } = window.AV_DATA;
  const [sel, setSel] = uS(null);
  const active = REGIONS.filter(r => r.status === "active");
  const expansion = REGIONS.filter(r => r.status === "expansion");
  return (
    <main>
      <PageHeader
        kicker="OUR REACH · 15 ACTIVE / 7 EXPANSION"
        title="Coast to coast, growing inland."
        lead="High-level density only. Specific venues, partner names, and machine addresses are kept private — disclosed under NDA to prospective location and advertising partners."
      />
      <section className="section">
        <div className="container">
          <ReachMap onSelect={setSel} selected={sel} />
        </div>
      </section>
      <section className="section" style={{ borderTop: "1px solid var(--rule)", background: "var(--bg-elev)" }}>
        <div className="container grid-12">
          <div style={{ gridColumn: "span 7" }}>
            <SectionHeader eyebrow="ACTIVE HUBS · 15" title="Where we operate today." />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)", borderRadius: 10, overflow: "hidden" }}>
              {active.map(r => (
                <button key={r.id} onClick={() => setSel(r)} style={{
                  background: sel && sel.id === r.id ? "var(--accent-soft)" : "var(--bg)",
                  border: 0, padding: 16, textAlign: "left", cursor: "pointer",
                }}>
                  <div className="meta" style={{ color: sel && sel.id === r.id ? "var(--accent)" : "var(--ink-3)" }}>{r.state}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{r.name}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ gridColumn: "span 5" }}>
            <SectionHeader eyebrow="EXPANSION · 07" title="Where we're heading next." />
            <ul style={{ listStyle: "none", padding: 0, margin: 0, border: "1px solid var(--rule)", borderRadius: 10, overflow: "hidden" }}>
              {expansion.map((r, i) => (
                <li key={r.id} style={{ padding: 16, background: "var(--bg)", borderTop: i ? "1px solid var(--rule)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{r.name}, {r.state}</span>
                  <span className="tag warn">COMING SOON</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 24 }}>
              <Link to="/contact?form=suggest" className="btn btn-ghost btn-arrow">Suggest a location</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Operating Area (CTA-focused page about regions + suggest) ───────
function OperatingAreaPage() {
  return (
    <main>
      <PageHeader
        kicker="OPERATING AREA"
        title="Service regions and growth zones."
        lead="AutoVend serves 15 active metropolitan regions and is expanding into 7 more this year. If your venue isn't in our footprint yet, suggest it — we prioritize new regions by density of inbound interest."
      />
      <section className="section">
        <div className="container">
          <ReachMap />
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            <div className="card card-pad">
              <div className="stat-num">15</div>
              <div className="stat-label" style={{ marginTop: 6 }}>active regions</div>
              <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 12 }}>Metropolitan service areas with full route coverage and same-day field response.</p>
            </div>
            <div className="card card-pad">
              <div className="stat-num">07</div>
              <div className="stat-label" style={{ marginTop: 6 }}>expansion zones · 2026</div>
              <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 12 }}>Routes, partner pipeline, and warehouse staging in progress. Pre-launch placements available.</p>
            </div>
            <div className="card card-pad">
              <div className="stat-num">∞</div>
              <div className="stat-label" style={{ marginTop: 6 }}>suggested by you</div>
              <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 12 }}>We weight new region launches by density of inbound venue suggestions.</p>
              <Link to="/contact?form=suggest" className="btn btn-ghost btn-sm btn-arrow" style={{ marginTop: 12 }}>Suggest a location</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Resources (placeholder content per brief) ───────────────────────
function ResourcesPage() {
  const items = [
    { tag: "WHITEPAPER", t: "Predictive Retail · A Field Manual", d: "How AI-driven assortment, telemetry, and ad inventory turn vending into infrastructure.", status: "Q3 2026 · placeholder" },
    { tag: "CASE STUDY", t: "Equinox Buckhead · 90-day pilot", d: "Stockout-rate reduction, basket-size lift, and operator hours saved across a 4-unit pilot.", status: "draft · placeholder" },
    { tag: "ARTICLE", t: "Vending in 2026: 6 shifts to watch", d: "Cashless-first, ad-network plays, fresh formats, and the operational stack to run them.", status: "placeholder" },
    { tag: "FAQ", t: "Operator FAQ", d: "Answers for property managers, HR teams, and venue ops on placement, share, and service.", status: "placeholder" },
    { tag: "MEDIA KIT", t: "Advertising specs & rate card", d: "32″ HD specs, daypart rates, prohibited categories, IO templates.", status: "Q2 2026 · placeholder" },
    { tag: "WHITEPAPER", t: "Cashless-capable payments", d: "How the platform supports modern cashless and biometric-capable payment ecosystems.", status: "draft · placeholder" },
  ];
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
            {items.map((it, i) => (
              <article key={i} className="card card-pad" style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: 12, minHeight: 260 }}>
                <span className="meta" style={{ color: "var(--accent)" }}>{it.tag}</span>
                <h3 style={{ fontSize: 20 }}>{it.t}</h3>
                <p style={{ color: "var(--ink-3)", fontSize: 13.5, margin: 0, flex: 1 }}>{it.d}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid var(--rule)" }}>
                  <span className="tag">{it.status.toUpperCase()}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>READ →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, {
  HomePage, LocationPartnerPage, AdvertisingPartnerPage, FeaturesPage,
  ReachPage, OperatingAreaPage, ResourcesPage, PageHeader,
});
