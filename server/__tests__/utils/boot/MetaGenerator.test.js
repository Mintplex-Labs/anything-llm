const http = require("node:http");
const express = require("express");

jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: { getValueOrFallback: jest.fn() },
}));

const { SystemSettings } = require("../../../models/systemSettings");
const { MetaGenerator } = require("../../../utils/boot/MetaGenerator");

describe("MetaGenerator HTML responses", () => {
  let server;
  let generator;
  let logSpy;

  function get(path) {
    return new Promise((resolve, reject) => {
      const request = http.get(
        { host: "127.0.0.1", port: server.address().port, path },
        (response) => {
          let body = "";
          response.setEncoding("utf8");
          response.on("data", (chunk) => (body += chunk));
          response.on("end", () =>
            resolve({
              status: response.statusCode,
              headers: response.headers,
              body,
            })
          );
          response.on("error", reject);
        }
      );
      request.on("error", reject);
    });
  }

  beforeAll((done) => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const app = express();
    app.get("/manifest.json", (_, response) =>
      generator.generateManifest(response)
    );
    app.use((request, response, next) => {
      const status = request.path === "/unavailable" ? 503 : 200;
      generator.generate(response, status).catch(next);
    });
    server = app.listen(0, "127.0.0.1", done);
  });

  beforeEach(() => {
    MetaGenerator._instance = null;
    generator = new MetaGenerator();
    SystemSettings.getValueOrFallback.mockReset();
    SystemSettings.getValueOrFallback.mockImplementation(
      async (_, value) => value
    );
  });

  afterAll((done) => {
    logSpy.mockRestore();
    server.close(done);
  });

  it.each(["/", "/login", "/settings", "/unknown-route"])(
    "protects generated HTML at %s from framing",
    async (path) => {
      const response = await get(path);

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/^text\/html/);
      expect(response.headers["x-frame-options"]).toBe("DENY");
      expect(response.body).toContain('<div id="root"');
      expect(response.body).toContain('src="/index.js"');
    }
  );

  it("protects responses after the metadata has been cached", async () => {
    const first = await get("/");
    const second = await get("/login");

    expect(first.headers["x-frame-options"]).toBe("DENY");
    expect(second.headers["x-frame-options"]).toBe("DENY");
    expect(SystemSettings.getValueOrFallback).toHaveBeenCalledTimes(2);
  });

  it("preserves a custom status while protecting the generated HTML", async () => {
    const response = await get("/unavailable");

    expect(response.status).toBe(503);
    expect(response.headers["x-frame-options"]).toBe("DENY");
  });

  it("keeps the web app manifest response unchanged", async () => {
    const response = await get("/manifest.json");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/^application\/json/);
    expect(JSON.parse(response.body).start_url).toBe("/");
    expect(response.headers["x-frame-options"]).toBeUndefined();
  });
});
