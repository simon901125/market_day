import { expect, test } from './fixtures';

const registerRoleCases = [
  {
    role: 'vendor',
    label: '攤主',
    registerPath: '/vendor/register',
    verifyPath: '/vendor/verify-email',
    heading: '攤主註冊',
  },
  {
    role: 'organizer',
    label: '主辦方',
    registerPath: '/organizer/register',
    verifyPath: '/organizer/verify-email',
    heading: '主辦方註冊',
  },
] as const;

test.describe('AUTH-01 本地註冊', () => {
  for (const config of registerRoleCases) {
    test(`@smoke ${config.label}填寫有效資料後進入 Email 驗證頁`, async ({ page }) => {
      const email = `e2e.${config.role}.${Date.now()}@example.test`;
      const password = 'Test123456';
      let requestBody: Record<string, unknown> | undefined;

      await page.route(`**/api/${config.role}/local-register`, async (route) => {
        requestBody = route.request().postDataJSON() as Record<string, unknown>;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            statusCode: 200,
            message: 'Registration verification code sent successfully',
            messageDetails: null,
            data: null,
          }),
        });
      });

      await page.goto(config.registerPath);
      await expect(page.getByRole('heading', { name: config.heading })).toBeVisible();

      await page.locator('input[name="directorName"]').fill(`E2E ${config.label}`);
      await page.locator('input[name="email"]').fill(email);
      await page.locator('input[name="password"]').fill(password);
      await page.locator('input[name="checkPw"]').fill(password);
      await page.getByRole('button', { name: '建立帳號', exact: true }).click();

      const dialog = page.getByRole('dialog');
      await expect(dialog).toContainText('驗證碼已寄出');
      await expect(dialog).toContainText(email);
      expect(requestBody).toEqual({
        name: `E2E ${config.label}`,
        email,
        password,
      });

      await page.getByRole('button', { name: '前往驗證', exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${config.verifyPath}\\?email=`));
      await expect(page.getByRole('heading', { name: '請輸入 Email 驗證碼' })).toBeVisible();
      await expect(page.locator('.verify-desc strong')).toHaveText(email);

      const pendingEmail = await page.evaluate(
        (role) => sessionStorage.getItem(`MarketDayPendingRegistrationEmail_${role}`),
        config.role,
      );
      expect(pendingEmail).toBe(email);
    });
  }
});
