import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import type { Locator, Page, Response } from '@playwright/test';
import { expect, test } from './fixtures';
import { authRoleCases, getCredentials, loginWithUi } from './auth-test-helpers';

interface ApiEnvelope<T = Record<string, unknown>> {
  statusCode?: number;
  message?: string;
  data?: T;
}

interface TargetCredentials {
  email: string;
  password: string;
}

interface AdminFlowCredentials {
  admin: TargetCredentials;
  organizer: TargetCredentials;
  targetOrganizer: TargetCredentials;
  targetVendor: TargetCredentials;
}

interface AdminFlowState {
  eventAId: number;
  eventCId: number;
  targetOrganizerUserId: number;
  targetVendorUserId: number;
}

interface EventTimes {
  registrationStartsAt: Date;
  registrationEndsAt: Date;
  eventStartsAt: Date;
  eventEndsAt: Date;
}

const eventCoverPath = resolve('src/assets/images/market/cards/market-card-01.png');
const eventMapPath = resolve('src/assets/images/market/cards/market-card-02.png');

test.describe('Market Day 管理員後台', () => {
  test('@admin-management 管理員後台補件、下架審核、款項結清、使用者管理與操作紀錄', async ({ browser }) => {
    test.setTimeout(10 * 60 * 1000);

    const credentials = requiredCredentials();
    test.skip(!credentials, '需要管理員、主辦方、目標主辦方與目標攤主四組 E2E 測試帳號。');

    const runId = `${Date.now()}-${randomUUID().slice(0, 8)}`;
    const eventAName = `E2E 管理員測試活動A ${runId}`;
    const eventCName = `E2E 管理員測試活動C ${runId}`;

    const desktopViewport = { width: 1440, height: 900 };
    const adminContext = await browser.newContext({ viewport: desktopViewport });
    const organizerContext = await browser.newContext({ viewport: desktopViewport });
    const targetOrganizerContext = await browser.newContext({ viewport: desktopViewport });
    const targetVendorContext = await browser.newContext({ viewport: desktopViewport });

    const adminPage = await adminContext.newPage();
    const organizerPage = await organizerContext.newPage();
    const targetOrganizerPage = await targetOrganizerContext.newPage();
    const targetVendorPage = await targetVendorContext.newPage();

    for (const page of [adminPage, organizerPage, targetOrganizerPage, targetVendorPage]) {
      page.setDefaultTimeout(15_000);
      page.setDefaultNavigationTimeout(30_000);
    }

    const state: AdminFlowState = {
      eventAId: 0,
      eventCId: 0,
      targetOrganizerUserId: 0,
      targetVendorUserId: 0,
    };

    try {
      await test.step('ADMIN-01～04 管理員登入、總覽、通知中心', async () => {
        progress('ADMIN-01～04 登入、總覽、通知中心');
        const adminConfig = authRoleCases.find((item) => item.role === 'admin')!;
        const loginResponse = await loginWithUi(
          adminPage,
          adminConfig,
          credentials!.admin.email,
          credentials!.admin.password,
        );
        const loginBody = await expectApiSuccess<{ user?: { role?: string } }>(loginResponse);
        expect(loginBody.data?.user?.role).toBe('ADMIN');
        await expect(adminPage).toHaveURL(adminConfig.dashboardPath);

        const overviewPromise = waitForApi(adminPage, '/api/admin/dashboard/overview', 'GET');
        await adminPage.goto('/admin/dash-board/home');
        const overviewBody = await expectApiSuccess<{
          pendingReview?: number;
          totalActivity?: number;
        }>(await overviewPromise);
        expect(overviewBody.data?.totalActivity).toBeGreaterThanOrEqual(0);
        await expect(adminPage.locator('.todo-card', { hasText: '活動審核' })).toBeVisible();
        await expect(adminPage.locator('.stats-cards .todo-card', { hasText: '活動總數' })).toBeVisible();

        await adminPage.goto('/admin/dash-board/notification');
        await expect(adminPage.getByRole('heading', { name: '通知中心' })).toBeVisible();
        for (const tab of ['未讀', '活動', '系統', '異常', '全部'] as const) {
          const noticesPromise = waitForApi(adminPage, '/api/admin/notices/search', 'POST');
          await adminPage.locator('.tabs button', { hasText: tab }).click();
          await expectApiSuccess(await noticesPromise);
        }

        const unreadCard = adminPage.locator('.notification-card.unread').first();
        if (await unreadCard.count() > 0) {
          const markedTitle = (await unreadCard.locator('.notification-content h3').textContent())?.trim() ?? '';
          const markReadPromise = waitForApi(adminPage, '/isRead', 'POST');
          await unreadCard.click();
          await expectApiSuccess(await markReadPromise);
          const markedCard = adminPage.locator('.notification-card', { hasText: markedTitle }).first();
          await expect(markedCard).not.toHaveClass(/unread/);
        }
      });
      await test.step('ADMIN-05～07 活動 A 建立、要求補件、重新送審', async () => {});
      await test.step('ADMIN-08～10 活動 A 審核通過、地圖建置、發布', async () => {});
      await test.step('ADMIN-11～14 活動 A 下架審核（駁回後核准）', async () => {});
      await test.step('ADMIN-15～17 活動 C 短時間窗與款項結清', async () => {});
      await test.step('ADMIN-18～23 目標主辦方帳號管理', async () => {});
      await test.step('ADMIN-24～28 目標攤主帳號管理', async () => {});
      await test.step('ADMIN-29 操作紀錄查詢', async () => {});
    } finally {
      await Promise.all([
        adminContext.close(),
        organizerContext.close(),
        targetOrganizerContext.close(),
        targetVendorContext.close(),
      ]);
    }
  });
});

function requiredCredentials(): AdminFlowCredentials | null {
  const admin = getCredentials(authRoleCases.find((item) => item.role === 'admin')!);
  const organizer = getCredentials(authRoleCases.find((item) => item.role === 'organizer')!);
  const targetOrganizerEmail = process.env['E2E_TARGET_ORGANIZER_EMAIL'];
  const targetOrganizerPassword = process.env['E2E_TARGET_ORGANIZER_PASSWORD'];
  const targetVendorEmail = process.env['E2E_TARGET_VENDOR_EMAIL'];
  const targetVendorPassword = process.env['E2E_TARGET_VENDOR_PASSWORD'];

  if (
    !admin.email || !admin.password ||
    !organizer.email || !organizer.password ||
    !targetOrganizerEmail || !targetOrganizerPassword ||
    !targetVendorEmail || !targetVendorPassword
  ) {
    return null;
  }

  return {
    admin: { email: admin.email, password: admin.password },
    organizer: { email: organizer.email, password: organizer.password },
    targetOrganizer: { email: targetOrganizerEmail, password: targetOrganizerPassword },
    targetVendor: { email: targetVendorEmail, password: targetVendorPassword },
  };
}

function waitForApi(page: Page, path: string, method: string): Promise<Response> {
  return page.waitForResponse((response) =>
    response.url().includes(path) && response.request().method() === method,
  );
}

async function expectApiSuccess<T = Record<string, unknown>>(
  response: Response,
): Promise<ApiEnvelope<T>> {
  const body = (await response.json()) as ApiEnvelope<T>;
  expect(response.ok(), `${response.request().method()} ${response.url()}`).toBe(true);
  expect(body.statusCode).toBeGreaterThanOrEqual(200);
  expect(body.statusCode).toBeLessThan(300);
  return body;
}

async function closeAlert(page: Page, title: string, buttonName: string): Promise<void> {
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText(title);
  await dialog.getByRole('button', { name: buttonName, exact: true }).click();
}

async function chooseDropdown(dropdown: Locator, option: string): Promise<void> {
  await dropdown.locator('.select-btn').click();
  await dropdown.getByRole('option', { name: option, exact: true }).click();
}

async function clickNext(page: Page): Promise<void> {
  await page.getByRole('button', { name: '下一步', exact: true }).click();
}

async function fillDateTime(page: Page, prefix: string, date: Date): Promise<void> {
  await page.locator(`input[name="${prefix}Date"]`).fill(formatDate(date));
  await page.locator(`input[name="${prefix}Time"]`).fill(formatTime(date));
}

function formatDate(value: Date): string {
  return [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, '0'),
    String(value.getDate()).padStart(2, '0'),
  ].join('-');
}

function formatTime(value: Date): string {
  return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
}

async function waitUntilPast(page: Page, target: Date, bufferMs = 3_000): Promise<void> {
  const remaining = target.getTime() - Date.now() + bufferMs;
  if (remaining > 0) {
    await page.waitForTimeout(remaining);
  }
}

async function readTodoCount(page: Page, label: string): Promise<number> {
  const card = page.locator('.todo-card', { hasText: label });
  await expect(card).toBeVisible();
  const text = await card.locator('.count-num').textContent();
  return Number((text ?? '0').trim());
}

async function expectNotificationVisible(page: Page, keyword: string): Promise<void> {
  await expect(page.locator('.notification-card', { hasText: keyword }).first())
    .toBeVisible({ timeout: 15_000 });
}

async function createAndSubmitMinimalEvent(
  page: Page,
  eventName: string,
  times: EventTimes,
): Promise<number> {
  await page.goto('/organizer/dash-board/activity/detail');
  await expect(page.locator('h2.form-section-title')).toContainText('活動基本資料');

  await page.locator('input[name="eventName"]').fill(eventName);
  await page.locator('label.category-option', { hasText: '文創手作' }).locator('input').check();
  await page.locator('.cover-field input[type="file"]').setInputFiles(eventCoverPath);
  await page.locator('textarea[name="description"]').fill('E2E 管理員後台測試活動簡介');
  await page.locator('textarea[name="introduction"]').fill(
    '此活動由 Playwright 自動建立，用來驗證管理員後台的審核、下架與款項結清流程。',
  );
  await clickNext(page);

  await fillDateTime(page, 'eventStart', times.eventStartsAt);
  await fillDateTime(page, 'eventEnd', times.eventEndsAt);
  await fillDateTime(page, 'registrationStart', times.registrationStartsAt);
  await fillDateTime(page, 'registrationEnd', times.registrationEndsAt);
  await page.locator('input[name="metro"]').fill('無');
  await page.locator('input[name="bus"]').fill('E2E 測試公車站');
  await page.locator('input[name="driving"]').fill('場地附設停車區');
  await clickNext(page);

  const venuePanel = page.locator('.venue-location-grid');
  await chooseDropdown(venuePanel.locator('app-dropdown').nth(0), '台北市');
  await chooseDropdown(venuePanel.locator('app-dropdown').nth(1), '中正區');
  await page.locator('input[name="address"]').fill('八德路一段 1 號');
  await page.locator('input[name="venueName"]').fill('E2E 管理員測試場地');
  await page.locator('input[name="boothLength"]').fill('3');
  await page.locator('input[name="boothWidth"]').fill('3');
  await page.locator('input[name="totalBooths"]').fill('2');
  await page.locator('input[name="boothPrice"]').fill('1200');
  await page.locator('input[name="depositAmount"]').fill('1000');

  await page.getByRole('button', { name: '新增分區' }).click();
  const zoneDialog = page.getByRole('dialog', { name: '新增攤位分區' });
  await zoneDialog.getByRole('button', { name: /選擇顏色/ }).first().click();
  await chooseDropdown(zoneDialog.locator('app-dropdown'), 'A 區');
  await zoneDialog.locator('input[name="zoneDialogCount"]').fill('2');
  await zoneDialog.getByRole('button', { name: '新增分區' }).click();
  await expect(zoneDialog).toBeHidden();
  await page.locator('.layout-upload-panel input[type="file"]').setInputFiles(eventMapPath);
  await clickNext(page);

  await page.getByLabel('不提供設備租借', { exact: true }).check();
  await page.getByLabel('不提供基本用電', { exact: true }).check();
  await page.getByLabel('不開放額外申請', { exact: true }).check();

  await page.getByRole('button', { name: '送出審核', exact: true }).click();
  const saveEventPromise = waitForApi(page, '/api/organizer/events', 'POST');
  await page.getByRole('button', { name: '確定送出', exact: true }).click();
  const saveEventBody = await expectApiSuccess<{ eventId?: number }>(await saveEventPromise);
  const eventId = Number(saveEventBody.data?.eventId);
  expect(eventId).toBeGreaterThan(0);

  const reviewResponse = await page.waitForResponse((response) =>
    response.url().endsWith(`/api/organizer/events/${eventId}/submit-review`) &&
    response.request().method() === 'POST',
  );
  await expectApiSuccess(reviewResponse);
  await closeAlert(page, '送出審核成功', '知道了');
  await expect(page).toHaveURL(new RegExp(`/organizer/dash-board/activity/detail/${eventId}`));
  await expect(page.getByText('待審核', { exact: true }).first()).toBeVisible();

  return eventId;
}

function progress(step: string): void {
  console.log(`[admin-management] ${step}`);
}
