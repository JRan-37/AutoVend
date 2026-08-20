# CLAUDE.md — AutoVend

Guidance for Claude Code in this repository. This repo has its own conventions — the
AI-Workspace rules (CommonJS, no TypeScript) do **not** apply here.

## What this is

Platform for AutoVend Systems (smart vending machines): public marketing/lead-gen site +
internal operator CRM. Design is approved and binding: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
(modular monolith, AWS, CI/CD), [docs/PRD.md](docs/PRD.md), [docs/ROADMAP.md](docs/ROADMAP.md)
(phases; each ends deployed). The fleet is **simulator-first** — no machine hardware specs
exist; all machine data comes from `tools/simulator` (`Machine.source: simulated|hardware`).

## Commands

Node ≥ 22 via `fnm` (in bash: `eval "$(fnm env --shell bash)"`), pnpm via corepack
(pinned in `packageManager`).

```sh
pnpm install
pnpm lint          # eslint incl. boundary + no-danger rules
pnpm typecheck     # tsc --noEmit in every package
pnpm test          # vitest (packages define their own)
pnpm build         # contracts builds to dist/; apps are stubs until their phase
```

## Hard rules

- **Public repo.** Never commit secrets, AWS account IDs, role ARNs, or customer/lead data.
  Deploys use GitHub OIDC — there are no AWS keys anywhere, including CI.
- **`prototype/` is frozen.** It is the design reference for the Phase 1 rebuild — read it,
  never edit it. It's excluded from lint/typecheck/format on purpose.
- **Module boundaries (apps/api):** modules expose one `index.ts` facade; cross-module
  imports of internals are lint errors. `console` is the only module allowed to depend on
  every facade. One Postgres schema per module; cross-schema joins only via published
  read-only views, only from `console`. Details: ARCHITECTURE §4.
- **Migrations are expand/contract and forward-only** — must keep version N−1 of the code
  working (rolling deploys). No `DROP` without the `destructive-migration` PR label.
- **Enums are code values** (`packages/contracts/src/enums.ts`) with `*_LABELS` maps for
  display. Display strings never reach the database or the API.
- **Money:** integer minor units (cents). **Time:** `timestamptz`; rollups use venue-local
  dates. **PII:** lead/survey text renders as text only (`react/no-danger` is an error);
  request bodies are never logged.
- **Infra:** Terraform only; the Route 53 zone (autovendsystems.com) is a **data source** —
  Google Workspace MX/DKIM/TXT records must never be managed, imported, or overwritten.

## Workflow

- Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `ci:`, `test:`).
- Branch from `main`, PR back into `main`; CI (`ci.yml`) must be green. No force-pushes.
- Tests first where behavior is involved (house TDD rules apply); colocated `*.test.ts`.
- New closed value set? Add codes + labels to contracts enums — the test suite fails any
  `*_LABELS` map that drifts from its values array.
