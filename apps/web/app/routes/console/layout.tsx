import { Outlet } from "react-router";

/* Real operator console shell — always client-rendered, never prerendered,
 * never indexed. Cognito sign-in lands here in Phase 3. */

export function meta() {
  return [{ title: "Operator console — AutoVend" }, { name: "robots", content: "noindex" }];
}

export default function ConsoleLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg-sunken)",
        padding: 24,
      }}
    >
      <Outlet />
    </div>
  );
}
