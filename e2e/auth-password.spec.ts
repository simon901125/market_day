import { Page, Response } from '@playwright/test';

import { expect, test } from './fixtures';
import {
  AuthRoleCase,
  authRoleCases,
  getCredentials,
  loginWithUi,
  readStoredSession,
} from './auth-test-helpers';

const passwordRoles = authRoleCases.filter(
  (config) => config.role === 'vendor' || config.role === 'organizer',
);
const passwordApiUrl = 'http://localhost:8081/api/auth/resetPassword/reset';

test.describe('AUTH-07 登入後修改密碼', () => {
  for (const config of passwordRoles) {
    test(`@smoke @mutating ${config.label}目前密碼驗證與修改密碼`, async ({ page }) => {
      test.setTimeout(90_000);
      const { email, password } = getCredentials(config);
      test.skip(
        !email || !password,
        `尚未設定 ${config.emailEnv} 或 ${config.passwordEnv}`,
      );

      const temporaryPassword = createTemporaryPassword(config);
      let token = '';
      let passwordChanged = false;

      try {
        const loginResponse = await loginWithUi(page, config, email!, password!);
        const loginBody = await loginResponse.json();
        expect(loginBody.statusCode).toBeGreaterThanOrEqual(200);
        expect(loginBody.statusCode).toBeLessThan(300);

        const session = await readStoredSession(page, config.role);
        token = session.token ?? '';
        expect(token).toBeTruthy();

        await page.goto(`/${config.role}/dash-board/account-settings`);
        await expect(page.getByRole('heading', { name: '帳號設定' })).toBeVisible();
        await page
          .getByRole('button', { name: '修改密碼', exact: true })
          .click();

        const incorrectResponse = await submitPasswordChange(
          page,
          'DefinitelyWrong-E2E-Password-2026!',
          temporaryPassword,
        );
        const incorrectBody = await incorrectResponse.json();

        passwordChanged = isApiSuccessStatus(incorrectBody.statusCode);
        expect(incorrectBody.statusCode).toBe(400);
        const incorrectMessage =
          incorrectBody.messageDetails || incorrectBody.message;
        expect(incorrectMessage).toBeTruthy();
        await expect(page.getByRole('alert')).toContainText(incorrectMessage);

        const successResponse = await submitPasswordChange(
          page,
          password!,
          temporaryPassword,
        );
        const successBody = await successResponse.json();

        expect(successBody.statusCode).toBeGreaterThanOrEqual(200);
        expect(successBody.statusCode).toBeLessThan(300);
        passwordChanged = isApiSuccessStatus(successBody.statusCode);

        const successDialog = page.getByRole('dialog');
        await expect(successDialog).toContainText('密碼已更新');
        await successDialog.getByRole('button', { name: '確定' }).click();
      } finally {
        if (passwordChanged) {
          await restorePassword(page, token, temporaryPassword, password!);
        }
      }
    });
  }
});

async function submitPasswordChange(
  page: Page,
  currentPassword: string,
  newPassword: string,
): Promise<Response> {
  const dialog = page.getByRole('dialog', { name: '修改密碼' });
  await dialog.locator('input[name="currentPassword"]').fill(currentPassword);
  await dialog.locator('input[name="newPassword"]').fill(newPassword);
  await dialog.locator('input[name="confirmPassword"]').fill(newPassword);

  const responsePromise = page.waitForResponse(
    (response) =>
      response.url() === passwordApiUrl &&
      response.request().method() === 'POST',
  );
  await dialog.getByRole('button', { name: '儲存變更' }).click();
  return responsePromise;
}

async function restorePassword(
  page: Page,
  token: string,
  temporaryPassword: string,
  originalPassword: string,
): Promise<void> {
  const response = await page.request.post(passwordApiUrl, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      currentPassword: temporaryPassword,
      password: originalPassword,
    },
  });
  const body = await response.json();

  expect(
    body.statusCode,
    '測試已修改密碼，但無法還原原密碼；請立即檢查此 E2E 帳號',
  ).toBeGreaterThanOrEqual(200);
  expect(body.statusCode).toBeLessThan(300);
}

function createTemporaryPassword(config: AuthRoleCase): string {
  return `E2e${config.expectedApiRole}${Date.now()}A1`;
}

function isApiSuccessStatus(statusCode: number): boolean {
  return statusCode >= 200 && statusCode < 300;
}
