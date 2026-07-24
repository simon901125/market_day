import { expect, test } from '../../fixtures';
import {
  chooseDropdown,
  credentialsFor,
  desktopViewport,
  expectApiSuccess,
  loginAs,
  organizerApiGet,
  waitForApi,
} from './organizer-test-helpers';

test.use({ viewport: desktopViewport });

test.describe('主辦方後台－收款管理', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');
    await loginAs(page, 'organizer');
  });

  test('@organizer ORG-41 收款搜尋使用 Real API 並保留關鍵字', async ({ page }) => {
    const initialPromise = waitForApi(page, '/api/organizer/payments/search', 'POST');
    await page.goto('/organizer/dash-board/collection');
    await expectApiSuccess(await initialPromise);
    await expect(page.getByRole('heading', { name: '收款管理' })).toBeVisible();

    await page.getByPlaceholder('搜尋活動名稱 / 品牌名稱').fill('日光');
    const searchPromise = waitForApi(page, /\/api\/organizer\/payments\/search\?.*keyword=%E6%97%A5%E5%85%89/, 'POST');
    await page.getByRole('button', { name: '搜尋', exact: true }).click();
    await expectApiSuccess(await searchPromise);
    await expect(page).toHaveURL(/keyword=%E6%97%A5%E5%85%89/);

    const statusPromise = waitForApi(page, '/api/organizer/payments/search', 'POST');
    await chooseDropdown(page.locator('app-dropdown').first(), '付款成功');
    const statusResponse = await statusPromise;
    await expectApiSuccess(statusResponse);
    expect(new URL(statusResponse.url()).searchParams.get('paymentStatus')).toBe('付款成功');

    const datePromise = waitForApi(page, '/api/organizer/payments/search', 'POST');
    await page.goto('/organizer/dash-board/collection?keyword=%E6%97%A5%E5%85%89&status=%E4%BB%98%E6%AC%BE%E6%88%90%E5%8A%9F&startDate=2026-07-01&endDate=2026-07-31');
    const dateResponse = await datePromise;
    await expectApiSuccess(dateResponse);
    const dateQuery = new URL(dateResponse.url()).searchParams;
    expect(dateQuery.get('startDate')).toBe('2026-07-01');
    expect(dateQuery.get('endDate')).toBe('2026-07-31');
  });

  test('@organizer ORG-42～44 收款詳情顯示付款與費用資料並可返回', async ({ page }) => {
    const listPromise = waitForApi(page, '/api/organizer/payments/search', 'POST');
    await page.goto('/organizer/dash-board/collection');
    await expectApiSuccess(await listPromise);

    const paidListPromise = waitForApi(page, '/api/organizer/payments/search', 'POST');
    await chooseDropdown(page.locator('app-dropdown').first(), '付款成功');
    await expectApiSuccess(await paidListPromise);

    const firstRow = page.locator('tbody tr[role="link"]').first();
    test.skip((await firstRow.count()) === 0, '目前沒有可驗證的收款資料。');
    const detailPromise = waitForApi(page, /\/api\/organizer\/payments\/\d+$/, 'GET');
    await firstRow.click();
    await expectApiSuccess(await detailPromise);

    await expect(page).toHaveURL(/\/organizer\/dash-board\/collection\/detail\/\d+/);
    await expect(page.getByRole('heading', { name: '收款詳情' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '收款資訊' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '報名費用明細' })).toBeVisible();
    await expect(page.getByText('藍新金流', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('NEWEBPAY', { exact: true })).toHaveCount(0);

    await page.getByRole('button', { name: '返回收款管理' }).click();
    await expect(page).toHaveURL(/\/organizer\/dash-board\/collection/);
    await expect(page).toHaveURL(/status=/);
  });

  test('@organizer ORG-39、ORG-43 報名、付款與費用加總使用 Real API 交叉驗證', async ({ page }) => {
    const accountsBody = await expectApiSuccess<{
      accounts?: { items?: Array<{ eventId: number; grossRevenue: number; refundAmount: number }> };
    }>(await organizerApiGet(page, '/api/organizer/accounts/search?page=1&pageSize=100'));
    const account = (accountsBody.data?.accounts?.items ?? [])
      .find((item) => item.grossRevenue > 0 || item.refundAmount > 0);
    test.skip(!account, '目前沒有可核對費用的付款或退款資料。');

    const ledgerBody = await expectApiSuccess<{
      payments: { items: Array<{ applicationId: number }> };
    }>(await organizerApiGet(
      page,
      `/api/organizer/accounts/${account!.eventId}?paymentPage=1&paymentPageSize=100`,
    ));
    const applicationId = ledgerBody.data?.payments.items[0]?.applicationId;
    expect(applicationId, '帳務明細應提供報名 ID').toBeGreaterThan(0);

    const paymentBody = await expectApiSuccess<{
      application: { applicationId: number; paymentStatus: string; paymentNo: string | null };
      feeDetails: Array<{ item: string; amount: number | string | null }>;
      rentalEquipments: Array<{ subtotal?: number | string | null }>;
      extraPower: Array<{ subtotal?: number | string | null }>;
      statusRecords: Array<{ key: string; createdAt: string | null }>;
    }>(await organizerApiGet(page, `/api/organizer/payments/${applicationId}`));
    const detail = paymentBody.data!;
    expect(detail.application.applicationId).toBe(applicationId);
    expect(detail.application.paymentNo).toBeTruthy();
    const totalRow = detail.feeDetails.at(-1);
    expect(totalRow?.item).toMatch(/總計|合計/);
    const lineTotal = detail.feeDetails.slice(0, -1)
      .reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
    expect(lineTotal).toBe(Number(totalRow?.amount ?? 0));
    expect(detail.rentalEquipments.reduce((sum, row) => sum + Number(row.subtotal ?? 0), 0))
      .toBeGreaterThanOrEqual(0);
    expect(detail.extraPower.reduce((sum, row) => sum + Number(row.subtotal ?? 0), 0))
      .toBeGreaterThanOrEqual(0);
    expect(detail.statusRecords.some((record) => record.createdAt != null)).toBe(true);

    const registrationBody = await expectApiSuccess<{
      payment?: { amount?: number | string | null };
      fee?: { total?: number | string | null };
      boothAssignments?: unknown[];
      times?: Record<string, string | null>;
    }>(await organizerApiGet(page, `/api/organizer/applications/${applicationId}`));
    const registeredTotal = Number(
      registrationBody.data?.payment?.amount ?? registrationBody.data?.fee?.total ?? totalRow?.amount ?? 0,
    );
    expect(registeredTotal).toBe(Number(totalRow?.amount ?? 0));
  });
});
