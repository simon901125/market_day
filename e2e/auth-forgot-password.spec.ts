import { expect, test } from './fixtures';

const forgotPasswordRoleCases = [
  {
    role: 'vendor',
    label: '攤主',
    forgotPath: '/vendor/forgot-password',
    verifyPath: '/vendor/verify-email',
  },
  {
    role: 'organizer',
    label: '主辦方',
    forgotPath: '/organizer/forgot-password',
    verifyPath: '/organizer/verify-email',
  },
] as const;

test.describe('AUTH-04 忘記與重設密碼', () => {
  for (const config of forgotPasswordRoleCases) {
    test(`@smoke ${config.label}送出 Email 後進入重設密碼驗證頁`, async ({ page }) => {
      const email = `e2e.reset.${config.role}@example.test`;
      let requestBody: Record<string, unknown> | undefined;

      await page.route('**/api/auth/resetPassword/request', async (route) => {
        requestBody = route.request().postDataJSON() as Record<string, unknown>;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            statusCode: 200,
            message: 'Password reset verification code sent successfully',
            messageDetails: null,
            data: null,
          }),
        });
      });

      await page.goto(config.forgotPath);
      await expect(
        page.getByRole('heading', { name: '忘記密碼', exact: true }),
      ).toBeVisible();
      await page.locator('input[name="email"]').fill(email);
      await page.getByRole('button', { name: '寄送驗證碼', exact: true }).click();

      const dialog = page.getByRole('dialog');
      await expect(dialog).toContainText('驗證碼已寄出');
      await expect(dialog).toContainText(email);
      expect(requestBody).toEqual({ email });

      await page.getByRole('button', { name: '前往驗證', exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${config.verifyPath}\\?email=.*purpose=reset`));
      await expect(page.getByRole('heading', { name: '請輸入 Email 驗證碼' })).toBeVisible();
      await expect(page.locator('.verify-desc strong')).toHaveText(email);

      const resetEmail = await page.evaluate(
        (role) => sessionStorage.getItem(`MarketDayPasswordResetEmail_${role}`),
        config.role,
      );
      expect(resetEmail).toBe(email);
    });
  }
});
