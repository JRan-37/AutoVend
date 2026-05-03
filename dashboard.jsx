/* AutoVend — Operator Dashboard Demo (gated, multi-tab)
 * All data labeled DEMO/SAMPLE per brief guardrails.
 */
const { useState: useSt_D, useMemo: useM_D } = React;

function DashboardChrome({ children, mode = "dark" }) {
  return (
    <div className={"dash-shell " + mode} style={{
      "--dbg": mode === "dark" ? "#0a0d10" : "#ffffff",
      background: "var(--dbg, var(--bg))",
      color: mode === "dark" ? "#f4f6f7" : "#0d141a",
    }}>
      {/* OS-style chrome bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px",
        borderBottom: "1px solid var(--drule)",
        background: "var(--dbg-sunken)",
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#ff5f57" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#febc2e" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#28c840" }} />
        </div>
        <div style={{
          marginLeft: 14, fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--dink-3)", letterSpacing: ".05em",
        }}>
          OPERATOR · console.autovend.systems · DEMO ENVIRONMENT
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10.5, padding: "3px 8px",
            border: "1px solid var(--daccent)", color: "var(--daccent)",
            borderRadius: 4, letterSpacing: ".06em",
          }}>SAMPLE DATA</span>
        </div>
      </div>
      {children}
    </div>
  );
}

function DashboardSidebar({ tab, setTab }) {
  const items = [
    { id: "overview", label: "Overview", icon: "▦" },
    { id: "machines", label: "Machines", icon: "▤" },
    { id: "sales", label: "Sales", icon: "△" },
    { id: "ads", label: "Ads", icon: "◐" },
  ];
  const minor = [
    { id: "routes", label: "Routes" },
    { id: "alerts", label: "Alerts" },
    { id: "settings", label: "Settings" },
  ];
  return (
    <aside style={{
      width: 220, borderRight: "1px solid var(--drule)",
      background: "var(--dbg-sunken)",
      padding: "16px 12px",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--dink-3)",
        letterSpacing: ".08em", textTransform: "uppercase",
        padding: "8px 12px 6px",
      }}>FLEET OPS</div>
      {items.map(it => (
        <button key={it.id} onClick={() => setTab(it.id)} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 12px", borderRadius: 6,
          border: 0, textAlign: "left",
          background: tab === it.id ? "var(--daccent-soft)" : "transparent",
          color: tab === it.id ? "var(--daccent)" : "var(--dink-2)",
          fontSize: 13.5, fontFamily: "inherit",
          cursor: "pointer",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", opacity: 0.7, width: 14 }}>{it.icon}</span>
          {it.label}
        </button>
      ))}
      <div style={{ height: 16 }} />
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--dink-3)",
        letterSpacing: ".08em", textTransform: "uppercase",
        padding: "8px 12px 6px",
      }}>OPS</div>
      {minor.map(it => (
        <button key={it.id} onClick={() => setTab(it.id)} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 12px", borderRadius: 6,
          border: 0, textAlign: "left",
          background: tab === it.id ? "var(--daccent-soft)" : "transparent",
          color: tab === it.id ? "var(--daccent)" : "var(--dink-2)",
          fontSize: 13.5, fontFamily: "inherit",
          cursor: "pointer",
        }}>{it.label}</button>
      ))}
      <div style={{ marginTop: "auto", padding: 12, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--dink-4)", letterSpacing: ".05em" }}>
        OPERATOR · CO@AUTOVEND<br />Region · SE-01
      </div>
    </aside>
  );
}

function OverviewTab() {
  const { SALES_30D, FLEET_HEALTH, TOP_PRODUCTS } = window.AV_DATA;
  const totalSales = SALES_30D.reduce((a, b) => a + b, 0);
  const onlineCount = FLEET_HEALTH.filter(m => m.status === "online").length;
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div className="stat-label" style={{ color: "var(--dink-3)" }}>FLEET OVERVIEW · LAST 30 DAYS</div>
          <h2 className="h2" style={{ marginTop: 6, color: "var(--dink)" }}>Good morning, Chisom.</h2>
        </div>
        <div className="meta-row">
          <span><span className="dot" style={{ background: "var(--good)" }} /> ALL SYSTEMS OPERATIONAL · TARGET</span>
          <span>SYNCED 04:21 AGO</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="Fleet uptime · target" value="99.9%" delta="↑ 0.2 vs LM" footnote="ROLLING 30D · DEMO" />
        <StatCard label="Active machines" value={`${onlineCount} / ${FLEET_HEALTH.length}`} delta={`${FLEET_HEALTH.length - onlineCount} attention`} deltaTone="muted" footnote="ONLINE / FLEET" />
        <StatCard label="Sales volume · 30d" value={`$${(totalSales / 1000).toFixed(1)}K`} delta="↑ 12.4%" footnote="GROSS · ALL VENUES" />
        <StatCard label="Ad impressions · est." value="~1.34M" delta="↑ 8.1%" footnote="EST. · VENUE-DEPENDENT *" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 16 }}>
        <div style={{ padding: 20, border: "1px solid var(--drule)", borderRadius: 10, background: "var(--dbg-elev)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <div>
              <div className="stat-label" style={{ color: "var(--dink-3)" }}>SALES · DAILY · 30D</div>
              <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--dink)", marginTop: 4 }}>${(totalSales / 1000).toFixed(1)}K</div>
            </div>
            <div className="segments" style={{ background: "var(--dbg-sunken)", borderColor: "var(--drule)" }}>
              <button className="on" style={{ color: "var(--dink)" }}>30D</button>
              <button>90D</button>
              <button>YTD</button>
            </div>
          </div>
          <SparkBars data={SALES_30D} height={120} accent="var(--daccent)" muted="var(--drule-2)" />
          <div className="meta-row" style={{ marginTop: 8, color: "var(--dink-4)" }}>
            <span>APR 04</span>
            <span style={{ marginLeft: "auto" }}>MAY 03</span>
          </div>
        </div>

        <div style={{ padding: 20, border: "1px solid var(--drule)", borderRadius: 10, background: "var(--dbg-elev)" }}>
          <div className="stat-label" style={{ color: "var(--dink-3)", marginBottom: 12 }}>LOW STOCK · ATTENTION</div>
          {FLEET_HEALTH.filter(m => m.stock < 70 && m.status !== "offline").slice(0, 4).map(m => (
            <div key={m.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderTop: "1px solid var(--drule)",
            }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--dink)" }}>{m.venue}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--dink-3)", letterSpacing: ".04em", marginTop: 2 }}>
                  {m.id} · {m.region.toUpperCase()}
                </div>
              </div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 12,
                color: m.stock < 50 ? "var(--bad)" : "var(--warn)",
              }}>{m.stock}%</div>
            </div>
          ))}
          <button style={{
            marginTop: 12, width: "100%",
            background: "transparent", border: "1px solid var(--drule-2)",
            color: "var(--dink-2)", padding: "8px", borderRadius: 6,
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".05em",
          }}>QUEUE RESTOCK ROUTE →</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ padding: 20, border: "1px solid var(--drule)", borderRadius: 10, background: "var(--dbg-elev)" }}>
          <div className="stat-label" style={{ color: "var(--dink-3)", marginBottom: 12 }}>TOP PRODUCTS · 30D · UNITS</div>
          {TOP_PRODUCTS.slice(0, 5).map((p, i) => (
            <div key={p.sku} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderTop: i ? "1px solid var(--drule)" : "none" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dink-4)", width: 22 }}>{String(i + 1).padStart(2, "0")}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "var(--dink)" }}>{p.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--dink-3)", letterSpacing: ".04em", marginTop: 2 }}>{p.sku}</div>
              </div>
              <div style={{ width: 80, height: 4, background: "var(--drule)", borderRadius: 2 }}>
                <div style={{ width: `${p.mix * 10}%`, height: "100%", background: "var(--daccent)", borderRadius: 2 }} />
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--dink-2)", width: 60, textAlign: "right" }}>{p.units.toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: 20, border: "1px solid var(--drule)", borderRadius: 10, background: "var(--dbg-elev)" }}>
          <div className="stat-label" style={{ color: "var(--dink-3)", marginBottom: 12 }}>RECENT ALERTS</div>
          {[
            { t: "12m", level: "bad", who: "AV-0199 · Mile High", msg: "Heartbeat lost · dispatching field tech" },
            { t: "1h", level: "warn", who: "AV-0488 · Capital One", msg: "Stock < 35% · 4 SKUs flagged" },
            { t: "3h", level: "warn", who: "AV-0289 · Galleria", msg: "Vend-fail rate +6% · door sensor" },
            { t: "6h", level: "good", who: "AV-0418 · Equinox", msg: "Restock complete · 12 SKUs loaded" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderTop: i ? "1px solid var(--drule)" : "none" }}>
              <span style={{
                width: 6, height: 6, borderRadius: 999, marginTop: 6,
                background: a.level === "bad" ? "var(--bad)" : a.level === "warn" ? "var(--warn)" : "var(--good)",
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "var(--dink)" }}>{a.msg}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--dink-3)", letterSpacing: ".04em", marginTop: 2 }}>
                  {a.who} · {a.t} ago
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--dink-4)", letterSpacing: ".04em" }}>
        * Ad-impression estimate ~10K monthly per machine; depends on venue traffic and campaign schedule. All metrics shown are sample data for product preview.
      </div>
    </div>
  );
}

function MachinesTab() {
  const { FLEET_HEALTH } = window.AV_DATA;
  const [filter, setFilter] = useSt_D("all");
  const filtered = filter === "all" ? FLEET_HEALTH : FLEET_HEALTH.filter(m => m.status === filter);
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
        <div>
          <div className="stat-label" style={{ color: "var(--dink-3)" }}>FLEET</div>
          <h2 className="h2" style={{ marginTop: 4, color: "var(--dink)" }}>{FLEET_HEALTH.length} machines</h2>
        </div>
        <div className="segments" style={{ background: "var(--dbg-sunken)", borderColor: "var(--drule)" }}>
          {["all", "online", "low-stock", "service", "offline"].map(s => (
            <button key={s} className={filter === s ? "on" : ""} onClick={() => setFilter(s)} style={{ color: filter === s ? "var(--dink)" : "var(--dink-3)" }}>
              {s.toUpperCase().replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      <div style={{ border: "1px solid var(--drule)", borderRadius: 10, overflow: "hidden", background: "var(--dbg-elev)" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "100px 1.6fr 1fr 80px 80px 80px 100px",
          padding: "12px 16px", borderBottom: "1px solid var(--drule)",
          fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--dink-3)",
          letterSpacing: ".06em", textTransform: "uppercase",
          background: "var(--dbg-sunken)",
        }}>
          <span>MACHINE</span><span>VENUE</span><span>REGION</span>
          <span style={{ textAlign: "right" }}>HEALTH</span>
          <span style={{ textAlign: "right" }}>STOCK</span>
          <span style={{ textAlign: "right" }}>SALES 30D</span>
          <span style={{ textAlign: "right" }}>STATUS</span>
        </div>
        {filtered.map((m, i) => (
          <div key={m.id} style={{
            display: "grid", gridTemplateColumns: "100px 1.6fr 1fr 80px 80px 80px 100px",
            padding: "14px 16px", borderTop: i ? "1px solid var(--drule)" : "none",
            fontSize: 13, color: "var(--dink-2)", alignItems: "center",
          }}>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--dink)" }}>{m.id}</span>
            <span style={{ color: "var(--dink)" }}>{m.venue}</span>
            <span>{m.region}</span>
            <span style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: m.health < 80 ? "var(--warn)" : m.health === 0 ? "var(--bad)" : "var(--dink)" }}>{m.health}%</span>
            <span style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: m.stock < 50 ? "var(--bad)" : m.stock < 70 ? "var(--warn)" : "var(--dink)" }}>{m.stock}%</span>
            <span style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--dink)" }}>${m.sales.toLocaleString()}</span>
            <span style={{ textAlign: "right" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: ".05em",
                color: m.status === "online" ? "var(--good)" : m.status === "offline" ? "var(--bad)" : "var(--warn)",
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: 999,
                  background: m.status === "online" ? "var(--good)" : m.status === "offline" ? "var(--bad)" : "var(--warn)",
                }} />
                {m.status.toUpperCase().replace("-", " ")}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SalesTab() {
  const { SALES_30D, TOP_PRODUCTS } = window.AV_DATA;
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 className="h2" style={{ color: "var(--dink)" }}>Sales</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <StatCard label="Gross · 30d" value={`$${(SALES_30D.reduce((a, b) => a + b, 0) / 1000).toFixed(1)}K`} delta="↑ 12.4%" footnote="DEMO" />
        <StatCard label="Avg basket" value="$4.82" delta="↑ $0.31" footnote="DEMO" />
        <StatCard label="Vend success rate" value="99.4%" delta="↑ 0.2pt" footnote="DEMO" />
      </div>
      <div style={{ padding: 20, border: "1px solid var(--drule)", borderRadius: 10, background: "var(--dbg-elev)" }}>
        <div className="stat-label" style={{ color: "var(--dink-3)", marginBottom: 16 }}>DAILY SALES · LAST 30 DAYS</div>
        <SparkBars data={SALES_30D} height={180} accent="var(--daccent)" muted="var(--drule-2)" />
      </div>
      <div style={{ padding: 20, border: "1px solid var(--drule)", borderRadius: 10, background: "var(--dbg-elev)" }}>
        <div className="stat-label" style={{ color: "var(--dink-3)", marginBottom: 12 }}>PRODUCT MIX · TOP 6</div>
        {TOP_PRODUCTS.map((p, i) => (
          <div key={p.sku} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: i ? "1px solid var(--drule)" : "none" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--dink-4)", width: 22 }}>{String(i + 1).padStart(2, "0")}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "var(--dink)" }}>{p.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--dink-3)", marginTop: 2 }}>{p.sku} · MIX {p.mix}%</div>
            </div>
            <div style={{ flex: 1, height: 6, background: "var(--drule)", borderRadius: 3 }}>
              <div style={{ width: `${p.mix * 10}%`, height: "100%", background: "var(--daccent)", borderRadius: 3 }} />
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--dink-2)", width: 80, textAlign: "right" }}>{p.units.toLocaleString()} u</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdsTab() {
  const { AD_CAMPAIGNS } = window.AV_DATA;
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
        <h2 className="h2" style={{ color: "var(--dink)" }}>Ads · 32″ HD network</h2>
        <span className="meta-row"><span>EST. ~10K MONTHLY IMPRESSIONS / UNIT *</span></span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="Impressions · 30d · est." value="1.34M" delta="↑ 8.1%" footnote="EST. · VENUE-DEPENDENT" />
        <StatCard label="QR scans" value="31.2K" delta="↑ 14.6%" footnote="UNIQUE" />
        <StatCard label="Active campaigns" value="2" delta="1 ending soon" deltaTone="muted" footnote="LIVE" />
        <StatCard label="Avg CTR" value="2.4%" delta="↑ 0.3pt" footnote="QR-BASED" />
      </div>
      <div style={{ border: "1px solid var(--drule)", borderRadius: 10, overflow: "hidden", background: "var(--dbg-elev)" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "90px 1.4fr 1fr 1fr 1fr 1fr 90px",
          padding: "12px 16px", borderBottom: "1px solid var(--drule)",
          fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--dink-3)",
          letterSpacing: ".06em", textTransform: "uppercase",
          background: "var(--dbg-sunken)",
        }}>
          <span>ID</span><span>BRAND</span><span>FLIGHT</span>
          <span style={{ textAlign: "right" }}>IMPRESSIONS</span>
          <span style={{ textAlign: "right" }}>CTR</span>
          <span style={{ textAlign: "right" }}>QR SCANS</span>
          <span style={{ textAlign: "right" }}>STATUS</span>
        </div>
        {AD_CAMPAIGNS.map((c, i) => (
          <div key={c.id} style={{
            display: "grid", gridTemplateColumns: "90px 1.4fr 1fr 1fr 1fr 1fr 90px",
            padding: "14px 16px", borderTop: i ? "1px solid var(--drule)" : "none",
            fontSize: 13, color: "var(--dink-2)", alignItems: "center",
          }}>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--dink)" }}>{c.id}</span>
            <span style={{ color: "var(--dink)" }}>{c.brand}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{c.flight}</span>
            <span style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--dink)" }}>{(c.impressions / 1000).toFixed(0)}K</span>
            <span style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{c.ctr}%</span>
            <span style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>{c.qrScans.toLocaleString()}</span>
            <span style={{ textAlign: "right" }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: ".05em",
                color: c.status === "live" ? "var(--good)" : c.status === "ending" ? "var(--warn)" : "var(--dink-3)",
              }}>{c.status.toUpperCase()}</span>
            </span>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--dink-4)" }}>
        * Impression estimates depend on venue traffic and campaign schedule. Pricing and inventory subject to confirmation.
      </div>
    </div>
  );
}

function GenericTab({ title }) {
  return (
    <div style={{ padding: 40, color: "var(--dink-3)" }}>
      <h2 className="h2" style={{ color: "var(--dink)" }}>{title}</h2>
      <p style={{ marginTop: 12, fontSize: 14, maxWidth: "60ch" }}>
        This module is part of the Phase 2 dashboard scope. Switch to Overview, Machines, Sales, or Ads to explore the demo.
      </p>
    </div>
  );
}

function Dashboard({ mode = "dark" }) {
  const [tab, setTab] = useSt_D("overview");
  return (
    <DashboardChrome mode={mode}>
      <div style={{ display: "flex", minHeight: 720 }}>
        <DashboardSidebar tab={tab} setTab={setTab} />
        <main style={{ flex: 1, overflow: "auto", maxHeight: 720 }}>
          {tab === "overview" && <OverviewTab />}
          {tab === "machines" && <MachinesTab />}
          {tab === "sales" && <SalesTab />}
          {tab === "ads" && <AdsTab />}
          {tab === "routes" && <GenericTab title="Routes" />}
          {tab === "alerts" && <GenericTab title="Alerts" />}
          {tab === "settings" && <GenericTab title="Settings" />}
        </main>
      </div>
    </DashboardChrome>
  );
}

window.Dashboard = Dashboard;
