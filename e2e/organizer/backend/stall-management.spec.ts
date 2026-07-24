import { expect, test } from '../../fixtures';
import {
  chooseDropdown,
  credentialsFor,
  desktopViewport,
  expectApiSuccess,
  loginAs,
  organizerApiGet,
  organizerApiGetAllEventItems,
  waitForApi,
} from './organizer-test-helpers';

test.use({ viewport: desktopViewport });

test.describe('主辦方後台－攤位管理', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');
    await loginAs(page, 'organizer');
  });

  test('@organizer ORG-53 攤位活動搜尋使用 Real API', async ({ page }) => {
    const initialPromise = waitForApi(page, '/api/organizer/stalls/search', 'GET');
    await page.goto('/organizer/dash-board/stall');
    await expectApiSuccess(await initialPromise);
    await expect(page.getByRole('heading', { name: '攤位管理' })).toBeVisible();

    await page.getByPlaceholder('搜尋活動名稱').fill('日光');
    const searchPromise = waitForApi(page, '/api/organizer/stalls/search', 'GET');
    await page.getByRole('button', { name: '搜尋', exact: true }).click();
    const searchResponse = await searchPromise;
    await expectApiSuccess(searchResponse);
    expect(new URL(searchResponse.url()).searchParams.get('eventTitle')).toBe('日光');

    const statusPromise = waitForApi(page, '/api/organizer/stalls/search', 'GET');
    await chooseDropdown(page.locator('app-dropdown').first(), '品牌已公開');
    const statusResponse = await statusPromise;
    await expectApiSuccess(statusResponse);
    expect(new URL(statusResponse.url()).searchParams.get('status')).toBe('brandsPublished');

    const datePromise = waitForApi(page, '/api/organizer/stalls/search', 'GET');
    await page.goto('/organizer/dash-board/stall?startDate=2026-07-01&endDate=2026-07-31');
    const dateResponse = await datePromise;
    await expectApiSuccess(dateResponse);
    expect(new URL(dateResponse.url()).searchParams.get('event_start_at')).toBe('2026-07-01');
    expect(new URL(dateResponse.url()).searchParams.get('event_end_at')).toBe('2026-07-31');
  });

  test('@organizer ORG-54～59 攤位詳情、狀態頁籤與地圖可正確載入', async ({ page }) => {
    const listPromise = waitForApi(page, '/api/organizer/stalls/search', 'GET');
    await page.goto('/organizer/dash-board/stall');
    await expectApiSuccess(await listPromise);

    const firstRow = page.locator('tbody tr[role="link"]').first();
    test.skip((await firstRow.count()) === 0, '目前沒有可驗證的攤位活動。');
    const detailPromise = waitForApi(page, /\/api\/organizer\/stall\/\d+(?:\?|$)/, 'GET');
    await firstRow.click();
    await expectApiSuccess(await detailPromise);

    await expect(page.getByRole('heading', { name: '攤位詳情' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '攤位摘要' })).toBeVisible();
    await expect(page.getByRole('tab', { name: /全部/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /可選擇/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /已選擇/ })).toBeVisible();

    await page.getByRole('button', { name: '瀏覽攤位地圖' }).click();
    await expect(page).toHaveURL(/\/organizer\/dash-board\/stall\/detail\/\d+\/map/);
    await expect(page.locator('app-market-map')).toBeVisible();
  });

  test('@organizer ORG-54～59 攤位數量、搜尋、隱私與選位結果使用 Real API 交叉驗證', async ({ page }) => {
    const events = await organizerApiGetAllEventItems<{
      eventId: number;
      selectedStallCount: number;
      availableStallCount: number;
    }>(page, '/api/organizer/stalls/search');
    const target = events.find((event) => event.selectedStallCount > 0 && event.availableStallCount > 0);
    expect(target, '全部活動分頁中應有同時包含已選與未選攤位的主流程活動').toBeTruthy();

    const mapBody = await expectApiSuccess<{
      event: { totalStallCount: number; selectedStallCount: number; availableStallCount: number; currentApplyDate: string };
      stalls: Array<{ stalls: Array<{ stallNo: string; status: string; selectedApplicationId: number | null; selectedVendor?: { name?: string | null } | null }> }>;
    }>(await organizerApiGet(page, `/api/organizer/stall/${target!.eventId}`));
    const stalls = mapBody.data?.stalls.flatMap((zone) => zone.stalls) ?? [];
    const event = mapBody.data!.event;
    expect(stalls).toHaveLength(event.totalStallCount);
    expect(event.selectedStallCount + event.availableStallCount).toBe(event.totalStallCount);

    const selected = stalls.find((stall) => stall.selectedApplicationId != null);
    const available = stalls.find((stall) => stall.selectedApplicationId == null);
    expect(selected, '測試活動應有已選攤位').toBeTruthy();
    expect(available, '測試活動應有未選攤位').toBeTruthy();

    const stallSearch = await expectApiSuccess<{
      stalls: Array<{ stalls: Array<{ stallNo: string }> }>;
    }>(await organizerApiGet(
      page,
      `/api/organizer/stall/${target!.eventId}?keyword=${encodeURIComponent(selected!.stallNo)}`,
    ));
    expect(stallSearch.data?.stalls.flatMap((zone) => zone.stalls).map((stall) => stall.stallNo))
      .toContain(selected!.stallNo);

    const selectedDetail = await expectApiSuccess<{
      stall: { stallNo: string; status: string };
      vendor: { brandName: string | null; vendorOwnerName: string | null; vendorEmail: string | null } | null;
    }>(await organizerApiGet(
      page,
      `/api/organizer/stall/${target!.eventId}/${encodeURIComponent(selected!.stallNo)}?applyDate=${event.currentApplyDate}`,
    ));
    expect(selectedDetail.data?.stall.stallNo).toBe(selected!.stallNo);
    expect(selectedDetail.data?.vendor?.brandName).toBeTruthy();
    expect(selectedDetail.data?.vendor?.vendorOwnerName).toBeTruthy();

    const availableDetail = await expectApiSuccess<{
      vendor: unknown | null;
    }>(await organizerApiGet(
      page,
      `/api/organizer/stall/${target!.eventId}/${encodeURIComponent(available!.stallNo)}?applyDate=${event.currentApplyDate}`,
    ));
    expect(availableDetail.data?.vendor).toBeNull();

    const reloaded = await expectApiSuccess<{
      stalls: Array<{ stalls: Array<{ stallNo: string; selectedApplicationId: number | null }> }>;
    }>(await organizerApiGet(page, `/api/organizer/stall/${target!.eventId}?applyDate=${event.currentApplyDate}`));
    const persisted = reloaded.data?.stalls.flatMap((zone) => zone.stalls)
      .find((stall) => stall.stallNo === selected!.stallNo);
    expect(persisted?.selectedApplicationId).toBe(selected!.selectedApplicationId);
  });
});
