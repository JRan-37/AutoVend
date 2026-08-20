# SES sending identity for the domain — send-only; receiving stays on Google
# Workspace. This module NEVER touches the apex MX/TXT records: DKIM lives on
# selector subdomains and MAIL FROM on its own subdomain (ARCHITECTURE §13 Q3).

terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 6.0" }
  }
}

variable "domain" {
  type = string
}

variable "zone_id" {
  type = string
}

resource "aws_ses_domain_identity" "main" {
  domain = var.domain
}

resource "aws_ses_domain_dkim" "main" {
  domain = aws_ses_domain_identity.main.domain
}

resource "aws_route53_record" "dkim" {
  count           = 3
  zone_id         = var.zone_id
  name            = "${aws_ses_domain_dkim.main.dkim_tokens[count.index]}._domainkey.${var.domain}"
  type            = "CNAME"
  ttl             = 600
  records         = ["${aws_ses_domain_dkim.main.dkim_tokens[count.index]}.dkim.amazonses.com"]
  allow_overwrite = false
}

resource "aws_ses_domain_mail_from" "main" {
  domain           = aws_ses_domain_identity.main.domain
  mail_from_domain = "mail.${var.domain}"
}

resource "aws_route53_record" "mail_from_mx" {
  zone_id         = var.zone_id
  name            = aws_ses_domain_mail_from.main.mail_from_domain
  type            = "MX"
  ttl             = 600
  records         = ["10 feedback-smtp.us-east-1.amazonses.com"]
  allow_overwrite = false
}

resource "aws_route53_record" "mail_from_spf" {
  zone_id         = var.zone_id
  name            = aws_ses_domain_mail_from.main.mail_from_domain
  type            = "TXT"
  ttl             = 600
  records         = ["v=spf1 include:amazonses.com ~all"]
  allow_overwrite = false
}

output "identity_arn" {
  value = aws_ses_domain_identity.main.arn
}
