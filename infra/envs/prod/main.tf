# Production environment. State lives in the bootstrap-created S3 bucket;
# the backend is configured via -backend-config (CI: repo variables; local:
# a gitignored backend.hcl) so no account-linked names are committed —
# this repo is public.
#
# The Route 53 zone is a DATA SOURCE only: it pre-exists and carries the
# Google Workspace MX/DKIM/TXT records, which Terraform must never manage
# (ARCHITECTURE §13 Q1/Q3). This root adds only AutoVend-owned records.

terraform {
  required_version = ">= 1.9"
  backend "s3" {}
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 6.0" }
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = { project = "autovend", managed-by = "terraform", env = "prod" }
  }
}

variable "domain" {
  type    = string
  default = "autovendsystems.com"
}

# Mirror of apps/web/react-router.config.ts `prerender` — update both together.
variable "prerendered_paths" {
  type = list(string)
  default = [
    "/",
    "/solutions/location-partner",
    "/solutions/advertising-partner",
    "/features",
    "/reach",
    "/operating-area",
    "/resources",
    "/dashboard-demo",
    "/survey",
    "/contact",
  ]
}

data "aws_route53_zone" "main" {
  name         = "${var.domain}."
  private_zone = false
}

module "frontend" {
  source            = "../../modules/frontend"
  domain            = var.domain
  zone_id           = data.aws_route53_zone.main.zone_id
  prerendered_paths = var.prerendered_paths
}

module "ses" {
  source  = "../../modules/ses"
  domain  = var.domain
  zone_id = data.aws_route53_zone.main.zone_id
}

# ── Site aliases (AutoVend-owned records in the existing zone) ───────
resource "aws_route53_record" "apex_a" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain
  type    = "A"
  alias {
    name                   = module.frontend.distribution_domain
    zone_id                = module.frontend.distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "apex_aaaa" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain
  type    = "AAAA"
  alias {
    name                   = module.frontend.distribution_domain
    zone_id                = module.frontend.distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_a" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "www.${var.domain}"
  type    = "A"
  alias {
    name                   = module.frontend.distribution_domain
    zone_id                = module.frontend.distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_aaaa" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "www.${var.domain}"
  type    = "AAAA"
  alias {
    name                   = module.frontend.distribution_domain
    zone_id                = module.frontend.distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

output "web_bucket" {
  value = module.frontend.bucket_name
}

output "cf_distribution_id" {
  value = module.frontend.distribution_id
}

output "cf_domain" {
  value = module.frontend.distribution_domain
}

output "site_url" {
  value = "https://${var.domain}"
}
