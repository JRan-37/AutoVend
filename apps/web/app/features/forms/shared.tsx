import { useRef, useState } from "react";
import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  LEAD_TYPE_LABELS,
  type LeadSubmission,
  type SubmissionReceipt,
  type SurveySubmission,
} from "@autovend/contracts";
import { useApi } from "../../lib/api/context";
import { newIdempotencyKey } from "../../lib/idempotency";
import { useToasts } from "../../lib/toast";

/* Shared form plumbing. Form schemas are DERIVED from the contract schemas'
 * field rules but speak form dialect ("" for untouched optionals, select
 * strings); each form maps validated values to the wire type before submit
 * (ARCHITECTURE §3). */

/** Required text, capped to the matching contract field's max so the client
 * rejects what the wire schema would reject (no raw ZodError surfacing). */
export const required = (max = 200, label = "Required") =>
  z.string().trim().min(1, label).max(max, `Keep it under ${max} characters`);
export const emailField = z
  .string()
  .trim()
  .min(1, "Required")
  .max(254)
  .email("Enter a valid email");
export const optionalText = (max: number) =>
  z.string().trim().max(max, `Keep it under ${max} characters`);
const emailShape = z.string().email();
/** Optional email in form dialect: "" allowed, otherwise must satisfy the same
 * validator the contract uses (zod's .email(), not a looser hand-rolled regex). */
export const optionalEmailField = z
  .string()
  .trim()
  .max(254)
  .refine((v) => v === "" || emailShape.safeParse(v).success, "Enter a valid email");

export function requiredChoice(values: readonly string[]) {
  return z.string().refine((v) => values.includes(v), "Required");
}
export function optionalChoice(values: readonly string[]) {
  return z.string().refine((v) => v === "" || values.includes(v), "Pick a listed option");
}

/** "" → undefined for optional wire fields. */
export function blankToUndefined(v: string | undefined): string | undefined {
  return v === undefined || v.trim() === "" ? undefined : v.trim();
}

export function useLeadSubmission() {
  const { submissions } = useApi();
  const { pushToast } = useToasts();
  const keyRef = useRef(newIdempotencyKey());

  return useMutation({
    mutationFn: (input: LeadSubmission) =>
      submissions.submitLead(input, { idempotencyKey: keyRef.current }),
    onSuccess: (receipt, input) => {
      pushToast(`Submitted · ${LEAD_TYPE_LABELS[input.type]} · ref ${receipt.id}`);
      keyRef.current = newIdempotencyKey();
    },
  });
}

export function useSurveySubmission() {
  const { submissions } = useApi();
  const { pushToast } = useToasts();
  const keyRef = useRef(newIdempotencyKey());

  return useMutation({
    mutationFn: (input: SurveySubmission) =>
      submissions.submitSurvey(input, { idempotencyKey: keyRef.current }),
    onSuccess: (receipt) => {
      pushToast(`Survey received · ref ${receipt.id}`);
      keyRef.current = newIdempotencyKey();
    },
  });
}

/** Spam trap: hidden field humans never fill. Enforced for real by the API in
 * Phase 2; on the client a filled trap short-circuits to a fake success. */
export function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="sr" aria-hidden="true">
      <label>
        Leave this field empty
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}

export function useHoneypot() {
  const [trap, setTrap] = useState("");
  const fakeReceipt = (): SubmissionReceipt => ({
    id: `L-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    receivedAt: new Date().toISOString(),
  });
  return { trap, setTrap, isBot: trap.trim() !== "", fakeReceipt };
}

export function FormShell({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card card-pad" style={{ padding: 32 }}>
      <div className="meta" style={{ color: "var(--accent)", marginBottom: 8 }}>
        {kicker}
      </div>
      <h2 className="h2" style={{ fontSize: 26, marginBottom: 24 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

export function SuccessState({
  title,
  body,
  refId,
}: {
  title: string;
  body: string;
  refId: string;
}) {
  return (
    <div className="card card-pad" style={{ padding: 32 }}>
      <div className="meta" style={{ color: "var(--good)", marginBottom: 8 }}>
        ● SUBMITTED · REF {refId}
      </div>
      <h2 className="h2" style={{ fontSize: 26, marginBottom: 12 }}>
        {title}
      </h2>
      <p style={{ color: "var(--ink-3)", marginBottom: 24 }}>{body}</p>
      <Link to="/" className="btn btn-ghost btn-arrow">
        Back to home
      </Link>
    </div>
  );
}

export function SubmitError({ error }: { error: unknown }) {
  if (!error) return null;
  const message =
    error instanceof Error ? error.message : "Something went wrong. Your submission wasn't saved.";
  return (
    <div className="form-banner-error span-2" role="alert">
      {message} If it keeps failing, email us directly instead.
    </div>
  );
}
