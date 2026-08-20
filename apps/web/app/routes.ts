import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  layout("routes/marketing/layout.tsx", [
    index("routes/marketing/home.tsx"),
    route("solutions/location-partner", "routes/marketing/location-partner.tsx"),
    route("solutions/advertising-partner", "routes/marketing/advertising-partner.tsx"),
    route("features", "routes/marketing/features.tsx"),
    route("reach", "routes/marketing/reach.tsx"),
    route("operating-area", "routes/marketing/operating-area.tsx"),
    route("resources", "routes/marketing/resources.tsx"),
    route("dashboard-demo", "routes/marketing/dashboard-demo.tsx"),
    route("survey", "routes/marketing/survey.tsx"),
    route("contact", "routes/marketing/contact.tsx"),
    route("*", "routes/marketing/not-found.tsx"),
  ]),
  route("console", "routes/console/layout.tsx", [index("routes/console/home.tsx")]),
] satisfies RouteConfig;
