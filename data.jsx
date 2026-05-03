/* AutoVend — shared sample data
 * All metrics labeled as DEMO/SAMPLE per brief guardrails.
 */

const REGIONS = [
  // Active hubs (approximate centroids on a 1000x600 viewBox map)
  { id: "atl", name: "Atlanta", state: "GA", status: "active", density: 0.95, x: 720, y: 380 },
  { id: "char", name: "Charlotte", state: "NC", status: "active", density: 0.78, x: 765, y: 345 },
  { id: "dc", name: "DC Metro", state: "DC", status: "active", density: 0.85, x: 810, y: 285 },
  { id: "nyc", name: "NYC Metro", state: "NY", status: "active", density: 0.92, x: 850, y: 230 },
  { id: "bos", name: "Boston", state: "MA", status: "active", density: 0.7, x: 880, y: 195 },
  { id: "mia", name: "South FL", state: "FL", status: "active", density: 0.68, x: 790, y: 510 },
  { id: "dal", name: "DFW", state: "TX", status: "active", density: 0.74, x: 540, y: 430 },
  { id: "hou", name: "Houston", state: "TX", status: "active", density: 0.6, x: 590, y: 470 },
  { id: "phx", name: "Phoenix", state: "AZ", status: "active", density: 0.55, x: 290, y: 410 },
  { id: "lax", name: "LA Metro", state: "CA", status: "active", density: 0.82, x: 195, y: 380 },
  { id: "sfo", name: "Bay Area", state: "CA", status: "active", density: 0.78, x: 130, y: 290 },
  { id: "sea", name: "Seattle", state: "WA", status: "active", density: 0.65, x: 175, y: 130 },
  { id: "den", name: "Denver", state: "CO", status: "active", density: 0.6, x: 425, y: 305 },
  { id: "chi", name: "Chicago", state: "IL", status: "active", density: 0.88, x: 660, y: 245 },
  { id: "msp", name: "Twin Cities", state: "MN", status: "active", density: 0.5, x: 605, y: 175 },

  // Expansion (coming soon)
  { id: "nash", name: "Nashville", state: "TN", status: "expansion", density: 0.3, x: 670, y: 340 },
  { id: "slc", name: "Salt Lake", state: "UT", status: "expansion", density: 0.3, x: 350, y: 270 },
  { id: "pdx", name: "Portland", state: "OR", status: "expansion", density: 0.3, x: 165, y: 175 },
  { id: "kc", name: "Kansas City", state: "MO", status: "expansion", density: 0.3, x: 580, y: 305 },
  { id: "stl", name: "St. Louis", state: "MO", status: "expansion", density: 0.3, x: 625, y: 305 },
  { id: "phl", name: "Philadelphia", state: "PA", status: "expansion", density: 0.3, x: 830, y: 260 },
  { id: "orl", name: "Orlando", state: "FL", status: "expansion", density: 0.3, x: 765, y: 480 },
];

const FLEET_HEALTH = [
  { id: "AV-0421", venue: "Midtown Office Tower", region: "Atlanta", health: 98, sales: 4280, stock: 92, alerts: 0, status: "online" },
  { id: "AV-0418", venue: "Equinox · Buckhead", region: "Atlanta", health: 96, sales: 3650, stock: 71, alerts: 1, status: "online" },
  { id: "AV-0512", venue: "Mercy Health Pavilion", region: "Charlotte", health: 99, sales: 5102, stock: 88, alerts: 0, status: "online" },
  { id: "AV-0488", venue: "Capital One Concourse", region: "DC Metro", health: 88, sales: 4720, stock: 34, alerts: 2, status: "low-stock" },
  { id: "AV-0392", venue: "Hudson Yards Lobby", region: "NYC Metro", health: 100, sales: 6840, stock: 95, alerts: 0, status: "online" },
  { id: "AV-0367", venue: "WeWork · Flatiron", region: "NYC Metro", health: 92, sales: 3215, stock: 64, alerts: 0, status: "online" },
  { id: "AV-0289", venue: "Galleria Mall · Lvl 2", region: "DFW", health: 76, sales: 2105, stock: 58, alerts: 1, status: "service" },
  { id: "AV-0301", venue: "UCLA Ackerman", region: "LA Metro", health: 97, sales: 5560, stock: 82, alerts: 0, status: "online" },
  { id: "AV-0277", venue: "Salesforce Tower", region: "Bay Area", health: 94, sales: 4980, stock: 76, alerts: 0, status: "online" },
  { id: "AV-0241", venue: "Logan Airport · Term B", region: "Boston", health: 99, sales: 7230, stock: 91, alerts: 0, status: "online" },
  { id: "AV-0199", venue: "Mile High Stadium", region: "Denver", health: 0, sales: 0, stock: 0, alerts: 3, status: "offline" },
  { id: "AV-0156", venue: "Northwestern Hosp.", region: "Chicago", health: 95, sales: 4410, stock: 81, alerts: 0, status: "online" },
];

const SALES_30D = [
  // Last 30 days, daily $ totals across fleet (sample data)
  3120, 3340, 2890, 3580, 4120, 4380, 4210, 3890, 3650, 3920,
  4080, 4310, 4520, 4280, 4150, 3980, 4220, 4480, 4720, 4810,
  4690, 4540, 4360, 4580, 4920, 5180, 5240, 5120, 5380, 5460,
];

const TOP_PRODUCTS = [
  { name: "Liquid Death · Sparkling 16oz", sku: "LD-SPK-16", units: 8420, mix: 9.2 },
  { name: "RXBAR Chocolate Sea Salt", sku: "RX-CSS-1.83", units: 6210, mix: 6.8 },
  { name: "Celsius · Tropical Vibe", sku: "CL-TRV-12", units: 5980, mix: 6.5 },
  { name: "Skinny Pop · Original 4.4oz", sku: "SP-OG-4.4", units: 5210, mix: 5.7 },
  { name: "KIND Bar · Dark Chocolate", sku: "KD-DCN-1.4", units: 4890, mix: 5.4 },
  { name: "Olipop · Strawberry Vanilla", sku: "OP-SBV-12", units: 4320, mix: 4.7 },
];

const AD_CAMPAIGNS = [
  { id: "C-0204", brand: "Liquid Death", flight: "Apr 12 — May 09", impressions: 412800, ctr: 2.4, qrScans: 9890, status: "live" },
  { id: "C-0198", brand: "Celsius Energy", flight: "Apr 01 — Apr 30", impressions: 388200, ctr: 1.9, qrScans: 7220, status: "live" },
  { id: "C-0192", brand: "Whoop 5.0", flight: "Mar 25 — Apr 22", impressions: 298100, ctr: 3.1, qrScans: 9180, status: "ending" },
  { id: "C-0181", brand: "On Running", flight: "Mar 04 — Apr 01", impressions: 244500, ctr: 2.0, qrScans: 4870, status: "complete" },
];

const FEATURES = [
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

const VENUE_TYPES = [
  "Office tower / corporate campus",
  "Multifamily residential",
  "Gym / fitness studio",
  "Hospital / clinic",
  "University / college campus",
  "Hotel / hospitality",
  "Airport / transit hub",
  "Retail / mall",
  "Other",
];

const PRODUCT_CATEGORIES = [
  "Sparkling & functional water",
  "Energy drinks",
  "Cold brew & coffee",
  "Protein bars",
  "Better-for-you snacks",
  "Salty snacks",
  "Fresh / chilled grab-and-go",
  "Hydration / electrolytes",
];

const DIETARY_TAGS = [
  "Gluten-free",
  "Vegan",
  "Keto / low-carb",
  "High protein",
  "Sugar-free",
  "Organic",
];

window.AV_DATA = {
  REGIONS, FLEET_HEALTH, SALES_30D, TOP_PRODUCTS, AD_CAMPAIGNS,
  FEATURES, VENUE_TYPES, PRODUCT_CATEGORIES, DIETARY_TAGS,
};
