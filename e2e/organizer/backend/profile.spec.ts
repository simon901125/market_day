import { expect, test } from '../../fixtures';
import {
  chooseDropdown,
  credentialsFor,
  desktopViewport,
  expectApiSuccess,
  loginAs,
  openOrganizerProfile,
  waitForApi,
} from './organizer-test-helpers';

test.use({ viewport: desktopViewport });

test.describe.serial('主辦方後台－主辦方資料', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');
    await loginAs(page, 'organizer');
  });

  test('@organizer ORG-14 主辦方資料會載入既有內容與地址選項', async ({ page }) => {
    const dialog = await openOrganizerProfile(page);
    await expect(dialog.locator('input[name="organizerName"]')).not.toHaveValue('');
    await expect(dialog.locator('app-dropdown')).toHaveCount(2);
    await dialog.getByRole('button', { name: '關閉主辦方資料' }).click();
  });

  test('@organizer ORG-15 錯誤欄位會阻止儲存', async ({ page }) => {
    const dialog = await openOrganizerProfile(page);
    await dialog.locator('input[name="organizerName"]').fill('');
    await dialog.locator('input[name="contactEmail"]').fill('invalid-email');
    await dialog.locator('input[name="serviceStartTime"]').fill('18:00');
    await dialog.locator('input[name="serviceEndTime"]').fill('09:00');
    await dialog.getByRole('button', { name: '儲存', exact: true }).click();

    await expect(dialog.locator('.field-error').first()).toBeVisible();
    await expect(dialog).toBeVisible();
  });

  test('@organizer ORG-16～18 儲存、重新載入並解除功能鎖定', async ({ page }) => {
    const credentials = credentialsFor('organizer')!;
    const organizerName = '沐日市集企劃工作室';
    const dialog = await openOrganizerProfile(page);

    await dialog.locator('input[name="organizerName"]').fill(organizerName);
    await dialog.locator('input[name="contactName"]').fill('林沐晴');
    await dialog.locator('input[name="contactPhone"]').fill('0928613745');
    await dialog.locator('input[name="contactEmail"]').fill(credentials.email);
    await dialog.locator('input[name="companyName"]').fill('沐日整合行銷有限公司');
    await dialog.locator('input[name="taxId"]').fill('');
    await chooseDropdown(dialog.locator('app-dropdown').nth(0), '台北市');
    await chooseDropdown(dialog.locator('app-dropdown').nth(1), '中正區');
    await dialog.locator('input[name="address"]').fill('八德路一段 1 號');

    const monday = dialog.locator('input[name="weekday週一"]');
    if (!(await monday.isChecked())) await monday.check();
    await dialog.locator('input[name="serviceStartTime"]').fill('09:00');
    await dialog.locator('input[name="serviceEndTime"]').fill('18:00');

    const savePromise = waitForApi(page, '/api/organizer/profile/save', 'POST');
    await dialog.getByRole('button', { name: '儲存', exact: true }).click();
    await expectApiSuccess(await savePromise);
    await expect(page.getByRole('dialog')).toContainText('主辦方資料已儲存');
    await page.getByRole('dialog').getByRole('button', { name: '確定' }).click();

    const reloadedDialog = await openOrganizerProfile(page);
    await expect(reloadedDialog.locator('input[name="organizerName"]')).toHaveValue(organizerName);
    await reloadedDialog.getByRole('button', { name: '關閉主辦方資料' }).click();

    const eventsPromise = waitForApi(page, '/api/organizer/events/search', 'GET');
    await page.goto('/organizer/dash-board/activity');
    await expectApiSuccess(await eventsPromise);
    await expect(page).toHaveURL('/organizer/dash-board/activity');
  });
});
