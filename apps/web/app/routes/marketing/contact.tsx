import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { PageHeader } from "../../components/primitives";
import { CONTACT_EMAILS } from "../../features/marketing/content";
import { AdvertisingForm } from "../../features/forms/AdvertisingForm";
import { GeneralForm } from "../../features/forms/GeneralForm";
import { PlacementForm } from "../../features/forms/PlacementForm";
import { SuggestForm } from "../../features/forms/SuggestForm";

export function meta() {
  return [
    { title: "Contact — AutoVend Systems" },
    {
      name: "description",
      content: "Placement requests, advertising inquiries, venue suggestions, and general contact.",
    },
  ];
}

const TABS = [
  { id: "placement", label: "Smart Placement", desc: "Bring AutoVend to your venue" },
  { id: "advertising", label: "Advertising", desc: "32″ ad-network inquiries" },
  { id: "suggest", label: "Suggest a location", desc: "Recommend a venue" },
  { id: "general", label: "General", desc: "Press, partnerships, other" },
] as const;
type TabId = (typeof TABS)[number]["id"];

function isTabId(v: string | null): v is TabId {
  return TABS.some((t) => t.id === v);
}

export default function ContactPage() {
  const [params] = useSearchParams();
  const fromUrl = params.get("form");
  const [tab, setTab] = useState<TabId>(isTabId(fromUrl) ? fromUrl : "placement");

  useEffect(() => {
    if (isTabId(fromUrl)) setTab(fromUrl);
  }, [fromUrl]);

  return (
    <main>
      <PageHeader
        kicker="CONTACT · LEAD CAPTURE"
        title="Pick the path that fits."
        lead="Forms route directly to the relevant AutoVend team. We respond within two business days."
      />
      <section className="section">
        <div className="container grid-12">
          <aside style={{ gridColumn: "span 4" }}>
            <div className="meta" style={{ marginBottom: 16 }}>
              SELECT FORM · 04
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  style={{
                    textAlign: "left",
                    padding: 16,
                    border: "1px solid " + (tab === t.id ? "var(--ink)" : "var(--rule)"),
                    background: tab === t.id ? "var(--bg-elev)" : "var(--bg)",
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    fontFamily: "inherit",
                  }}
                >
                  <span
                    className="meta"
                    style={{ color: tab === t.id ? "var(--accent)" : "var(--ink-3)" }}
                  >
                    {tab === t.id ? "● ACTIVE" : "○ SELECT"}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>
                    {t.label}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{t.desc}</span>
                </button>
              ))}
            </div>
            <div
              style={{
                marginTop: 32,
                padding: 20,
                background: "var(--bg-elev)",
                border: "1px solid var(--rule)",
                borderRadius: 8,
              }}
            >
              <div className="meta" style={{ marginBottom: 8 }}>
                DIRECT
              </div>
              <div style={{ fontSize: 14, color: "var(--ink-2)" }}>
                {CONTACT_EMAILS.partners}
                <br />
                {CONTACT_EMAILS.ads}
                <br />
                {CONTACT_EMAILS.press}
              </div>
            </div>
          </aside>
          <div style={{ gridColumn: "span 8" }}>
            {tab === "placement" && <PlacementForm />}
            {tab === "advertising" && <AdvertisingForm />}
            {tab === "suggest" && <SuggestForm />}
            {tab === "general" && <GeneralForm />}
          </div>
        </div>
      </section>
    </main>
  );
}
