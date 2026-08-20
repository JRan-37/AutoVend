/* Enum codes are the single source of truth for every closed value set
 * (ARCHITECTURE §5): the API stores and validates codes; the UI renders the
 * matching LABELS entry. Display strings never reach the database — the
 * prototype submitted labels like "200 – 500" (en dash included) and this
 * layer exists so that never happens again.
 */

export const LEAD_TYPES = ["placement", "advertising", "suggestion", "general", "demo"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];
export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  placement: "Smart Placement",
  advertising: "Advertising",
  suggestion: "Location Suggestion",
  general: "General",
  demo: "Dashboard Demo",
};

export const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

export const VENUE_TYPES = [
  "office_corporate",
  "multifamily_residential",
  "gym_fitness",
  "hospital_clinic",
  "university_campus",
  "hotel_hospitality",
  "airport_transit",
  "retail_mall",
  "other",
] as const;
export type VenueType = (typeof VENUE_TYPES)[number];
export const VENUE_TYPE_LABELS: Record<VenueType, string> = {
  office_corporate: "Office tower / corporate campus",
  multifamily_residential: "Multifamily residential",
  gym_fitness: "Gym / fitness studio",
  hospital_clinic: "Hospital / clinic",
  university_campus: "University / college campus",
  hotel_hospitality: "Hotel / hospitality",
  airport_transit: "Airport / transit hub",
  retail_mall: "Retail / mall",
  other: "Other",
};

export const TRAFFIC_BANDS = [
  "under_200",
  "b200_500",
  "b500_1500",
  "b1500_5000",
  "over_5000",
] as const;
export type TrafficBand = (typeof TRAFFIC_BANDS)[number];
export const TRAFFIC_BAND_LABELS: Record<TrafficBand, string> = {
  under_200: "< 200",
  b200_500: "200 – 500",
  b500_1500: "500 – 1,500",
  b1500_5000: "1,500 – 5,000",
  over_5000: "5,000+",
};

export const INDUSTRIES = [
  "beverage",
  "snack_cpg",
  "wellness_fitness",
  "apparel_footwear",
  "tech",
  "auto",
  "entertainment",
  "other",
] as const;
export type Industry = (typeof INDUSTRIES)[number];
export const INDUSTRY_LABELS: Record<Industry, string> = {
  beverage: "Beverage",
  snack_cpg: "Snack / CPG",
  wellness_fitness: "Wellness / fitness",
  apparel_footwear: "Apparel / footwear",
  tech: "Tech",
  auto: "Auto",
  entertainment: "Entertainment",
  other: "Other",
};

export const BUDGET_BANDS = ["under_10k", "b10k_50k", "b50k_250k", "over_250k"] as const;
export type BudgetBand = (typeof BUDGET_BANDS)[number];
export const BUDGET_BAND_LABELS: Record<BudgetBand, string> = {
  under_10k: "< $10K",
  b10k_50k: "$10K – $50K",
  b50k_250k: "$50K – $250K",
  over_250k: "$250K+",
};

export const PRODUCT_CATEGORIES = [
  "sparkling_functional_water",
  "energy_drinks",
  "cold_brew_coffee",
  "protein_bars",
  "better_for_you_snacks",
  "salty_snacks",
  "fresh_grab_and_go",
  "hydration_electrolytes",
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  sparkling_functional_water: "Sparkling & functional water",
  energy_drinks: "Energy drinks",
  cold_brew_coffee: "Cold brew & coffee",
  protein_bars: "Protein bars",
  better_for_you_snacks: "Better-for-you snacks",
  salty_snacks: "Salty snacks",
  fresh_grab_and_go: "Fresh / chilled grab-and-go",
  hydration_electrolytes: "Hydration / electrolytes",
};

export const DIETARY_TAGS = [
  "gluten_free",
  "vegan",
  "keto_low_carb",
  "high_protein",
  "sugar_free",
  "organic",
] as const;
export type DietaryTag = (typeof DIETARY_TAGS)[number];
export const DIETARY_TAG_LABELS: Record<DietaryTag, string> = {
  gluten_free: "Gluten-free",
  vegan: "Vegan",
  keto_low_carb: "Keto / low-carb",
  high_protein: "High protein",
  sugar_free: "Sugar-free",
  organic: "Organic",
};

export const MACHINE_STATUSES = ["online", "low_stock", "service", "offline"] as const;
export type MachineStatus = (typeof MACHINE_STATUSES)[number];
export const MACHINE_STATUS_LABELS: Record<MachineStatus, string> = {
  online: "Online",
  low_stock: "Low stock",
  service: "Service",
  offline: "Offline",
};

export const MACHINE_SOURCES = ["simulated", "hardware"] as const;
export type MachineSource = (typeof MACHINE_SOURCES)[number];
export const MACHINE_SOURCE_LABELS: Record<MachineSource, string> = {
  simulated: "Simulated",
  hardware: "Hardware",
};

export const REGION_STATUSES = ["active", "expansion"] as const;
export type RegionStatus = (typeof REGION_STATUSES)[number];
export const REGION_STATUS_LABELS: Record<RegionStatus, string> = {
  active: "Active",
  expansion: "Expansion",
};

export const CAMPAIGN_STATUSES = ["live", "ending", "complete"] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];
export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  live: "Live",
  ending: "Ending",
  complete: "Complete",
};

export const ALERT_LEVELS = ["info", "warn", "critical"] as const;
export type AlertLevel = (typeof ALERT_LEVELS)[number];
export const ALERT_LEVEL_LABELS: Record<AlertLevel, string> = {
  info: "Info",
  warn: "Warning",
  critical: "Critical",
};
