import type { ConsoleReadApi } from "@autovend/contracts";

/* Fixtures wrapper for console reads (ARCHITECTURE §3): wraps any dataset in
 * configurable latency / failure / emptiness so every list and stat card gets
 * built with loading, error-with-retry, and empty states. In dev, options come
 * from the URL: ?fixtures=delay:1200,fail:0.5,empty */

export interface FixtureOptions {
  delayMs: number;
  failRate: number;
  empty: boolean;
}

export const DEFAULT_FIXTURE_OPTIONS: FixtureOptions = {
  delayMs: 350,
  failRate: 0,
  empty: false,
};

export function parseFixtureOptions(search: string): FixtureOptions {
  const raw = new URLSearchParams(search).get("fixtures");
  const opts = { ...DEFAULT_FIXTURE_OPTIONS };
  if (!raw) return opts;
  for (const part of raw.split(",")) {
    const [k, v] = part.split(":");
    if (k === "delay" && v !== undefined) opts.delayMs = Math.max(0, Number(v) || 0);
    if (k === "fail" && v !== undefined) opts.failRate = Math.min(1, Math.max(0, Number(v) || 0));
    if (k === "empty") opts.empty = v === undefined || v === "1" || v === "true";
  }
  return opts;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function withFixtures(source: ConsoleReadApi, options: FixtureOptions): ConsoleReadApi {
  async function gate<T>(value: () => Promise<T>, emptyValue: T): Promise<T> {
    await sleep(options.delayMs);
    if (Math.random() < options.failRate) {
      throw new Error("Fleet data is temporarily unavailable.");
    }
    if (options.empty) return emptyValue;
    return value();
  }

  return {
    getOverview: () =>
      gate(source.getOverview, {
        salesDailyMinor: [],
        machinesOnline: 0,
        machinesTotal: 0,
        uptimeLabel: "—",
        adImpressionsLabel: "—",
        lowStock: [],
        topProducts: [],
        alerts: [],
      }),
    getMachines: () => gate(source.getMachines, []),
    getSalesDailyMinor: () => gate(source.getSalesDailyMinor, []),
    getTopProducts: () => gate(source.getTopProducts, []),
    getCampaigns: () => gate(source.getCampaigns, []),
    getRegions: () => gate(source.getRegions, []),
  };
}
