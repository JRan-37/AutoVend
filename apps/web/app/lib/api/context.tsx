import { createContext, useContext, useMemo } from "react";
import type { ConsoleReadApi } from "@autovend/contracts";
import { createStubSubmissionApi, type SubmissionApi } from "./stub";
import { demoConsoleSource } from "../../features/demo/demoData";
import {
  DEFAULT_FIXTURE_OPTIONS,
  parseFixtureOptions,
  withFixtures,
  type FixtureOptions,
} from "./fixtures";

interface Api {
  submissions: SubmissionApi;
  /** Console reads for the public demo — frozen dataset behind the fixtures
   * wrapper. In dev, `?fixtures=delay:1200,fail:0.5,empty` exercises the
   * loading/error/empty branches. */
  demoConsole(options?: Partial<FixtureOptions>): ConsoleReadApi;
}

const ApiCtx = createContext<Api | null>(null);

export function useApi(): Api {
  const ctx = useContext(ApiCtx);
  if (!ctx) throw new Error("useApi must be used within ApiProvider");
  return ctx;
}

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<Api>(() => {
    return {
      submissions: createStubSubmissionApi(),
      demoConsole(options) {
        const fromUrl =
          import.meta.env.DEV && typeof window !== "undefined"
            ? parseFixtureOptions(window.location.search)
            : DEFAULT_FIXTURE_OPTIONS;
        return withFixtures(demoConsoleSource, { ...fromUrl, ...options });
      },
    };
  }, []);

  return <ApiCtx.Provider value={value}>{children}</ApiCtx.Provider>;
}
