/**
 * Tests E2E de la page « Nouvel article » (/dashboard/articles/nouveau)
 *
 * Utilise la sandbox /test/articles/nouveau : pas d’auth, API mockée côté client.
 * Aucun backend NestJS requis.
 *
 * Lancer :
 *   npm run test:e2e
 *   npm run test:e2e:ui   (interface Playwright)
 *
 * Tester manuellement dans le navigateur :
 *   http://localhost:3001/test/articles/nouveau
 */

import { expect, test } from '@playwright/test';

const TEST_PAGE = '/test/articles/nouveau';
const AUTOSAVE_MS = 3_500;

test.describe('Page Nouvel article (sandbox /test/articles/nouveau)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_PAGE);
    await expect(page.getByRole('heading', { name: 'Nouvel article' })).toBeVisible();
    await expect(page.locator('.ProseMirror')).toBeVisible({ timeout: 15_000 });
  });

  test('affiche la structure complète de l’éditeur', async ({ page }) => {
    await expect(page.getByText('Mode test')).toBeVisible();
    await expect(page.getByPlaceholder('Titre de l\'article…')).toBeVisible();
    await expect(page.getByText('Non sauvegardé')).toBeVisible();
    await expect(page.getByTitle('Gras (Ctrl+B)')).toBeVisible();
    await expect(page.getByTitle('Italique (Ctrl+I)')).toBeVisible();
    await expect(page.locator('.ProseMirror')).toBeVisible();
  });

  test('permet de saisir le titre et le contenu', async ({ page }) => {
    const title = page.getByPlaceholder('Titre de l\'article…');
    await title.fill('Mon article Playwright');

    const editor = page.locator('.ProseMirror');
    await editor.click();
    await editor.pressSequentially('Contenu rédigé dans TipTap.');

    await expect(title).toHaveValue('Mon article Playwright');
    await expect(editor).toContainText('Contenu rédigé dans TipTap.');
    await expect(page.getByText(/\d+ caractères/)).toBeVisible();
  });

  test('applique le gras via la barre d’outils', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.click();
    await editor.pressSequentially('Texte en gras');
    await editor.press('Control+a');
    await page.getByTitle('Gras (Ctrl+B)').click();

    await expect(editor.locator('strong')).toHaveCount(1);
  });

  test('insère un titre H1 via la toolbar', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.click();
    await editor.pressSequentially('Mon grand titre');
    await page.getByTitle('Titre 1').click();

    await expect(editor.locator('h1')).toHaveCount(1);
  });

  test('ouvre le menu slash et insère une liste', async ({ page }) => {
    const editor = page.locator('.ProseMirror');
    await editor.click();
    await editor.pressSequentially('/liste');
    await expect(page.getByRole('button', { name: 'Liste Liste à puces' })).toBeVisible();
    await page.keyboard.press('Enter');

    await expect(editor.locator('ul')).toHaveCount(1);
  });

  test('ouvre le panneau Paramètres et gère les métadonnées', async ({ page }) => {
    await page.getByTitle('Paramètres').click();
    await expect(page.getByRole('heading', { name: 'Paramètres' })).toBeVisible();

    const excerpt = page.getByPlaceholder('Courte description de l\'article…');
    await excerpt.fill('Résumé SEO de test.');

    await page.locator('select').selectOption('cat-tech');
    await page.getByPlaceholder('Ajouter un tag…').fill('playwright');
    await page.getByPlaceholder('Ajouter un tag…').press('Enter');

    await expect(excerpt).toHaveValue('Résumé SEO de test.');
    await expect(page.locator('select')).toHaveValue('cat-tech');
    await expect(page.getByText('#playwright')).toBeVisible();
  });

  test('autosauvegarde via API mockée après saisie', async ({ page }) => {
    await page.getByPlaceholder('Titre de l\'article…').fill('Article autosave E2E');

    const editor = page.locator('.ProseMirror');
    await editor.click();
    await editor.pressSequentially('Contenu autosave');

    await expect(page.getByText('Sauvegardé')).toBeVisible({ timeout: AUTOSAVE_MS + 5_000 });

    await page.getByTitle('Paramètres').click();
    await expect(page.getByRole('button', { name: /Publier l'article/i })).toBeVisible();
  });

  test('affiche une erreur si la création échoue', async ({ page }) => {
    await page.goto(`${TEST_PAGE}?failCreate=1`);
    await expect(page.locator('.ProseMirror')).toBeVisible({ timeout: 15_000 });

    await page.getByPlaceholder('Titre de l\'article…').fill('Échec save');
    const editor = page.locator('.ProseMirror');
    await editor.click();
    await editor.pressSequentially('Contenu');

    await expect(page.getByText('Erreur de sauvegarde')).toBeVisible({ timeout: AUTOSAVE_MS + 5_000 });
  });

  test('ouvre le panneau Historique sans article créé', async ({ page }) => {
    await page.getByTitle('Historique').click();
    await expect(page.getByRole('heading', { name: 'Historique' })).toBeVisible();
    await expect(page.getByText('Restaurer')).not.toBeVisible();
  });
});
