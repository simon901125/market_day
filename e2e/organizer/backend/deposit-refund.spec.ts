import { expect, test } from '../../fixtures';
import {
  closeAlert,
  credentialsFor,
  desktopViewport,
  expectApiSuccess,
  loginAs,
  waitForApi,
} from './organizer-test-helpers';

test.use({ viewport: desktopViewport });

test.describe('主辦方後台－保證金退還', () => {
  test('@organizer @deposit-refund ORG-40 活動進行中可登記現金退還保證金', async ({ page }) => {
    const applicationId = Number(process.env['E2E_DEPOSIT_APPLICATION_ID']);
    test.skip(!applicationId, '需設定已付款、完成所有日期選位且活動進行中的 E2E_DEPOSIT_APPLICATION_ID。');
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');

    await loginAs(page, 'organizer');
    const detailPromise = waitForApi(page, `/api/organizer/applications/${applicationId}`, 'GET');
    await page.goto(`/organizer/dash-board/register/detail/${applicationId}`);
    await expectApiSuccess(await detailPromise);

    const returnedStatus = page.getByText('保證金已退還', { exact: true }).first();
    if (await returnedStatus.isVisible()) {
      await expect(page.getByRole('button', { name: '退還保證金', exact: true })).toHaveCount(0);
      return;
    }

    const returnButton = page.getByRole('button', { name: '退還保證金', exact: true });
    await expect(returnButton).toBeEnabled();
    await returnButton.click();
    const refundPromise = waitForApi(page, '/api/organizer/deposits/refund', 'POST');
    await page.getByRole('button', { name: '確認退還', exact: true }).click();
    await expectApiSuccess(await refundPromise);
    await closeAlert(page, '保證金已退還', '知道了');

    await page.reload();
    await expect(page.getByText('保證金已退還', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: '退還保證金', exact: true })).toHaveCount(0);
  });
});
