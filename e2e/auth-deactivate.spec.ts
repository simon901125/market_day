import { expect, test } from './fixtures';
import {
  authRoleCases,
  loginWithUi,
  readStoredSession,
} from './auth-test-helpers';

test.describe('AUTH-10 註銷帳號', () => {
  test('@destructive 一次性帳號註銷後不可再次登入', async ({ page }) => {
    test.setTimeout(90_000);

    const role = process.env['E2E_DESTRUCTIVE_ROLE'];
    const email = process.env['E2E_DESTRUCTIVE_EMAIL'];
    const password = process.env['E2E_DESTRUCTIVE_PASSWORD'];
    const config = authRoleCases.find(
      (item) => item.role === role && item.role !== 'admin',
    );

    test.skip(
      !config || !email || !password,
      '必須設定 E2E_DESTRUCTIVE_ROLE（vendor 或 organizer）、E2E_DESTRUCTIVE_EMAIL、E2E_DESTRUCTIVE_PASSWORD',
    );

    const loginResponse = await loginWithUi(page, config!, email!, password!);
    const loginBody = await loginResponse.json();
    expect(loginBody.statusCode).toBeGreaterThanOrEqual(200);
    expect(loginBody.statusCode).toBeLessThan(300);

    await page.goto(`/${config!.role}/dash-board/account-settings`);
    await page.getByRole('button', { name: '申請註銷帳號' }).click();

    const confirmDialog = page.getByRole('dialog');
    await expect(confirmDialog).toContainText('註銷帳號確認');

    const deactivateResponsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/account/deactivate') &&
        response.request().method() === 'POST',
    );
    await confirmDialog.getByRole('button', { name: '確定註銷' }).click();

    const deactivateResponse = await deactivateResponsePromise;
    const deactivateBody = await deactivateResponse.json();
    expect(deactivateBody.statusCode).toBeGreaterThanOrEqual(200);
    expect(deactivateBody.statusCode).toBeLessThan(300);
    await expect(page).toHaveURL(config!.loginPath);

    const session = await readStoredSession(page, config!.role);
    expect(session.token).toBeNull();
    expect(session.user).toBeNull();

    const successDialog = page.getByRole('dialog');
    await expect(successDialog).toContainText('帳號已成功註銷');
    await successDialog.getByRole('button', { name: '返回登入頁' }).click();

    const rejectedLoginResponse = await loginWithUi(
      page,
      config!,
      email!,
      password!,
    );
    const rejectedLoginBody = await rejectedLoginResponse.json();
    expect(rejectedLoginBody.statusCode).toBe(400);
    await expect(page).toHaveURL(config!.loginPath);
  });
});
