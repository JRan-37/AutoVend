import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import boundaries from "eslint-plugin-boundaries";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "prototype/**", // frozen design reference — never linted
      "**/dist/**",
      "**/build/**",
      "**/.react-router/**",
      "**/test-results/**",
      "**/playwright-report/**",
      "**/node_modules/**",
      "coverage/**",
      "index.html",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Node utility scripts (preview server, future tooling)
  {
    files: ["**/scripts/**/*.mjs"],
    languageOptions: {
      globals: { process: "readonly", console: "readonly" },
    },
  },

  // Lead/survey text is attacker-controlled input rendered in the privileged
  // console (ARCHITECTURE §10.2) — raw-HTML rendering is banned repo-wide.
  {
    files: ["**/*.tsx", "**/*.jsx"],
    plugins: { react },
    rules: {
      "react/no-danger": "error",
      "react/no-danger-with-children": "error",
    },
  },

  // Modular-monolith boundaries (ARCHITECTURE §4): modules import only each
  // other's facades and the shared kernel. Inert until apps/api/src exists;
  // the facade-only + console-fan-out refinements land with the api scaffold.
  {
    files: ["apps/api/src/**/*.ts"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "module", pattern: "apps/api/src/modules/*", capture: ["module"] },
        { type: "shared", pattern: "apps/api/src/shared/**", partialMatch: false },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: ["module"], allow: ["shared", "module"] },
            { from: ["shared"], allow: ["shared"] },
          ],
        },
      ],
    },
  },

  prettier,
);
