import { useState } from "react";
import type { ConsoleReadApi } from "@autovend/contracts";
import { OverviewTab } from "./OverviewTab";
import { AdsTab, MachinesTab, SalesTab } from "./DataTabs";
import "./dashboard.css";

/* Operator console demo shell — ported from prototype dashboard.jsx. Reads
 * exclusively through a ConsoleReadApi (frozen demo data behind the fixtures
 * wrapper); Routes/Alerts/Settings become real modules in Phases 3–4. */

const MAIN_TABS = [
  { id: "overview", label: "Overview", icon: "▦" },
  { id: "machines", label: "Machines", icon: "▤" },
  { id: "sales", label: "Sales", icon: "△" },
  { id: "ads", label: "Ads", icon: "◐" },
] as const;
const MINOR_TABS = [
  { id: "routes", label: "Routes" },
  { id: "alerts", label: "Alerts" },
  { id: "settings", label: "Settings" },
] as const;

type TabId = (typeof MAIN_TABS)[number]["id"] | (typeof MINOR_TABS)[number]["id"];

function ComingTab({ title }: { title: string }) {
  return (
    <div style={{ padding: 40, color: "var(--dink-3)" }}>
      <h2 className="h2" style={{ color: "var(--dink)" }}>
        {title}
      </h2>
      <p style={{ marginTop: 12, fontSize: 14, maxWidth: "60ch" }}>
        This module arrives with the real operator console (roadmap Phases 3–4). Switch to Overview,
        Machines, Sales, or Ads to explore the demo.
      </p>
    </div>
  );
}

export function Dashboard({
  api,
  mode = "dark",
}: {
  api: ConsoleReadApi;
  mode?: "dark" | "light";
}) {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className={"dash-shell " + mode}>
      <div className="dash-chrome">
        <div className="dash-dots">
          <span style={{ background: "#ff5f57" }} />
          <span style={{ background: "#febc2e" }} />
          <span style={{ background: "#28c840" }} />
        </div>
        <div className="dash-chrome-label">
          OPERATOR · console.autovendsystems.com · DEMO ENVIRONMENT
        </div>
        <span className="dash-badge">SAMPLE DATA</span>
      </div>
      <div className="dash-body">
        <aside className="dash-sidebar">
          <div className="dash-side-label">FLEET OPS</div>
          {MAIN_TABS.map((it) => (
            <button
              key={it.id}
              type="button"
              className={"dash-side-btn" + (tab === it.id ? " on" : "")}
              onClick={() => setTab(it.id)}
            >
              <span className="icon">{it.icon}</span>
              {it.label}
            </button>
          ))}
          <div style={{ height: 16 }} />
          <div className="dash-side-label">OPS</div>
          {MINOR_TABS.map((it) => (
            <button
              key={it.id}
              type="button"
              className={"dash-side-btn" + (tab === it.id ? " on" : "")}
              onClick={() => setTab(it.id)}
            >
              {it.label}
            </button>
          ))}
          <div className="dash-side-foot">
            OPERATOR · DEMO
            <br />
            Region · SE-01
          </div>
        </aside>
        <main className="dash-main">
          {tab === "overview" && <OverviewTab api={api} />}
          {tab === "machines" && <MachinesTab api={api} />}
          {tab === "sales" && <SalesTab api={api} />}
          {tab === "ads" && <AdsTab api={api} />}
          {tab === "routes" && <ComingTab title="Routes" />}
          {tab === "alerts" && <ComingTab title="Alerts" />}
          {tab === "settings" && <ComingTab title="Settings" />}
        </main>
      </div>
    </div>
  );
}
