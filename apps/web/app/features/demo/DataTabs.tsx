import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MACHINE_STATUS_LABELS,
  MACHINE_STATUSES,
  type ConsoleReadApi,
  type MachineStatus,
} from "@autovend/contracts";
import { DataState } from "../../components/DataState";
import { SparkBars, StatCard } from "../../components/primitives";
import { formatInt, formatMoneyMinor, formatMoneyMinorCompact } from "../../lib/format";

const STATUS_COLOR: Record<MachineStatus, string> = {
  online: "var(--good)",
  low_stock: "var(--warn)",
  service: "var(--warn)",
  offline: "var(--bad)",
};

export function MachinesTab({ api }: { api: ConsoleReadApi }) {
  const query = useQuery({ queryKey: ["demo", "machines"], queryFn: () => api.getMachines() });
  const [filter, setFilter] = useState<"all" | MachineStatus>("all");

  return (
    <div className="dash-pad">
      <DataState
        query={query}
        loadingHeight={360}
        loadingLines={8}
        isEmpty={(rows) => rows.length === 0}
        emptyTitle="NO MACHINES YET"
        emptyHint="Fleet machines appear here once registered."
      >
        {(rows) => {
          const filtered = filter === "all" ? rows : rows.filter((m) => m.status === filter);
          return (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div className="stat-label" style={{ color: "var(--dink-3)" }}>
                    FLEET
                  </div>
                  <h2 className="h2" style={{ marginTop: 4, color: "var(--dink)" }}>
                    {rows.length} machines
                  </h2>
                </div>
                <div
                  className="segments"
                  style={{ background: "var(--dbg-sunken)", borderColor: "var(--drule)" }}
                >
                  <button
                    type="button"
                    className={filter === "all" ? "on" : ""}
                    onClick={() => setFilter("all")}
                    style={{ color: filter === "all" ? "var(--dink)" : "var(--dink-3)" }}
                  >
                    ALL
                  </button>
                  {MACHINE_STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={filter === s ? "on" : ""}
                      onClick={() => setFilter(s)}
                      style={{ color: filter === s ? "var(--dink)" : "var(--dink-3)" }}
                    >
                      {MACHINE_STATUS_LABELS[s].toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="data-state" style={{ borderColor: "var(--drule-2)" }}>
                  <span className="data-state-title">NO MACHINES MATCH THIS FILTER</span>
                </div>
              ) : (
                <div className="dash-table">
                  <div className="dash-thead cols-machines">
                    <span>MACHINE</span>
                    <span>VENUE</span>
                    <span>REGION</span>
                    <span style={{ textAlign: "right" }}>HEALTH</span>
                    <span style={{ textAlign: "right" }}>STOCK</span>
                    <span style={{ textAlign: "right" }}>SALES 30D</span>
                    <span style={{ textAlign: "right" }}>STATUS</span>
                  </div>
                  {filtered.map((m) => (
                    <div key={m.serial} className="dash-row cols-machines">
                      <span style={{ fontFamily: "var(--font-mono)", color: "var(--dink)" }}>
                        {m.serial}
                      </span>
                      <span style={{ color: "var(--dink)" }}>{m.venue}</span>
                      <span>{m.region}</span>
                      <span
                        className="dash-num"
                        style={{
                          color:
                            m.healthPct === 0
                              ? "var(--bad)"
                              : m.healthPct < 80
                                ? "var(--warn)"
                                : "var(--dink)",
                        }}
                      >
                        {m.healthPct}%
                      </span>
                      <span
                        className="dash-num"
                        style={{
                          color:
                            m.stockPct < 50
                              ? "var(--bad)"
                              : m.stockPct < 70
                                ? "var(--warn)"
                                : "var(--dink)",
                        }}
                      >
                        {m.stockPct}%
                      </span>
                      <span className="dash-num" style={{ color: "var(--dink)" }}>
                        {formatMoneyMinor(m.sales30dMinor)}
                      </span>
                      <span className="dash-status" style={{ color: STATUS_COLOR[m.status] }}>
                        <span className="sdot" />
                        {MACHINE_STATUS_LABELS[m.status].toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          );
        }}
      </DataState>
    </div>
  );
}

export function SalesTab({ api }: { api: ConsoleReadApi }) {
  const sales = useQuery({ queryKey: ["demo", "sales"], queryFn: () => api.getSalesDailyMinor() });
  const products = useQuery({
    queryKey: ["demo", "products"],
    queryFn: () => api.getTopProducts(),
  });

  return (
    <div className="dash-pad">
      <h2 className="h2" style={{ color: "var(--dink)" }}>
        Sales
      </h2>
      <DataState
        query={sales}
        loadingHeight={220}
        loadingLines={4}
        isEmpty={(d) => d.length === 0}
        emptyTitle="NO SALES RECORDED"
        emptyHint="Daily totals appear once transactions flow."
      >
        {(daily) => {
          const totalMinor = daily.reduce((a, b) => a + b, 0);
          return (
            <>
              <div className="dash-grid-3">
                <StatCard
                  label="Gross · 30d"
                  value={formatMoneyMinorCompact(totalMinor)}
                  delta="↑ 12.4%"
                  footnote="DEMO"
                />
                <StatCard label="Avg basket" value="$4.82" delta="↑ $0.31" footnote="DEMO" />
                <StatCard label="Vend success rate" value="99.4%" delta="↑ 0.2pt" footnote="DEMO" />
              </div>
              <div className="dash-panel">
                <div className="stat-label" style={{ color: "var(--dink-3)", marginBottom: 16 }}>
                  DAILY SALES · LAST 30 DAYS
                </div>
                <SparkBars data={daily} height={180} />
              </div>
            </>
          );
        }}
      </DataState>
      <div className="dash-panel">
        <div className="stat-label" style={{ color: "var(--dink-3)", marginBottom: 12 }}>
          PRODUCT MIX · TOP 6
        </div>
        <DataState
          query={products}
          loadingHeight={180}
          loadingLines={6}
          isEmpty={(d) => d.length === 0}
          emptyTitle="NO PRODUCT DATA"
        >
          {(rows) => (
            <>
              {rows.map((p, i) => (
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
                        marginTop: 2,
                      }}
                    >
                      {p.sku} · MIX {p.mixPct}%
                    </div>
                  </div>
                  <div style={{ flex: 1, height: 6, background: "var(--drule)", borderRadius: 3 }}>
                    <div
                      style={{
                        width: `${Math.min(100, p.mixPct * 10)}%`,
                        height: "100%",
                        background: "var(--daccent)",
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--dink-2)",
                      width: 80,
                      textAlign: "right",
                    }}
                  >
                    {formatInt(p.units)} u
                  </div>
                </div>
              ))}
            </>
          )}
        </DataState>
      </div>
    </div>
  );
}

export function AdsTab({ api }: { api: ConsoleReadApi }) {
  const query = useQuery({ queryKey: ["demo", "campaigns"], queryFn: () => api.getCampaigns() });

  return (
    <div className="dash-pad">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h2 className="h2" style={{ color: "var(--dink)" }}>
          Ads · 32″ HD network
        </h2>
        <span className="meta-row">
          <span>EST. ~10K MONTHLY IMPRESSIONS / UNIT *</span>
        </span>
      </div>
      <DataState
        query={query}
        loadingHeight={300}
        loadingLines={6}
        isEmpty={(d) => d.length === 0}
        emptyTitle="NO CAMPAIGNS"
        emptyHint="Booked flights appear here."
      >
        {(rows) => {
          const live = rows.filter((c) => c.status === "live").length;
          const totalScans = rows.reduce((a, c) => a + c.qrScans, 0);
          return (
            <>
              <div className="dash-grid-4">
                <StatCard
                  label="Impressions · 30d · est."
                  value="1.34M"
                  delta="↑ 8.1%"
                  footnote="EST. · VENUE-DEPENDENT"
                />
                <StatCard
                  label="QR scans"
                  value={formatInt(totalScans)}
                  delta="↑ 14.6%"
                  footnote="UNIQUE"
                />
                <StatCard
                  label="Active campaigns"
                  value={String(live)}
                  delta={`${rows.filter((c) => c.status === "ending").length} ending soon`}
                  deltaTone="muted"
                  footnote="LIVE"
                />
                <StatCard label="Avg CTR" value="2.4%" delta="↑ 0.3pt" footnote="QR-BASED" />
              </div>
              <div className="dash-table">
                <div className="dash-thead cols-ads">
                  <span>ID</span>
                  <span>BRAND</span>
                  <span>FLIGHT</span>
                  <span style={{ textAlign: "right" }}>IMPRESSIONS</span>
                  <span style={{ textAlign: "right" }}>CTR</span>
                  <span style={{ textAlign: "right" }}>QR SCANS</span>
                  <span style={{ textAlign: "right" }}>STATUS</span>
                </div>
                {rows.map((c) => (
                  <div key={c.id} className="dash-row cols-ads">
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--dink)" }}>
                      {c.id}
                    </span>
                    <span style={{ color: "var(--dink)" }}>{c.brand}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      {c.flightLabel}
                    </span>
                    <span className="dash-num" style={{ color: "var(--dink)" }}>
                      {(c.impressions / 1000).toFixed(0)}K
                    </span>
                    <span className="dash-num">{c.ctrPct}%</span>
                    <span className="dash-num">{formatInt(c.qrScans)}</span>
                    <span
                      className="dash-status"
                      style={{
                        color:
                          c.status === "live"
                            ? "var(--good)"
                            : c.status === "ending"
                              ? "var(--warn)"
                              : "var(--dink-3)",
                      }}
                    >
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--dink-4)" }}
              >
                * Impression estimates depend on venue traffic and campaign schedule. Pricing and
                inventory subject to confirmation.
              </div>
            </>
          );
        }}
      </DataState>
    </div>
  );
}
