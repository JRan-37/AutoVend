/* Small shared primitives ported from prototype/components.jsx. */

export function Field({
  label,
  required,
  hint,
  error,
  group,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string | undefined;
  error?: string | undefined;
  /** For toggle-button groups: renders a role="group" div instead of a <label>,
   * so the label text doesn't hijack the first button's accessible name. */
  group?: boolean;
  children: React.ReactNode;
}) {
  const body = (
    <>
      <span className="field-label">
        <span>{label}</span>
        {required && <span className="req">REQUIRED</span>}
      </span>
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </>
  );
  if (group) {
    return (
      <div className="field" role="group" aria-label={label}>
        {body}
      </div>
    );
  }
  return <label className="field">{body}</label>;
}

export function Placeholder({
  label,
  height = 280,
  style,
}: {
  label: string;
  height?: number;
  style?: React.CSSProperties;
}) {
  return <div className="placeholder" data-label={label} style={{ height, ...style }} />;
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 24,
        marginBottom: 40,
        flexWrap: "wrap",
      }}
    >
      <div style={{ maxWidth: "60ch" }}>
        {eyebrow && (
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            {eyebrow}
          </div>
        )}
        {title && <h2 className="h2">{title}</h2>}
        {lead && (
          <p className="lead" style={{ marginTop: 12, marginBottom: 0 }}>
            {lead}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  lead,
  meta,
}: {
  kicker: string;
  title: string;
  lead?: string;
  meta?: React.ReactNode;
}) {
  return (
    <section style={{ borderBottom: "1px solid var(--rule)", padding: "80px 0 56px" }}>
      <div className="container">
        <div className="eyebrow" style={{ marginBottom: 24 }}>
          {kicker}
        </div>
        <h1 className="h1" style={{ maxWidth: "20ch" }}>
          {title}
        </h1>
        {lead && (
          <p className="lead" style={{ marginTop: 20, fontSize: 18 }}>
            {lead}
          </p>
        )}
        {meta && (
          <div className="meta-row" style={{ marginTop: 32 }}>
            {meta}
          </div>
        )}
      </div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  delta,
  deltaTone = "good",
  footnote,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "good" | "bad" | "muted";
  footnote?: string;
}) {
  return (
    <div
      style={{
        padding: 20,
        border: "1px solid var(--drule, var(--rule))",
        borderRadius: 10,
        background: "var(--dbg-elev, var(--bg-elev))",
      }}
    >
      <div className="stat-label" style={{ color: "var(--dink-3, var(--ink-3))" }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
        <div className="stat-num" style={{ color: "var(--dink, var(--ink))" }}>
          {value}
        </div>
        {delta && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color:
                deltaTone === "good"
                  ? "var(--good)"
                  : deltaTone === "bad"
                    ? "var(--bad)"
                    : "var(--dink-3, var(--ink-3))",
            }}
          >
            {delta}
          </span>
        )}
      </div>
      {footnote && (
        <div
          style={{
            marginTop: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            color: "var(--dink-4, var(--ink-4))",
            letterSpacing: ".04em",
            textTransform: "uppercase",
          }}
        >
          {footnote}
        </div>
      )}
    </div>
  );
}

export function SparkBars({
  data,
  height = 80,
  accent = "var(--daccent, var(--accent))",
  muted = "var(--drule-2, var(--rule-2))",
}: {
  data: number[];
  height?: number;
  accent?: string;
  muted?: string;
}) {
  // The prototype crashed into NaN geometry on empty input; render an honest
  // empty track instead.
  if (data.length === 0) {
    return (
      <div
        className="data-state"
        style={{ height, padding: 0, placeItems: "center" }}
        aria-label="No data points yet"
      >
        <span className="data-state-title">NO DATA POINTS YET</span>
      </div>
    );
  }
  const max = Math.max(...data, 1);
  return (
    <svg
      viewBox={`0 0 ${data.length * 12} ${height}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height, display: "block" }}
      role="img"
      aria-label={`Bar chart with ${data.length} data points`}
    >
      {data.map((v, i) => {
        const h = (v / max) * (height - 6);
        const isLast = i === data.length - 1;
        return (
          <rect
            key={i}
            x={i * 12 + 1}
            y={height - h}
            width={9}
            height={h}
            rx={1.5}
            fill={isLast ? accent : muted}
          />
        );
      })}
    </svg>
  );
}
