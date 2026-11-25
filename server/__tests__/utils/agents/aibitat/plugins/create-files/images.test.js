/* eslint-env jest */
const http = require("http");
const {
  isPublicIp,
  assertPublicUrl,
  downloadImage,
  imageType,
  loadImage,
  embedMarkdownImages,
} = require("../../../../../../utils/agents/aibitat/plugins/create-files/images.js");

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);
const pad = (head) =>
  Buffer.concat([Buffer.from(head, "latin1"), Buffer.alloc(16)]);
const GIF = pad("GIF89a");
const BMP = pad("BM");
const WEBP = Buffer.concat([
  Buffer.from("RIFF\0\0\0\0WEBP", "latin1"),
  Buffer.alloc(8),
]);
const dataUrl = (buffer, mime = "image/png") =>
  `data:${mime};base64,${buffer.toString("base64")}`;

// The server listens on loopback, so tests that need to reach it allow
// exactly that address.
const loopbackOnly = (ip) => ip === "127.0.0.1";
let server;
let base;
let port;
const hits = [];
const routes = {
  "/ok.png": (res) => {
    res.writeHead(200, { "content-type": "image/png" });
    res.write(PNG.subarray(0, 10));
    res.end(PNG.subarray(10));
  },
  "/untyped.gif": (res) => {
    res.writeHead(200, { "content-type": "application/octet-stream" });
    res.end(GIF);
  },
  "/lying.png": (res) => {
    res.writeHead(200, { "content-type": "image/png" });
    res.end("<html>not an image</html>");
  },
  "/page.html": (res) => {
    res.writeHead(200, { "content-type": "text/html" });
    res.end("<html>");
  },
  "/vector.svg": (res) => {
    res.writeHead(200, { "content-type": "image/svg+xml" });
    res.end("<svg/>");
  },
  "/missing.png": (res) => {
    res.writeHead(404, { "content-type": "image/png" });
    res.end();
  },
  "/huge.jpg": (res) => {
    res.writeHead(200, { "content-type": "image/jpeg" });
    const chunk = Buffer.alloc(1024 * 1024);
    for (let i = 0; i < 11; i++) res.write(chunk);
    res.end();
  },
  "/slow.png": () => {},
  "/hop": (res) => {
    res.writeHead(302, { location: "/ok.png" });
    res.end();
  },
  "/loop": (res) => {
    res.writeHead(302, { location: "/loop" });
    res.end();
  },
  "/to-v6-loopback": (res) => {
    res.writeHead(302, { location: "http://[::ffff:7f00:1]/secret" });
    res.end();
  },
};

beforeAll(
  () =>
    new Promise((resolve) => {
      server = http.createServer((req, res) => {
        hits.push(req.url);
        (routes[req.url] || routes["/missing.png"])(res);
      });
      server.listen(0, "127.0.0.1", () => {
        port = server.address().port;
        base = `http://127.0.0.1:${port}`;
        resolve();
      });
    })
);
afterAll(() => {
  server.closeAllConnections();
  return new Promise((resolve) => server.close(resolve));
});
beforeEach(() => hits.splice(0));

describe("isPublicIp and assertPublicUrl", () => {
  test("only public addresses pass", () => {
    for (const ip of [
      "127.0.0.1",
      "10.1.2.3",
      "172.16.0.1",
      "172.31.255.255",
      "192.168.1.1",
      "169.254.169.254",
      "100.64.0.1",
      "0.0.0.0",
      "224.0.0.1",
      "::1",
      "::",
      "fc00::1",
      "fe80::1",
      "::ffff:127.0.0.1",
      // The same addresses as Node writes them after parsing a URL.
      "::ffff:7f00:1",
      "::ffff:a9fe:a9fe",
      "::7f00:1",
      "64:ff9b::7f00:1",
      "2002:7f00:1::1",
      "2001:0:7f00:1::1",
      "not an ip",
      "",
    ])
      expect([ip, isPublicIp(ip)]).toEqual([ip, false]);
    for (const ip of ["8.8.8.8", "172.32.0.1", "93.184.216.34", "2606:4700::1"])
      expect([ip, isPublicIp(ip)]).toEqual([ip, true]);
  });

  test("rejects other schemes and hosts on the server's own network, however they are written", async () => {
    for (const url of [
      "file:///etc/passwd",
      "ftp://8.8.8.8/a.png",
      "http://127.0.0.1/a.png",
      "http://127.1/a.png",
      "http://2130706433/a.png",
      "http://0x7f000001/a.png",
      "http://localhost:3001/a.png",
      "http://[::1]/a.png",
      "http://[::ffff:127.0.0.1]/a.png",
      "http://[::ffff:a9fe:a9fe]/latest/meta-data",
      "http://169.254.169.254/latest/meta-data",
    ])
      await expect(assertPublicUrl(url)).rejects.toThrow();
    await expect(assertPublicUrl("not a url")).rejects.toThrow();
    await expect(
      assertPublicUrl("https://93.184.216.34/a.png")
    ).resolves.toBeUndefined();
  });
});

describe("downloadImage", () => {
  test("refuses this host by default, by name or by address, without connecting", async () => {
    for (const url of [
      `${base}/ok.png`,
      `http://localhost:${port}/ok.png`,
      `http://[::ffff:127.0.0.1]:${port}/ok.png`,
    ])
      await expect(downloadImage(url)).rejects.toThrow(/not a public address/);
    expect(hits).toEqual([]);
  });

  test("checks every redirect before following it, and stops after a few", async () => {
    expect(
      await downloadImage(`${base}/hop`, { isAllowed: loopbackOnly })
    ).toEqual(PNG);
    await expect(
      downloadImage(`${base}/to-v6-loopback`, { isAllowed: loopbackOnly })
    ).rejects.toThrow(/not a public address/);
    await expect(
      downloadImage(`${base}/loop`, { isAllowed: loopbackOnly })
    ).rejects.toThrow(/too many redirects/);
    expect(hits.slice(0, 3)).toEqual(["/hop", "/ok.png", "/to-v6-loopback"]);
    expect(hits.filter((url) => url === "/loop")).toHaveLength(4);
  });

  test("accepts any content type unless the caller names formats", async () => {
    const open = { isAllowed: loopbackOnly };
    const strict = { isAllowed: loopbackOnly, formats: ["png", "jpg"] };
    expect(await downloadImage(`${base}/untyped.gif`, open)).toEqual(GIF);
    for (const path of ["/untyped.gif", "/page.html", "/vector.svg"])
      await expect(downloadImage(`${base}${path}`, strict)).rejects.toThrow(
        /unsupported content type/
      );
    expect(await downloadImage(`${base}/ok.png`, strict)).toEqual(PNG);
  });

  test("fails on errors, oversized bodies and slow servers", async () => {
    const options = { isAllowed: loopbackOnly };
    await expect(downloadImage(`${base}/missing.png`, options)).rejects.toThrow(
      /HTTP 404/
    );
    await expect(downloadImage(`${base}/huge.jpg`, options)).rejects.toThrow(
      /too large/
    );
    await expect(
      downloadImage(`${base}/ok.png`, { ...options, maxBytes: 10 })
    ).rejects.toThrow(/too large/);
    await expect(
      downloadImage(`${base}/slow.png`, { ...options, timeoutMs: 50 })
    ).rejects.toThrow(/abort/i);
    const controller = new AbortController();
    const pending = downloadImage(`${base}/slow.png`, {
      ...options,
      signal: controller.signal,
    });
    setTimeout(() => controller.abort(), 20);
    await expect(pending).rejects.toThrow(/abort/i);
  });
});

describe("imageType", () => {
  test("reads the format from magic bytes only", () => {
    expect(imageType(PNG)).toBe("png");
    expect(imageType(pad("\xff\xd8\xff"))).toBe("jpg");
    expect(imageType(GIF)).toBe("gif");
    expect(imageType(pad("GIF87a"))).toBe("gif");
    expect(imageType(BMP)).toBe("bmp");
    expect(imageType(WEBP)).toBe("webp");
    expect(imageType(pad("RIFF\0\0\0\0WAVE"))).toBeNull();
    expect(imageType(pad("<svg/>"))).toBeNull();
    expect(imageType(PNG.subarray(0, 11))).toBeNull();
    expect(imageType(Buffer.alloc(0))).toBeNull();
    expect(imageType(null)).toBeNull();
    expect(imageType(undefined)).toBeNull();
  });
});

describe("loadImage", () => {
  const formats = ["png", "jpg", "gif"];

  test("decodes base64 data URLs and checks what they contain", async () => {
    expect(await loadImage(dataUrl(PNG), { formats })).toEqual({
      buffer: PNG,
      type: "png",
    });
    // The declared type does not matter, the bytes do.
    expect((await loadImage(dataUrl(GIF, "image/png"), { formats })).type).toBe(
      "gif"
    );
    for (const [src, error] of [
      [dataUrl(Buffer.from("<html>hello</html>")), /not an image/],
      [dataUrl(WEBP, "image/webp"), /webp images are not supported/],
      [dataUrl(PNG, "text/plain"), /not a base64 image/],
      [`data:image/png,${PNG.toString("latin1")}`, /not a base64 image/],
      ["data:image/png;base64,", /not a base64 image/],
    ])
      await expect(loadImage(src, { formats })).rejects.toThrow(error);
    await expect(
      loadImage(dataUrl(PNG), { formats, maxBytes: 10 })
    ).rejects.toThrow(/too large/);
  });

  test("downloads only from public addresses unless told otherwise", async () => {
    await expect(loadImage(`${base}/ok.png`, { formats })).rejects.toThrow(
      /not a public address/
    );
    expect(hits).toEqual([]);
    expect(
      await loadImage(`${base}/ok.png`, { formats, isAllowed: loopbackOnly })
    ).toEqual({ buffer: PNG, type: "png" });
    await expect(
      loadImage(`${base}/lying.png`, { formats, isAllowed: loopbackOnly })
    ).rejects.toThrow(/not an image/);
  });

  test("refuses every other kind of source", async () => {
    for (const src of [
      "",
      "a.png",
      "/etc/passwd",
      "file:///etc/passwd",
      "ftp://8.8.8.8/a.png",
      "javascript:alert(1)",
      "//127.0.0.1/a.png",
    ])
      await expect(loadImage(src, { formats })).rejects.toThrow(
        /unsupported image source/
      );
    expect(hits).toEqual([]);
  });
});

describe("embedMarkdownImages", () => {
  const formats = ["png", "jpg", "gif"];
  const imagesIn = (markdown) => [
    ...markdown.matchAll(/!\[[^\]]*\]\(([^)]*)\)|<img\b[^>]*>/g),
  ];

  test("leaves nothing a renderer would fetch from this host", async () => {
    const markdown = [
      `# Report`,
      `![inline](${base}/ok.png "title")`,
      `![by reference][pic]`,
      `[pic]: http://localhost:${port}/ok.png`,
      `Text with <img src='http://[::ffff:127.0.0.1]:${port}/ok.png'> inside.`,
      `<p><img alt="x" src=${base}/ok.png></p>`,
      `[![linked](${base}/ok.png)](https://example.com)`,
    ].join("\n\n");
    const logs = [];
    const result = await embedMarkdownImages(markdown, {
      formats,
      log: (msg) => logs.push(msg),
    });

    expect(hits).toEqual([]);
    expect(imagesIn(result)).toEqual([]);
    expect(result).toContain("# Report");
    expect(result).toContain("Text with  inside.");
    expect(result).toContain("](https://example.com)");
    expect(logs.every((msg) => /not a public address/.test(msg))).toBe(true);
    expect(logs.length).toBeGreaterThan(0);
  });

  test("embeds the images it can load and drops the rest", async () => {
    const markdown = [
      `![ok](${base}/ok.png)`,
      `![again](${base}/ok.png)`,
      `![missing](${base}/missing.png)`,
      `![page](${base}/page.html)`,
      `![data](${dataUrl(GIF, "image/gif")})`,
      `![relative](./a.png)`,
      `<img src="${base}/untyped.gif" width="10">`,
      `[a link](${base}/ok.png) stays a link`,
    ].join("\n\n");
    const result = await embedMarkdownImages(markdown, {
      formats,
      isAllowed: loopbackOnly,
    });

    // Each source is downloaded once, however often it appears.
    expect(hits.filter((url) => url === "/ok.png")).toHaveLength(1);
    const sources = imagesIn(result).map(
      ([tag, src]) => src ?? tag.match(/src="([^"]*)"/)[1]
    );
    expect(sources).toEqual([
      dataUrl(PNG),
      dataUrl(PNG),
      dataUrl(GIF, "image/gif"),
      dataUrl(GIF, "image/gif"),
    ]);
    expect(result).toContain("![ok](data:image/png;base64,");
    expect(result).toContain(`[a link](${base}/ok.png) stays a link`);
    expect(result).not.toContain("missing");
    expect(result).not.toContain("./a.png");
  });

  test("returns markdown without images unchanged", async () => {
    for (const markdown of [
      "",
      "plain text",
      "# Title\n\n```\ncode <b>\n```\n\n[link](https://example.com)",
    ])
      expect(await embedMarkdownImages(markdown, { formats })).toBe(markdown);
  });
});
