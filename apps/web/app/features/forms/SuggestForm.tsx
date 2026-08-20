import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TRAFFIC_BANDS,
  TRAFFIC_BAND_LABELS,
  type SuggestionLead,
  type TrafficBand,
} from "@autovend/contracts";
import { Field } from "../../components/primitives";
import { CONTACT_EMAILS } from "../marketing/content";
import {
  blankToUndefined,
  FormShell,
  HoneypotField,
  optionalChoice,
  optionalEmailField,
  optionalText,
  required,
  SubmitError,
  SuccessState,
  useHoneypot,
  useLeadSubmission,
} from "./shared";

const schema = z.object({
  venue: required(),
  city: required(),
  state: optionalText(80),
  trafficBand: optionalChoice(TRAFFIC_BANDS),
  reason: required(4000),
  contact: optionalText(200),
  email: optionalEmailField,
});
type Values = z.infer<typeof schema>;

function toSubmission(v: Values): SuggestionLead {
  return {
    type: "suggestion",
    venue: v.venue,
    city: v.city,
    state: blankToUndefined(v.state),
    trafficBand: blankToUndefined(v.trafficBand) as TrafficBand | undefined,
    reason: v.reason,
    contact: blankToUndefined(v.contact),
    email: blankToUndefined(v.email),
  };
}

export function SuggestForm() {
  const submission = useLeadSubmission();
  const honeypot = useHoneypot();
  const [refId, setRefId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      venue: "",
      city: "",
      state: "",
      trafficBand: "",
      reason: "",
      contact: "",
      email: "",
    },
  });

  if (refId) {
    return (
      <SuccessState
        title="Suggestion logged."
        body="We weight new region launches and venue priorities by inbound interest. Suggestions like yours move our route map."
        refId={refId}
      />
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    if (honeypot.isBot) {
      setRefId(honeypot.fakeReceipt().id);
      return;
    }
    try {
      const receipt = await submission.mutateAsync(toSubmission(values));
      setRefId(receipt.id);
    } catch {
      // surfaced to the user via submission.error → <SubmitError/>
    }
  });

  return (
    <FormShell kicker="FORM · 03 OF 04 · SUGGEST A LOCATION" title="Recommend a venue.">
      <form onSubmit={(e) => void onSubmit(e)} className="form-grid" noValidate>
        <HoneypotField value={honeypot.trap} onChange={honeypot.setTrap} />
        <div className="span-2">
          <Field label="Venue name" required error={errors.venue?.message}>
            <input
              className={"input" + (errors.venue ? " error" : "")}
              placeholder="e.g. SoHo House Austin"
              {...register("venue")}
            />
          </Field>
        </div>
        <Field label="City" required error={errors.city?.message}>
          <input className={"input" + (errors.city ? " error" : "")} {...register("city")} />
        </Field>
        <Field label="State" error={errors.state?.message}>
          <input className="input" {...register("state")} />
        </Field>
        <Field label="Foot traffic estimate" error={errors.trafficBand?.message}>
          <select className="select" {...register("trafficBand")}>
            <option value="">— select —</option>
            {TRAFFIC_BANDS.map((v) => (
              <option key={v} value={v}>
                {TRAFFIC_BAND_LABELS[v]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Your name (optional)" error={errors.contact?.message}>
          <input className="input" {...register("contact")} />
        </Field>
        <div className="span-2">
          <Field label="Why this venue?" required error={errors.reason?.message}>
            <textarea
              className={"textarea" + (errors.reason ? " error" : "")}
              rows={3}
              placeholder="What makes this venue a fit for AutoVend?"
              {...register("reason")}
            />
          </Field>
        </div>
        <SubmitError error={submission.error} />
        <div className="form-foot span-2">
          <span className="meta">ROUTES TO · {CONTACT_EMAILS.placement}</span>
          <button
            type="submit"
            className="btn btn-accent btn-arrow"
            disabled={submission.isPending}
          >
            {submission.isPending ? "Submitting…" : "Submit suggestion"}
          </button>
        </div>
      </form>
    </FormShell>
  );
}
