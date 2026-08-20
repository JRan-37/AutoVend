import { expect, test } from "@playwright/test";

const PUBLIC_ROUTES: Array<[path: string, h1: RegExp]> = [
  ["/", /vending,\s*operated like\s*infrastructure/i],
  ["/solutions/location-partner", /modern amenity/i],
  ["/solutions/advertising-partner", /moment of purchase/i],
  ["/features", /predictive retail stack/i],
  ["/reach", /coast to coast/i],
  ["/operating-area", /service regions/i],
  ["/resources", /whitepapers/i],
  ["/survey", /what you'd actually buy/i],
  ["/contact", /pick the path/i],
  ["/dashboard-demo", /unlock the dashboard preview/i],
];

for (const [path, h1] of PUBLIC_ROUTES) {
  test(`renders ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toContainText(h1);
  });
}

test("unknown routes render the 404 page", async ({ page }) => {
  await page.goto("/definitely-not-a-page");
  await expect(page.locator("h1")).toContainText(/doesn't exist/i);
});

test("console shell is a sign-in wall, not the demo", async ({ page }) => {
  await page.goto("/console");
  await expect(page.locator("h1")).toContainText(/sign-in isn't open yet/i);
});

test("legacy hash links redirect to clean URLs", async ({ page }) => {
  await page.goto("/#/features");
  await expect(page).toHaveURL(/\/features$/);
  await expect(page.locator("h1")).toContainText(/predictive retail stack/i);
});

test("prerendered marketing HTML contains real content before hydration", async ({ request }) => {
  const res = await request.get("/features");
  expect(res.ok()).toBeTruthy();
  const html = await res.text();
  expect(html).toContain("Predictive restock");
});
