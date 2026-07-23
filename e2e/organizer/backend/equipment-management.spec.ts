import { expect, test } from '../../fixtures';
import {
  chooseDropdown,
  credentialsFor,
  desktopViewport,
  expectApiSuccess,
  expectNonEmptyDownload,
  loginAs,
  organizerApiGet,
  organizerApiGetAllEventItems,
  waitForApi,
} from './organizer-test-helpers';

test.use({ viewport: desktopViewport });

test.describe('主辦方後台－設備管理', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');
    await loginAs(page, 'organizer');
  });

  test('@organizer ORG-61 設備活動搜尋使用 Real API', async ({ page }) => {
    const initialPromise = waitForApi(page, '/api/organizer/equipment/search', 'GET');
    await page.goto('/organizer/dash-board/equipment');
    await expectApiSuccess(await initialPromise);
    await expect(page.getByRole('heading', { name: '設備管理' })).toBeVisible();

    await page.getByPlaceholder('搜尋活動名稱').fill('日光');
    const searchPromise = waitForApi(page, '/api/organizer/equipment/search', 'GET');
    await page.getByRole('button', { name: '搜尋', exact: true }).click();
    const searchResponse = await searchPromise;
    await expectApiSuccess(searchResponse);
    expect(new URL(searchResponse.url()).searchParams.get('eventTitle')).toBe('日光');

    const statusPromise = waitForApi(page, '/api/organizer/equipment/search', 'GET');
    await chooseDropdown(page.locator('app-dropdown').first(), '品牌已公開');
    const statusResponse = await statusPromise;
    await expectApiSuccess(statusResponse);
    expect(new URL(statusResponse.url()).searchParams.get('status')).toBe('brandsPublished');

    const datePromise = waitForApi(page, '/api/organizer/equipment/search', 'GET');
    await page.goto('/organizer/dash-board/equipment?startDate=2026-07-01&endDate=2026-07-31');
    const dateResponse = await datePromise;
    await expectApiSuccess(dateResponse);
    expect(new URL(dateResponse.url()).searchParams.get('event_start_at')).toBe('2026-07-01');
    expect(new URL(dateResponse.url()).searchParams.get('event_end_at')).toBe('2026-07-31');
  });

  test('@organizer ORG-62～65 設備總覽、明細與報表下載', async ({ page }) => {
    const listPromise = waitForApi(page, '/api/organizer/equipment/search', 'GET');
    await page.goto('/organizer/dash-board/equipment');
    await expectApiSuccess(await listPromise);

    const firstRow = page.locator('tbody tr[role="link"]').first();
    test.skip((await firstRow.count()) === 0, '目前沒有可驗證的設備活動。');
    const detailPromise = waitForApi(page, /\/api\/organizer\/equipment\/\d+\?/, 'GET');
    await firstRow.click();
    await expectApiSuccess(await detailPromise);

    await expect(page.getByRole('heading', { name: '設備詳情' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '設備總覽' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '租借設備管理' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '額外用電管理' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '車牌管理' })).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: '下載設備報表' }).click();
    await expectNonEmptyDownload(await downloadPromise);
  });

  test('@organizer ORG-62～64 設備總覽與三類明細使用 Real API 交叉驗證', async ({ page }) => {
    const events = await organizerApiGetAllEventItems<{
      eventId: number;
      registeredStallCount: number;
    }>(page, '/api/organizer/equipment/search');
    const target = events
      .find((event) => event.registeredStallCount > 0);
    test.skip(!target, '目前沒有包含報名資料的主辦方活動。');

    const detailBody = await expectApiSuccess<{
      equipmentOverview: Record<string, number>;
      eventEquipments: Array<Record<string, unknown>>;
      basicPowers: Array<Record<string, unknown>>;
      extraPowers: Array<Record<string, unknown>>;
      equipmentRentalManagement: { items: Array<Record<string, unknown>>; totalItems: number };
      extraPowerManagement: { items: Array<Record<string, unknown>>; totalItems: number };
      vehicleManagement: { items: Array<Record<string, unknown>>; totalItems: number };
      vehicleRegistrationStatistics: Record<string, number>;
    }>(await organizerApiGet(
      page,
      `/api/organizer/equipment/${target!.eventId}?equipmentRentalPage=1&equipmentRentalPageSize=100&extraPowerPage=1&extraPowerPageSize=100&vehiclePage=1&vehiclePageSize=100`,
    ));
    const data = detailBody.data!;
    const overviewKeys = [
      'registeredStallCount', 'basicEquipmentCount', 'basicPowerCount',
      'equipmentRentalCount', 'extraPowerCount', 'vehicleRegistrationCount',
    ];
    for (const key of overviewKeys) {
      expect(Number(data.equipmentOverview[key]), `${key} 必須是非負整數`).toBeGreaterThanOrEqual(0);
    }
    expect(data.equipmentOverview['registeredStallCount']).toBe(target!.registeredStallCount);
    expect(data.vehicleManagement.items).toHaveLength(data.vehicleManagement.totalItems);
    expect(data.equipmentRentalManagement.items).toHaveLength(data.equipmentRentalManagement.totalItems);
    expect(data.extraPowerManagement.items).toHaveLength(data.extraPowerManagement.totalItems);
    expect(data.equipmentOverview['vehicleRegistrationCount']).toBe(data.vehicleManagement.totalItems);
    expect(data.vehicleRegistrationStatistics['registeredCount']).toBe(data.vehicleManagement.totalItems);

    for (const row of [
      ...data.equipmentRentalManagement.items,
      ...data.extraPowerManagement.items,
      ...data.vehicleManagement.items,
    ]) {
      expect(String(row['brandName'] ?? '').trim(), '設備明細必須帶回品牌名稱').not.toBe('');
      expect(row, '設備明細必須包含攤位編號欄位，尚未選位時值可以是 null')
        .toHaveProperty('stallNo');
    }
  });
});
