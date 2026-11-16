/* eslint-env jest */
const sharp = require("sharp");
const {
  createPreviewer,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/render.js");
const {
  slideThumbnail,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/thumbnail.js");
const {
  slidePreviews,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/previews.js");
const {
  normalizeSlides,
  assignLayouts,
  sectionSlide,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/slides.js");
const {
  getTheme,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/themes.js");

const deck = { title: "Deck", subtitle: "Sub" };
const ideas = (n) =>
  Array.from({ length: n }, (_, i) => ({
    title: `Idea ${i}`,
    text: "Why it matters",
  }));

/** One slide of every layout, the way deck-builder.js produces them. */
function everyLayout() {
  const content = normalizeSlides([
    { title: "Bullets", points: ["a", "b"] },
    { title: "Split", layout: "split", points: ["a", "b"] },
    { title: "Cards", items: ideas(3) },
    { title: "Steps", items: ideas(4), ordered: true },
    { title: "Steps list", items: ideas(6), ordered: true },
    { title: "Comparison", items: ideas(2) },
    {
      title: "Stats",
      figures: [
        { value: "42%", label: "a" },
        { value: "17%", label: "b" },
      ],
    },
    { title: "Bar", chart: { type: "bar", values: [1, 2, 3] } },
    { title: "Line", chart: { type: "line", values: [1, 3, 2] } },
    { title: "Pie", chart: { type: "doughnut", values: [1, 2, 3] } },
    { title: "Table", table: { headers: ["a", "b"], rows: [["1", "2"]] } },
    { title: "Quote", quote: { text: "Words", by: "Someone" } },
  ]);
  return [
    sectionSlide("Intro", "Why"),
    ...assignLayouts(content, { used: {}, previous: null }),
  ];
}

const decode = (url) => {
  expect(url).toMatch(/^data:image\/jpeg;base64,/);
  return sharp(Buffer.from(url.split(",")[1], "base64")).metadata();
};

describe("slideThumbnail", () => {
  test("bakes the cover and every layout into a 16:9 JPEG", async () => {
    const preview = createPreviewer(deck, getTheme("blue"));
    const slides = [null, ...everyLayout()];
    expect(
      new Set(slides.slice(2).map((s) => s.layout)).size
    ).toBeGreaterThanOrEqual(9);
    for (const slide of slides) {
      const image = await decode(await slideThumbnail(preview(slide)));
      expect([image.format, image.width, image.height]).toEqual([
        "jpeg",
        1024,
        576,
      ]);
    }
  });

  test("escapes model text so it cannot break the SVG", async () => {
    const preview = createPreviewer(
      { title: `Q&A <b>"quoted"</b> it's`, subtitle: "]]> &amp; <!--" },
      getTheme("blue")
    );
    const image = await decode(await slideThumbnail(preview(null)));
    expect(image.width).toBe(1024);
  });
});

describe("slidePreviews", () => {
  const agent = () => {
    const sent = [];
    return {
      sent,
      handlerProps: { log: jest.fn() },
      socket: { send: (type, content) => sent.push({ type, ...content }) },
    };
  };

  test("sends each slide as an image in deck order, then done", async () => {
    const aibitat = agent();
    const previews = slidePreviews(aibitat, deck, getTheme("blue"));
    previews.add(null);
    everyLayout().slice(0, 2).forEach(previews.add);
    await previews.end();
    const { sent } = aibitat;
    expect(sent.map((e) => e.type)).toEqual(Array(4).fill("pptxSlidePreview"));
    expect(new Set(sent.map((e) => e.deckId)).size).toBe(1);
    expect(sent.slice(0, 3).map((e) => e.index)).toEqual([0, 1, 2]);
    for (const e of sent.slice(0, 3))
      expect(e.image).toMatch(/^data:image\/jpeg;base64,/);
    expect(sent[3]).toEqual({
      type: "pptxSlidePreview",
      deckId: sent[0].deckId,
      done: true,
    });
  });

  test("stops previewing after a failure without throwing, and sends nothing when no slide went out", async () => {
    const aibitat = agent();
    const previews = slidePreviews(aibitat, deck, getTheme("blue"));
    expect(() => previews.add({ layout: "nope" })).not.toThrow();
    previews.add(null);
    await previews.end();
    expect(aibitat.sent).toEqual([]);
    expect(aibitat.handlerProps.log).toHaveBeenCalledWith(
      expect.stringMatching(/Previews disabled/)
    );
  });

  test("never throws when the socket does", async () => {
    const previews = slidePreviews(
      {
        handlerProps: { log: () => {} },
        socket: {
          send: () => {
            throw new Error("closed");
          },
        },
      },
      deck,
      getTheme("blue")
    );
    previews.add(null);
    await expect(previews.end()).resolves.toBeUndefined();
  });
});

describe("slidePreviews with pictures", () => {
  const {
    preparePicture,
  } = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/images.js");
  const {
    pictureSlide,
  } = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/slides.js");
  const red = () =>
    sharp({
      create: { width: 800, height: 600, channels: 3, background: "#ff0000" },
    })
      .png()
      .toBuffer()
      .then(preparePicture);
  const pixel = async (url, x, y) => {
    const { data, info } = await sharp(Buffer.from(url.split(",")[1], "base64"))
      .raw()
      .toBuffer({ resolveWithObject: true });
    const i = (y * info.width + x) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const isRed = ([r, g, b]) => r > 200 && g < 60 && b < 60;

  async function pictureDeck(photo) {
    const state = { used: {}, previous: null };
    const [beside] = assignLayouts(
      normalizeSlides([{ title: "Beside", points: ["a", "b"] }]).map((s) => ({
        ...s,
        image: photo,
        fit: "cover",
        credit: "Image: news.com",
      })),
      state
    );
    const [alone] = assignLayouts(
      [
        pictureSlide("Alone", {
          image: photo,
          fit: "contain",
          caption: "A caption",
        }),
      ],
      state
    );
    return [
      { ...sectionSlide("Intro", "Why"), image: Promise.resolve(photo) },
      beside,
      alone,
    ];
  }

  test("previews draw pictures, waiting for ones still being generated", async () => {
    const photo = await red();
    const aibitat = {
      sent: [],
      handlerProps: { log: jest.fn() },
      socket: { send: (type, content) => aibitat.sent.push(content) },
    };
    const previews = slidePreviews(
      aibitat,
      { ...deck, image: new Promise((r) => setTimeout(() => r(photo), 20)) },
      getTheme("blue")
    );
    previews.add(null);
    (await pictureDeck(photo)).forEach(previews.add);
    await previews.end();
    expect(aibitat.handlerProps.log).not.toHaveBeenCalled();
    const images = aibitat.sent.filter((e) => e.image);
    expect(images.map((e) => e.index)).toEqual([0, 1, 2, 3]);
    // Cover and divider pictures fill the right; "image" fills its panel;
    // a picture on its own sits in the middle.
    expect(isRed(await pixel(images[0].image, 900, 288))).toBe(true);
    expect(isRed(await pixel(images[1].image, 900, 288))).toBe(true);
    expect(isRed(await pixel(images[2].image, 800, 100))).toBe(true);
    expect(isRed(await pixel(images[3].image, 512, 300))).toBe(true);
    expect(isRed(await pixel(images[3].image, 40, 300))).toBe(false);
  });
});
