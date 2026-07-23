import { expect, test } from '../../fixtures';
import { readStoredSession } from '../../auth-test-helpers';
import {
  credentialsFor,
  desktopViewport,
  expectApiSuccess,
  loginAs,
  waitForApi,
} from './organizer-test-helpers';

test.use({ viewport: desktopViewport });

test.describe('主辦方後台－首頁、導覽與權限', () => {
  test('@organizer ORG-01 主辦方可以登入後台', async ({ page }) => {
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');
    await loginAs(page, 'organizer');
    await expect(page.getByRole('heading', { name: /歡迎回來/ })).toBeVisible();
  });

  test('@organizer ORG-02 重新整理後仍維持登入狀態', async ({ page }) => {
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');
    await loginAs(page, 'organizer');
    const beforeReload = await readStoredSession(page, 'organizer');
    expect(beforeReload.token).toBeTruthy();

    await page.reload();
    await expect(page).toHaveURL('/organizer/dash-board/home');
    await expect(page.getByRole('heading', { name: /歡迎回來/ })).toBeVisible();
    const afterReload = await readStoredSession(page, 'organizer');
    expect(afterReload.token).toBe(beforeReload.token);
  });

  test('@organizer ORG-03 未登入不能直接進入主辦方後台', async ({ page }) => {
    await page.goto('/organizer/dash-board/home');
    await expect(page).toHaveURL(/\/organizer\/login/);
    await expect(page.getByRole('heading', { name: '主辦方登入' })).toBeVisible();
  });

  test('@organizer ORG-04 攤主與管理員登入狀態不能進入主辦方後台', async ({ browser }) => {
    for (const role of ['vendor', 'admin'] as const) {
      test.skip(!credentialsFor(role), `缺少 ${role} E2E 帳密。`);
      const context = await browser.newContext({ viewport: desktopViewport });
      const page = await context.newPage();
      try {
        await loginAs(page, role);
        await page.goto('/organizer/dash-board/home');
        await expect(page).not.toHaveURL('/organizer/dash-board/home');
        await expect(page.locator('app-organizer-dashboard-home')).toHaveCount(0);
      } finally {
        await context.close();
      }
    }
  });

  test('@organizer ORG-05 首頁統計與活動概況使用 Real API', async ({ page }) => {
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');
    await loginAs(page, 'organizer');

    const applicationsPromise = waitForApi(
      page,
      '/api/organizer/applications/search',
      'GET',
    );
    const eventsPromise = waitForApi(page, '/api/organizer/events/search', 'GET');
    await page.reload();
    await expectApiSuccess(await applicationsPromise);
    await expectApiSuccess(await eventsPromise);

    await expect(page.getByText('待審核報名', { exact: true })).toBeVisible();
    await expect(page.getByText('退款待確認', { exact: true })).toBeVisible();
    await expect(page.getByText('待完成選位', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '活動報名概況' })).toBeVisible();
  });

  test('@organizer ORG-06 首頁統計卡會帶入正確篩選條件', async ({ page }) => {
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');
    await loginAs(page, 'organizer');

    const cases = [
      { label: '待審核報名', path: '/organizer/dash-board/register', status: '待審核' },
      { label: '退款待確認', path: '/organizer/dash-board/collection', status: '退款申請中' },
      { label: '待完成選位', path: '/organizer/dash-board/register', status: '待選位' },
    ];
    for (const item of cases) {
      await page.goto('/organizer/dash-board/home');
      await page.locator('.todo-card', { hasText: item.label }).locator('.todo-link').click();
      await expect(page).toHaveURL(new RegExp(item.path.replaceAll('/', '\\/')));
      expect(new URL(page.url()).searchParams.get('status')).toBe(item.status);
    }
  });

  test('@organizer ORG-07 主辦方主要管理頁皆能使用 Real API 載入', async ({ page }) => {
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');
    await loginAs(page, 'organizer');

    const pages = [
      { path: '/organizer/dash-board/activity', api: '/api/organizer/events/search' },
      { path: '/organizer/dash-board/register', api: '/api/organizer/applications/search' },
      { path: '/organizer/dash-board/collection', api: '/api/organizer/payments/search' },
      { path: '/organizer/dash-board/stall', api: '/api/organizer/stalls/search' },
      { path: '/organizer/dash-board/equipment', api: '/api/organizer/equipment/search' },
      { path: '/organizer/dash-board/account', api: '/api/organizer/accounts/search' },
    ];

    for (const item of pages) {
      const responsePromise = waitForApi(page, item.api);
      await page.goto(item.path);
      await expectApiSuccess(await responsePromise);
      await expect(page).toHaveURL(item.path);
    }
  });
});
