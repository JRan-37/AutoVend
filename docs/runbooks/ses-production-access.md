# SES production access — request to submit

New AWS accounts start in the SES **sandbox** (200 msgs/day, verified
recipients only). Phase 2's lead-notification emails need production access,
and AWS reviews these requests by hand (typically < 1 day) — so it gets filed
now, at the end of Phase 1 (ROADMAP).

## Prerequisite (Terraform, already applied)

The domain identity + DKIM + custom MAIL FROM for `autovendsystems.com` are
managed in `infra/modules/ses`. Verification usually completes within minutes
of the DNS records landing; confirm in the console that the identity shows
**Verified** before submitting.

## How to submit (Jon, ~3 minutes)

AWS Console → **Amazon SES** (us-east-1) → **Get set up** / **Account
dashboard** → **Request production access**:

- **Mail type:** Transactional
- **Website URL:** `https://autovendsystems.com`
- **Use case description** (paste):

> AutoVend Systems operates smart vending machines. Our website
> (autovendsystems.com) has contact forms (placement requests, advertising
> inquiries, venue suggestions, product surveys). SES sends only
> **transactional, internal notification emails**: when a form is submitted,
> one short notification goes to our own staff mailboxes on this same domain
> (placement@/ads@/hello@autovendsystems.com, hosted on Google Workspace).
> No marketing mail, no mail to form submitters, no third-party recipients.
> Expected volume: well under 100 emails/day. Bounces/complaints are
> near-impossible by design (we send only to our own verified-domain
> mailboxes), and we monitor delivery via CloudWatch. Sending is DKIM-signed
> with a custom MAIL FROM subdomain (mail.autovendsystems.com).

- **Additional contacts:** leave default
- **Acknowledge** the AUP boxes and submit.

## After approval

Nothing to change in code — Phase 2's notifications module uses the same
identity. Note the approval in this file with the date.

- [ ] Identity shows Verified in SES console
- [ ] Production access requested
- [ ] Production access granted (date: ______)
