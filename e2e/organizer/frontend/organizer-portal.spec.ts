import { expect, test } from '../../fixtures';
import {
  credentialsFor,
  desktopViewport,
  loginAs,
} from '../backend/organizer-test-helpers';

test.describe('主辦方公開專區', () => {
  test('@organizer-portal ORG-Z01、ORG-Z02 公開首頁內容與圖片正常顯示', async ({ page }) => {
    await page.setViewportSize(desktopViewport);
    await page.goto('/organizer/home');

    await expect(page).toHaveURL(/\/organizer\/home$/);
    await expect(page.getByRole('heading', { name: /讓你的市集.*被更多攤主看見/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: '為什麼選擇小集日？' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '主辦方可以做什麼？' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '使用流程' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '常見問題' })).toBeVisible();
    await expect(page.locator('.feature-card')).toHaveCount(3);
    await expect(page.locator('.action-card')).toHaveCount(4);
    await expect(page.locator('.step-item')).toHaveCount(5);
    await expect(page.locator('.faq-list details')).toHaveCount(4);
    await expect(page.locator('.faq-list details').first()).toHaveAttribute('open', '');

    await page.locator('.faq-list details').nth(1).locator('summary').click();
    await expect(page.locator('.faq-list details').nth(1)).toHaveAttribute('open', '');

    await expect.poll(async () => page.locator('main img').evaluateAll((images) =>
      images.every((image) => (image as HTMLImageElement).complete
        && (image as HTMLImageElement).naturalWidth > 0),
    )).toBe(true);

    await page.reload();
    await expect(page.getByRole('heading', { name: /讓你的市集.*被更多攤主看見/ })).toBeVisible();
  });

  test('@organizer-portal ORG-Z03 註冊與登入 CTA 開啟正確入口', async ({ page, context }) => {
    await page.setViewportSize(desktopViewport);
    await page.goto('/organizer/home');

    const registerPagePromise = context.waitForEvent('page');
    await page.locator('.hero-actions a.primary-btn').click();
    const registerPage = await registerPagePromise;
    await expect(registerPage).toHaveURL(/\/organizer\/register$/);
    await registerPage.close();

    const loginPagePromise = context.waitForEvent('page');
    await page.locator('.hero-actions a.outline-btn').click();
    const loginPage = await loginPagePromise;
    await expect(loginPage).toHaveURL(/\/organizer\/login$/);
    await loginPage.close();
  });

  test('@organizer-portal ORG-Z04、ORG-Z07、ORG-Z08 未登入導覽與關於我們頁面正常', async ({ page }) => {
    await page.setViewportSize(desktopViewport);
    await page.goto('/organizer/home');

    const header = page.locator('.organizer-header');
    await expect(header.getByRole('link', { name: '登入', exact: true })).toBeVisible();
    await expect(header.getByRole('link', { name: '註冊', exact: true })).toBeVisible();
    await expect(header.getByRole('link', { name: '管理後台', exact: true })).toHaveCount(0);
    await expect(header.getByRole('link', { name: '首頁', exact: true })).toHaveClass(/active/);

    await header.getByRole('link', { name: '關於我們', exact: true }).click();
    await expect(page).toHaveURL(/\/organizer\/about$/);
    await expect(page.getByRole('heading', { name: '關於小集日' })).toBeVisible();
    await expect(page.locator('.organizer-header').getByRole('link', { name: '關於我們', exact: true }))
      .toHaveClass(/active/);
    await expect(page.locator('app-user-footer footer')).toBeVisible();

    await page.locator('.organizer-header').getByRole('link', { name: '回小集日首頁', exact: true }).click();
    await expect(page).toHaveURL(/\/user\/home$/);
  });

  test('@organizer-portal ORG-Z05、ORG-Z06 已登入時顯示帳號與管理後台入口', async ({ page, context }) => {
    test.skip(!credentialsFor('organizer'), '缺少主辦方 E2E 帳密。');
    await loginAs(page, 'organizer');
    await page.setViewportSize(desktopViewport);
    await page.goto('/organizer/home');

    const header = page.locator('.organizer-header');
    await expect(header.locator('.account-name')).toBeVisible();
    await expect(header.locator('button.logout-btn')).toBeVisible();
    await expect(header.getByRole('link', { name: '登入', exact: true })).toHaveCount(0);
    await expect(header.getByRole('link', { name: '註冊', exact: true })).toHaveCount(0);

    const dashboardPagePromise = context.waitForEvent('page');
    await header.locator('a[href="/organizer/dash-board/home"]').click();
    const dashboardPage = await dashboardPagePromise;
    await expect(dashboardPage).toHaveURL(/\/organizer\/dash-board\/home$/);
    await expect(dashboardPage.getByRole('heading', { name: /歡迎回來/ })).toBeVisible();
    await dashboardPage.close();
  });

  test('@organizer-portal ORG-Z09 手機導覽可由按鈕、Escape 與路由切換收合', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/organizer/home');

    const menuButton = page.getByRole('button', { name: '開啟主辦方導覽選單' });
    const drawer = page.locator('#organizer-mobile-menu');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');

    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(drawer).toHaveAttribute('aria-hidden', 'false');
    await expect(drawer).toHaveClass(/open/);

    await page.keyboard.press('Escape');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');

    await menuButton.click();
    await drawer.getByRole('link', { name: '關於我們', exact: true }).click();
    await expect(page).toHaveURL(/\/organizer\/about$/);
    await expect(page.locator('#organizer-mobile-menu')).toHaveAttribute('aria-hidden', 'true');
  });

  test('@organizer-portal ORG-Z10 首頁與關於我們在桌面、平板及手機沒有水平溢位', async ({ page }) => {
    const viewports = [
      { width: 1440, height: 900 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      for (const path of ['/organizer/home', '/organizer/about']) {
        await page.goto(path);
        await expect(page.locator('.organizer-header')).toBeVisible();
        await expect(page.locator('app-user-footer footer')).toBeVisible();
        await expect.poll(async () => page.evaluate(() =>
          document.documentElement.scrollWidth <= window.innerWidth + 1,
        ), `${path} 在 ${viewport.width}px 不應產生水平捲軸`).toBe(true);
      }
    }
  });
});
