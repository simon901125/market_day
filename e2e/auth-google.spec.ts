import { expect, test } from './fixtures';
import {
  authRoleCases,
  createUnsignedJwt,
  installGoogleCredentialStub,
  readStoredSession,
} from './auth-test-helpers';

const googleRoles = authRoleCases.filter(
  (config) => config.role === 'vendor' || config.role === 'organizer',
);

test.describe('AUTH-05 Google 註冊與登入', () => {
  for (const config of googleRoles) {
    test(`@smoke ${config.label}使用 Google 帳號註冊後進入 Email 驗證頁`, async ({
      page,
    }) => {
      const email = `e2e.google.${config.role}@example.test`;
      const credential = await installGoogleCredentialStub(page, email);
      let requestBody: Record<string, unknown> | undefined;

      await page.route(`**/api/${config.role}/google-register`, async (route) => {
        requestBody = route.request().postDataJSON() as Record<string, unknown>;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(apiResult(null)),
        });
      });

      await page.goto(`/${config.role}/register`);
      const googleButton = page.locator('button.google-btn');
      await googleButton.focus();
      await googleButton.press('Enter');
      await expect.poll(
        () =>
          page.evaluate(
            () =>
              (window as unknown as Record<string, unknown>)[
                '__e2eGoogleCredentialDelivered'
              ],
          ),
        { timeout: 5_000 },
      ).toBe(true);
      await expect.poll(() => requestBody, { timeout: 5_000 }).toEqual({ credential });

      const dialog = page.getByRole('dialog');
      await expect(dialog).toContainText('驗證碼已寄出');
      await expect(dialog).toContainText(email);

      await dialog.getByRole('button', { name: '前往驗證' }).click();
      await expect(page).toHaveURL(
        new RegExp(`/${config.role}/verify-email\\?email=`),
      );

      const pendingEmail = await page.evaluate(
        (role) =>
          sessionStorage.getItem(`MarketDayPendingRegistrationEmail_${role}`),
        config.role,
      );
      expect(pendingEmail).toBe(email);
    });

    test(`@smoke ${config.label}使用 Google 帳號登入後進入後台`, async ({
      page,
    }) => {
      const email = `e2e.google.${config.role}@example.test`;
      const credential = await installGoogleCredentialStub(page, email);
      const token = createUnsignedJwt({
        email,
        role: config.expectedApiRole,
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      let requestBody: Record<string, unknown> | undefined;

      await page.route(`**/api/${config.role}/google-login`, async (route) => {
        requestBody = route.request().postDataJSON() as Record<string, unknown>;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(
            apiResult({
              token,
              user: {
                email,
                name: `E2E Google ${config.label}`,
                role: config.expectedApiRole,
                provider: 'GOOGLE',
                googleSub: `e2e-google-${config.role}`,
                status: 'ACTIVE',
              },
            }),
          ),
        });
      });

      await page.goto(config.loginPath);
      const googleButton = page.locator('button.google-btn');
      await googleButton.focus();
      await googleButton.press('Enter');
      await expect.poll(
        () =>
          page.evaluate(
            () =>
              (window as unknown as Record<string, unknown>)[
                '__e2eGoogleCredentialDelivered'
              ],
          ),
        { timeout: 5_000 },
      ).toBe(true);
      await expect.poll(() => requestBody, { timeout: 5_000 }).toEqual({ credential });

      await expect(page).toHaveURL(config.dashboardPath);

      const session = await readStoredSession(page, config.role);
      expect(session.token).toBe(token);
      expect(JSON.parse(session.user ?? '{}').role).toBe(config.expectedApiRole);
    });
  }
});

function apiResult<T>(data: T): {
  statusCode: number;
  message: string;
  messageDetails: null;
  data: T;
} {
  return {
    statusCode: 200,
    message: 'success',
    messageDetails: null,
    data,
  };
}
