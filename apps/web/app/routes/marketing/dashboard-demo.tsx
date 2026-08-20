import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { DemoLead } from "@autovend/contracts";
import { Field, PageHeader, Placeholder } from "../../components/primitives";
import { Dashboard } from "../../features/demo/Dashboard";
import {
  blankToUndefined,
  emailField,
  FormShell,
  HoneypotField,
  optionalText,
  required,
  SubmitError,
  useHoneypot,
  useLeadSubmission,
} from "../../features/forms/shared";
import { useApi } from "../../lib/api/context";

export function meta() {
  return [
    { title: "Dashboard demo — AutoVend Systems" },
    {
      name: "description",
      content:
        "A gated preview of the AutoVend operator console — fleet health, sales velocity, low-stock alerts, and ad performance on sample data.",
    },
  ];
}

const UNLOCK_KEY = "av-demo-unlocked";

const schema = z.object({
  name: required(),
  email: emailField,
  org: required(),
  role: optionalText(120),
});
type Values = z.infer<typeof schema>;

function toSubmission(v: Values): DemoLead {
  return {
    type: "demo",
    name: v.name,
    email: v.email,
    org: v.org,
    role: blankToUndefined(v.role),
  };
}

function DemoGate({ onUnlock }: { onUnlock: () => void }) {
  const submission = useLeadSubmission();
  const honeypot = useHoneypot();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", org: "", role: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!honeypot.isBot) {
      await submission.mutateAsync(toSubmission(values));
    }
    window.localStorage.setItem(UNLOCK_KEY, "1");
    onUnlock();
  });

  return (
    <main>
      <PageHeader
        kicker="OPERATOR CONSOLE · DEMO"
        title="Unlock the dashboard preview."
        lead="A gated preview using sample data — what fleet operators will see when AutoVend goes live in your region. Drop your details to unlock."
      />
      <section className="section">
        <div className="container grid-12">
          <div style={{ gridColumn: "span 7" }}>
            <div
              style={{
                position: "relative",
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid var(--rule)",
              }}
            >
              <Placeholder label="DASHBOARD · BLURRED PREVIEW · UNLOCK TO VIEW" height={460} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, var(--bg) 100%)",
                }}
              >
                <div
                  style={{
                    background: "var(--ink)",
                    color: "var(--bg)",
                    padding: "10px 14px",
                    borderRadius: 999,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: ".08em",
                  }}
                >
                  🔒 GATED · UNLOCK BELOW
                </div>
              </div>
            </div>
            <div
              style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
            >
              {[
                ["FLEET UPTIME", "99.9% target *"],
                ["ACTIVE MACHINES", "11 / 12 online"],
                ["SALES · 30D", "$126.4K · sample"],
                ["AD IMPRESSIONS · EST.", "~1.34M / mo *"],
              ].map(([l, v]) => (
                <div key={l} className="card card-pad">
                  <div className="stat-label">{l}</div>
                  <div className="stat-num" style={{ marginTop: 6, fontSize: 28 }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ gridColumn: "span 5" }}>
            <FormShell kicker="DEMO ACCESS · GATED" title="Get a preview.">
              <form
                onSubmit={(e) => void onSubmit(e)}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
                noValidate
              >
                <HoneypotField value={honeypot.trap} onChange={honeypot.setTrap} />
                <Field label="Name" required error={errors.name?.message}>
                  <input
                    className={"input" + (errors.name ? " error" : "")}
                    {...register("name")}
                  />
                </Field>
                <Field label="Work email" required error={errors.email?.message}>
                  <input
                    className={"input" + (errors.email ? " error" : "")}
                    type="email"
                    {...register("email")}
                  />
                </Field>
                <Field label="Organization" required error={errors.org?.message}>
                  <input className={"input" + (errors.org ? " error" : "")} {...register("org")} />
                </Field>
                <Field label="Role" error={errors.role?.message}>
                  <input
                    className="input"
                    placeholder="Operator, property manager, ad buyer…"
                    {...register("role")}
                  />
                </Field>
                <SubmitError error={submission.error} />
                <div className="form-foot">
                  <span className="meta">SAMPLE DATA · DEMO ONLY</span>
                  <button
                    type="submit"
                    className="btn btn-primary btn-arrow"
                    disabled={submission.isPending}
                  >
                    {submission.isPending ? "Unlocking…" : "Unlock demo"}
                  </button>
                </div>
              </form>
            </FormShell>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function DashboardDemoPage() {
  const { demoConsole } = useApi();
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const api = useMemo(() => demoConsole(), [demoConsole]);

  useEffect(() => {
    setUnlocked(window.localStorage.getItem(UNLOCK_KEY) === "1");
    setHydrated(true);
  }, []);

  if (!hydrated) return null;
  if (!unlocked) return <DemoGate onUnlock={() => setUnlocked(true)} />;

  return (
    <main>
      <PageHeader
        kicker="OPERATOR CONSOLE · UNLOCKED · SAMPLE DATA"
        title="Dashboard preview."
        lead="Use the sidebar tabs to explore Overview, Machines, Sales, and Ads. All numbers shown are sample data for product preview only."
        meta={
          <>
            <span>
              <span className="dot" style={{ background: "var(--good)" }} /> ACCESS GRANTED
            </span>
            <span style={{ marginLeft: "auto" }}>SAMPLE DATA · NEVER LIVE FLEET DATA</span>
          </>
        }
      />
      <section style={{ padding: "40px 0 80px" }}>
        <div className="container">
          <Dashboard api={api} mode="dark" />
          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span className="meta">FIG · 02 — OPERATOR CONSOLE · DEMO BUILD</span>
            <Link to="/contact?form=placement" className="btn btn-accent btn-arrow">
              Bring AutoVend to your venue
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
