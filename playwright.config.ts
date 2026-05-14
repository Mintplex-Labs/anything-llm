import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: "../anythingLLM-fix/playwright-report", open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "yarn dev:server",
      port: 3001,
      reuseExistingServer: true,
      timeout: 120000,
    },
    {
      command: "yarn dev:frontend",
      port: 3000,
      reuseExistingServer: true,
      timeout: 120000,
    },
  ],
});
