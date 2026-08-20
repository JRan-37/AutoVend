# AutoVend

Platform for AutoVend Systems — smart vending machines with cashless payments, telemetry,
and a 32″ ad display. Two surfaces: a public marketing/lead-gen site and an internal
operator CRM (“the console”) for running the fleet.

**Status:** Phase 0 — monorepo scaffold. The fleet is simulator-first (no hardware specs
yet); see the design docs.

## Layout

| Path                 | What                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `apps/web`           | React Router v7 app — marketing (prerendered) + console (SPA). Phase 1.                           |
| `apps/api`           | NestJS modular monolith — the CRM. Phase 2+.                                                      |
| `packages/contracts` | zod/ts-rest contracts + enum codes shared FE/BE.                                                  |
| `infra/`             | Terraform (S3+CloudFront, App Runner, RDS, OIDC roles). Phase 1+.                                 |
| `prototype/`         | The original static prototype — **frozen as the design reference.**                               |
| `docs/`              | [PRD](docs/PRD.md) · [Architecture](docs/ARCHITECTURE.md) · [Roadmap](docs/ROADMAP.md) · runbooks |

## Development

Node ≥ 22 (via `fnm`), pnpm (via corepack).

```sh
pnpm install
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

The prototype needs no build — serve `prototype/` with any static server. The root
`index.html` only redirects the legacy GitHub Pages URL into `prototype/` until the
production site replaces Pages.

## Conventions

- Conventional commits (`feat:`, `fix:`, `docs:`, …); PRs into `main`; CI must be green.
- This repo is **public**: no secrets, no AWS account IDs, no customer data in any file.
  Deploys authenticate via GitHub OIDC — there are no AWS keys to leak.
- Module boundary rules and migration discipline: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) §4.
