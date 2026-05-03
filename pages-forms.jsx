/* AutoVend — Forms pages: Survey, Contact, Dashboard demo gate */
const { useState: uSF, useEffect: uEF, useMemo: uMF } = React;

// Reusable validated form
function useForm(initial) {
  const [values, setValues] = uSF(initial);
  const [errors, setErrors] = uSF({});
  const set = (k) => (e) => {
    const v = e && e.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e;
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((er) => { const c = { ...er }; delete c[k]; return c; });
  };
  const toggle = (k, v) => () => {
    setValues((s) => {
      const arr = Array.isArray(s[k]) ? s[k] : [];
      return { ...s, [k]: arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v] };
    });
  };
  return { values, set, toggle, setValues, errors, setErrors };
}

function validateRequired(values, fields) {
  const errors = {};
  fields.forEach(f => {
    const v = values[f];
    if (!v || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && v.length === 0)) {
      errors[f] = "Required";
    }
  });
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter a valid email";
  return errors;
}

// ── Survey page ─────────────────────────────────────────────────────
function SurveyPage() {
  const { PRODUCT_CATEGORIES, DIETARY_TAGS, VENUE_TYPES } = window.AV_DATA;
  const { submitSurvey } = useStore();
  const f = useForm({ venue: "", venueType: "", products: [], dietary: [], suggestion: "", email: "" });
  const [done, setDone] = uSF(null);

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validateRequired(f.values, ["venue", "products"]);
    if (f.values.products.length === 0) errs.products = "Pick at least one";
    f.setErrors(errs);
    if (Object.keys(errs).length === 0) {
      const s = submitSurvey(f.values);
      setDone(s);
    }
  };

  if (done) {
    return (
      <main>
        <PageHeader kicker="SURVEY · CONFIRMED" title="Got it. Thanks for telling us." lead="Your preferences are routed to the assortment-planning queue. We use these signals to tune SKU mix per machine and per region." />
        <section className="section">
          <div className="container" style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="card card-pad" style={{ padding: 32 }}>
              <div className="meta" style={{ color: "var(--accent)", marginBottom: 12 }}>RESPONSE LOGGED · {done.id}</div>
              <h3 style={{ fontSize: 22, marginBottom: 12 }}>Want to suggest a venue too?</h3>
              <p style={{ color: "var(--ink-3)", marginBottom: 20 }}>If your office, gym, or campus doesn't have an AutoVend yet, drop the venue and we'll route it to the placement team.</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/contact?form=suggest" className="btn btn-accent btn-arrow">Suggest a location</Link>
                <Link to="/" className="btn btn-ghost">Back to home</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHeader kicker="END USERS · PRODUCT SURVEY" title="Tell us what you'd actually buy." lead="Two minutes. No login. We use your input to tune the SKU mix at machines in your area and stock products people in your venue actually want." />
      <section className="section">
        <div className="container" style={{ maxWidth: 720, margin: "0 auto" }}>
          <form onSubmit={onSubmit} className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 24, padding: 32 }}>
            <Field label="Where do you usually use a vending machine?" required error={f.errors.venue} hint="An office, gym, hospital, school — be as specific as you like.">
              <input className={"input" + (f.errors.venue ? " error" : "")} value={f.values.venue} onChange={f.set("venue")} placeholder="e.g. Hudson Yards office tower, NYC" />
            </Field>
            <Field label="Venue type">
              <select className="select" value={f.values.venueType} onChange={f.set("venueType")}>
                <option value="">— select —</option>
                {VENUE_TYPES.map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Which categories do you reach for?" required error={f.errors.products} hint="Pick all that apply.">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {PRODUCT_CATEGORIES.map(c => {
                  const on = f.values.products.includes(c);
                  return (
                    <button key={c} type="button" onClick={f.toggle("products", c)} style={{
                      padding: "10px 12px", borderRadius: 6,
                      border: "1px solid " + (on ? "var(--accent)" : "var(--rule-2)"),
                      background: on ? "var(--accent-soft)" : "var(--bg)",
                      color: on ? "var(--accent)" : "var(--ink-2)",
                      textAlign: "left", fontSize: 13.5, fontFamily: "inherit",
                    }}>{on ? "● " : "○ "}{c}</button>
                  );
                })}
              </div>
            </Field>
            <Field label="Any dietary preferences?" hint="Optional.">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {DIETARY_TAGS.map(t => {
                  const on = f.values.dietary.includes(t);
                  return (
                    <button key={t} type="button" onClick={f.toggle("dietary", t)} style={{
                      padding: "6px 12px", borderRadius: 999,
                      border: "1px solid " + (on ? "var(--accent)" : "var(--rule-2)"),
                      background: on ? "var(--accent-soft)" : "var(--bg)",
                      color: on ? "var(--accent)" : "var(--ink-2)",
                      fontSize: 13, fontFamily: "inherit",
                    }}>{t}</button>
                  );
                })}
              </div>
            </Field>
            <Field label="Specific products to add?" hint="Brand, SKU, or just 'oat milk lattes' — anything goes.">
              <textarea className="textarea" rows={3} value={f.values.suggestion} onChange={f.set("suggestion")} placeholder="e.g. Olipop Cherry Vanilla, Magic Spoon cereal cups, oat milk options…" />
            </Field>
            <Field label="Email (optional)" hint="Only if you want a heads-up when your venue gets restocked.">
              <input className={"input" + (f.errors.email ? " error" : "")} value={f.values.email} onChange={f.set("email")} placeholder="you@company.com" />
            </Field>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid var(--rule)" }}>
              <span className="meta">NO SENSITIVE DATA · ROUTED TO ASSORTMENT TEAM</span>
              <button type="submit" className="btn btn-primary btn-arrow">Submit survey</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

// ── Contact page (multi-form: placement, advertising, suggest, general) ──
function ContactPage({ initialForm = "placement" }) {
  const [tab, setTab] = uSF(initialForm);
  uEF(() => { setTab(initialForm); }, [initialForm]);
  const tabs = [
    { id: "placement", label: "Smart Placement", desc: "Bring AutoVend to your venue" },
    { id: "advertising", label: "Advertising", desc: "32″ ad-network inquiries" },
    { id: "suggest", label: "Suggest a location", desc: "Recommend a venue" },
    { id: "general", label: "General", desc: "Press, partnerships, other" },
  ];
  return (
    <main>
      <PageHeader kicker="CONTACT · LEAD CAPTURE" title="Pick the path that fits." lead="Forms route directly to the relevant AutoVend team. We respond within two business days." />
      <section className="section">
        <div className="container grid-12">
          <aside style={{ gridColumn: "span 4" }}>
            <div className="meta" style={{ marginBottom: 16 }}>SELECT FORM · 04</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  textAlign: "left", padding: "16px",
                  border: "1px solid " + (tab === t.id ? "var(--ink)" : "var(--rule)"),
                  background: tab === t.id ? "var(--bg-elev)" : "var(--bg)",
                  borderRadius: 8, cursor: "pointer",
                  display: "flex", flexDirection: "column", gap: 4,
                  fontFamily: "inherit",
                }}>
                  <span className="meta" style={{ color: tab === t.id ? "var(--accent)" : "var(--ink-3)" }}>{tab === t.id ? "● ACTIVE" : "○ SELECT"}</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{t.label}</span>
                  <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{t.desc}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 32, padding: 20, background: "var(--bg-elev)", border: "1px solid var(--rule)", borderRadius: 8 }}>
              <div className="meta" style={{ marginBottom: 8 }}>DIRECT</div>
              <div style={{ fontSize: 14, color: "var(--ink-2)" }}>partners@autovend.systems<br />ads@autovend.systems<br />press@autovend.systems</div>
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

function FormShell({ title, kicker, children }) {
  return (
    <div className="card card-pad" style={{ padding: 32 }}>
      <div className="meta" style={{ color: "var(--accent)", marginBottom: 8 }}>{kicker}</div>
      <h2 className="h2" style={{ fontSize: 26, marginBottom: 24 }}>{title}</h2>
      {children}
    </div>
  );
}

function SuccessState({ title, body, refId }) {
  return (
    <div className="card card-pad" style={{ padding: 32 }}>
      <div className="meta" style={{ color: "var(--good)", marginBottom: 8 }}>● SUBMITTED · REF {refId}</div>
      <h2 className="h2" style={{ fontSize: 26, marginBottom: 12 }}>{title}</h2>
      <p style={{ color: "var(--ink-3)", marginBottom: 24 }}>{body}</p>
      <Link to="/" className="btn btn-ghost btn-arrow">Back to home</Link>
    </div>
  );
}

function PlacementForm() {
  const { submitLead } = useStore();
  const f = useForm({ org: "", contact: "", email: "", phone: "", venueType: "", traffic: "", address: "", message: "" });
  const [done, setDone] = uSF(null);
  const submit = (e) => {
    e.preventDefault();
    const errs = validateRequired(f.values, ["org", "contact", "email", "venueType"]);
    f.setErrors(errs);
    if (Object.keys(errs).length === 0) setDone(submitLead("Smart Placement", f.values));
  };
  if (done) return <SuccessState title="Placement request received." body="The placement team reviews venue fit, traffic, and footprint. Expect a follow-up within 2 business days with site survey and partnership terms." refId={done.id} />;
  return (
    <FormShell kicker="FORM · 01 OF 04 · SMART PLACEMENT" title="Bring AutoVend to your venue.">
      <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Organization" required error={f.errors.org}><input className={"input" + (f.errors.org ? " error" : "")} value={f.values.org} onChange={f.set("org")} /></Field>
        <Field label="Your name" required error={f.errors.contact}><input className={"input" + (f.errors.contact ? " error" : "")} value={f.values.contact} onChange={f.set("contact")} /></Field>
        <Field label="Email" required error={f.errors.email}><input className={"input" + (f.errors.email ? " error" : "")} value={f.values.email} onChange={f.set("email")} type="email" /></Field>
        <Field label="Phone"><input className="input" value={f.values.phone} onChange={f.set("phone")} /></Field>
        <Field label="Venue type" required error={f.errors.venueType}>
          <select className={"select" + (f.errors.venueType ? " error" : "")} value={f.values.venueType} onChange={f.set("venueType")}>
            <option value="">— select —</option>
            {window.AV_DATA.VENUE_TYPES.map(v => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Daily foot traffic (est.)">
          <select className="select" value={f.values.traffic} onChange={f.set("traffic")}>
            <option value="">— select —</option>
            {["< 200", "200 – 500", "500 – 1,500", "1,500 – 5,000", "5,000+"].map(v => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Venue address or city" hint="City and state are enough — full address optional.">
            <input className="input" value={f.values.address} onChange={f.set("address")} />
          </Field>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Anything else?" hint="Hours, restrictions, what you're hoping to offer.">
            <textarea className="textarea" rows={4} value={f.values.message} onChange={f.set("message")} />
          </Field>
        </div>
        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid var(--rule)" }}>
          <span className="meta">ROUTES TO · placement@autovend.systems</span>
          <button type="submit" className="btn btn-accent btn-arrow">Request Smart Placement</button>
        </div>
      </form>
    </FormShell>
  );
}

function AdvertisingForm() {
  const { submitLead } = useStore();
  const f = useForm({ org: "", contact: "", email: "", industry: "", budget: "", flight: "", message: "" });
  const [done, setDone] = uSF(null);
  const submit = (e) => {
    e.preventDefault();
    const errs = validateRequired(f.values, ["org", "contact", "email", "industry"]);
    f.setErrors(errs);
    if (Object.keys(errs).length === 0) setDone(submitLead("Advertising", f.values));
  };
  if (done) return <SuccessState title="Advertising inquiry received." body="The ad-sales team will reach out with a media kit, current inventory, and rate-card guidance. All estimates are subject to confirmation at IO." refId={done.id} />;
  return (
    <FormShell kicker="FORM · 02 OF 04 · ADVERTISING" title="Plan a campaign on the AutoVend network.">
      <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Brand / agency" required error={f.errors.org}><input className={"input" + (f.errors.org ? " error" : "")} value={f.values.org} onChange={f.set("org")} /></Field>
        <Field label="Your name" required error={f.errors.contact}><input className={"input" + (f.errors.contact ? " error" : "")} value={f.values.contact} onChange={f.set("contact")} /></Field>
        <Field label="Email" required error={f.errors.email}><input className={"input" + (f.errors.email ? " error" : "")} value={f.values.email} onChange={f.set("email")} type="email" /></Field>
        <Field label="Industry" required error={f.errors.industry}>
          <select className={"select" + (f.errors.industry ? " error" : "")} value={f.values.industry} onChange={f.set("industry")}>
            <option value="">— select —</option>
            {["Beverage", "Snack / CPG", "Wellness / fitness", "Apparel / footwear", "Tech", "Auto", "Entertainment", "Other"].map(v => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Estimated budget">
          <select className="select" value={f.values.budget} onChange={f.set("budget")}>
            <option value="">— select —</option>
            {["< $10K", "$10K – $50K", "$50K – $250K", "$250K+"].map(v => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Target flight">
          <input className="input" value={f.values.flight} onChange={f.set("flight")} placeholder="e.g. June 1 – June 30" />
        </Field>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Campaign objectives" hint="Awareness, sampling, QR-driven activation, retail lift, etc.">
            <textarea className="textarea" rows={4} value={f.values.message} onChange={f.set("message")} />
          </Field>
        </div>
        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid var(--rule)" }}>
          <span className="meta">ROUTES TO · ads@autovend.systems</span>
          <button type="submit" className="btn btn-accent btn-arrow">Send inquiry</button>
        </div>
      </form>
    </FormShell>
  );
}

function SuggestForm() {
  const { submitLead } = useStore();
  const f = useForm({ venue: "", city: "", state: "", traffic: "", reason: "", contact: "", email: "" });
  const [done, setDone] = uSF(null);
  const submit = (e) => {
    e.preventDefault();
    const errs = validateRequired(f.values, ["venue", "city", "reason"]);
    f.setErrors(errs);
    if (Object.keys(errs).length === 0) setDone(submitLead("Location Suggestion", f.values));
  };
  if (done) return <SuccessState title="Suggestion logged." body="We weight new region launches and venue priorities by inbound interest. Suggestions like yours move our route map." refId={done.id} />;
  return (
    <FormShell kicker="FORM · 03 OF 04 · SUGGEST A LOCATION" title="Recommend a venue.">
      <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Venue name" required error={f.errors.venue}><input className={"input" + (f.errors.venue ? " error" : "")} value={f.values.venue} onChange={f.set("venue")} placeholder="e.g. SoHo House Austin" /></Field>
        </div>
        <Field label="City" required error={f.errors.city}><input className={"input" + (f.errors.city ? " error" : "")} value={f.values.city} onChange={f.set("city")} /></Field>
        <Field label="State"><input className="input" value={f.values.state} onChange={f.set("state")} /></Field>
        <Field label="Foot traffic estimate">
          <select className="select" value={f.values.traffic} onChange={f.set("traffic")}>
            <option value="">— select —</option>
            {["< 200", "200 – 500", "500 – 1,500", "1,500 – 5,000", "5,000+"].map(v => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Your name (optional)"><input className="input" value={f.values.contact} onChange={f.set("contact")} /></Field>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Why this venue?" required error={f.errors.reason}>
            <textarea className={"textarea" + (f.errors.reason ? " error" : "")} rows={3} value={f.values.reason} onChange={f.set("reason")} placeholder="What makes this venue a fit for AutoVend?" />
          </Field>
        </div>
        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid var(--rule)" }}>
          <span className="meta">ROUTES TO · placement@autovend.systems</span>
          <button type="submit" className="btn btn-accent btn-arrow">Submit suggestion</button>
        </div>
      </form>
    </FormShell>
  );
}

function GeneralForm() {
  const { submitLead } = useStore();
  const f = useForm({ name: "", email: "", subject: "", message: "" });
  const [done, setDone] = uSF(null);
  const submit = (e) => {
    e.preventDefault();
    const errs = validateRequired(f.values, ["name", "email", "message"]);
    f.setErrors(errs);
    if (Object.keys(errs).length === 0) setDone(submitLead("General", f.values));
  };
  if (done) return <SuccessState title="Message received." body="We'll route this to the right team and get back to you within two business days." refId={done.id} />;
  return (
    <FormShell kicker="FORM · 04 OF 04 · GENERAL" title="Send us a note.">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Name" required error={f.errors.name}><input className={"input" + (f.errors.name ? " error" : "")} value={f.values.name} onChange={f.set("name")} /></Field>
          <Field label="Email" required error={f.errors.email}><input className={"input" + (f.errors.email ? " error" : "")} value={f.values.email} onChange={f.set("email")} type="email" /></Field>
        </div>
        <Field label="Subject"><input className="input" value={f.values.subject} onChange={f.set("subject")} /></Field>
        <Field label="Message" required error={f.errors.message}>
          <textarea className={"textarea" + (f.errors.message ? " error" : "")} rows={5} value={f.values.message} onChange={f.set("message")} />
        </Field>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid var(--rule)" }}>
          <span className="meta">ROUTES TO · hello@autovend.systems</span>
          <button type="submit" className="btn btn-accent btn-arrow">Send</button>
        </div>
      </form>
    </FormShell>
  );
}

// ── Dashboard demo gate ─────────────────────────────────────────────
function DashboardDemoPage({ darkDashboard }) {
  const { demoUnlocked, setDemoUnlocked, submitLead } = useStore();
  const f = useForm({ name: "", email: "", org: "", role: "" });
  const submit = (e) => {
    e.preventDefault();
    const errs = validateRequired(f.values, ["name", "email", "org"]);
    f.setErrors(errs);
    if (Object.keys(errs).length === 0) {
      submitLead("Dashboard Demo", f.values);
      setDemoUnlocked(true);
    }
  };

  if (!demoUnlocked) {
    return (
      <main>
        <PageHeader kicker="OPERATOR CONSOLE · DEMO" title="Unlock the dashboard preview." lead="The operator console is in Phase 2 build. Below is a gated preview using sample data — what fleet operators will see when AutoVend goes live in your region. Drop your details to unlock." />
        <section className="section">
          <div className="container grid-12">
            <div style={{ gridColumn: "span 7" }}>
              <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: "1px solid var(--rule)" }}>
                <Placeholder label="DASHBOARD · BLURRED PREVIEW · UNLOCK TO VIEW" height={460} />
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, var(--bg) 100%)" }}>
                  <div style={{ background: "var(--ink)", color: "var(--bg)", padding: "10px 14px", borderRadius: 999, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em" }}>
                    🔒 GATED · UNLOCK BELOW
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  ["FLEET UPTIME", "99.9% target *"],
                  ["ACTIVE MACHINES", "11 / 12 online"],
                  ["SALES · 30D", "$126.4K · sample"],
                  ["AD IMPRESSIONS · EST.", "~1.34M / mo *"],
                ].map(([l, v]) => (
                  <div key={l} className="card card-pad">
                    <div className="stat-label">{l}</div>
                    <div className="stat-num" style={{ marginTop: 6, fontSize: 28 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: "span 5" }}>
              <FormShell kicker="DEMO ACCESS · GATED" title="Get a 30-minute preview.">
                <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Field label="Name" required error={f.errors.name}><input className={"input" + (f.errors.name ? " error" : "")} value={f.values.name} onChange={f.set("name")} /></Field>
                  <Field label="Work email" required error={f.errors.email}><input className={"input" + (f.errors.email ? " error" : "")} value={f.values.email} onChange={f.set("email")} type="email" /></Field>
                  <Field label="Organization" required error={f.errors.org}><input className={"input" + (f.errors.org ? " error" : "")} value={f.values.org} onChange={f.set("org")} /></Field>
                  <Field label="Role"><input className="input" value={f.values.role} onChange={f.set("role")} placeholder="Operator, property manager, ad buyer…" /></Field>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid var(--rule)" }}>
                    <span className="meta">SAMPLE DATA · NO PII STORED</span>
                    <button type="submit" className="btn btn-primary btn-arrow">Unlock demo</button>
                  </div>
                </form>
              </FormShell>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHeader
        kicker="OPERATOR CONSOLE · UNLOCKED · SAMPLE DATA"
        title="Dashboard preview."
        lead="Use the sidebar tabs to explore Overview, Machines, Sales, and Ads. All numbers shown are sample data for product preview only."
        meta={<>
          <span><span className="dot" style={{ background: "var(--good)" }} /> ACCESS GRANTED · TRACK ANALYTICS EVENT</span>
          <span style={{ marginLeft: "auto" }}>EXPIRES IN 30 MINUTES · SAMPLE DATA</span>
        </>}
      />
      <section style={{ padding: "0 0 80px" }}>
        <div className="container">
          <Dashboard mode={darkDashboard ? "dark" : "light"} />
          <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span className="meta">FIG · 02 — OPERATOR CONSOLE · v0.4 · DEMO BUILD</span>
            <Link to="/contact?form=placement" className="btn btn-accent btn-arrow">Bring AutoVend to your venue</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { SurveyPage, ContactPage, DashboardDemoPage });
