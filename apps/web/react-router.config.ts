import type { Config } from "@react-router/dev/config";

// SPA mode with prerendered public routes (ARCHITECTURE §3): marketing pages
// ship as real HTML on S3; /console/* stays client-only and is never listed.
export default {
  ssr: false,
  prerender: [
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
  ],
} satisfies Config;
