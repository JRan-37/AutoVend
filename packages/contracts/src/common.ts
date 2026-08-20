import { z } from "zod";

/* Shared API conventions (ARCHITECTURE §5): one paginated envelope, one
 * RFC 7807-style error body, one submission receipt shape. */

export const problemDetailsSchema = z.object({
  type: z.string().max(200).default("about:blank"),
  title: z.string().max(200),
  status: z.number().int().min(100).max(599),
  detail: z.string().max(2000).optional(),
  instance: z.string().max(200).optional(),
});
export type ProblemDetails = z.infer<typeof problemDetailsSchema>;

export const submissionReceiptSchema = z.object({
  id: z.string().min(1).max(64),
  receivedAt: z.string().datetime(),
});
export type SubmissionReceipt = z.infer<typeof submissionReceiptSchema>;

export interface Paginated<T> {
  items: T[];
  cursor: string | null;
  total?: number;
}

export function paginatedSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    items: z.array(item),
    cursor: z.string().nullable(),
    total: z.number().int().nonnegative().optional(),
  });
}
