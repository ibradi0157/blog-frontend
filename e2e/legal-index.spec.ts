/**
 * Tests E2E — index légal et sandbox
 * Sans backend : /test/legal
 * Avec backend (optionnel) : /legal
 */

import { expect, test } from '@playwright/test';

test.describe('Pages légales (sandbox /test/legal)', () => {
  test('affiche la liste mockée des pages légales', async ({ page }) => {
    await page.goto('/test/legal');
    await expect(page.getByRole('heading', { name: /Informations légales \(test\)/i })).toBeVisible();
    await expect(page.getByText('Mode test')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Politique de confidentialité' })).toBeVisible();
    await expect(page.getByRole('link', { name: "Conditions d'utilisation" })).toBeVisible();
  });
});

test.describe('Index légal public /legal', () => {
  test('affiche le titre ou un état vide sans erreur 404', async ({ page }) => {
    const res = await page.goto('/legal');
    expect(res?.status()).not.toBe(404);
    await expect(
      page.getByRole('heading', { name: /Informations légales/i })
    ).toBeVisible({ timeout: 10_000 });
  });
});
