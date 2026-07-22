import { expect, test } from '../../fixtures';
import {
  chooseDropdown,
  closeAlert,
  credentialsFor,
  desktopViewport,
  expectApiSuccess,
  fillCompleteOrganizerEvent,
  loginAs,
  uniqueLabel,
  waitForApi,
} from './organizer-test-helpers';

test.use({ viewport: desktopViewport });

test.describe('主辦方後台－活動管理', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');
    await loginAs(page, 'organizer');
  });

  test('@organizer ORG-28～32 活動送審、撤回、核准、發布與申請下架', async ({ page, browser }) => {
    test.setTimeout(2 * 60 * 1000);
    test.skip(!credentialsFor('admin'), '跨角色活動流程需要管理員 E2E 帳密。');

    const eventName = uniqueLabel('小日子生活市集・秋日手作場').toUpperCase();
    await page.goto('/organizer/dash-board/activity/detail');
    await fillCompleteOrganizerEvent(page, eventName);

    const createPromise = waitForApi(page, '/api/organizer/events', 'POST');
    const firstReviewPromise = waitForApi(page, /\/api\/organizer\/events\/\d+\/submit-review/, 'POST');
    await page.getByRole('button', { name: '送出審核', exact: true }).click();
    await page.getByRole('button', { name: '確定送出', exact: true }).click();
    const createBody = await expectApiSuccess(await createPromise);
    await expectApiSuccess(await firstReviewPromise);
    const eventId = Number((createBody.data as { eventId?: number } | undefined)?.eventId);
    expect(eventId).toBeGreaterThan(0);
    await closeAlert(page, '送出審核成功', '知道了');
    await expect(page.getByText('待審核', { exact: true }).first()).toBeVisible();

    await page.getByRole('button', { name: '撤回申請', exact: true }).click();
    const withdrawPromise = waitForApi(page, `/api/organizer/events/${eventId}/withdraw`, 'POST');
    await page.getByRole('button', { name: '確定撤回申請', exact: true }).click();
    await expectApiSuccess(await withdrawPromise);
    await closeAlert(page, '撤回申請成功', '知道了');
    await expect(page.getByRole('button', { name: '送出審核', exact: true })).toBeVisible();

    await page.getByRole('button', { name: '送出審核', exact: true }).click();
    const secondReviewPromise = waitForApi(page, `/api/organizer/events/${eventId}/submit-review`, 'POST');
    await page.getByRole('button', { name: '確定送出', exact: true }).click();
    await expectApiSuccess(await secondReviewPromise);
    await closeAlert(page, '送出審核成功', '知道了');

    const adminContext = await browser.newContext({ viewport: desktopViewport });
    const adminPage = await adminContext.newPage();
    try {
      await loginAs(adminPage, 'admin');
      await adminPage.goto(`/admin/dash-board/activity/detail/${eventId}`);
      await expect(adminPage.getByRole('heading', { name: eventName })).toBeVisible();

      await adminPage.locator('.header-actions button', { hasText: '審核通過' }).click();
      const approvePromise = waitForApi(adminPage, `/api/admin/events/${eventId}/approve`, 'POST');
      await adminPage.getByRole('button', { name: '確認送出', exact: true }).click();
      await expectApiSuccess(await approvePromise);
      await closeAlert(adminPage, '審核通過', '確定');

      await adminPage.locator('.header-actions button', { hasText: '地圖建置完成' }).click();
      const mapPromise = waitForApi(adminPage, `/api/admin/events/${eventId}/map-complete`, 'POST');
      await adminPage.getByRole('button', { name: '確認送出', exact: true }).click();
      await expectApiSuccess(await mapPromise);
      await closeAlert(adminPage, '地圖建置已送出', '確定');
    } finally {
      await adminContext.close();
    }

    await page.goto(`/organizer/dash-board/activity/detail/${eventId}`);
    await page.getByRole('button', { name: '發布活動', exact: true }).click();
    const publishPromise = waitForApi(page, `/api/organizer/events/${eventId}/publish`, 'POST');
    await page.getByRole('button', { name: '確定發布', exact: true }).click();
    await expectApiSuccess(await publishPromise);
    await closeAlert(page, '發布活動成功', '知道了');

    const publicContext = await browser.newContext({ viewport: desktopViewport });
    const publicPage = await publicContext.newPage();
    try {
      await publicPage.goto('/user/activity-list');
      await publicPage.getByPlaceholder('請輸入活動名稱或關鍵字').fill(eventName);
      const publicSearchPromise = waitForApi(publicPage, '/api/markets/search', 'POST');
      await publicPage.getByRole('button', { name: '搜尋', exact: true }).click();
      await expectApiSuccess(await publicSearchPromise);
      await expect(publicPage.locator('app-user-market-card', { hasText: eventName })).toBeVisible();
    } finally {
      await publicContext.close();
    }

    await page.getByRole('button', { name: '下架活動', exact: true }).click();
    const reasonDialog = page.getByRole('dialog');
    await reasonDialog.locator('#requiredReason').fill('活動內容與場地資訊需重新確認，申請暫時下架調整。');
    await reasonDialog.getByRole('button', { name: '下一步', exact: true }).click();
    const unpublishPromise = waitForApi(page, `/api/organizer/events/${eventId}/unpublish-request`, 'POST');
    await page.getByRole('button', { name: '確認送出', exact: true }).click();
    await expectApiSuccess(await unpublishPromise);
    await closeAlert(page, '下架申請已送出', '知道了');
    await expect(page.getByText('下架申請中', { exact: true }).first()).toBeVisible();
  });

  test('@organizer ORG-22 不完整資料可儲存草稿但不能送審', async ({ page }) => {
    const eventName = uniqueLabel('暖光生活市集・籌備草稿');

    await page.goto('/organizer/dash-board/activity/detail');
    await page.locator('input[name="eventName"]').fill(eventName);

    await page.getByRole('button', { name: '儲存草稿', exact: true }).click();
    const incompleteDialog = page.getByRole('dialog');
    await expect(incompleteDialog).toContainText('尚有必填資料未完成');
    const createPromise = waitForApi(page, '/api/organizer/events', 'POST');
    await incompleteDialog.getByRole('button', { name: '儲存草稿', exact: true }).click();
    const createResponse = await createPromise;
    if (!createResponse.ok()) {
      throw new Error(`儲存不完整草稿失敗：HTTP ${createResponse.status()} ${await createResponse.text()}`);
    }
    const createBody = await expectApiSuccess(createResponse);
    const eventId = Number((createBody.data as { eventId?: number } | undefined)?.eventId);
    expect(eventId).toBeGreaterThan(0);
    await closeAlert(page, '儲存草稿成功', '知道了');
    await expect(page).toHaveURL(new RegExp(`/organizer/dash-board/activity/detail/${eventId}`));

    await page.getByRole('button', { name: '送出審核', exact: true }).click();
    await closeAlert(page, '無法送出審核', '確定');

    await page.goto(`/organizer/dash-board/activity/detail/${eventId}`);
    await page.getByRole('button', { name: '刪除', exact: true }).click();
    const deleteDialog = page.getByRole('dialog');
    const deletePromise = waitForApi(page, `/api/organizer/events/${eventId}`, 'DELETE');
    await deleteDialog.getByRole('button', { name: '確定刪除', exact: true }).click();
    await expectApiSuccess(await deletePromise);
    await closeAlert(page, '活動已刪除', '知道了');
  });

  test('@organizer ORG-21 ORG-23 ORG-24 ORG-25 ORG-26 ORG-27 ORG-33 活動草稿完整生命週期', async ({ page }) => {
    const originalName = uniqueLabel('巷弄好物生活節・週末限定場').toUpperCase();
    const editedName = `${originalName} 已編輯`;

    await page.goto('/organizer/dash-board/activity/detail');
    await expect(page.getByRole('heading', { name: '建立活動' })).toBeVisible();
    await fillCompleteOrganizerEvent(page, originalName);

    const createPromise = waitForApi(page, '/api/organizer/events', 'POST');
    await page.getByRole('button', { name: '儲存草稿', exact: true }).click();
    await expectApiSuccess(await createPromise);
    await closeAlert(page, '儲存草稿成功', '知道了');
    await expect(page).toHaveURL(/\/organizer\/dash-board\/activity\/detail\/\d+/);
    const eventId = page.url().match(/detail\/(\d+)/)?.[1];
    expect(eventId, '儲存草稿後 URL 應包含活動 ID').toBeTruthy();
    await expect(page.locator('.detail-readonly-content input[type="text"]').first()).toHaveValue(originalName);
    await expect(page.locator('.cover-preview-frame img')).toBeVisible();
    await page.getByRole('button', { name: /4 活動設備與用電設定/ }).click();
    await expect(page.getByText('六尺木紋展示桌', { exact: true })).toBeVisible();
    await expect(page.getByText(/110V.*500/).first()).toBeVisible();
    await expect(page.getByText('高功率餐飲設備用電', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '編輯', exact: true })).toBeVisible();

    const loadEditPromise = waitForApi(page, `/api/organizer/events/${eventId}`, 'GET');
    await page.getByRole('button', { name: '編輯', exact: true }).click();
    await expectApiSuccess(await loadEditPromise);
    await expect(page).toHaveURL(new RegExp(`detail\\?edit=${eventId}`));
    const eventNameInput = page.locator('input[name="eventName"]');
    await expect(eventNameInput).toHaveValue(originalName);
    await eventNameInput.fill(editedName);

    await page.getByRole('button', { name: '取消', exact: true }).click();
    const unsavedDialog = page.getByRole('dialog');
    await expect(unsavedDialog).toContainText('尚有未儲存的變更');
    await unsavedDialog.getByRole('button', { name: '取消', exact: true }).click();
    await expect(eventNameInput).toHaveValue(editedName);

    const updatePromise = waitForApi(page, '/api/organizer/events', 'POST');
    await page.getByRole('button', { name: '儲存草稿', exact: true }).click();
    await expectApiSuccess(await updatePromise);
    await closeAlert(page, '儲存草稿成功', '知道了');
    await expect(page).toHaveURL(new RegExp(`detail/${eventId}`));
    await expect(page.locator('.detail-readonly-content input[type="text"]').first()).toHaveValue(editedName);

    const reopenEditPromise = waitForApi(page, `/api/organizer/events/${eventId}`, 'GET');
    await page.getByRole('button', { name: '編輯', exact: true }).click();
    await expectApiSuccess(await reopenEditPromise);
    await page.locator('input[name="eventName"]').fill(`${editedName} 未儲存`);
    await page.getByRole('button', { name: '取消', exact: true }).click();
    const leaveDialog = page.getByRole('dialog');
    await expect(leaveDialog).toContainText('尚有未儲存的變更');
    await leaveDialog.getByRole('button', { name: '確定離開', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`detail/${eventId}`));
    await expect(page.locator('.detail-readonly-content input[type="text"]').first()).toHaveValue(editedName);

    await page.getByRole('button', { name: '刪除', exact: true }).click();
    const deleteDialog = page.getByRole('dialog');
    await expect(deleteDialog).toContainText(editedName);
    const deletePromise = waitForApi(page, `/api/organizer/events/${eventId}`, 'DELETE');
    await deleteDialog.getByRole('button', { name: '確定刪除', exact: true }).click();
    await expectApiSuccess(await deletePromise);
    await closeAlert(page, '活動已刪除', '知道了');
    await expect(page).toHaveURL(/\/organizer\/dash-board\/activity(?:\?|$)/);
  });

  test('@organizer ORG-19 活動名稱、狀態與日期搜尋使用 Real API', async ({ page }) => {
    const initialPromise = waitForApi(page, '/api/organizer/events/search', 'GET');
    await page.goto('/organizer/dash-board/activity');
    await expectApiSuccess(await initialPromise);
    await expect(page.getByRole('heading', { name: '活動管理' })).toBeVisible();

    const keyword = uniqueLabel('不存在活動');
    await page.getByPlaceholder('請輸入活動名稱').fill(keyword);
    const searchPromise = waitForApi(page, '/api/organizer/events/search', 'GET');
    await page.getByRole('button', { name: '搜尋', exact: true }).click();
    const searchResponse = await searchPromise;
    await expectApiSuccess(searchResponse);
    expect(new URL(searchResponse.url()).searchParams.get('keyword')).toBe(keyword);
    await expect(page.locator('.table-empty-state')).toBeVisible();

    const statusPromise = waitForApi(page, '/api/organizer/events/search', 'GET');
    await chooseDropdown(page.locator('app-dropdown').first(), '草稿');
    const statusResponse = await statusPromise;
    await expectApiSuccess(statusResponse);
    expect(new URL(statusResponse.url()).searchParams.get('status')).toBe('DRAFT');

    const datePromise = waitForApi(page, '/api/organizer/events/search', 'GET');
    await page.goto('/organizer/dash-board/activity?startDate=2026-07-01&endDate=2026-07-31');
    const dateResponse = await datePromise;
    await expectApiSuccess(dateResponse);
    const dateQuery = new URL(dateResponse.url()).searchParams;
    expect(dateQuery.get('startDate')).toBe('2026-07-01');
    expect(dateQuery.get('endDate')).toBe('2026-07-31');
  });

  test('@organizer ORG-20 返回活動列表後保留查詢條件', async ({ page }) => {
    const responsePromise = waitForApi(page, '/api/organizer/events/search', 'GET');
    await page.goto('/organizer/dash-board/activity?keyword=%E6%97%A5%E5%85%89&startDate=2026-07-01&endDate=2026-07-31&page=1');
    await expectApiSuccess(await responsePromise);
    await expect(page.getByPlaceholder('請輸入活動名稱')).toHaveValue('日光');
    await expect(page.getByPlaceholder('開始日期')).toHaveValue('2026-07-01');
    await expect(page.getByPlaceholder('結束日期')).toHaveValue('2026-07-31');

    const firstRow = page.locator('tbody tr[role="link"]').first();
    await expect(firstRow).toBeVisible();
    const status = (await firstRow.locator('.status-badge').textContent())?.trim();
    expect(status, '活動列表第一筆應顯示狀態').toBeTruthy();
    const statusPromise = waitForApi(page, '/api/organizer/events/search', 'GET');
    await chooseDropdown(page.locator('app-dropdown').first(), status!);
    await expectApiSuccess(await statusPromise);
    await expect(firstRow).toBeVisible();
    const detailPromise = waitForApi(page, /\/api\/organizer\/events\/\d+$/, 'GET');
    await firstRow.click();
    await expectApiSuccess(await detailPromise);
    await page.getByRole('link', { name: '返回活動管理' }).click();

    await expect(page).toHaveURL(/keyword=%E6%97%A5%E5%85%89/);
    expect(new URL(page.url()).searchParams.get('status')).toBe(status);
    await expect(page).toHaveURL(/startDate=2026-07-01/);
    await expect(page).toHaveURL(/endDate=2026-07-31/);
    await expect(page).toHaveURL(/page=1/);
    await expect(page.getByPlaceholder('請輸入活動名稱')).toHaveValue('日光');
  });
});
