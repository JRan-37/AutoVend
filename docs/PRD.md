# AutoVend — Product Requirements (v0.1)

Status: **approved 2026-08-19** · Owner: Jon

## One-liner

AutoVend places smart vending machines (cashless payments, telemetry, 32″ ad display) in
high-traffic venues. The platform has two halves:

1. **Public site** — marketing + lead generation (placement requests, ad inquiries, venue
   suggestions, consumer product surveys, gated dashboard demo).
2. **Operator console (CRM)** — internal system for running the business: machines, venues,
   leads/pipeline, inventory & restocking, sales, ad campaigns, service operations.

The existing repo is a static Babel-in-browser React prototype of the public site with a
hard-coded demo of the console. It defines the product surface and the design language; this
project productionizes it and builds the real backend behind it.

## Personas

| Persona           | Relationship | Needs                                                                              |
| ----------------- | ------------ | ---------------------------------------------------------------------------------- |
| Fleet operator    | internal     | One console: fleet uptime, stock levels, restock routes, alerts, service tickets   |
| Placement / sales | internal     | Lead inbox from website forms, pipeline stages, venue records, follow-up tracking  |
| Ad sales          | internal     | Campaign records, flight dates, delivery metrics (impressions, QR scans)           |
| Venue host        | external     | Request a machine, get responses within 2 business days (self-serve portal: later) |
| Advertiser        | external     | Campaign inquiry → media kit (self-serve portal: later)                            |
| End consumer      | external     | 2-minute product survey, suggest venues — no login                                 |

## Goals (first 12 months)

1. Marketing site live on the AutoVend domain, deployed from `main` automatically.
2. Every public form writes a **Lead** or **SurveyResponse** into the CRM (no more lost
   submissions) with an email notification to the right inbox.
3. Operator console v1 on real data: machines, venues, leads, sales, ads — auth-gated.
4. All deploys via GitHub Actions to AWS; no hand-run infrastructure changes.

## Non-goals (v1)

- Payment processing / machine firmware / device provisioning (telemetry _ingest API_ is in
  scope later; the machine side is not).
- Advertiser or venue-host self-serve portals (CRM records only).
- Native mobile apps; multi-tenant SaaS (single operator: AutoVend).
- Real demand-forecasting ML ("predictive restock" ships as threshold rules first).

## Product surface (from the prototype — source of truth for v1 scope)

### Public routes

`/` home · `/solutions/location-partner` · `/solutions/advertising-partner` · `/features` ·
`/reach` (US map) · `/operating-area` · `/dashboard-demo` (lead-gated) · `/survey` ·
`/contact` (4 forms) · `/resources`

### Forms → CRM entities

| Form               | Required fields                | Writes                 | Routed to  |
| ------------------ | ------------------------------ | ---------------------- | ---------- |
| Smart Placement    | org, contact, email, venueType | Lead(type=placement)   | placement@ |
| Advertising        | org, contact, email, industry  | Lead(type=advertising) | ads@       |
| Suggest a location | venue, city, reason            | Lead(type=suggestion)  | placement@ |
| General            | name, email, message           | Lead(type=general)     | hello@     |
| Demo unlock        | name, email, org               | Lead(type=demo)        | sales      |
| Product survey     | venue, ≥1 category             | SurveyResponse         | assortment |

### Console tabs (demo today → real modules)

| Tab                        | Prototype state                                       | Backing module                   |
| -------------------------- | ----------------------------------------------------- | -------------------------------- |
| Overview                   | sample stats, sales sparkline, low-stock list, alerts | sales + machines + inventory     |
| Machines                   | fleet table: health, stock, sales 30d, status filter  | machines + inventory             |
| Sales                      | daily sales, product mix                              | sales + catalog                  |
| Ads                        | campaign table: flight, impressions, CTR, QR scans    | advertising                      |
| Routes / Alerts / Settings | "Phase 2" stubs                                       | operations / machines / identity |

## Success metrics

- Lead form → CRM record + notification email: < 1 min, zero silent drops.
- Deploy lead time (merge → live): < 15 min, no manual steps.
- Console list views render first real data < 2s at p75 (signed-in, warm API); site LCP < 2.5s.
- Operator can answer "which machines need restock today?" from one screen.

## Constraints

- Solo developer; AWS monthly budget should stay lean (target < ~$50/mo until revenue).
- **No machine hardware specs yet** — machines are simulated (`tools/simulator`,
  ARCHITECTURE §4) until specs arrive; all machine modeling stays hardware-agnostic.
- Preserve the prototype's visual identity (token-based design system in `styles.css`).
- Lead data contains PII (names, emails, phones) — treat accordingly (see ARCHITECTURE.md §10).
