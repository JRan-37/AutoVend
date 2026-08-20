/** One key per logical submission: generated when a form mounts, kept across
 * retries of the same attempt, regenerated only after a success. */
export function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `idk-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
