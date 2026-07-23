import { expect, test } from '../../fixtures';
import {
  chooseDropdown,
  credentialsFor,
  desktopViewport,
  expectApiSuccess,
  expectNonEmptyDownload,
  loginAs,
  organizerApiGet,
  waitForApi,
} from './organizer-test-helpers';

test.use({ viewport: desktopViewport });

test.describe('主辦方後台－帳務管理', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');
    await loginAs(page, 'organizer');
  });

  test('@organizer ORG-66 帳務活動搜尋使用 Real API', async ({ page }) => {
    const initialPromise = waitForApi(page, '/api/organizer/accounts/search', 'GET');
    await page.goto('/organizer/dash-board/account');
    const initialBody = await expectApiSuccess(await initialPromise);
    await expect(page.getByRole('heading', { name: '帳務管理' })).toBeVisible();

    const accounts = ((initialBody.data as {
      accounts?: { items?: Array<{ publishStatusText?: string }> };
    } | undefined)?.accounts?.items ?? []);
    expect(
      accounts.some((item) => item.publishStatusText === '品牌公開前驗收'),
      '帳務 API 不應再回傳已廢止的「品牌公開前驗收」狀態',
    ).toBe(false);
    await expect(page.getByText('品牌公開前驗收', { exact: true })).toHaveCount(0);

    await page.getByPlaceholder('搜尋活動名稱').fill('日光');
    const searchPromise = waitForApi(page, '/api/organizer/accounts/search', 'GET');
    await page.getByRole('button', { name: '搜尋', exact: true }).click();
    const searchResponse = await searchPromise;
    await expectApiSuccess(searchResponse);
    expect(new URL(searchResponse.url()).searchParams.get('eventTitle')).toBe('日光');

    const statusPromise = waitForApi(page, '/api/organizer/accounts/search', 'GET');
    await chooseDropdown(page.locator('app-dropdown').first(), '品牌已公開');
    const statusResponse = await statusPromise;
    await expectApiSuccess(statusResponse);
    expect(new URL(statusResponse.url()).searchParams.get('status')).toBe('brandsPublished');

    const datePromise = waitForApi(page, '/api/organizer/accounts/search', 'GET');
    await page.goto('/organizer/dash-board/account?startDate=2026-07-01&endDate=2026-07-31');
    const dateResponse = await datePromise;
    await expectApiSuccess(dateResponse);
    expect(new URL(dateResponse.url()).searchParams.get('event_start_at')).toBe('2026-07-01');
    expect(new URL(dateResponse.url()).searchParams.get('event_end_at')).toBe('2026-07-31');
  });

  test('@organizer ORG-67～71 帳務統計、明細與報表下載', async ({ page }) => {
    const listPromise = waitForApi(page, '/api/organizer/accounts/search', 'GET');
    await page.goto('/organizer/dash-board/account');
    await expectApiSuccess(await listPromise);

    const firstRow = page.locator('tbody tr[role="link"]').first();
    test.skip((await firstRow.count()) === 0, '目前沒有可驗證的帳務活動。');
    const detailPromise = waitForApi(page, /\/api\/organizer\/accounts\/\d+\?/, 'GET');
    await firstRow.click();
    await expectApiSuccess(await detailPromise);

    await expect(page.getByRole('heading', { name: '帳務詳情' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '帳務摘要' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '付款統計' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '退款統計' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '保證金統計' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '帳務明細' })).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: '下載帳務報表' }).click();
    await expectNonEmptyDownload(await downloadPromise);
  });

  test('@organizer ORG-67～70 帳務公式、筆數、保證金與狀態頁籤使用 Real API 交叉驗證', async ({ page }) => {
    const searchBody = await expectApiSuccess<{
      accounts?: { items?: Array<{ eventId: number; grossRevenue: number; refundAmount: number; returnedDepositAmount: number; unreturnedDepositAmount: number; netRevenue: number }> };
    }>(await organizerApiGet(page, '/api/organizer/accounts/search?page=1&pageSize=100'));
    const target = (searchBody.data?.accounts?.items ?? [])
      .find((account) => account.grossRevenue > 0 || account.refundAmount > 0);
    test.skip(!target, '目前沒有可交叉驗證的付款或退款帳務資料。');

    const detailBody = await expectApiSuccess<{
      summary: Record<string, number>;
      statistics: { payment: Record<string, number>; refund: Record<string, number>; deposit: Record<string, number> };
      payments: { items: Array<Record<string, unknown>>; totalItems: number };
    }>(await organizerApiGet(
      page,
      `/api/organizer/accounts/${target!.eventId}?paymentPage=1&paymentPageSize=100`,
    ));
    const data = detailBody.data!;
    expect(data.summary['netRevenue']).toBe(
      data.summary['grossRevenue'] - data.summary['refundAmount'] - data.summary['returnedDepositAmount'],
    );
    expect(data.summary['grossRevenue']).toBe(target!.grossRevenue);
    expect(data.summary['refundAmount']).toBe(target!.refundAmount);
    expect(data.summary['returnedDepositAmount']).toBe(target!.returnedDepositAmount);
    expect(data.summary['unreturnedDepositAmount']).toBe(target!.unreturnedDepositAmount);
    expect(data.statistics.payment['paidStallCount']).toBeLessThanOrEqual(
      data.statistics.payment['totalStallCount'],
    );
    expect(data.statistics.deposit['returnedDepositAmount']).toBe(data.summary['returnedDepositAmount']);
    expect(data.statistics.deposit['unreturnedDepositAmount']).toBe(data.summary['unreturnedDepositAmount']);
    expect(data.payments.items).toHaveLength(data.payments.totalItems);

    const initialDetailPromise = waitForApi(page, /\/api\/organizer\/accounts\/\d+\?/, 'GET');
    await page.goto(`/organizer/dash-board/account/detail/${target!.eventId}`);
    await expectApiSuccess(await initialDetailPromise);
    await expect(page.getByRole('heading', { name: '帳務詳情' })).toBeVisible();
    for (const status of ['付款成功', '退款申請中', '退款處理中', '已退款', '已取消']) {
      const responsePromise = waitForApi(page, /\/api\/organizer\/accounts\/\d+\?.*status=/, 'GET');
      await page.getByRole('tab', { name: new RegExp(`^${status}`) }).click();
      const response = await responsePromise;
      await expectApiSuccess(await response);
      expect(new URL(response.url()).searchParams.get('status')).toBe(status);
      await expect(page.getByRole('tab', { name: new RegExp(`^${status}`) }))
        .toHaveAttribute('aria-selected', 'true');
    }
  });
});
