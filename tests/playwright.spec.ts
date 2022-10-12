import { test, expect } from '@playwright/test';

test.skip('basic test', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('div div')).toContainText('Hello World');
})