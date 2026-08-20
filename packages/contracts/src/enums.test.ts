import { describe, expect, test } from "vitest";
import * as enums from "./enums.js";

// Every (VALUES, LABELS) pair exported by the module, discovered by convention
// so a new enum can't be added without labels silently.
const pairs = [
  ["LEAD_TYPES", "LEAD_TYPE_LABELS"],
  ["LEAD_STATUSES", "LEAD_STATUS_LABELS"],
  ["VENUE_TYPES", "VENUE_TYPE_LABELS"],
  ["TRAFFIC_BANDS", "TRAFFIC_BAND_LABELS"],
  ["INDUSTRIES", "INDUSTRY_LABELS"],
  ["BUDGET_BANDS", "BUDGET_BAND_LABELS"],
  ["PRODUCT_CATEGORIES", "PRODUCT_CATEGORY_LABELS"],
  ["DIETARY_TAGS", "DIETARY_TAG_LABELS"],
  ["MACHINE_STATUSES", "MACHINE_STATUS_LABELS"],
  ["MACHINE_SOURCES", "MACHINE_SOURCE_LABELS"],
  ["REGION_STATUSES", "REGION_STATUS_LABELS"],
] as const;

const CODE_FORMAT = /^[a-z0-9]+(_[a-z0-9]+)*$/;

describe.each(pairs)("%s / %s", (valuesName, labelsName) => {
  const values = (enums as Record<string, unknown>)[valuesName] as readonly string[];
  const labels = (enums as Record<string, unknown>)[labelsName] as Record<string, string>;

  test("both exports exist", () => {
    expect(values).toBeDefined();
    expect(labels).toBeDefined();
  });

  test("codes are lower_snake_case and unique", () => {
    for (const v of values) expect(v).toMatch(CODE_FORMAT);
    expect(new Set(values).size).toBe(values.length);
  });

  test("labels cover every code, no extras, none empty", () => {
    expect(Object.keys(labels).sort()).toEqual([...values].sort());
    for (const label of Object.values(labels)) expect(label.trim()).not.toHaveLength(0);
  });

  test("labels are unique within the enum", () => {
    const all = Object.values(labels);
    expect(new Set(all).size).toBe(all.length);
  });
});

test("every exported *_LABELS map is covered by this suite", () => {
  const exported = Object.keys(enums).filter((k) => k.endsWith("_LABELS"));
  const covered = pairs.map(([, labelsName]) => labelsName);
  expect(exported.sort()).toEqual([...covered].sort());
});

test("every exported value array is registered in this suite", () => {
  const valueArrays = Object.entries(enums)
    .filter(([, v]) => Array.isArray(v) && v.every((x) => typeof x === "string"))
    .map(([k]) => k);
  const covered = pairs.map(([valuesName]) => valuesName);
  expect(valueArrays.sort()).toEqual([...covered].sort());
});
