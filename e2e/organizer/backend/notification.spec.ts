import { expect, test } from '../../fixtures';
import {
  credentialsFor,
  desktopViewport,
  expectApiSuccess,
  loginAs,
  waitForApi,
} from './organizer-test-helpers';

test.use({ viewport: desktopViewport });

test.describe('主辦方後台－通知中心', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const organizerCredentials = credentialsFor('organizer');
    test.skip(!organizerCredentials, '缺少主辦方 E2E 帳密。');

    if (testInfo.title.includes('ORG-12')) {
      const emptyAccountEmail = process.env['E2E_EMPTY_ORGANIZER_EMAIL'];
      test.skip(!emptyAccountEmail, '缺少 E2E_EMPTY_ORGANIZER_EMAIL。');
      await loginAs(page, 'organizer', {
        email: emptyAccountEmail!,
        password: organizerCredentials!.password,
      });
      return;
    }

    await loginAs(page, 'organizer', organizerCredentials!);
  });

  test('@organizer ORG-08 通知列表由 Real API 載入', async ({ page }) => {
    const responsePromise = waitForApi(page, '/api/organizer/notices', 'GET');
    await page.goto('/organizer/dash-board/notification');
    await expectApiSuccess(await responsePromise);

    await expect(page.getByRole('heading', { name: '通知中心' })).toBeVisible();
    const notificationCount = await page.locator('.notification-card').count();
    if (notificationCount === 0) {
      await expect(page.getByRole('status')).toBeVisible();
    }
  });

  test('@organizer ORG-09 可以切換全部與未讀通知', async ({ page }) => {
    const initialPromise = waitForApi(page, '/api/organizer/notices', 'GET');
    await page.goto('/organizer/dash-board/notification');
    await expectApiSuccess(await initialPromise);

    const unreadPromise = waitForApi(page, /\/api\/organizer\/notices\?.*filter=.*%E6%9C%AA%E8%AE%80/, 'GET');
    await page.getByRole('button', { name: '未讀', exact: true }).click();
    await expectApiSuccess(await unreadPromise);
    await expect(page.getByRole('button', { name: '未讀', exact: true })).toHaveClass(/active/);

    const allPromise = waitForApi(page, /\/api\/organizer\/notices\?.*filter=.*%E5%85%A8%E9%83%A8/, 'GET');
    await page.getByRole('button', { name: '全部', exact: true }).click();
    await expectApiSuccess(await allPromise);
  });

  test('@organizer ORG-10 點擊未讀通知會送出已讀 API', async ({ page }) => {
    const listPromise = waitForApi(page, '/api/organizer/notices', 'GET');
    await page.goto('/organizer/dash-board/notification');
    await expectApiSuccess(await listPromise);

    const cards = page.locator('.notification-card');
    let unreadIndex = -1;
    for (let index = 0; index < await cards.count(); index += 1) {
      if ((await cards.nth(index).getAttribute('class'))?.includes('unread')) {
        unreadIndex = index;
        break;
      }
    }
    test.skip(unreadIndex < 0, '目前沒有可標記的未讀通知。');
    const unreadCard = cards.nth(unreadIndex);

    const readPromise = waitForApi(page, /\/api\/notification\/\d+\/isRead$/, 'POST');
    await unreadCard.click();
    await expectApiSuccess(await readPromise);
    await expect(unreadCard).not.toHaveClass(/unread/);
  });

  test('@organizer ORG-12 無通知結果會顯示空狀態', async ({ page }) => {
    const responsePromise = waitForApi(page, '/api/organizer/notices', 'GET');
    await page.goto('/organizer/dash-board/notification');
    await expectApiSuccess(await responsePromise);

    await expect(page.locator('.notification-card')).toHaveCount(0);
    await expect(page.locator('.notification-empty-state')).toBeVisible();
  });
});
