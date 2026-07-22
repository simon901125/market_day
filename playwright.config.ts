import { defineConfig } from '@playwright/test';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.e2e.local', quiet: true });

if (
  process.env['E2E_PRE_PUSH'] === '1' &&
  (!process.env['E2E_ORGANIZER_EMAIL'] || !process.env['E2E_ORGANIZER_PASSWORD'])
) {
  throw new Error(
    'Pre-push E2E requires E2E_ORGANIZER_EMAIL and E2E_ORGANIZER_PASSWORD in .env.e2e.local.',
  );
}

const isUiMode = process.argv.includes('--ui');
const isMainFlowDemo =
  process.env['E2E_DEMO'] === '1' ||
  (process.argv.includes('--headed') &&
    process.argv.some((argument) => argument.includes('event-main-flow.spec.ts')));

if (isMainFlowDemo) {
  process.env['E2E_DEMO'] = '1';
}

const slowMo = Number(
  process.env[isUiMode ? 'PW_UI_SLOW_MO' : 'PW_SLOW_MO'] ?? (isMainFlowDemo ? 400 : 0),
);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    locale: 'zh-TW',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: {
      slowMo,
      args: [
        '--start-maximized',
        '--disable-features=Translate,TranslateUI',
        '--disable-translate',
      ],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        channel: process.env['PW_BROWSER_CHANNEL'] || undefined,
        viewport: null,
      },
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
