import { defineConfig, devices } from '@playwright/test'

const PORT = 6173

export default defineConfig({
	testDir: 'playwright/tests',
	testMatch: /.*\.test\.ts/,
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	reporter: [['html', { open: 'never' }]],
	retries: process.env.CI ? 1 : 0,
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'on-first-retry',
		launchOptions: {
			args: ['--auto-open-devtools-for-tabs'],
		},
		screenshot: 'only-on-failure',
		actionTimeout: 5_000,
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: {
		command: process.env.CI
			? `npm run preview -- --port ${PORT}`
			: `npm run start -- --port ${PORT}`,
		port: PORT,
		reuseExistingServer: false,
		timeout: 5_000,
	},
})
