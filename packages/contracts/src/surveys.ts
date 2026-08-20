import { z } from "zod";
import { DIETARY_TAGS, PRODUCT_CATEGORIES, VENUE_TYPES } from "./enums.js";

/* Consumer product-survey submission. Categories are stored as enum codes so
 * historical answers keep their meaning when the live catalog changes. */

export const surveySubmissionSchema = z.object({
  venueText: z.string().trim().min(1).max(300),
  venueType: z.enum(VENUE_TYPES).optional(),
  categoryCodes: z.array(z.enum(PRODUCT_CATEGORIES)).min(1).max(PRODUCT_CATEGORIES.length),
  dietaryCodes: z.array(z.enum(DIETARY_TAGS)).max(DIETARY_TAGS.length).default([]),
  suggestion: z.string().trim().max(2000).optional(),
  email: z.string().trim().max(254).email().optional(),
});

export type SurveySubmission = z.infer<typeof surveySubmissionSchema>;
