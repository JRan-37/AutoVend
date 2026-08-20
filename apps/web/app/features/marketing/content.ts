/* Marketing copy constants ported from prototype/data.jsx. Pure content —
 * closed value sets used by forms live in @autovend/contracts enums instead. */

export interface FeatureBlock {
  code: string;
  title: string;
  body: string;
  metric: { v: string; l: string };
}

export const FEATURES: FeatureBlock[] = [
  {
    code: "01",
    title: "Predictive restock",
    body: "Demand-forecasting models reorder by SKU before stock hits threshold, balanced against route economics. Operators see what to load, where, and why.",
    metric: { v: "92%", l: "fewer stockouts vs. legacy fleet · sample" },
  },
  {
    code: "02",
    title: "Machine health telemetry",
    body: "Onboard sensors stream temperature, vend-fail, payment-terminal status, and door events. Anomalies open service tickets automatically — no customer report required.",
    metric: { v: "<6h", l: "median time-to-repair target" },
  },
  {
    code: "03",
    title: "32″ HD ad surface",
    body: "Each unit ships with a 32-inch portrait display calibrated for daylit lobbies. Full-motion creative, scheduled by daypart, with QR pairing for mobile activations.",
    metric: { v: "~10K", l: "est. monthly impressions / unit *" },
  },
  {
    code: "04",
    title: "Cashless-first payments",
    body: "Built to support modern cashless and biometric-capable payment ecosystems — tap, mobile wallet, and account-linked credentials. No cash handling overhead.",
    metric: { v: "0", l: "cash-handling reconciliation" },
  },
  {
    code: "05",
    title: "Operator dashboard",
    body: "One pane: fleet uptime, sales velocity, low-stock alerts, route priority, ad performance. Designed for back-office operators and field techs.",
    metric: { v: "1", l: "console for fleet ops" },
  },
  {
    code: "06",
    title: "Assortment intelligence",
    body: "Per-machine SKU mix tunes itself against sales velocity, demographics signal, and consumer survey input. Venues get the products their visitors actually buy.",
    metric: { v: "+18%", l: "lift in basket size · sample" },
  },
];

export const CONTACT_EMAILS = {
  partners: "partners@autovendsystems.com",
  ads: "ads@autovendsystems.com",
  press: "press@autovendsystems.com",
  placement: "placement@autovendsystems.com",
  hello: "hello@autovendsystems.com",
};
