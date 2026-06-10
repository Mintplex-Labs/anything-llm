const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

describe("Crypto Moonboys public Sparky page", () => {
  const pagePath = path.resolve(
    __dirname,
    "../../../frontend/public/sparky.html"
  );

  it("loads without JavaScript errors", () => {
    const html = fs.readFileSync(pagePath, "utf8");
    const errors = [];
    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      url: "https://cryptomoonboys.com/sparky.html",
      beforeParse(window) {
        window.fetch = jest.fn();
        window.addEventListener("error", (event) =>
          errors.push(event.error || event.message)
        );
      },
    });

    expect(
      dom.window.document.querySelector(".npc-badge[data-npc='sparky']")
    ).toBeTruthy();
    expect(
      dom.window.document.getElementById("message").getAttribute("aria-label")
    ).toBe("Message");
    expect(errors).toEqual([]);
  });

  it("keeps the legacy public page as a safe Sparky redirect", () => {
    const legacyHtml = fs.readFileSync(
      path.resolve(__dirname, "../../../frontend/public/paperclip.html"),
      "utf8"
    );

    expect(legacyHtml).toContain("/sparky.html");
    expect(legacyHtml).not.toMatch(/Paperclip|data-npc=["']paperclip["']/);
    expect(legacyHtml).not.toMatch(
      /SWARMSY_BRIDGE_TOKEN|X-SWARMSY-BRIDGE-TOKEN|test-bridge-token|\/settings\/website-npcs|npc-control|bridgeToken|workspaceSlug/
    );
  });

  it("sends chat through the public bridge with no private token in the browser", async () => {
    const html = fs.readFileSync(pagePath, "utf8");
    expect(html).not.toMatch(
      /SWARMSY_BRIDGE_TOKEN|X-SWARMSY-BRIDGE-TOKEN|test-bridge-token|\/settings\/website-npcs|npc-control|bridgeToken|workspaceSlug/
    );

    let fetchCall;
    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      url: "https://cryptomoonboys.com/sparky.html",
      beforeParse(window) {
        window.fetch = jest.fn(async (...args) => {
          fetchCall = args;
          return {
            json: async () => ({
              success: true,
              reply: "mock live bridge response",
            }),
          };
        });
      },
    });

    const textarea = dom.window.document.getElementById("message");
    textarea.value = "Hello Sparky";
    dom.window.document
      .getElementById("chat-form")
      .dispatchEvent(
        new dom.window.Event("submit", { bubbles: true, cancelable: true })
      );
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetchCall[0]).toBe("/api/public/npc-chat");
    expect(fetchCall[1].headers).toEqual({
      "Content-Type": "application/json",
    });
    expect(JSON.parse(fetchCall[1].body)).toEqual({
      npcId: "sparky",
      message: "Hello Sparky",
      pagePath: "/sparky.html",
    });
  });

  it("keeps Website NPC admin frontend access admin-only and hidden from public downloads", () => {
    const main = fs.readFileSync(
      path.resolve(__dirname, "../../../frontend/src/main.jsx"),
      "utf8"
    );
    const sidebar = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SettingsSidebar/index.jsx"
      ),
      "utf8"
    );

    expect(main).toContain('path: "/settings/website-npcs"');
    expect(main).toContain("<AdminRoute Component={WebsiteNpcsAdmin} />");
    expect(sidebar).toContain('btnText: "Website NPCs"');
    expect(sidebar).toContain('roles: ["admin"]');
    expect(sidebar).toContain("IS_SWARMSY_PUBLIC_DOWNLOAD_BUILD");
    expect(main).toContain("includeSwarmsyAdminNpcRoutes");
  });
});
