import { expect, test } from '@playwright/test';

const organizerEmail = process.env['E2E_ORGANIZER_EMAIL'];
const organizerPassword = process.env['E2E_ORGANIZER_PASSWORD'];

test.describe('主辦方登入', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/organizer/login');
    await expect(page.getByRole('heading', { name: '主辦方登入' })).toBeVisible();
  });

  test('使用正確帳密可以登入主辦方後台', async ({ page }) => {
    test.skip(
      !organizerEmail || !organizerPassword,
      '尚未設定 E2E_ORGANIZER_EMAIL 或 E2E_ORGANIZER_PASSWORD',
    );

    await page.locator('input[name="email"]').fill(organizerEmail!);
    await page.locator('input[name="password"]').fill(organizerPassword!);

    const loginResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/organizer/local-login') &&
        response.request().method() === 'POST',
    );

    await page.getByRole('button', { name: '登入', exact: true }).click();
    await loginResponse;

    await expect(page).toHaveURL(/\/organizer\/dash-board\/home$/);
  });

  test('使用錯誤密碼時不能登入', async ({ page }) => {
    test.skip(!organizerEmail, '尚未設定 E2E_ORGANIZER_EMAIL');

    await page.locator('input[name="email"]').fill(organizerEmail!);
    await page
      .locator('input[name="password"]')
      .fill('DefinitelyWrong-E2E-Password-2026!');

    const loginResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/organizer/local-login') &&
        response.request().method() === 'POST',
    );

    await page.getByRole('button', { name: '登入', exact: true }).click();
    await loginResponse;

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('登入失敗');
    await expect(dialog).toContainText(/Email 或密碼錯誤|帳號或密碼錯誤/);
    await expect(page).toHaveURL(/\/organizer\/login$/);
  });
});
