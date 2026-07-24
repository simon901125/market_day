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

test.describe.serial('主辦方後台－藍新 Sandbox 退款', () => {
  test('@organizer @sandbox-refund ORG-45～49 新付款申請並完成真實退款', async ({ browser }) => {
    test.setTimeout(3 * 60 * 1000);
    const applicationId = Number(process.env['E2E_REFUND_APPLICATION_ID']);
    test.skip(!applicationId, '需先以本次新付款設定 E2E_REFUND_APPLICATION_ID。');
    test.skip(!credentialsFor('vendor') || !credentialsFor('organizer'), '缺少攤主或主辦方 E2E 帳密。');

    const vendorContext = await browser.newContext({ viewport: desktopViewport });
    const organizerContext = await browser.newContext({ viewport: desktopViewport });
    const vendorPage = await vendorContext.newPage();
    const organizerPage = await organizerContext.newPage();
    try {
      await loginAs(vendorPage, 'vendor');
      await vendorPage.goto(`/vendor/dash-board/application-record/detail/${applicationId}`);
      const refundButton = vendorPage.getByRole('button', { name: /申請退款/ });
      await expect(refundButton).toBeVisible();
      // Angular 的 click handler 會等待整個多步驟退款流程；直接派送事件，
      // 避免 Playwright 把開啟第一個對話框誤判為單次 click 尚未結束。
      await refundButton.dispatchEvent('click');
      const reasonDialog = vendorPage.getByRole('dialog');
      await expect(reasonDialog).toContainText('填寫退款原因');
      await reasonDialog.locator('#requiredReason').fill('攤主因行程異動取消參與，依活動規範辦理退款。');
      await reasonDialog.getByRole('button', { name: '下一步', exact: true }).click();
      const requestPromise = waitForApi(vendorPage, '/api/vendor/refunds', 'POST');
      await vendorPage.getByRole('button', { name: '確認申請退款', exact: true }).click();
      await expectApiSuccess(await requestPromise);
      await closeAlert(vendorPage, '退款申請已送出', '確認');
      await expect(vendorPage.getByText('退款申請中', { exact: true }).first()).toBeVisible();

      await loginAs(organizerPage, 'organizer');
      const paymentPromise = waitForApi(
        organizerPage,
        `/api/organizer/payments/${applicationId}`,
        'GET',
      );
      await organizerPage.goto(`/organizer/dash-board/collection/detail/${applicationId}`);
      await expectApiSuccess(await paymentPromise);
      await expect(organizerPage.getByRole('heading', { name: '退款資訊' })).toBeVisible();
      await expect(organizerPage.getByRole('button', { name: '同意退款', exact: true })).toBeVisible();

      await organizerPage.getByRole('button', { name: '同意退款', exact: true }).click();
      const reviewPromise = waitForApi(organizerPage, '/api/organizer/refunds/review', 'POST');
      await organizerPage.getByRole('button', { name: '確認同意', exact: true }).click();
      await expectApiSuccess(await reviewPromise);
      await closeAlert(organizerPage, '退款金流已完成', '我知道了');
      await organizerPage.reload();
      await expect(organizerPage.getByText(/已退款|退款處理中/).first()).toBeVisible();

      await organizerPage.goto(`/organizer/dash-board/register/detail/${applicationId}`);
      await expect(organizerPage.getByText(/已退款|退款處理中/).first()).toBeVisible();
    } finally {
      await vendorContext.close();
      await organizerContext.close();
    }
  });

  test('@organizer @sandbox-refund ORG-50～52 退款失敗可重試且完成後不可重複', async ({ page }) => {
    test.setTimeout(2 * 60 * 1000);
    const applicationId = Number(process.env['E2E_REFUND_FAILED_APPLICATION_ID']);
    test.skip(!applicationId, '需由 Sandbox 準備退款失敗資料並設定 E2E_REFUND_FAILED_APPLICATION_ID。');
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');

    await loginAs(page, 'organizer');
    await page.goto(`/organizer/dash-board/collection/detail/${applicationId}`);
    await expect(page.getByText('退款失敗', { exact: true }).first()).toBeVisible();
    const retryButton = page.getByRole('button', { name: '重試退款', exact: true });
    await expect(retryButton).toBeVisible();
    await retryButton.click();
    const retryPromise = waitForApi(page, '/api/organizer/refunds/payment', 'POST');
    await page.getByRole('button', { name: '確認重試', exact: true }).click();
    await expectApiSuccess(await retryPromise);
    await closeAlert(page, '退款金流已完成', '我知道了');
    await page.reload();
    await expect(page.getByRole('button', { name: /退款/ })).toHaveCount(0);
  });
});
