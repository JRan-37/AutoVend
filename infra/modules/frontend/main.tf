# Static frontend: private S3 bucket behind CloudFront with OAC, a viewer-
# request function that maps clean URLs to prerendered HTML and everything
# else to RR7's __spa-fallback.html (never distribution-level
# custom_error_response — that would rewrite future /api/* errors,
# ARCHITECTURE §7), a security response-headers policy, and an ACM cert
# validated in the existing Route 53 zone.

terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 6.0" }
  }
}

variable "domain" {
  type        = string
  description = "Apex domain (e.g. autovendsystems.com)"
}

variable "zone_id" {
  type        = string
  description = "Route 53 hosted zone id for the domain (pre-existing, data-sourced)"
}

variable "prerendered_paths" {
  type        = list(string)
  description = "Extensionless paths that have prerendered index.html files (mirror of apps/web/react-router.config.ts)"
}

locals {
  aliases = [var.domain, "www.${var.domain}"]
}

# ── Site bucket (private; CloudFront-only via OAC) ───────────────────
resource "aws_s3_bucket" "web" {
  bucket_prefix = "autovend-prod-web-"
}

resource "aws_s3_bucket_versioning" "web" {
  bucket = aws_s3_bucket.web.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_public_access_block" "web" {
  bucket                  = aws_s3_bucket.web.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_iam_policy_document" "web_bucket" {
  statement {
    sid       = "CloudFrontRead"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.web.arn}/*"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.web.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "web" {
  bucket = aws_s3_bucket.web.id
  policy = data.aws_iam_policy_document.web_bucket.json
}

resource "aws_cloudfront_origin_access_control" "web" {
  name                              = "autovend-prod-web"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ── Viewer-request function: clean URLs → prerendered HTML → fallback ─
resource "aws_cloudfront_function" "router" {
  name    = "autovend-prod-web-router"
  runtime = "cloudfront-js-2.0"
  publish = true
  comment = "Prerendered-path routing + SPA fallback (no custom_error_response)"
  code    = <<-EOT
    var PRERENDERED = ${jsonencode(var.prerendered_paths)};
    function handler(event) {
      var request = event.request;
      var uri = request.uri;
      if (uri.length > 1 && uri.endsWith("/")) {
        uri = uri.slice(0, -1);
      }
      if (uri === "/" || uri === "") {
        request.uri = "/index.html";
        return request;
      }
      if (PRERENDERED.includes(uri)) {
        request.uri = uri + "/index.html";
        return request;
      }
      var lastSegment = uri.split("/").pop();
      if (lastSegment.includes(".")) {
        request.uri = uri; // static asset — serve as-is
        return request;
      }
      request.uri = "/__spa-fallback.html"; // /console/*, 404s, deep links
      return request;
    }
  EOT
}

# ── Security headers (ARCHITECTURE §10.4) ────────────────────────────
resource "aws_cloudfront_response_headers_policy" "web" {
  name = "autovend-prod-web-security"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
    content_type_options { override = true }
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
    content_security_policy {
      content_security_policy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
      override                = true
    }
  }

  custom_headers_config {
    items {
      header   = "Permissions-Policy"
      value    = "camera=(), microphone=(), geolocation=()"
      override = true
    }
  }
}

# ── Certificate (us-east-1) validated in the existing zone ───────────
resource "aws_acm_certificate" "web" {
  domain_name               = var.domain
  subject_alternative_names = ["www.${var.domain}"]
  validation_method         = "DNS"
  lifecycle { create_before_destroy = true }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.web.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  zone_id         = var.zone_id
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  ttl             = 300
  allow_overwrite = false
}

resource "aws_acm_certificate_validation" "web" {
  certificate_arn         = aws_acm_certificate.web.arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}

# ── Distribution ─────────────────────────────────────────────────────
resource "aws_cloudfront_distribution" "web" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "autovend prod web"
  price_class         = "PriceClass_100"
  aliases             = local.aliases
  default_root_object = "index.html"

  origin {
    origin_id                = "s3-web"
    domain_name              = aws_s3_bucket.web.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.web.id
  }

  default_cache_behavior {
    target_origin_id           = "s3-web"
    viewer_protocol_policy     = "redirect-to-https"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    compress                   = true
    cache_policy_id            = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed-CachingOptimized (honors origin Cache-Control)
    response_headers_policy_id = aws_cloudfront_response_headers_policy.web.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.router.arn
    }
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.web.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

output "bucket_name" {
  value = aws_s3_bucket.web.bucket
}

output "distribution_id" {
  value = aws_cloudfront_distribution.web.id
}

output "distribution_domain" {
  value = aws_cloudfront_distribution.web.domain_name
}

output "distribution_hosted_zone_id" {
  value = aws_cloudfront_distribution.web.hosted_zone_id
}
