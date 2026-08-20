import type { AlertLevel, CampaignStatus, MachineStatus, RegionStatus } from "./enums.js";

/* Console VIEW contracts (ARCHITECTURE §5): screen-shaped read models owned by
 * the future `console` BFF. The web app's fixtures and the frozen demo dataset
 * conform to these shapes — domain modules never contort to them.
 * Money is integer minor units (cents); the frontend formats. */

export interface RegionView {
  id: string;
  name: string;
  state: string;
  status: RegionStatus;
  density: number; // 0..1 editorial weighting for the map
  mapX: number; // 1000x600 viewBox coordinates
  mapY: number;
}

export interface MachineListRow {
  serial: string;
  venue: string;
  region: string;
  healthPct: number;
  stockPct: number;
  sales30dMinor: number;
  alerts: number;
  status: MachineStatus;
}

export interface TopProductRow {
  name: string;
  sku: string;
  units: number;
  mixPct: number;
}

export interface AdCampaignRow {
  id: string;
  brand: string;
  flightLabel: string;
  impressions: number;
  ctrPct: number;
  qrScans: number;
  status: CampaignStatus;
}

export interface AlertRow {
  level: AlertLevel;
  machineSerial: string;
  venue: string;
  message: string;
  agoLabel: string;
}

export interface ConsoleOverview {
  salesDailyMinor: number[]; // last 30 days
  machinesOnline: number;
  machinesTotal: number;
  uptimeLabel: string;
  adImpressionsLabel: string;
  lowStock: MachineListRow[];
  topProducts: TopProductRow[];
  alerts: AlertRow[];
}

/** The read surface the console/demo UI consumes. Implemented today by the
 * frozen demo dataset and the dev fixtures adapter; by the `console` BFF over
 * HTTP from Phase 3 — same interface, per-endpoint flips. */
export interface ConsoleReadApi {
  getOverview(): Promise<ConsoleOverview>;
  getMachines(): Promise<MachineListRow[]>;
  getSalesDailyMinor(): Promise<number[]>;
  getTopProducts(): Promise<TopProductRow[]>;
  getCampaigns(): Promise<AdCampaignRow[]>;
  getRegions(): Promise<RegionView[]>;
}
