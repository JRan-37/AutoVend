import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { GeneralLead } from "@autovend/contracts";
import { Field } from "../../components/primitives";
import { CONTACT_EMAILS } from "../marketing/content";
import {
  blankToUndefined,
  emailField,
  FormShell,
  HoneypotField,
  optionalText,
  required,
  SubmitError,
  SuccessState,
  useHoneypot,
  useLeadSubmission,
} from "./shared";

const schema = z.object({
  name: required(),
  email: emailField,
  subject: optionalText(200),
  message: required(),
});
type Values = z.infer<typeof schema>;

function toSubmission(v: Values): GeneralLead {
  return {
    type: "general",
    name: v.name,
    email: v.email,
    subject: blankToUndefined(v.subject),
    message: v.message,
  };
}

export function GeneralForm() {
  const submission = useLeadSubmission();
  const honeypot = useHoneypot();
  const [refId, setRefId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  if (refId) {
    return (
      <SuccessState
        title="Message received."
        body="We'll route this to the right team and get back to you within two business days."
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
    <FormShell kicker="FORM · 04 OF 04 · GENERAL" title="Send us a note.">
      <form
        onSubmit={(e) => void onSubmit(e)}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
        noValidate
      >
        <HoneypotField value={honeypot.trap} onChange={honeypot.setTrap} />
        <div className="form-grid">
          <Field label="Name" required error={errors.name?.message}>
            <input className={"input" + (errors.name ? " error" : "")} {...register("name")} />
          </Field>
          <Field label="Email" required error={errors.email?.message}>
            <input
              className={"input" + (errors.email ? " error" : "")}
              type="email"
              {...register("email")}
            />
          </Field>
        </div>
        <Field label="Subject" error={errors.subject?.message}>
          <input className="input" {...register("subject")} />
        </Field>
        <Field label="Message" required error={errors.message?.message}>
          <textarea
            className={"textarea" + (errors.message ? " error" : "")}
            rows={5}
            {...register("message")}
          />
        </Field>
        <SubmitError error={submission.error} />
        <div className="form-foot">
          <span className="meta">ROUTES TO · {CONTACT_EMAILS.hello}</span>
          <button
            type="submit"
            className="btn btn-accent btn-arrow"
            disabled={submission.isPending}
          >
            {submission.isPending ? "Submitting…" : "Send"}
          </button>
        </div>
      </form>
    </FormShell>
  );
}
