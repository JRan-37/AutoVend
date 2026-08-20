import { expect, test } from "vitest";
import { formatInt, formatMoneyMinor, formatMoneyMinorCompact } from "./format";

test("formatMoneyMinor renders whole dollars without cents", () => {
  expect(formatMoneyMinor(428000)).toBe("$4,280");
});

test("formatMoneyMinor keeps cents when present", () => {
  expect(formatMoneyMinor(18240)).toBe("$182.40");
});

test("formatMoneyMinorCompact abbreviates thousands", () => {
  expect(formatMoneyMinorCompact(12_640_000)).toBe("$126.4K");
});

test("formatMoneyMinorCompact leaves small amounts alone", () => {
  expect(formatMoneyMinorCompact(48200)).toBe("$482");
});

test("formatInt groups thousands", () => {
  expect(formatInt(31234)).toBe("31,234");
});
