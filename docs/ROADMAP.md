# AutoVend — Delivery Roadmap (v0.2)

Status: **approved 2026-08-19** · Frontend first, per project direction. Each phase ends deployed, not
"done on a branch". Companion: [ARCHITECTURE.md](ARCHITECTURE.md).
Sizing is rough solo-dev calendar time, stated so "frontend first" doesn't silently become
two months of invisible work.

## Phase 0 — Repo & toolchain scaffold _(~2–3 days)_

Goal: a monorepo where `pnpm install && pnpm build && pnpm test` works and CI is green.

- [x] Move prototype files (incl. `AutoVend Website.html`) to `prototype/`, untouched;
      exclude `prototype/**` from eslint + tsconfig **in the same commit**
- [x] Media: the 16 MB of unreferenced source renders (`uploads/`) `git filter-repo`'d out of
      history 2026-08-20 (originals archived off-repo; convention: source media lives in S3,
      not git). Referenced media (`prototype/assets/`) stays with the prototype it serves;
      web-sized copies land in `apps/web/public/` during the Phase 1 port
- [x] pnpm workspaces: `apps/web`, `apps/api` (empty shell), `packages/contracts`
      (builds to `dist/` with a real exports map from day one)
- [x] Shared tooling: root eslint (incl. `eslint-plugin-boundaries` + `react/no-danger`),
      prettier, tsconfig base, vitest, Renovate (app installed; SHA-pinned actions, lockfile,
      image digests)
- [x] `ci.yml`: gitleaks (fail fast, pre-install) → install → `pnpm audit` → lint →
      format-check → typecheck → test → build,
      all actions pinned to commit SHAs; branch protection on `main`
- [x] AutoVend `CLAUDE.md` (TS/pnpm conventions, boundary rules, test gates, migration rules)

**Exit: ✅ met 2026-08-20** — CI green ([PR #1](https://github.com/JRan-37/AutoVend/pull/1),
31s); repo layout matches ARCHITECTURE §2.

## Phase 1 — Frontend productionization + first AWS deploy _(~3–5 weeks)_ ← current focus

Goal: the prototype, rebuilt properly, live on CloudFront with automated deploys.

- [ ] Scaffold `apps/web` (React Router v7 **pinned**, `ssr:false`, prerender = public routes;
      console routes SPA-only + noindex; hash-route redirect shim for old `#/x` links)
- [ ] Port design system: `styles.css` tokens → `app/styles/`; extract inline styles to
      component CSS; keep theme/density working; self-host fonts (Fontsource, 2 families)
- [ ] Port shared chrome: Header, Footer, StatCard, SparkBars (fix empty-input NaN), Field,
      Toasts, US reach map
- [ ] Port pages: home, solutions ×2, features, reach, operating-area, resources, 404
      (contact addresses in copy become @autovendsystems.com — the real domain)
- [ ] `packages/contracts` v0: **enum codes + LABELS maps** (venueType, trafficBand, leadType,
      industry, budgetBand, categories, dietary — ported from `data.jsx`, display strings never
      submitted), `leads` + `surveys` resource contracts, `console.view` contracts for the demo
      data shapes, `Paginated<T>` + RFC 7807 error conventions
- [ ] Port forms (survey + 4 contact forms) on RHF + schemas derived from contracts; submit via
      the contract client against a stub adapter; Idempotency-Key generated client-side
- [ ] `/dashboard-demo`: port the gated demo backed by **frozen `demoData.ts`** (permanent,
      never API-wired); `/console` shell exists behind a placeholder sign-in wall
- [ ] Fixtures adapter with `{delayMs, failRate, empty}` — **acceptance: every list/stat has
      loading, error-with-retry, and empty states**
- [ ] Tests: Playwright smoke (routes render) + form-submit E2E; vitest on lib/features logic
- [ ] Terraform: hand-applied `infra/bootstrap` (state bucket + OIDC provider) → `github-oidc`
      roles (§8 sub-conditions), `frontend` (S3+CloudFront+headers policy+CF function), `dns`
      (data-source the existing autovendsystems.com zone — Google Workspace records untouched)
- [ ] `deploy-web.yml` + `infra.yml` (plan on PR w/ tfsec, gated apply) live
- [ ] **File SES production-access request + set up DKIM/MAIL FROM once the domain exists**
      (human-reviewed, takes days — must not sit on Phase 2's critical path)

**Exit:** merge to main → site updates on CloudFront; Lighthouse ≥ 90 perf/SEO on `/`;
prerendered HTML for public routes; forms validate and submit against the stub with visible
loading/error/success states.

## Phase 2 — API skeleton + real lead capture _(~2–3 weeks)_

Goal: public forms write real Leads/SurveyResponses; Jon can read them; notifications flow.

- [ ] Scaffold `apps/api`: NestJS shared kernel (config, drizzle + schema barrel +
      destructive-migration CI check, typed events, RFC 7807 error envelope, health endpoint,
      allowlist pino logging, request-id, audit-log interceptor)
- [ ] **Origin lock middleware** (§10.1) + global deny-by-default auth guard with `@Public()`
- [ ] Modules: `parties`, `crm` (lead + survey intake, typed filter columns, immutable
      snapshot rule, purge use cases + soft delete), notifications adapter (SES on
      `lead.created`/`survey.submitted` — **pointer emails, no PII**)
- [ ] Public endpoints: body cap, zod `.max()` everywhere, honeypot, XFF-aware rate limit
      (+ the two-XFF-buckets test), Idempotency-Key dedupe, CRLF stripping near SES headers
- [ ] **Minimal console inbox**: Cognito pool (Hosted UI, one admin user, MFA) + a read-only
      lead/survey list at `/console` — between Phase 2 and 3 the email must not be the CRM
- [ ] Terraform: `database` (RDS with §7 flags), `api` (ECR scan-on-push, App Runner + VPC
      connector + **SES/SSM interface endpoints**, SSM params), SES identity; `deploy-api.yml`
      with scan + health gates
- [ ] Flip web forms stub → `/api/v1` (delete the stub adapter for these endpoints)
- [ ] Migration rehearsal runbook: restore latest prod snapshot locally, run migrations, then
      ship (standing rule while there's no staging)
- [ ] testcontainers integration tests on crm/parties; 80% gate on api modules enforced

**Exit:** placement form on prod → Lead row + pointer email < 1 min; Jon reads it signed-in at
`/console`; zero AWS credentials in GitHub; App Runner unreachable except via CloudFront.

## Phase 3 — Console v1 on real data _(~3–5 weeks)_

Goal: operators sign in and manage the fleet from real records.

- [ ] `identity` (JIT provisioning, role display copy) + roles admin/operator/field-tech;
      **authz test matrix (every role × route group + no-token → 401) — exit criterion**
- [ ] Modules: `locations` (regions incl. timeZone/map coords, venues), `machines` (registry,
      placements, manual status/health, alerts as immutable signals), `catalog`, `inventory`
      (slots, thresholds), `documents` (presigned S3, MIME/size allowlist)
- [ ] `console` BFF: screen endpoints (`/console/overview`, `/console/machines` list rows),
      published read-only views (`machines.v_machine_summary`), batch user/name resolution
- [ ] CRM UI: lead inbox becomes workable — assign, stage transitions, notes, `convertLead`
      (org/venue create-or-link with dedupe)
- [ ] Console tabs flip fixtures → API per endpoint: Machines → Overview (Sales/Ads stay on
      fixtures until Phase 4); **each flip deletes its fixture**
- [ ] Public reach map: prerender `loader` fetches `GET /api/v1/public/regions` (region-level
      aggregates only — never venue names/addresses, a contract-level guarantee); console
      region/venue changes fire a repo-dispatch that reruns `deploy-web`
- [ ] `tools/simulator` one-shot mode seeds the mock fleet (`source='simulated'`) + 90 days
      of history through module facades (run via the bastion path, §4 one-off tasks)
- [ ] E2E: login → machines table → edit placement; visual snapshots on console

**Exit:** fixtures deleted for machines/venues/leads; `/dashboard-demo` still renders from
frozen demo data with **zero authenticated API calls**; a venue added in the console shows on
the public map after the triggered redeploy.

## Phase 4 — Revenue & operations modules _(~3–4 weeks)_

Goal: the console answers money and maintenance questions.

- [ ] `sales`: simulator-generated transactions (+ CSV import path for real data), snapshot
      name/price, minor units, venue-local daily rollups, product mix
- [ ] `advertising`: campaigns, flights, delivery-metrics entry, InsertionOrder + Invoice
      records (status only — no payment processing)
- [ ] `locations.VenueAgreement`: rev-share/fixed-fee terms + computed "owed to venue" figure
- [ ] `operations`: service tickets (manual + auto-open on `machine.went-offline`), restock
      routes fed by `stock.below-threshold`
- [ ] Console: Sales/Ads tabs on real data; Routes + Alerts tabs built; **global search**
      (pg_trgm/tsvector in the `console` BFF over published views: serials, venues, orgs,
      contacts)

**Exit:** "which machines need restock today?" answered by `/console/routes`; sales tab shows
imported numbers; each venue shows its agreement terms and computed share.

## Phase 5 — Hardening & polish _(~1–2 weeks + ongoing)_

- [ ] Observability pass: alarms → email verified, request-id tracing end-to-end
- [ ] RDS restore drill documented in `docs/runbooks/` (and exercised once)
- [ ] Accessibility + reduced-motion audit (WCAG 2.2) on the public site
- [ ] Cost review vs. ARCHITECTURE §7 estimate; right-size App Runner/RDS
- [ ] Telemetry ingest API (`machines` module) — per-serial tokens with rotation (not
      Cognito); `tools/simulator` tick mode is its first client, before any hardware exists
- [ ] Revisit deferred triggers: WAF (abuse), staging (API churn), outbox+SQS (event
      durability), ECS (ingress/networking needs)

## Sequencing notes

- Phases 0–1 need no AWS commitments beyond an account and (optionally) the domain; Phase 1
  infra is frontend-only and ~$3/mo. The SES production-access request is the one Phase 2
  dependency that must be filed during Phase 1.
- `packages/contracts` starts in Phase 1 deliberately — but split resource vs. **view**
  contracts (§5): fixtures conform to view shapes so the frontend never freezes the backend's
  joins into the contract.
- Contract and schema changes are additive-only within a release (expand/contract); this is
  what keeps the independent web/api pipelines and rolling deploys safe.
