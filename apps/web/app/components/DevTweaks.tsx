import { useEffect, useState } from "react";

/* Dev-only slice of the prototype's tweaks panel: theme + density switching
 * for verifying the design-system port. Excluded from production builds by
 * the import.meta.env.DEV guard at the usage site. */

const THEMES = [
  { value: "", label: "Slate" },
  { value: "dark", label: "Dark" },
  { value: "warm", label: "Warm" },
];
const DENSITIES = ["editorial", "regular", "airy"];

export function DevTweaks() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("");
  const [density, setDensity] = useState("regular");

  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme;
    else delete document.documentElement.dataset.theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  return (
    <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 200 }}>
      {open && (
        <div
          className="card card-pad"
          style={{
            marginBottom: 8,
            display: "grid",
            gap: 12,
            boxShadow: "0 12px 32px rgba(0,0,0,.14)",
          }}
        >
          <div className="meta">TWEAKS · DEV ONLY</div>
          <div className="segments">
            {THEMES.map((t) => (
              <button
                key={t.value}
                type="button"
                className={theme === t.value ? "on" : ""}
                onClick={() => setTheme(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="segments">
            {DENSITIES.map((d) => (
              <button
                key={d}
                type="button"
                className={density === d ? "on" : ""}
                onClick={() => setDensity(d)}
              >
                {d}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => window.localStorage.removeItem("av-demo-unlocked")}
          >
            Reset demo gate
          </button>
        </div>
      )}
      <button
        type="button"
        className="btn btn-primary btn-sm"
        style={{ marginLeft: "auto", display: "block" }}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close tweaks" : "Tweaks"}
      </button>
    </div>
  );
}
