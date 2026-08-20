import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DIETARY_TAGS,
  DIETARY_TAG_LABELS,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS,
  VENUE_TYPES,
  VENUE_TYPE_LABELS,
  type DietaryTag,
  type ProductCategory,
  type SurveySubmission,
  type VenueType,
} from "@autovend/contracts";
import { Field, PageHeader } from "../../components/primitives";
import {
  blankToUndefined,
  HoneypotField,
  optionalChoice,
  optionalText,
  required,
  SubmitError,
  useHoneypot,
  useSurveySubmission,
} from "../../features/forms/shared";

export function meta() {
  return [
    { title: "Product survey — AutoVend Systems" },
    {
      name: "description",
      content:
        "Two minutes, no login: tell us what you'd actually buy and we tune the SKU mix at machines in your area.",
    },
  ];
}

const schema = z.object({
  venueText: required(),
  venueType: optionalChoice(VENUE_TYPES),
  categoryCodes: z.array(z.string()).min(1, "Pick at least one"),
  dietaryCodes: z.array(z.string()),
  suggestion: optionalText(2000),
  email: z
    .string()
    .trim()
    .max(254)
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email"),
});
type Values = z.infer<typeof schema>;

function toSubmission(v: Values): SurveySubmission {
  return {
    venueText: v.venueText,
    venueType: blankToUndefined(v.venueType) as VenueType | undefined,
    categoryCodes: v.categoryCodes as ProductCategory[],
    dietaryCodes: v.dietaryCodes as DietaryTag[],
    suggestion: blankToUndefined(v.suggestion),
    email: blankToUndefined(v.email),
  };
}

export default function SurveyPage() {
  const submission = useSurveySubmission();
  const honeypot = useHoneypot();
  const [refId, setRefId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      venueText: "",
      venueType: "",
      categoryCodes: [],
      dietaryCodes: [],
      suggestion: "",
      email: "",
    },
  });

  const categories = watch("categoryCodes");
  const dietary = watch("dietaryCodes");

  const toggle = (field: "categoryCodes" | "dietaryCodes", value: string) => {
    const current = field === "categoryCodes" ? categories : dietary;
    const next = current.includes(value) ? current.filter((x) => x !== value) : [...current, value];
    setValue(field, next, { shouldValidate: true });
  };

  if (refId) {
    return (
      <main>
        <PageHeader
          kicker="SURVEY · CONFIRMED"
          title="Got it. Thanks for telling us."
          lead="Your preferences are routed to the assortment-planning queue. We use these signals to tune SKU mix per machine and per region."
        />
        <section className="section">
          <div className="container" style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="card card-pad" style={{ padding: 32 }}>
              <div className="meta" style={{ color: "var(--accent)", marginBottom: 12 }}>
                RESPONSE LOGGED · {refId}
              </div>
              <h3 style={{ fontSize: 22, marginBottom: 12 }}>Want to suggest a venue too?</h3>
              <p style={{ color: "var(--ink-3)", marginBottom: 20 }}>
                If your office, gym, or campus doesn&apos;t have an AutoVend yet, drop the venue and
                we&apos;ll route it to the placement team.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/contact?form=suggest" className="btn btn-accent btn-arrow">
                  Suggest a location
                </Link>
                <Link to="/" className="btn btn-ghost">
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    if (honeypot.isBot) {
      setRefId(`S-${Math.random().toString(36).slice(2, 7).toUpperCase()}`);
      return;
    }
    const receipt = await submission.mutateAsync(toSubmission(values));
    setRefId(receipt.id);
  });

  return (
    <main>
      <PageHeader
        kicker="END USERS · PRODUCT SURVEY"
        title="Tell us what you'd actually buy."
        lead="Two minutes. No login. We use your input to tune the SKU mix at machines in your area and stock products people in your venue actually want."
      />
      <section className="section">
        <div className="container" style={{ maxWidth: 720, margin: "0 auto" }}>
          <form
            onSubmit={(e) => void onSubmit(e)}
            className="card card-pad"
            style={{ display: "flex", flexDirection: "column", gap: 24, padding: 32 }}
            noValidate
          >
            <HoneypotField value={honeypot.trap} onChange={honeypot.setTrap} />
            <Field
              label="Where do you usually use a vending machine?"
              required
              error={errors.venueText?.message}
              hint="An office, gym, hospital, school — be as specific as you like."
            >
              <input
                className={"input" + (errors.venueText ? " error" : "")}
                placeholder="e.g. Hudson Yards office tower, NYC"
                {...register("venueText")}
              />
            </Field>
            <Field label="Venue type" error={errors.venueType?.message}>
              <select className="select" {...register("venueType")}>
                <option value="">— select —</option>
                {VENUE_TYPES.map((v) => (
                  <option key={v} value={v}>
                    {VENUE_TYPE_LABELS[v]}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Which categories do you reach for?"
              required
              group
              error={errors.categoryCodes?.message}
              hint="Pick all that apply."
            >
              <div className="choice-grid">
                {PRODUCT_CATEGORIES.map((c) => {
                  const on = categories.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      className={"choice" + (on ? " on" : "")}
                      aria-pressed={on}
                      onClick={() => toggle("categoryCodes", c)}
                    >
                      {on ? "● " : "○ "}
                      {PRODUCT_CATEGORY_LABELS[c]}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="Any dietary preferences?" group hint="Optional.">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {DIETARY_TAGS.map((t) => {
                  const on = dietary.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      className={"pill" + (on ? " on" : "")}
                      aria-pressed={on}
                      onClick={() => toggle("dietaryCodes", t)}
                    >
                      {DIETARY_TAG_LABELS[t]}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field
              label="Specific products to add?"
              hint="Brand, SKU, or just 'oat milk lattes' — anything goes."
              error={errors.suggestion?.message}
            >
              <textarea
                className="textarea"
                rows={3}
                placeholder="e.g. Olipop Cherry Vanilla, Magic Spoon cereal cups, oat milk options…"
                {...register("suggestion")}
              />
            </Field>
            <Field
              label="Email (optional)"
              hint="Only if you want a heads-up when your venue gets restocked."
              error={errors.email?.message}
            >
              <input
                className={"input" + (errors.email ? " error" : "")}
                {...register("email")}
                placeholder="you@company.com"
              />
            </Field>
            <SubmitError error={submission.error} />
            <div className="form-foot">
              <span className="meta">NO SENSITIVE DATA · ROUTED TO ASSORTMENT TEAM</span>
              <button
                type="submit"
                className="btn btn-primary btn-arrow"
                disabled={submission.isPending}
              >
                {submission.isPending ? "Submitting…" : "Submit survey"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
