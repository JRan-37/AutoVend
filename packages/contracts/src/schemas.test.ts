import { describe, expect, test } from "vitest";
import { leadSubmissionSchema, placementLeadSchema } from "./leads.js";
import { surveySubmissionSchema } from "./surveys.js";
import { problemDetailsSchema, submissionReceiptSchema } from "./common.js";

const validPlacement = {
  type: "placement",
  org: "Hudson Yards Mgmt",
  contact: "Dana Ortiz",
  email: "dana@example.com",
  venueType: "office_corporate",
} as const;

describe("leadSubmissionSchema", () => {
  test("accepts a minimal valid placement lead", () => {
    const parsed = leadSubmissionSchema.parse(validPlacement);
    expect(parsed.type).toBe("placement");
  });

  test("rejects display labels where enum codes are required", () => {
    const r = leadSubmissionSchema.safeParse({
      ...validPlacement,
      venueType: "Office tower / corporate campus",
    });
    expect(r.success).toBe(false);
  });

  test("rejects unknown lead types", () => {
    expect(
      leadSubmissionSchema.safeParse({ ...validPlacement, type: "Smart Placement" }).success,
    ).toBe(false);
  });

  test("rejects invalid email", () => {
    expect(
      leadSubmissionSchema.safeParse({ ...validPlacement, email: "not-an-email" }).success,
    ).toBe(false);
  });

  test("caps every free-text field", () => {
    expect(
      placementLeadSchema.safeParse({ ...validPlacement, message: "x".repeat(4001) }).success,
    ).toBe(false);
    expect(placementLeadSchema.safeParse({ ...validPlacement, org: "x".repeat(201) }).success).toBe(
      false,
    );
  });

  test("trims whitespace and rejects blank required fields", () => {
    expect(placementLeadSchema.safeParse({ ...validPlacement, org: "   " }).success).toBe(false);
    const parsed = placementLeadSchema.parse({ ...validPlacement, org: "  Equinox  " });
    expect(parsed.org).toBe("Equinox");
  });

  test("general lead requires a message", () => {
    expect(
      leadSubmissionSchema.safeParse({
        type: "general",
        name: "Sam",
        email: "sam@example.com",
      }).success,
    ).toBe(false);
  });
});

describe("surveySubmissionSchema", () => {
  test("accepts a valid survey and defaults dietaryCodes", () => {
    const parsed = surveySubmissionSchema.parse({
      venueText: "Hudson Yards office tower, NYC",
      categoryCodes: ["energy_drinks", "protein_bars"],
    });
    expect(parsed.dietaryCodes).toEqual([]);
  });

  test("requires at least one category", () => {
    expect(
      surveySubmissionSchema.safeParse({ venueText: "Somewhere", categoryCodes: [] }).success,
    ).toBe(false);
  });

  test("rejects category display labels", () => {
    expect(
      surveySubmissionSchema.safeParse({
        venueText: "Somewhere",
        categoryCodes: ["Energy drinks"],
      }).success,
    ).toBe(false);
  });
});

describe("common envelopes", () => {
  test("submission receipt validates", () => {
    expect(
      submissionReceiptSchema.safeParse({ id: "L-ABC12", receivedAt: new Date().toISOString() })
        .success,
    ).toBe(true);
  });

  test("problem details validates and defaults type", () => {
    const p = problemDetailsSchema.parse({ title: "Rate limited", status: 429 });
    expect(p.type).toBe("about:blank");
  });
});
