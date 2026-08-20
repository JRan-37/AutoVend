import { expect, test } from "@playwright/test";

test("placement form validates required fields before submitting", async ({ page }) => {
  await page.goto("/contact?form=placement");
  await page.getByRole("button", { name: /request smart placement/i }).click();
  await expect(page.getByText("Required").first()).toBeVisible();
});

test("placement form submits and shows a receipt", async ({ page }) => {
  await page.goto("/contact?form=placement");
  await page.getByLabel(/organization/i).fill("Hudson Yards Management");
  await page.getByLabel(/your name/i).fill("Dana Ortiz");
  await page.getByLabel(/^email/i).fill("dana@example.com");
  await page.getByLabel(/venue type/i).selectOption("office_corporate");
  await page.getByRole("button", { name: /request smart placement/i }).click();
  await expect(page.getByText(/placement request received/i)).toBeVisible();
  await expect(page.getByText(/● SUBMITTED · REF L-/)).toBeVisible();
});

test("survey requires a category and then submits", async ({ page }) => {
  await page.goto("/survey");
  await page.getByLabel(/where do you usually/i).fill("Hudson Yards office tower, NYC");
  await page.getByRole("button", { name: /submit survey/i }).click();
  await expect(page.getByText(/pick at least one/i)).toBeVisible();

  await page.getByRole("button", { name: /energy drinks/i }).click();
  await page.getByRole("button", { name: /submit survey/i }).click();
  await expect(page.getByText(/thanks for telling us/i)).toBeVisible();
});

test("demo gate unlocks the dashboard after lead capture", async ({ page }) => {
  await page.goto("/dashboard-demo");
  await page.getByLabel(/^name/i).fill("Jon R");
  await page.getByLabel(/work email/i).fill("jon@example.com");
  await page.getByLabel(/organization/i).fill("AutoVend");
  await page.getByRole("button", { name: /unlock demo/i }).click();
  await expect(page.getByText(/dashboard preview/i).first()).toBeVisible();
  await expect(page.getByText(/FLEET OVERVIEW/i)).toBeVisible({ timeout: 10_000 });
  await page.getByRole("button", { name: "Machines" }).click();
  await expect(page.getByText(/12 machines/i)).toBeVisible({ timeout: 10_000 });
});
