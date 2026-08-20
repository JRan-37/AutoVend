import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BUDGET_BANDS,
  BUDGET_BAND_LABELS,
  INDUSTRIES,
  INDUSTRY_LABELS,
  type AdvertisingLead,
  type BudgetBand,
  type Industry,
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
  industry: requiredChoice(INDUSTRIES),
  budgetBand: optionalChoice(BUDGET_BANDS),
  flight: optionalText(120),
  message: optionalText(4000),
});
type Values = z.infer<typeof schema>;

function toSubmission(v: Values): AdvertisingLead {
  return {
    type: "advertising",
    org: v.org,
    contact: v.contact,
    email: v.email,
    industry: v.industry as Industry,
    budgetBand: blankToUndefined(v.budgetBand) as BudgetBand | undefined,
    flight: blankToUndefined(v.flight),
    message: blankToUndefined(v.message),
  };
}

export function AdvertisingForm() {
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
      industry: "",
      budgetBand: "",
      flight: "",
      message: "",
    },
  });

  if (refId) {
    return (
      <SuccessState
        title="Advertising inquiry received."
        body="The ad-sales team will reach out with a media kit, current inventory, and rate-card guidance. All estimates are subject to confirmation at IO."
        refId={refId}
      />
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    if (honeypot.isBot) {
      setRefId(honeypot.fakeReceipt().id);
      return;
    }
    const receipt = await submission.mutateAsync(toSubmission(values));
    setRefId(receipt.id);
  });

  return (
    <FormShell
      kicker="FORM · 02 OF 04 · ADVERTISING"
      title="Plan a campaign on the AutoVend network."
    >
      <form onSubmit={(e) => void onSubmit(e)} className="form-grid" noValidate>
        <HoneypotField value={honeypot.trap} onChange={honeypot.setTrap} />
        <Field label="Brand / agency" required error={errors.org?.message}>
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
        <Field label="Industry" required error={errors.industry?.message}>
          <select
            className={"select" + (errors.industry ? " error" : "")}
            {...register("industry")}
          >
            <option value="">— select —</option>
            {INDUSTRIES.map((v) => (
              <option key={v} value={v}>
                {INDUSTRY_LABELS[v]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Estimated budget" error={errors.budgetBand?.message}>
          <select className="select" {...register("budgetBand")}>
            <option value="">— select —</option>
            {BUDGET_BANDS.map((v) => (
              <option key={v} value={v}>
                {BUDGET_BAND_LABELS[v]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Target flight" error={errors.flight?.message}>
          <input className="input" placeholder="e.g. June 1 – June 30" {...register("flight")} />
        </Field>
        <div className="span-2">
          <Field
            label="Campaign objectives"
            hint="Awareness, sampling, QR-driven activation, retail lift, etc."
            error={errors.message?.message}
          >
            <textarea className="textarea" rows={4} {...register("message")} />
          </Field>
        </div>
        <SubmitError error={submission.error} />
        <div className="form-foot span-2">
          <span className="meta">ROUTES TO · {CONTACT_EMAILS.ads}</span>
          <button
            type="submit"
            className="btn btn-accent btn-arrow"
            disabled={submission.isPending}
          >
            {submission.isPending ? "Submitting…" : "Send inquiry"}
          </button>
        </div>
      </form>
    </FormShell>
  );
}
