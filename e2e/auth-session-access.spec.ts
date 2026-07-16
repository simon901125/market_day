import { expect, test } from './fixtures';
import { authRoleCases, readStoredSession } from './auth-test-helpers';

test.describe('AUTH-09 Session 與角色權限', () => {
  for (const config of authRoleCases) {
    test(`@smoke 未登入不能直接進入${config.label}後台`, async ({ page }) => {
      await page.goto(config.dashboardPath);

      await expect(page).toHaveURL(config.loginPath);
      await expect(page.getByRole('heading', { name: config.loginHeading })).toBeVisible();

      const session = await readStoredSession(page, config.role);
      expect(session.token).toBeNull();
      expect(session.user).toBeNull();
    });
  }
});
