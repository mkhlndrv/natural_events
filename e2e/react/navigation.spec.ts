import { test, expect } from '@playwright/test';

test.describe('React App Navigation', () => {
  test('loads the dashboard with navbar and filter panel', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByText('NaturalEvents')).toBeVisible();

    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Analytics' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Earthquakes' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Natural Events' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  });

  test('navigates to analytics page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Analytics' }).click();

    await expect(page).toHaveURL('/analytics');
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();

    await expect(
      page.getByText(/Magnitude Distribution|No events match|Loading analytics/)
    ).toBeVisible({ timeout: 15000 });
  });

  test('navigates to about page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'About' }).click();

    await expect(page).toHaveURL('/about');
    await expect(page.getByText('About NaturalEvents')).toBeVisible();
    await expect(page.getByText('USGS Earthquake API')).toBeVisible();
    await expect(page.getByText('NASA EONET v3')).toBeVisible();
    await expect(page.getByText('Tech Stack')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Course' })).toBeVisible();
  });

  test('navigates back to dashboard from about', async ({ page }) => {
    await page.goto('/about');
    await page.getByRole('link', { name: 'Dashboard' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  });
});
