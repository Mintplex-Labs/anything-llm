/* eslint-env jest */
const http = require("http");
const { JSDOM } = require("jsdom");
const docx = require("docx");
const {
  htmlToDocxElements,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/docx/utils.js");

describe("htmlToDocxElements images", () => {
  let server;
  let port;
  const hits = [];

  beforeAll(
    () =>
      new Promise((resolve) => {
        server = http.createServer((req, res) => {
          hits.push(req.url);
          res.writeHead(200, { "content-type": "image/png" });
          res.end();
        });
        server.listen(0, "127.0.0.1", () => {
          port = server.address().port;
          resolve();
        });
      })
  );
  afterAll(() => new Promise((resolve) => server.close(resolve)));

  test("does not fetch images from this host, by name or by address", async () => {
    const logs = [];
    const html = [
      `http://127.0.0.1:${port}/a.png`,
      `http://localhost:${port}/b.png`,
      `http://[::ffff:127.0.0.1]:${port}/c.png`,
    ]
      .map((src) => `<img src="${src}"><p>text <img src="${src}"></p>`)
      .join("");

    await htmlToDocxElements(html, { JSDOM, docx }, (msg) => logs.push(msg));

    expect(hits).toEqual([]);
    expect(logs.filter((msg) => /not a public address/.test(msg))).toHaveLength(
      6
    );
  });
});
