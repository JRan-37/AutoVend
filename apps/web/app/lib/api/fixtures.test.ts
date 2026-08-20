import { expect, test } from "vitest";
import { parseFixtureOptions, withFixtures } from "./fixtures";
import { demoConsoleSource } from "../../features/demo/demoData";

test("parseFixtureOptions reads delay, fail, and empty from the URL", () => {
  const opts = parseFixtureOptions("?fixtures=delay:1200,fail:0.5,empty");
  expect(opts).toEqual({ delayMs: 1200, failRate: 0.5, empty: true });
});

test("parseFixtureOptions defaults when absent and clamps failRate", () => {
  expect(parseFixtureOptions("")).toEqual({ delayMs: 350, failRate: 0, empty: false });
  expect(parseFixtureOptions("?fixtures=fail:7").failRate).toBe(1);
});

test("empty mode returns empty datasets, not errors", async () => {
  const api = withFixtures(demoConsoleSource, { delayMs: 0, failRate: 0, empty: true });
  expect(await api.getMachines()).toEqual([]);
  const overview = await api.getOverview();
  expect(overview.machinesTotal).toBe(0);
  expect(overview.salesDailyMinor).toEqual([]);
});

test("failRate=1 rejects every read", async () => {
  const api = withFixtures(demoConsoleSource, { delayMs: 0, failRate: 1, empty: false });
  await expect(api.getMachines()).rejects.toThrow(/unavailable/i);
});

test("passthrough mode returns the frozen demo data", async () => {
  const api = withFixtures(demoConsoleSource, { delayMs: 0, failRate: 0, empty: false });
  const machines = await api.getMachines();
  expect(machines).toHaveLength(12);
  expect(machines[0]?.serial).toBe("AV-0421");
});
