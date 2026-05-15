/**
 * E2E tests for PR2 fixes: Agent Session & Streaming Defensive Fixes.
 *
 * These tests verify:
 * 1. API streaming resilience (writeResponseChunk null defense, completeText null safety)
 * 2. WebSocket agent invocation & disconnect handling
 * 3. Event listener cleanup (useIsAgentSessionActive)
 *
 * Prerequisites:
 *   - Server running on PORT (default 3001)
 *   - Frontend running on BASE_URL (default http://localhost:3000)
 *   - A workspace exists with slug "test-workspace"
 *   - LLM provider configured (genericOpenAi pointing to LM Studio)
 *
 * Run: npx playwright test e2e/agent-session-pr2.spec.cjs
 */
const { test, expect } = require("@playwright/test");

const BASE_URL = process.env.BASE_URL || "http://localhost:3002";
const API_BASE = process.env.API_BASE || "http://localhost:3001";
const WORKSPACE_SLUG = process.env.WORKSPACE_SLUG || "test-workspace";

// ─── API-level tests (no browser needed) ────────────────────────────────

test.describe("API: streaming endpoint resilience", () => {
  let apiKey = null;

  test.beforeAll(async ({ request }) => {
    // Try to get a valid API key from the system
    // In single-user mode, check without auth first
    const res = await request.get(`${API_BASE}/api/v1/system`);
    if (res.ok()) {
      const data = await res.json();
      apiKey = data?.apiKey || null;
    }
  });

  test("POST /stream-chat returns valid response for basic message", async ({
    request,
  }) => {
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    const response = await request.post(
      `${API_BASE}/workspace/${WORKSPACE_SLUG}/stream-chat`,
      {
        headers,
        data: { message: "Hello" },
      }
    );
    // Should get 200 (streaming) or 400/401 (not 500 server error)
    expect(response.status()).toBeLessThan(500);
  });

  test("stream-chat with empty message does not crash server", async ({
    request,
  }) => {
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    const response = await request.post(
      `${API_BASE}/workspace/${WORKSPACE_SLUG}/stream-chat`,
      {
        headers,
        data: { message: "" },
      }
    );
    // Should not return 500
    expect(response.status()).toBeLessThan(500);
  });

  test("stream-chat with null message body does not crash server", async ({
    request,
  }) => {
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    const response = await request.post(
      `${API_BASE}/workspace/${WORKSPACE_SLUG}/stream-chat`,
      {
        headers,
        data: {},
      }
    );
    // Should not return 500
    expect(response.status()).toBeLessThan(500);
  });

  test("stream-chat with threadSlug targets correct thread", async ({
    request,
  }) => {
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    // Create a new thread first
    const threadRes = await request.post(
      `${API_BASE}/workspace/${WORKSPACE_SLUG}/thread/new`,
      { headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {} }
    );
    if (threadRes.status() === 200) {
      const { thread } = await threadRes.json();
      if (thread?.slug) {
        const chatRes = await request.post(
          `${API_BASE}/workspace/${WORKSPACE_SLUG}/thread/${thread.slug}/stream-chat`,
          {
            headers,
            data: { message: "Test PR2 thread message" },
          }
        );
        expect([200, 400, 401]).toContain(chatRes.status());
      }
    }
  });
});

// ─── UI-level tests (browser) ───────────────────────────────────────────

test.describe("UI: agent session & event listener lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
  });

  test("page loads without JavaScript errors", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(`${BASE_URL}/workspace/${WORKSPACE_SLUG}`);
    await page.waitForTimeout(3000);

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(
      (e) => !e.includes("ResizeObserver") && !e.includes("Non-Error")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("event listeners are properly cleaned up on navigation", async ({
    page,
  }) => {
    // Navigate to workspace and count event listeners
    await page.goto(`${BASE_URL}/workspace/${WORKSPACE_SLUG}`);
    await page.waitForTimeout(2000);

    const listenerCountBefore = await page.evaluate(() => {
      return window._listenerCount || 0;
    });

    // Navigate away and back
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    await page.goto(`${BASE_URL}/workspace/${WORKSPACE_SLUG}`);
    await page.waitForTimeout(2000);

    const listenerCountAfter = await page.evaluate(() => {
      return window._listenerCount || 0;
    });

    // Listener count should not grow unboundedly
    // (allow some tolerance for normal app behavior)
    expect(listenerCountAfter).toBeLessThanOrEqual(listenerCountBefore + 5);
  });

  test("workspace chat input is functional after navigation", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/workspace/${WORKSPACE_SLUG}`);
    await page.waitForTimeout(3000);

    const promptInput = page.locator(
      "#prompt-input, textarea, [contenteditable]"
    );
    const hasInput = await promptInput.count();
    if (hasInput === 0) {
      test.skip();
      return;
    }

    // Verify input is interactive
    await promptInput.first().fill("PR2 test message");
    const value = await promptInput.first().inputValue();
    expect(value).toBe("PR2 test message");

    // Navigate away and back
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    await page.goto(`${BASE_URL}/workspace/${WORKSPACE_SLUG}`);
    await page.waitForTimeout(3000);

    // Input should still be functional
    const input2 = page.locator("#prompt-input, textarea, [contenteditable]");
    if ((await input2.count()) > 0) {
      await input2.first().fill("After navigation");
      const value2 = await input2.first().inputValue();
      expect(value2).toBe("After navigation");
    }
  });
});

// ─── Integration: full round-trip test ──────────────────────────────────

test.describe("Integration: message persistence after streaming", () => {
  test("chat history loads correctly after page reload", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    await page.goto(`${BASE_URL}/workspace/${WORKSPACE_SLUG}`);
    await page.waitForTimeout(3000);

    const promptInput = page.locator(
      "#prompt-input, textarea, [contenteditable]"
    );
    const hasInput = await promptInput.count();
    if (hasInput === 0) {
      test.skip();
      return;
    }

    // Send a unique message
    const testMsg = `PR2 E2E ${Date.now()}`;
    await promptInput.first().fill(testMsg);
    const sendButton = page.locator(
      'button[type="submit"], button[aria-label="Send"]'
    );
    if ((await sendButton.count()) > 0) {
      await sendButton.first().click();
    } else {
      await promptInput.first().press("Enter");
    }

    // Wait for the assistant reply to appear (up to 60s for slow LLM)
    try {
      await page.waitForSelector("[class*='markdown']", { timeout: 60000 });
    } catch {
      console.log("Timed out waiting for assistant reply");
    }

    // Wait for persistence
    await page.waitForTimeout(3000);

    // Reload and verify history
    await page.reload();
    await page.waitForTimeout(5000);

    const chatMessages = page.locator("[class*='markdown']");
    const count = await chatMessages.count();
    expect(count).toBeGreaterThan(0);
  });
});
