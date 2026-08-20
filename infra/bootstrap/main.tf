# Bootstrap root — applied BY HAND with the local admin profile, once.
# Creates the chicken-and-egg pieces CI needs before CI can exist: the
# Terraform state bucket, the GitHub OIDC provider, and the CI roles
# (ARCHITECTURE §8). State for THIS root stays local (gitignored).
#
#   AWS_PROFILE=autovend terraform init && terraform apply
#
# Everything else lives in infra/envs/prod and is applied through CI.

terraform {
  required_version = ">= 1.9"
  required_providers {
    aws    = { source = "hashicorp/aws", version = "~> 6.0" }
    random = { source = "hashicorp/random", version = "~> 3.6" }
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = { project = "autovend", managed-by = "terraform", root = "bootstrap" }
  }
}

locals {
  repo = "JRan-37/AutoVend"
}

data "aws_caller_identity" "current" {}

# ── Terraform state bucket ───────────────────────────────────────────
resource "random_id" "state_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "tfstate" {
  bucket = "autovend-tfstate-${random_id.state_suffix.hex}"
  lifecycle { prevent_destroy = true }
}

resource "aws_s3_bucket_versioning" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_public_access_block" "tfstate" {
  bucket                  = aws_s3_bucket.tfstate.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ── GitHub OIDC provider ─────────────────────────────────────────────
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

# Explicit sub-claim scoping per role — a wildcard sub would let any PR
# assume the prod deploy roles and make the approval gate decorative.
locals {
  oidc_condition_base = {
    "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
  }
}

data "aws_iam_policy_document" "assume_web_deploy" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${local.repo}:ref:refs/heads/main"]
    }
  }
}

data "aws_iam_policy_document" "assume_infra_plan" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${local.repo}:pull_request"]
    }
  }
}

data "aws_iam_policy_document" "assume_infra_apply" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${local.repo}:environment:production"]
    }
  }
}

# ── web-deploy: that bucket + that distribution's invalidations ──────
resource "aws_iam_role" "web_deploy" {
  name               = "gha-autovend-web-deploy"
  assume_role_policy = data.aws_iam_policy_document.assume_web_deploy.json
}

data "aws_iam_policy_document" "web_deploy" {
  statement {
    sid       = "SiteBucketList"
    actions   = ["s3:ListBucket"]
    resources = ["arn:aws:s3:::autovend-prod-web*"]
  }
  statement {
    sid       = "SiteBucketObjects"
    actions   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
    resources = ["arn:aws:s3:::autovend-prod-web*/*"]
  }
  statement {
    sid       = "Invalidate"
    actions   = ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"]
    resources = ["arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/*"]
  }
}

resource "aws_iam_role_policy" "web_deploy" {
  name   = "web-deploy"
  role   = aws_iam_role.web_deploy.id
  policy = data.aws_iam_policy_document.web_deploy.json
}

# ── infra-plan: read-only + state read (plan runs with -lock=false) ──
resource "aws_iam_role" "infra_plan" {
  name               = "gha-autovend-infra-plan"
  assume_role_policy = data.aws_iam_policy_document.assume_infra_plan.json
}

resource "aws_iam_role_policy_attachment" "infra_plan_readonly" {
  role       = aws_iam_role.infra_plan.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

data "aws_iam_policy_document" "infra_plan_state" {
  statement {
    actions   = ["s3:GetObject", "s3:ListBucket"]
    resources = [aws_s3_bucket.tfstate.arn, "${aws_s3_bucket.tfstate.arn}/*"]
  }
}

resource "aws_iam_role_policy" "infra_plan_state" {
  name   = "tfstate-read"
  role   = aws_iam_role.infra_plan.id
  policy = data.aws_iam_policy_document.infra_plan_state.json
}

# ── infra-apply: broad, only obtainable behind the GitHub environment
#    approval (solo-dev residual risk documented in ARCHITECTURE §8) ──
resource "aws_iam_role" "infra_apply" {
  name               = "gha-autovend-infra-apply"
  assume_role_policy = data.aws_iam_policy_document.assume_infra_apply.json
}

resource "aws_iam_role_policy_attachment" "infra_apply_admin" {
  role       = aws_iam_role.infra_apply.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

# ── Outputs (fed into GitHub repo variables — never committed) ───────
output "tfstate_bucket" {
  value = aws_s3_bucket.tfstate.bucket
}

output "web_deploy_role_arn" {
  value = aws_iam_role.web_deploy.arn
}

output "infra_plan_role_arn" {
  value = aws_iam_role.infra_plan.arn
}

output "infra_apply_role_arn" {
  value = aws_iam_role.infra_apply.arn
}
