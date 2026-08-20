# Infra

Terraform for the AutoVend AWS footprint (ARCHITECTURE §7–§8). This repo is
public: no account ids, ARNs, or generated bucket names are ever committed —
they live in GitHub repo **variables** and a local gitignored `backend.hcl`.

## Layout

| Path | What | Applied by |
|---|---|---|
| `bootstrap/` | tfstate bucket, GitHub OIDC provider, the 3 CI roles | **by hand**, local state (gitignored) |
| `envs/prod/` | frontend (S3+CloudFront+cert), DNS aliases, SES identity | **CI** — plan on PR, apply on main behind the `production` environment approval |
| `modules/` | frontend, ses | — |

## One-time bootstrap (already done 2026-08-20)

```sh
cd infra/bootstrap
AWS_PROFILE=autovend terraform init
AWS_PROFILE=autovend terraform apply
```

Outputs feed GitHub repo variables (`gh variable set …`): `TF_STATE_BUCKET`,
`AWS_WEB_DEPLOY_ROLE_ARN`, `AWS_INFRA_PLAN_ROLE_ARN`, `AWS_INFRA_APPLY_ROLE_ARN`.
After the first prod apply, add `WEB_BUCKET` and `CF_DISTRIBUTION_ID` from the
prod outputs.

## Local plan/apply against prod (rare; CI is the normal path)

Create `infra/envs/prod/backend.hcl` (gitignored):

```hcl
bucket       = "<TF_STATE_BUCKET>"
key          = "prod/terraform.tfstate"
region       = "us-east-1"
use_lockfile = true
```

```sh
cd infra/envs/prod
AWS_PROFILE=autovend terraform init -backend-config=backend.hcl
AWS_PROFILE=autovend terraform plan
```

## Hard rules

- The `autovendsystems.com` zone is a **data source**. Google Workspace's
  MX / site-verification TXT / `google._domainkey` records are never managed,
  imported, or overwritten. AutoVend adds only: CloudFront aliases, ACM
  validation CNAMEs, SES DKIM CNAMEs, and `mail.` MAIL-FROM records.
- No distribution-level `custom_error_response` — SPA fallback is the
  CloudFront function's job, or future `/api/*` errors get rewritten to HTML.
- `prerendered_paths` in `envs/prod/main.tf` mirrors
  `apps/web/react-router.config.ts` — update both together.
