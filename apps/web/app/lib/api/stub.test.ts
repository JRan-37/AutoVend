import { expect, test } from "vitest";
import { createStubSubmissionApi } from "./stub";

const validLead = {
  type: "general",
  name: "Sam",
  email: "sam@example.com",
  message: "Hello there",
} as const;

test("accepts a valid lead and returns a receipt", async () => {
  const api = createStubSubmissionApi({ delayMs: 0 });
  const receipt = await api.submitLead(validLead, { idempotencyKey: "k1" });
  expect(receipt.id).toMatch(/^L-/);
  expect(new Date(receipt.receivedAt).getTime()).not.toBeNaN();
});

test("replays the same receipt for the same idempotency key", async () => {
  const api = createStubSubmissionApi({ delayMs: 0 });
  const first = await api.submitLead(validLead, { idempotencyKey: "same" });
  const second = await api.submitLead(validLead, { idempotencyKey: "same" });
  expect(second.id).toBe(first.id);
});

test("different keys get different receipts", async () => {
  const api = createStubSubmissionApi({ delayMs: 0 });
  const a = await api.submitLead(validLead, { idempotencyKey: "a" });
  const b = await api.submitLead(validLead, { idempotencyKey: "b" });
  expect(a.id).not.toBe(b.id);
});

test("rejects invalid payloads with the contract schema", async () => {
  const api = createStubSubmissionApi({ delayMs: 0 });
  await expect(
    api.submitLead({ ...validLead, email: "nope" }, { idempotencyKey: "x" }),
  ).rejects.toThrow();
});

test("failRate=1 always fails without saving", async () => {
  const api = createStubSubmissionApi({ delayMs: 0, failRate: 1 });
  await expect(api.submitLead(validLead, { idempotencyKey: "f" })).rejects.toThrow(/unavailable/i);
});

test("survey submissions get S- refs", async () => {
  const api = createStubSubmissionApi({ delayMs: 0 });
  const receipt = await api.submitSurvey(
    { venueText: "Somewhere", categoryCodes: ["energy_drinks"], dietaryCodes: [] },
    { idempotencyKey: "s1" },
  );
  expect(receipt.id).toMatch(/^S-/);
});
