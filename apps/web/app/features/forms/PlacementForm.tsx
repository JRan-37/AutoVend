import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TRAFFIC_BANDS,
  TRAFFIC_BAND_LABELS,
  VENUE_TYPES,
  VENUE_TYPE_LABELS,
  type PlacementLead,
  type TrafficBand,
  type VenueType,
} from "@autovend/contracts";
import { Field } from "../../components/primitives";
import { CONTACT_EMAILS } from "../marketing/content";
import {
  blankToUndefined,
  emailField,
  FormShell,
  HoneypotField,
  optionalChoice,
  optionalText,
  required,
  requiredChoice,
  SubmitError,
  SuccessState,
  useHoneypot,
  useLeadSubmission,
} from "./shared";

const schema = z.object({
  org: required(),
  contact: required(),
  email: emailField,
  phone: optionalText(40),
  venueType: requiredChoice(VENUE_TYPES),
  trafficBand: optionalChoice(TRAFFIC_BANDS),
  address: optionalText(400),
  message: optionalText(4000),
});
type Values = z.infer<typeof schema>;

function toSubmission(v: Values): PlacementLead {
  return {
    type: "placement",
    org: v.org,
    contact: v.contact,
    email: v.email,
    phone: blankToUndefined(v.phone),
    venueType: v.venueType as VenueType,
    trafficBand: blankToUndefined(v.trafficBand) as TrafficBand | undefined,
    address: blankToUndefined(v.address),
    message: blankToUndefined(v.message),
  };
}

export function PlacementForm() {
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
      org: "",
      contact: "",
      email: "",
      phone: "",
      venueType: "",
      trafficBand: "",
      address: "",
      message: "",
    },
  });

  if (refId) {
    return (
      <SuccessState
        title="Placement request received."
        body="The placement team reviews venue fit, traffic, and footprint. Expect a follow-up within 2 business days with site survey and partnership terms."
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
    <FormShell kicker="FORM · 01 OF 04 · SMART PLACEMENT" title="Bring AutoVend to your venue.">
      <form onSubmit={(e) => void onSubmit(e)} className="form-grid" noValidate>
        <HoneypotField value={honeypot.trap} onChange={honeypot.setTrap} />
        <Field label="Organization" required error={errors.org?.message}>
          <input className={"input" + (errors.org ? " error" : "")} {...register("org")} />
        </Field>
        <Field label="Your name" required error={errors.contact?.message}>
          <input className={"input" + (errors.contact ? " error" : "")} {...register("contact")} />
        </Field>
        <Field label="Email" required error={errors.email?.message}>
          <input
            className={"input" + (errors.email ? " error" : "")}
            type="email"
            {...register("email")}
          />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input className="input" {...register("phone")} />
        </Field>
        <Field label="Venue type" required error={errors.venueType?.message}>
          <select
            className={"select" + (errors.venueType ? " error" : "")}
            {...register("venueType")}
          >
            <option value="">— select —</option>
            {VENUE_TYPES.map((v) => (
              <option key={v} value={v}>
                {VENUE_TYPE_LABELS[v]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Daily foot traffic (est.)" error={errors.trafficBand?.message}>
          <select className="select" {...register("trafficBand")}>
            <option value="">— select —</option>
            {TRAFFIC_BANDS.map((v) => (
              <option key={v} value={v}>
                {TRAFFIC_BAND_LABELS[v]}
              </option>
            ))}
          </select>
        </Field>
        <div className="span-2">
          <Field
            label="Venue address or city"
            hint="City and state are enough — full address optional."
            error={errors.address?.message}
          >
            <input className="input" {...register("address")} />
          </Field>
        </div>
        <div className="span-2">
          <Field
            label="Anything else?"
            hint="Hours, restrictions, what you're hoping to offer."
            error={errors.message?.message}
          >
            <textarea className="textarea" rows={4} {...register("message")} />
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
            {submission.isPending ? "Submitting…" : "Request Smart Placement"}
          </button>
        </div>
      </form>
    </FormShell>
  );
}
