import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useRouteError,
} from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";

import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./styles/tokens.css";
import "./styles/global.css";

import { ApiProvider } from "./lib/api/context";
import { queryClient } from "./lib/query";
import { ToastProvider } from "./lib/toast";

export function meta() {
  return [
    { title: "AutoVend Systems" },
    {
      name: "description",
      content:
        "Predictive automated retail — smart vending hardware, fleet telemetry, and an HD ad surface, operated as one platform.",
    },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-density="regular">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  const navigate = useNavigate();

  // Legacy hash links: the prototype was hash-routed (#/features). Forward
  // them once to clean URLs so old shared links keep working.
  useEffect(() => {
    const { hash } = window.location;
    if (hash.startsWith("#/")) {
      navigate(hash.slice(1), { replace: true });
    }
  }, [navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider>
        <ToastProvider>
          <Outlet />
        </ToastProvider>
      </ApiProvider>
    </QueryClientProvider>
  );
}

export function HydrateFallback() {
  return null;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;
  return (
    <main className="section">
      <div className="container" style={{ textAlign: "center", padding: "80px 0" }}>
        <div className="meta" style={{ color: "var(--accent)", marginBottom: 16 }}>
          {status} · SOMETHING BROKE
        </div>
        <h1 className="h1">That didn&apos;t work.</h1>
        <p className="lead" style={{ margin: "16px auto 32px" }}>
          The error is on our side. Reload the page, or head back to the homepage.
        </p>
        <Link to="/" className="btn btn-primary btn-arrow">
          Back to home
        </Link>
      </div>
    </main>
  );
}
