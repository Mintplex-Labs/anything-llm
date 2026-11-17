import assert from "node:assert/strict";
import { createServer as createHttpServer } from "node:http";
import { createRequire } from "node:module";
import { test } from "node:test";
import { fileURLToPath, URL } from "node:url";
import i18next from "i18next";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { ToastContainer } from "react-toastify";
import { createServer } from "vite";

// Run from the repository root after yarn setup:
// node --test frontend/tests/telemetry-toggle.test.mjs
const requireServer = createRequire(
  new URL("../../server/package.json", import.meta.url)
);
const { JSDOM } = requireServer("jsdom");

test("a failed telemetry opt-out keeps the switch on and can be retried", async (t) => {
  const vite = await createServer({
    configFile: false,
    root: fileURLToPath(new URL("..", import.meta.url)),
    resolve: {
      alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
    },
    esbuild: { jsx: "automatic" },
    css: { postcss: { plugins: [] } },
    optimizeDeps: { disabled: true },
    server: {
      middlewareMode: true,
      hmr: { server: createHttpServer() },
      watch: null,
    },
  });
  t.after(() => vite.close());
  const { default: TelemetryToggle } = await vite.ssrLoadModule(
    "/src/components/TelemetryToggle/index.jsx"
  );

  const dom = new JSDOM('<div id="app"></div>', {
    url: "http://anythingllm.test",
  });
  const { window } = dom;
  const { document, localStorage } = window;
  Object.assign(globalThis, {
    window,
    document,
    localStorage,
    IS_REACT_ACT_ENVIRONMENT: true,
  });

  let disableTelemetry = "false";
  let saves = 0;
  const failedSave = Promise.withResolvers();
  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (url.endsWith("/setup-complete"))
      return globalThis.Response.json({
        results: { DisableTelemetry: disableTelemetry },
      });

    assert.ok(url.endsWith("/system/update-env"));
    assert.equal(options.method, "POST");
    const { DisableTelemetry } = JSON.parse(options.body);
    assert.equal(DisableTelemetry, "true");
    if (++saves === 1) return failedSave.promise;

    disableTelemetry = DisableTelemetry;
    return globalThis.Response.json({
      newValues: { DisableTelemetry: disableTelemetry },
      error: false,
    });
  });

  const i18n = i18next.createInstance();
  await i18n.init({ lng: "en", resources: { en: { translation: {} } } });
  const root = createRoot(document.getElementById("app"));
  t.after(async () => {
    await act(async () => root.unmount());
    dom.window.close();
  });
  await act(async () =>
    root.render(
      createElement(
        I18nextProvider,
        { i18n },
        createElement(TelemetryToggle),
        createElement(ToastContainer)
      )
    )
  );

  const toggle = document.querySelector('input[type="checkbox"]');
  assert.equal(toggle.checked, true);
  await act(async () => toggle.click());
  assert.equal(toggle.checked, true);
  assert.equal(toggle.disabled, true, "the save is still pending");
  await act(async () => toggle.click());
  assert.equal(saves, 1, "a pending save cannot be submitted twice");

  await act(async () => {
    failedSave.resolve(
      globalThis.Response.json(
        { error: "Service unavailable" },
        { status: 503 }
      )
    );
  });
  assert.equal(toggle.disabled, false);
  assert.equal(toggle.checked, true, "the server did not confirm the opt-out");
  assert.equal(disableTelemetry, "false");
  assert.match(
    document.body.textContent,
    /could not save the telemetry setting/i
  );

  await act(async () => toggle.click());
  assert.equal(disableTelemetry, "true");
  assert.equal(toggle.checked, false);
  assert.equal(saves, 2);
});
