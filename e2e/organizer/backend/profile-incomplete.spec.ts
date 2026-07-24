import { expect, test } from '../../fixtures';
import {
  chooseDropdown,
  closeAlert,
  credentialsFor,
  desktopViewport,
  expectApiSuccess,
  loginAs,
  waitForApi,
} from './organizer-test-helpers';

test.use({ viewport: desktopViewport });

test('@organizer @profile-reset ORG-13 未完成 Profile 會阻擋功能，完成後解除', async ({ page }) => {
  test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');
  const credentials = credentialsFor('organizer')!;
  await loginAs(page, 'organizer');

  await expect(page.getByRole('heading', { name: /歡迎使用小集日主辦方後台/ })).toBeVisible();
  await page.goto('/organizer/dash-board/activity');
  await expect(page).toHaveURL('/organizer/dash-board/home');
  await expect(page.getByRole('heading', { name: '設定主辦方資料' })).toBeVisible();

  await page.getByRole('button', { name: '前往設定' }).click();
  const dialog = page.locator('.organizer-profile-modal');
  await dialog.locator('input[name="organizerName"]').fill('沐日市集企劃工作室');
  await dialog.locator('input[name="contactName"]').fill('林沐晴');
  await dialog.locator('input[name="contactPhone"]').fill('0928613745');
  await dialog.locator('input[name="contactEmail"]').fill(credentials.email);
  await dialog.locator('input[name="companyName"]').fill('沐日整合行銷有限公司');
  await dialog.locator('input[name="taxId"]').fill('');
  await chooseDropdown(dialog.locator('app-dropdown').nth(0), '台北市');
  await chooseDropdown(dialog.locator('app-dropdown').nth(1), '中正區');
  await dialog.locator('input[name="address"]').fill('八德路一段 1 號');
  await dialog.locator('input[name="weekday週一"]').check();
  await dialog.locator('input[name="weekday週二"]').check();
  await dialog.locator('input[name="weekday週三"]').check();
  await dialog.locator('input[name="weekday週四"]').check();
  await dialog.locator('input[name="weekday週五"]').check();
  await dialog.locator('input[name="serviceStartTime"]').fill('09:00');
  await dialog.locator('input[name="serviceEndTime"]').fill('18:00');

  const savePromise = waitForApi(page, '/api/organizer/profile/save', 'POST');
  await dialog.getByRole('button', { name: '儲存', exact: true }).click();
  await expectApiSuccess(await savePromise);
  await closeAlert(page, '主辦方資料已儲存', '確定');

  const eventsPromise = waitForApi(page, '/api/organizer/events/search', 'GET');
  await page.goto('/organizer/dash-board/activity');
  await expectApiSuccess(await eventsPromise);
  await expect(page).toHaveURL('/organizer/dash-board/activity');
});
