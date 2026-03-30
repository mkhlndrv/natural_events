import { test, expect } from '@playwright/test';

// This test is intentionally written to FAIL.
// It checks for an element that does not exist on the dashboard.
// Purpose: demonstrate that CI catches E2E failures.
test('dashboard shows a search bar', async ({ page }) => {
  await page.goto('/');

  // The dashboard does NOT have a search input — this will fail
  await expect(page.getByPlaceholder('Search events...')).toBeVisible({
    timeout: 5000,
  });
});
