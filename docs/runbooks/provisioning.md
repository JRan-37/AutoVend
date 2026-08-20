# Provisioning — access & keys for the pipelines

What Jon must set up, one time, for the GitHub Actions → AWS pipelines to work.
Written 2026-08-19 against the actual state of the dev machine (checked: AWS CLI v2 ✓,
Docker ✓, gh CLI ✓ as JRan-37, fnm/Node 22 ✓; Terraform and pnpm get installed by the build
tooling — no action needed).

**Timing:** Phase 0 and most of Phase 1 need none of the AWS items — CI runs on GitHub's
runners. Item 1 is needed as soon as workflow files are pushed; items 2–3 are needed at the
"Terraform bootstrap + first deploy" step. Provisioning can happen in parallel with the build.

---

## 1. GitHub — add the `workflow` scope (needed first)

The current gh token (scopes: `gist, read:org, repo`) **cannot push `.github/workflows/`
files** — GitHub rejects those pushes without the `workflow` scope. One command, approve in
the browser:

```bash
gh auth refresh -h github.com -s repo,workflow,read:org,gist
```

That's the only GitHub credential work, ever:

- **No AWS keys are ever stored in GitHub** — deploys authenticate via OIDC (ARCHITECTURE §8).
- No PATs to create. The `production` environment (required reviewer: you), branch protection
  on `main`, and repo variables (role ARNs, bucket names — non-secret) get configured through
  `gh` using your repo-owner rights once the workflows exist.

## 2. AWS — account + a local admin profile (needed at first deploy)

This settles open question 2. Pick a path:

### Path A — fresh dedicated account (recommended)

1. Create the account at aws.amazon.com — an email alias works (e.g. `jran2400+autovend@…`).
   Turn on **MFA for the root user immediately**; never use root again after step 2.
2. In the console: IAM → Users → create `autovend-admin` → attach `AdministratorAccess` →
   create an **access key** (use case: CLI).
3. On this machine, run:

   ```bash
   aws configure --profile autovend
   ```

   and enter the key ID / secret at the prompt (region `us-east-1`, output `json`).
   **Enter keys only in that prompt — never paste them into chat**; Claude drives the CLI via
   the profile name and never needs to see the values.

4. Report back: the **12-digit account ID** and that profile `autovend` is ready.

### Path B — reuse the existing account

The machine already has an SSO profile (`default`, token currently expired) and an
Amplify-era profile. If reusing that account:

1. `aws sso login` (or configure/refresh whichever profile has AdministratorAccess).
2. Report back the profile name + account ID.

Trade-off: shared billing/blast radius with existing workloads, and no fresh-account RDS
free tier (worth ~$15/mo in year one). Fresh is recommended.

### What the profile is actually for

One-time `infra/bootstrap` Terraform apply — it creates the state bucket, the GitHub **OIDC
provider**, and the four scoped CI roles (ARCHITECTURE §8). After that, all routine deploys
run keylessly from GitHub Actions; the local profile is only for rare state-level maintenance.
Optional hardening: deactivate the access key in IAM between uses.

## 3. Domain (optional now — unblocks DNS, SES, Cognito domains)

Settles open questions 1 and 3. If AutoVend gets a real domain (`autovend.systems` or
otherwise): register it in Route 53 in the AutoVend account (simplest), or keep an existing
registrar and delegate NS to a Route 53 hosted zone. Until then the site ships on the
default CloudFront domain, and everything else proceeds.

Follows from the domain, later (heads-up only, no action now):

- **SES production access request** (human-reviewed by AWS, takes ~a day) — filed at the end
  of Phase 1; the request text will be drafted for you, you submit it in the console.
- Mailbox provider for `placement@ / ads@ / hello@` (SES only sends) — or one shared inbox.

## Checklist

- [x] `gh auth refresh` — token now carries `workflow` scope _(verified 2026-08-19)_
- [x] AWS account decided — dedicated account provisioned _(ID kept out of this public repo;
      lives in GitHub repo variables + gitignored tfvars)_
- [x] `autovend` admin profile configured locally _(verified via `sts get-caller-identity`)_
- [x] Domain — **autovendsystems.com** in Route 53; mailboxes via **Google Workspace**
      (zone keeps Google MX/DKIM; Terraform uses the zone as a data source only)
- [ ] Install the **Renovate GitHub App** on JRan-37/AutoVend (one click, free for public
      repos) — keeps action SHAs, lockfile, and image digests fresh
- [ ] (Later, Phase 1 end) SES production access request submitted
- [ ] (Open question 5) `git filter-repo` decision on the 33 MB of renders in history

**Unrelated to pipelines, but recommended:** the zone has no SPF record — Google Workspace
outbound mail will soft-fail SPF at some receivers. Adding a TXT at the apex fixes it:
`"v=spf1 include:_spf.google.com ~all"` (add it in Route 53; SES's later MAIL FROM subdomain
uses its own SPF and won't conflict).
