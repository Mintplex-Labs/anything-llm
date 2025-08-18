import { test, expect } from '@playwright/test';

test('Login: loads, no console errors, themed', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
  await expect(page).toHaveScreenshot('login-light.png', { fullPage: true });
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme','dark');
    document.body.classList.remove('light');
    localStorage.setItem('theme','default');
  });
  await page.reload();
  await expect(page).toHaveScreenshot('login-dark.png', { fullPage: true });
  expect(errors, `Console errors: ${errors.join('\n')}`).toEqual([]);
});

test('Chat: composer & message bubbles present', async ({ page }) => {
  await page.goto('/chat');
  await expect(page.locator('footer:has-text("Send")')).toBeVisible();
  await expect(page.locator('.onenew-card').first()).toBeVisible();
  await expect(page).toHaveScreenshot('chat-light.png', { fullPage: true });
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme','dark');
    document.body.classList.remove('light');
    localStorage.setItem('theme','default');
  });
  await page.reload();
  await expect(page).toHaveScreenshot('chat-dark.png', { fullPage: true });
});

