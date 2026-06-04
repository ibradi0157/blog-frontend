/**
 * Sandbox formulaire création membre (UI seule, sans POST réel si non connecté).
 * URL : /test/admin/utilisateurs/nouveau
 */

import { expect, test } from '@playwright/test';

const TEST_PAGE = '/test/admin/utilisateurs/nouveau';

test.describe('Création membre admin (sandbox)', () => {
  test('affiche le formulaire et les règles mot de passe', async ({ page }) => {
    await page.goto(TEST_PAGE);
    await expect(page.getByRole('heading', { name: /Créer un membre/i })).toBeVisible();
    await expect(page.getByText('Mode test')).toBeVisible();
    await expect(page.getByText('Email', { exact: true })).toBeVisible();
    await expect(page.getByText('Un caractère spécial')).toBeVisible();
  });

  test('valide la correspondance des mots de passe', async ({ page }) => {
    await page.goto(TEST_PAGE);
    await page.locator('input[type="email"]').fill('membre@test.local');
    await page.locator('input[type="text"]').fill('Membre Test');
    await page.locator('input[type="password"]').first().fill('Secret1!');
    await page.locator('input[type="password"]').nth(1).fill('Autre1!');
    await page.getByRole('button', { name: /Créer le membre/i }).click();
    await expect(page.getByText(/ne correspondent pas/i)).toBeVisible();
  });
});
