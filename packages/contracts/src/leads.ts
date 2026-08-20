import { z } from "zod";
import { BUDGET_BANDS, INDUSTRIES, TRAFFIC_BANDS, VENUE_TYPES } from "./enums.js";

/* Lead submissions — the public forms' wire contracts (ARCHITECTURE §5, §10.2).
 * Every string is length-capped; enums are code values, never display labels.
 * The API stores a Lead as an immutable snapshot of exactly this payload. */

const shortText = z.string().trim().min(1).max(200);
const email = z.string().trim().max(254).email();
const phone = z.string().trim().max(40);
const longText = z.string().trim().max(4000);

export const placementLeadSchema = z.object({
  type: z.literal("placement"),
  org: shortText,
  contact: shortText,
  email,
  phone: phone.optional(),
  venueType: z.enum(VENUE_TYPES),
  trafficBand: z.enum(TRAFFIC_BANDS).optional(),
  address: z.string().trim().max(400).optional(),
  message: longText.optional(),
});

export const advertisingLeadSchema = z.object({
  type: z.literal("advertising"),
  org: shortText,
  contact: shortText,
  email,
  industry: z.enum(INDUSTRIES),
  budgetBand: z.enum(BUDGET_BANDS).optional(),
  flight: z.string().trim().max(120).optional(),
  message: longText.optional(),
});

export const suggestionLeadSchema = z.object({
  type: z.literal("suggestion"),
  venue: shortText,
  city: shortText,
  state: z.string().trim().max(80).optional(),
  trafficBand: z.enum(TRAFFIC_BANDS).optional(),
  reason: longText.min(1),
  contact: shortText.optional(),
  email: email.optional(),
});

export const generalLeadSchema = z.object({
  type: z.literal("general"),
  name: shortText,
  email,
  subject: z.string().trim().max(200).optional(),
  message: longText.min(1),
});

export const demoLeadSchema = z.object({
  type: z.literal("demo"),
  name: shortText,
  email,
  org: shortText,
  role: z.string().trim().max(120).optional(),
});

export const leadSubmissionSchema = z.discriminatedUnion("type", [
  placementLeadSchema,
  advertisingLeadSchema,
  suggestionLeadSchema,
  generalLeadSchema,
  demoLeadSchema,
]);

export type PlacementLead = z.infer<typeof placementLeadSchema>;
export type AdvertisingLead = z.infer<typeof advertisingLeadSchema>;
export type SuggestionLead = z.infer<typeof suggestionLeadSchema>;
export type GeneralLead = z.infer<typeof generalLeadSchema>;
export type DemoLead = z.infer<typeof demoLeadSchema>;
export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;
