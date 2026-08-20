/* Static preview that mirrors production fallback behavior: unknown paths get
 * RR7's __spa-fallback.html (NOT the prerendered home page) — the same rule
 * the CloudFront function implements. sirv's CLI only exposes a boolean
 * `--single`, so this uses the library API. */
import { createServer } from "node:http";
import sirv from "sirv";

const port = Number(process.env.PORT ?? 4173);
const serve = sirv("build/client", { single: "__spa-fallback.html", dev: false, etag: true });

createServer(serve).listen(port, () => {
  console.log(`preview ready on http://localhost:${port}`);
});
