/* eslint-env jest */
// utils/files resolves its storage paths from STORAGE_DIR when required.
process.env.STORAGE_DIR = __dirname;
const sharp = require("sharp");
const {
  preparePicture,
  isPublicIp,
  assertPublicUrl,
  downloadImage,
  imagesInMarkdown,
  downloadUrls,
  attachedPictures,
  assignPictures,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/images.js");

const png = (width, height, alpha = false) =>
  sharp({
    create: {
      width,
      height,
      channels: alpha ? 4 : 3,
      background: alpha
        ? { r: 10, g: 20, b: 30, alpha: 0.5 }
        : { r: 10, g: 20, b: 30 },
    },
  })
    .png()
    .toBuffer();

const picture = (name) => ({ data: `data:${name}`, width: 1600, height: 900 });

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
      "http://localhost:3001/a.png",
      "http://[::1]/a.png",
      "http://[::ffff:127.0.0.1]/a.png",
      "http://[::ffff:a9fe:a9fe]/latest/meta-data",
      "http://169.254.169.254/latest/meta-data",
    ])
      await expect(assertPublicUrl(url)).rejects.toThrow();
    await expect(
      assertPublicUrl("https://93.184.216.34/a.png")
    ).resolves.toBeUndefined();
  });
});

describe("downloadImage", () => {
  const http = require("http");
  let server;
  let base;
  const hits = [];
  const routes = {
    "/ok.png": (res) => {
      res.writeHead(200, { "content-type": "image/png" });
      res.write("ab");
      res.end("cd");
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
      for (let i = 0; i < 9; i++) res.write(chunk);
      res.end();
    },
    "/hop": (res) => {
      res.writeHead(302, { location: "/ok.png" });
      res.end();
    },
    "/to-v6-loopback": (res) => {
      res.writeHead(302, { location: "http://[::ffff:7f00:1]/secret" });
      res.end();
    },
  };
  // The server listens on loopback, so tests that need to reach it allow
  // exactly that address.
  const loopbackOnly = (ip) => ip === "127.0.0.1";

  beforeAll(
    () =>
      new Promise((resolve) => {
        server = http.createServer((req, res) => {
          hits.push(req.url);
          (routes[req.url] || routes["/missing.png"])(res);
        });
        server.listen(0, "127.0.0.1", () => {
          base = `http://127.0.0.1:${server.address().port}`;
          resolve();
        });
      })
  );
  afterAll(() => new Promise((resolve) => server.close(resolve)));
  beforeEach(() => hits.splice(0));

  test("refuses this host by default, by name or by address, without connecting", async () => {
    const port = server.address().port;
    for (const url of [
      `${base}/ok.png`,
      `http://localhost:${port}/ok.png`,
      `http://[::ffff:127.0.0.1]:${port}/ok.png`,
    ])
      await expect(downloadImage(url)).rejects.toThrow(/not a public address/);
    expect(hits).toEqual([]);
  });

  test("checks every redirect before following it", async () => {
    expect(
      (
        await downloadImage(`${base}/hop`, { isAllowed: loopbackOnly })
      ).toString()
    ).toBe("abcd");
    await expect(
      downloadImage(`${base}/to-v6-loopback`, { isAllowed: loopbackOnly })
    ).rejects.toThrow(/not a public address/);
    expect(hits).toEqual(["/hop", "/ok.png", "/to-v6-loopback"]);
  });

  test("returns only raster images that load and fit under the size cap", async () => {
    for (const [path, error] of [
      ["/page.html", /not a raster image/],
      ["/vector.svg", /not a raster image/],
      ["/missing.png", /HTTP 404/],
      ["/huge.jpg", /too large/],
    ])
      await expect(
        downloadImage(`${base}${path}`, { isAllowed: loopbackOnly })
      ).rejects.toThrow(error);
  });
});

describe("imagesInMarkdown", () => {
  test("keeps described absolute raster images and skips the rest", () => {
    const markdown = [
      "![A chart of adoption](https://x.com/chart.png)",
      '![Team photo](https://x.com/team.jpg "Our team")',
      "![](https://x.com/no-alt.png)",
      "![Diagram](https://x.com/flow.svg)",
      "![Diagram](https://up.x.org/thumb/a/ab/Flow.svg/1280px-Flow.svg.png)",
      "![Spinner](https://x.com/spin.gif?v=2)",
      "![Company logo](https://x.com/brand.png)",
      "![Relative](/img/a.png)",
      "[not an image](https://x.com/b.png)",
    ].join("\n\n");
    expect(imagesInMarkdown(markdown).map((i) => i.url)).toEqual([
      "https://x.com/chart.png",
      "https://x.com/team.jpg",
    ]);
  });

  test("turns file-name alt text into words and reads the caption under an image", () => {
    const markdown = [
      "[![330px-Multiple\\_attention\\_heads.png](https://t.org/thumb/e/e9/Multiple_attention_heads.png/330px-Multiple_attention_heads.png?u=1)](https://t.org/wiki/File:Multiple_attention_heads.png)",
      "",
      "Attention heads in a [transformer](https://t.org/wiki/T) layer",
      "",
      "![](https://x.com/uncaptioned.jpg)",
      "",
      "# A heading is not a caption",
    ].join("\n");
    expect(imagesInMarkdown(markdown)).toEqual([
      {
        alt: "Multiple attention heads",
        caption: "Attention heads in a transformer layer",
        url: "https://t.org/thumb/e/e9/Multiple_attention_heads.png/330px-Multiple_attention_heads.png?u=1",
      },
    ]);
  });
});

describe("downloadUrls", () => {
  test("tries a slide-sized MediaWiki thumbnail before the linked one", () => {
    expect(
      downloadUrls(
        "https://t.org/thumb/e/e9/Heads.png/330px-Heads.png?utm_source=x"
      )
    ).toEqual([
      "https://t.org/thumb/e/e9/Heads.png/1280px-Heads.png?utm_source=x",
      "https://t.org/thumb/e/e9/Heads.png/330px-Heads.png?utm_source=x",
    ]);
    for (const url of [
      "https://x.com/photo.jpg",
      "https://t.org/thumb/e/e9/Big.png/2000px-Big.png",
      "not a url",
    ])
      expect(downloadUrls(url)).toEqual([url]);
  });
});

describe("preparePicture", () => {
  test("scales large pictures down, keeping JPEG for opaque and PNG for transparent ones", async () => {
    const photo = await preparePicture(await png(4000, 3000));
    expect([photo.width, photo.height]).toEqual([1600, 1200]);
    expect(photo.data).toMatch(/^data:image\/jpeg;base64,/);

    const logo = await preparePicture(await png(300, 100, true));
    expect([logo.width, logo.height]).toEqual([300, 100]);
    expect(logo.data).toMatch(/^data:image\/png;base64,/);
    expect([photo.format, logo.format]).toEqual(["png", "png"]);
  });

  test("rejects data that is not an image", async () => {
    await expect(preparePicture(Buffer.from("nope"))).rejects.toThrow();
  });
});

describe("attachedPictures", () => {
  test("numbers the user's images oldest first and marks the latest message's", async () => {
    const attachment = async (name) => ({
      name,
      mime: "image/png",
      contentString: `data:image/png;base64,${(await png(64, 64)).toString("base64")}`,
    });
    const chats = [
      { from: "USER", attachments: [await attachment("old.png")] },
      { from: "@agent", attachments: [await attachment("agent.png")] },
      {
        from: "USER",
        attachments: [
          { name: "notes.txt", mime: "text/plain", contentString: "x" },
          await attachment("new.png"),
          { name: "broken.png", mime: "image/png", contentString: "bm9wZQ==" },
        ],
      },
    ];
    const summary = (pictures) =>
      pictures.map(({ number, name, latest, image }) => [
        number,
        name,
        latest,
        !!image,
      ]);
    // An older image is only decoded when the outline asks for it.
    expect(summary(await attachedPictures(chats))).toEqual([
      [1, "old.png", false, false],
      [2, "new.png", true, true],
      [3, "broken.png", true, false],
    ]);
    expect(summary(await attachedPictures(chats, new Set([1])))[0]).toEqual([
      1,
      "old.png",
      false,
      true,
    ]);
  });
});

describe("assignPictures", () => {
  const sections = [
    { title: "Market growth", keyPoints: ["Adoption in hospitals"] },
    { title: "Pricing", keyPoints: ["Plans and tiers"], image: 1 },
    { title: "Team" },
  ];

  test("puts attached images where the agent numbered them, then fills sections with the latest ones", () => {
    const plan = assignPictures({
      mode: "none",
      title: "Deck",
      sections,
      attached: [
        { number: 1, latest: false, image: picture("one") },
        { number: 2, latest: true, image: picture("two") },
        { number: 3, latest: true, image: null },
        { number: 4, latest: true, image: picture("four") },
      ],
    });
    expect(plan.sections.map((s) => s.inline?.image.data)).toEqual([
      "data:two",
      "data:one",
      "data:four",
    ]);
    expect(plan.sections.every((s) => s.inline.fit === "contain")).toBe(true);
    expect(plan.cover).toBeNull();
  });

  test("matches web pictures to sections by alt text and caption, never where nothing matches", () => {
    const web = (alt, caption = "", format = "jpeg") => ({
      alt,
      caption,
      url: `https://www.news.com/${alt.length}.jpg`,
      image: { ...picture(alt), format },
    });
    const plan = assignPictures({
      mode: "web",
      title: "Hospital AI adoption",
      sections,
      attached: [],
      web: [
        web("Hospital chart", "Hospital admissions by ward", "png"),
        web("Nurses using a tablet in a hospital ward"),
        web("Figure 2", "Market growth since 2020", "png"),
        web("Unrelated sunset"),
      ],
    });
    const [growth, pricing, team] = plan.sections.map((s) => s.inline);
    // A diagram is shown whole, under its caption.
    expect(growth).toMatchObject({
      caption: "Market growth since 2020",
      fit: "contain",
      credit: "Image: news.com",
    });
    expect(pricing).toBeNull();
    expect(team).toBeNull();
    // The cover is cropped, so it takes the best-matching photo, not the
    // better-matching diagram.
    expect(plan.cover.image.data).toBe(
      "data:Nurses using a tablet in a hospital ward"
    );
  });

  test("asks the illustrator for the cover and every divider", async () => {
    const generate = jest.fn(async (subject) => picture(subject));
    const plan = assignPictures({
      mode: "generate",
      title: "Deck",
      sections,
      attached: [],
      generate,
    });
    expect(generate).toHaveBeenCalledTimes(4);
    expect((await plan.cover.image).data).toBe("data:Deck");
    expect((await plan.sections[2].hero).data).toMatch(/^data:Team/);
    expect(plan.sections[1].inline).toBeNull();
  });
});
