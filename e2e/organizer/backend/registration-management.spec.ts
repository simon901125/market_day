import { expect, test } from '../../fixtures';
import {
  chooseDropdown,
  closeAlert,
  credentialsFor,
  createPublishedOrganizerEvent,
  desktopViewport,
  expectApiSuccess,
  loginAs,
  registrationOpenSchedule,
  submitVendorApplication,
  uniqueLabel,
  uniqueVehicleNo,
  waitForApi,
} from './organizer-test-helpers';

test.use({ viewport: desktopViewport });

test.describe('主辦方後台－報名管理', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');
    await loginAs(page, 'organizer');
  });

  test('@organizer ORG-36～38 專用報名的核准、必填驗證與拒絕', async ({ page, browser }) => {
    test.setTimeout(5 * 60 * 1000);
    test.skip(!credentialsFor('admin') || !credentialsFor('vendor'), '報名審核流程需要管理員與攤主 E2E 帳密。');

    const schedule = registrationOpenSchedule();
    const approveEventName = uniqueLabel('森日植感生活市集・品牌招募場').toUpperCase();
    const rejectEventName = uniqueLabel('島嶼風格選物節・品牌招募場').toUpperCase();
    const adminContext = await browser.newContext({ viewport: desktopViewport });
    const vendorContext = await browser.newContext({ viewport: desktopViewport });
    const adminPage = await adminContext.newPage();
    const vendorPage = await vendorContext.newPage();
    for (const targetPage of [page, adminPage, vendorPage]) {
      targetPage.setDefaultTimeout(15_000);
      targetPage.setDefaultNavigationTimeout(30_000);
    }

    try {
      await loginAs(adminPage, 'admin');
      await loginAs(vendorPage, 'vendor');
      await createPublishedOrganizerEvent(page, adminPage, approveEventName, schedule);
      await createPublishedOrganizerEvent(page, adminPage, rejectEventName, schedule);

      const approveApplicationId = await submitVendorApplication(
        vendorPage,
        approveEventName,
        schedule.registrationStart,
        uniqueVehicleNo(),
      );
      const rejectApplicationId = await submitVendorApplication(
        vendorPage,
        rejectEventName,
        schedule.registrationStart,
        uniqueVehicleNo(),
      );

      await page.goto(`/organizer/dash-board/register/detail/${approveApplicationId}`);
      await page.locator('.header-actions .detail-status-action', { hasText: '審核通過' }).click();
      const approvePromise = waitForApi(
        page,
        `/api/organizer/applications/${approveApplicationId}/approve`,
        'POST',
      );
      await page.getByRole('button', { name: '確認通過', exact: true }).click();
      await expectApiSuccess(await approvePromise);
      await closeAlert(page, '送出審核成功', '知道了');
      await expect(page.getByText('待付款', { exact: true }).first()).toBeVisible();
      await page.reload();
      await expect(page.getByText('待付款', { exact: true }).first()).toBeVisible();

      await page.goto(`/organizer/dash-board/register/detail/${rejectApplicationId}`);
      await page.locator('.header-actions .detail-status-action', { hasText: '審核未通過' }).click();
      const reasonDialog = page.getByRole('dialog');
      await reasonDialog.getByRole('button', { name: '送出結果', exact: true }).click();
      await expect(reasonDialog.locator('.registration-swal-field-error')).toHaveText('請選擇未通過原因');
      await reasonDialog.locator('app-dropdown .select-btn').click();
      await reasonDialog.getByRole('option', { name: '申請資料填寫不完整', exact: true }).click();
      await reasonDialog.locator('#rejectDescription').fill('本場次同類型品牌名額已滿，歡迎報名下一梯次。');
      await reasonDialog.getByRole('button', { name: '送出結果', exact: true }).click();

      const rejectPromise = waitForApi(
        page,
        `/api/organizer/applications/${rejectApplicationId}/reject`,
        'POST',
      );
      await page.getByRole('button', { name: '確認送出', exact: true }).click();
      await expectApiSuccess(await rejectPromise);
      await closeAlert(page, '審核未通過', '知道了');
      await expect(page.getByText('審核未通過', { exact: true }).first()).toBeVisible();
      await expect(page.getByText('申請資料填寫不完整', { exact: true }).first()).toBeVisible();
    } finally {
      await adminContext.close();
      await vendorContext.close();
    }
  });

  test('@organizer ORG-34 報名搜尋會保留活動與品牌條件', async ({ page }) => {
    const initialPromise = waitForApi(page, '/api/organizer/applications/search', 'GET');
    await page.goto('/organizer/dash-board/register');
    await expectApiSuccess(await initialPromise);

    await page.getByPlaceholder('請輸入活動名稱').fill('日光');
    await page.getByPlaceholder('請輸入品牌名稱').fill('山眠');
    const searchPromise = waitForApi(page, /\/api\/organizer\/applications\/search\?.*eventTitle=%E6%97%A5%E5%85%89.*brandName=%E5%B1%B1%E7%9C%A0/, 'GET');
    await page.getByRole('button', { name: '搜尋', exact: true }).click();
    await expectApiSuccess(await searchPromise);
    await expect(page).toHaveURL(/activity=%E6%97%A5%E5%85%89/);
    await expect(page).toHaveURL(/brand=%E5%B1%B1%E7%9C%A0/);

    const firstRow = page.locator('tbody tr[role="link"]').first();
    await expect(firstRow).toBeVisible();
    const status = (await firstRow.locator('.status-badge').textContent())?.trim();
    expect(status, '報名列表第一筆應顯示狀態').toBeTruthy();
    const statusPromise = waitForApi(page, '/api/organizer/applications/search', 'GET');
    await chooseDropdown(page.locator('app-dropdown').first(), status!);
    const statusResponse = await statusPromise;
    await expectApiSuccess(statusResponse);
    expect(new URL(statusResponse.url()).searchParams.get('status')).toBe(status);

    const datePromise = waitForApi(page, '/api/organizer/applications/search', 'GET');
    await page.goto(`/organizer/dash-board/register?activity=%E6%97%A5%E5%85%89&brand=%E5%B1%B1%E7%9C%A0&status=${encodeURIComponent(status!)}&startDate=2026-07-01&endDate=2026-07-31`);
    const dateResponse = await datePromise;
    await expectApiSuccess(dateResponse);
    const dateQuery = new URL(dateResponse.url()).searchParams;
    expect(dateQuery.get('registration_start_at')).toBe('2026-07-01');
    expect(dateQuery.get('registration_end_at')).toBe('2026-07-31');
  });

  test('@organizer ORG-35、39 報名詳情顯示品牌、費用與狀態資料', async ({ page }) => {
    const listPromise = waitForApi(page, '/api/organizer/applications/search', 'GET');
    await page.goto('/organizer/dash-board/register');
    await expectApiSuccess(await listPromise);

    const firstRow = page.locator('tbody tr[role="link"]').first();
    test.skip((await firstRow.count()) === 0, '目前沒有可驗證的主辦方報名資料。');
    const detailPromise = waitForApi(page, /\/api\/organizer\/applications\/\d+$/, 'GET');
    await firstRow.click();
    await expectApiSuccess(await detailPromise);

    await expect(page).toHaveURL(/\/organizer\/dash-board\/register\/detail\/\d+/);
    await expect(page.getByRole('heading', { name: '報名詳情' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '付款資訊' })).toBeVisible();
    await expect(page.getByText('目前狀態', { exact: true })).toBeVisible();
  });
});
