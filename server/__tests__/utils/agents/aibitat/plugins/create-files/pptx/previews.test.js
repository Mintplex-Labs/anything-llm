/* eslint-env jest */
const { loadImage } = require("canvas");
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
  return loadImage(Buffer.from(url.split(",")[1], "base64"));
};

describe("slideThumbnail", () => {
  test("bakes the cover and every layout into a 16:9 JPEG", async () => {
    const preview = createPreviewer(deck, getTheme("blue"));
    const slides = [null, ...everyLayout()];
    expect(
      new Set(slides.slice(2).map((s) => s.layout)).size
    ).toBeGreaterThanOrEqual(9);
    for (const slide of slides) {
      const image = await decode(slideThumbnail(preview(slide)));
      expect([image.width, image.height]).toEqual([1024, 576]);
    }
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

  test("sends each slide as an image in deck order, then done", () => {
    const aibitat = agent();
    const previews = slidePreviews(aibitat, deck, getTheme("blue"));
    previews.add(null);
    everyLayout().slice(0, 2).forEach(previews.add);
    previews.end();
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

  test("stops previewing after a failure without throwing, and sends nothing when no slide went out", () => {
    const aibitat = agent();
    const previews = slidePreviews(aibitat, deck, getTheme("blue"));
    expect(() => previews.add({ layout: "nope" })).not.toThrow();
    previews.add(null);
    previews.end();
    expect(aibitat.sent).toEqual([]);
    expect(aibitat.handlerProps.log).toHaveBeenCalledWith(
      expect.stringMatching(/Previews disabled/)
    );
  });

  test("never throws when the socket does", () => {
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
    expect(() => {
      previews.add(null);
      previews.end();
    }).not.toThrow();
  });
});
