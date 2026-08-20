import { useQuery } from "@tanstack/react-query";
import type { AlertLevel, ConsoleReadApi } from "@autovend/contracts";
import { DataState } from "../../components/DataState";
import { SparkBars, StatCard } from "../../components/primitives";
import { formatInt, formatMoneyMinorCompact } from "../../lib/format";

const ALERT_COLOR: Record<AlertLevel, string> = {
  critical: "var(--bad)",
  warn: "var(--warn)",
  info: "var(--good)",
};

export function OverviewTab({ api }: { api: ConsoleReadApi }) {
  const query = useQuery({ queryKey: ["demo", "overview"], queryFn: () => api.getOverview() });

  return (
    <div className="dash-pad">
      <DataState
        query={query}
        loadingHeight={420}
        loadingLines={6}
        isEmpty={(o) => o.machinesTotal === 0 && o.salesDailyMinor.length === 0}
        emptyTitle="NO FLEET DATA YET"
        emptyHint="Machines appear here once the fleet reports in."
      >
        {(o) => {
          const totalMinor = o.salesDailyMinor.reduce((a, b) => a + b, 0);
          return (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div className="stat-label" style={{ color: "var(--dink-3)" }}>
                    FLEET OVERVIEW · LAST 30 DAYS
                  </div>
                  <h2 className="h2" style={{ marginTop: 6, color: "var(--dink)" }}>
                    Good morning, operator.
                  </h2>
                </div>
                <div className="meta-row">
                  <span>
                    <span className="dot" style={{ background: "var(--good)" }} /> ALL SYSTEMS
                    OPERATIONAL · TARGET
                  </span>
                  <span>SAMPLE DATA</span>
                </div>
              </div>

              <div className="dash-grid-4">
                <StatCard
                  label="Fleet uptime · target"
                  value={o.uptimeLabel}
                  delta="↑ 0.2 vs LM"
                  footnote="ROLLING 30D · DEMO"
                />
                <StatCard
                  label="Active machines"
                  value={`${o.machinesOnline} / ${o.machinesTotal}`}
                  delta={`${o.machinesTotal - o.machinesOnline} attention`}
                  deltaTone="muted"
                  footnote="ONLINE / FLEET"
                />
                <StatCard
                  label="Sales volume · 30d"
                  value={formatMoneyMinorCompact(totalMinor)}
                  delta="↑ 12.4%"
                  footnote="GROSS · ALL VENUES"
                />
                <StatCard
                  label="Ad impressions · est."
                  value={o.adImpressionsLabel}
                  delta="↑ 8.1%"
                  footnote="EST. · VENUE-DEPENDENT *"
                />
              </div>

              <div className="dash-grid-main">
                <div className="dash-panel">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div className="stat-label" style={{ color: "var(--dink-3)" }}>
                        SALES · DAILY · 30D
                      </div>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 600,
                          fontFamily: "var(--font-display)",
                          color: "var(--dink)",
                          marginTop: 4,
                        }}
                      >
                        {formatMoneyMinorCompact(totalMinor)}
                      </div>
                    </div>
                    <span className="dash-badge">30D</span>
                  </div>
                  <SparkBars data={o.salesDailyMinor} height={120} />
                  <div className="meta-row" style={{ marginTop: 8, color: "var(--dink-4)" }}>
                    <span>DAY 01</span>
                    <span style={{ marginLeft: "auto" }}>TODAY</span>
                  </div>
                </div>

                <div className="dash-panel">
                  <div className="stat-label" style={{ color: "var(--dink-3)", marginBottom: 12 }}>
                    LOW STOCK · ATTENTION
                  </div>
                  {o.lowStock.length === 0 ? (
                    <div className="data-state" style={{ borderColor: "var(--drule-2)" }}>
                      <span className="data-state-title">NOTHING LOW</span>
                      <span>Every machine is stocked above threshold.</span>
                    </div>
                  ) : (
                    o.lowStock.map((m) => (
                      <div key={m.serial} className="dash-list-row">
                        <div>
                          <div style={{ fontSize: 13, color: "var(--dink)" }}>{m.venue}</div>
                          <div
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 10.5,
                              color: "var(--dink-3)",
                              letterSpacing: ".04em",
                              marginTop: 2,
                            }}
                          >
                            {m.serial} · {m.region.toUpperCase()}
                          </div>
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: m.stockPct < 50 ? "var(--bad)" : "var(--warn)",
                          }}
                        >
                          {m.stockPct}%
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="dash-grid-2">
                <div className="dash-panel">
                  <div className="stat-label" style={{ color: "var(--dink-3)", marginBottom: 12 }}>
                    TOP PRODUCTS · 30D · UNITS
                  </div>
                  {o.topProducts.length === 0 ? (
                    <div className="data-state" style={{ borderColor: "var(--drule-2)" }}>
                      <span className="data-state-title">NO SALES YET</span>
                    </div>
                  ) : (
                    o.topProducts.map((p, i) => (
                      <div key={p.sku} className="dash-list-row" style={{ gap: 12 }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: "var(--dink-4)",
                            width: 22,
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, color: "var(--dink)" }}>{p.name}</div>
                          <div
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 10.5,
                              color: "var(--dink-3)",
                              letterSpacing: ".04em",
                              marginTop: 2,
                            }}
                          >
                            {p.sku}
                          </div>
                        </div>
                        <div
                          style={{
                            width: 80,
                            height: 4,
                            background: "var(--drule)",
                            borderRadius: 2,
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(100, p.mixPct * 10)}%`,
                              height: "100%",
                              background: "var(--daccent)",
                              borderRadius: 2,
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "var(--dink-2)",
                            width: 60,
                            textAlign: "right",
                          }}
                        >
                          {formatInt(p.units)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="dash-panel">
                  <div className="stat-label" style={{ color: "var(--dink-3)", marginBottom: 12 }}>
                    RECENT ALERTS
                  </div>
                  {o.alerts.length === 0 ? (
                    <div className="data-state" style={{ borderColor: "var(--drule-2)" }}>
                      <span className="data-state-title">ALL QUIET</span>
                    </div>
                  ) : (
                    o.alerts.map((a, i) => (
                      <div
                        key={i}
                        className="dash-list-row"
                        style={{ justifyContent: "flex-start", gap: 12 }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 999,
                            marginTop: 6,
                            flexShrink: 0,
                            alignSelf: "flex-start",
                            background: ALERT_COLOR[a.level],
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, color: "var(--dink)" }}>{a.message}</div>
                          <div
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 10.5,
                              color: "var(--dink-3)",
                              letterSpacing: ".04em",
                              marginTop: 2,
                            }}
                          >
                            {a.machineSerial} · {a.venue.toUpperCase()} · {a.agoLabel} ago
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  color: "var(--dink-4)",
                  letterSpacing: ".04em",
                }}
              >
                * Ad-impression estimate ~10K monthly per machine; depends on venue traffic and
                campaign schedule. All metrics shown are sample data for product preview.
              </div>
            </>
          );
        }}
      </DataState>
    </div>
  );
}
