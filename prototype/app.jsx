/* AutoVend — App router + tweaks panel + mounting */
const { useState: uSA, useEffect: uEA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "default",
  "density": "regular",
  "darkDashboard": true
}/*EDITMODE-END*/;

function parseHash() {
  const h = window.location.hash || "#/";
  const raw = h.replace(/^#/, "") || "/";
  const [path, query = ""] = raw.split("?");
  const params = {};
  query.split("&").filter(Boolean).forEach(kv => {
    const [k, v] = kv.split("=");
    params[decodeURIComponent(k)] = decodeURIComponent(v || "");
  });
  return { path, params };
}

function App() {
  const [route, setRoute] = uSA(parseHash());
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const store = useAppStore();

  uEA(() => {
    const onHash = () => { setRoute(parseHash()); window.scrollTo({ top: 0, behavior: "instant" }); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  uEA(() => {
    document.documentElement.dataset.theme = t.theme === "default" ? "" : t.theme;
    document.documentElement.dataset.density = t.density;
  }, [t.theme, t.density]);

  const router = {
    path: route.path,
    params: route.params,
    go: (to) => { window.location.hash = to; },
  };

  let page = null;
  const p = route.path;
  if (p === "/" || p === "") page = <HomePage />;
  else if (p === "/solutions/location-partner") page = <LocationPartnerPage />;
  else if (p === "/solutions/advertising-partner") page = <AdvertisingPartnerPage />;
  else if (p === "/features") page = <FeaturesPage />;
  else if (p === "/reach") page = <ReachPage />;
  else if (p === "/operating-area") page = <OperatingAreaPage />;
  else if (p === "/dashboard-demo") page = <DashboardDemoPage darkDashboard={t.darkDashboard} />;
  else if (p === "/survey") page = <SurveyPage />;
  else if (p === "/contact") page = <ContactPage initialForm={route.params.form || "placement"} />;
  else if (p === "/resources") page = <ResourcesPage />;
  else page = <NotFound />;

  return (
    <RouterCtx.Provider value={router}>
      <StoreCtx.Provider value={store}>
        <a href="#main" className="sr">Skip to main content</a>
        <Header />
        <div id="main" data-screen-label={"page · " + p}>
          {page}
        </div>
        <Footer />
        <Toasts />
        <TweaksPanel>
          <TweakSection label="Theme" />
          <TweakRadio label="Palette" value={t.theme} options={[{value:"default", label:"Slate"}, {value:"dark", label:"Dark"}, {value:"warm", label:"Warm"}]} onChange={(v) => setTweak("theme", v)} />
          <TweakRadio label="Density" value={t.density} options={[{value:"editorial", label:"Dense"}, {value:"regular", label:"Regular"}, {value:"airy", label:"Airy"}]} onChange={(v) => setTweak("density", v)} />
          <TweakSection label="Dashboard" />
          <TweakToggle label="Dark dashboard" value={t.darkDashboard} onChange={(v) => setTweak("darkDashboard", v)} />
          <TweakSection label="Demo" />
          <TweakButton label="Reset demo gate" onClick={() => store.setDemoUnlocked(false)} />
        </TweaksPanel>
      </StoreCtx.Provider>
    </RouterCtx.Provider>
  );
}

function NotFound() {
  return (
    <main className="section">
      <div className="container" style={{ textAlign: "center", padding: "80px 0" }}>
        <div className="meta" style={{ color: "var(--accent)", marginBottom: 16 }}>404 · ROUTE NOT FOUND</div>
        <h1 className="h1">That page doesn't exist yet.</h1>
        <p className="lead" style={{ margin: "16px auto 32px" }}>The AutoVend site is being built out across Phase 1 and Phase 2. Try the homepage.</p>
        <Link to="/" className="btn btn-primary btn-arrow">Back to home</Link>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
