/* eslint-env jest */

// Records every text box instead of writing a file, so the test can check
// what was drawn and where.
const boxes = [];
jest.mock("pptxgenjs", () =>
  jest.fn().mockImplementation(() => ({
    ShapeType: { rect: "rect", roundRect: "roundRect" },
    ChartType: {
      bar: "bar",
      line: "line",
      pie: "pie",
      doughnut: "doughnut",
      area: "area",
    },
    addSlide: () => ({
      addText: (text, opts) => boxes.push({ text, opts }),
      addShape: () => {},
      addImage: () => {},
      addChart: () => {},
      addNotes: () => {},
    }),
    write: async () => Buffer.from(""),
  }))
);

const {
  fitText,
  renderDeck,
  textHeight,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/render.js");
const {
  LAYOUTS,
  DEFAULT_LIMITS,
  COVER_LIMITS,
  normalizeSlides,
  normalizeCover,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/slides.js");
const {
  getTheme,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/themes.js");

describe("fitText", () => {
  test("wraps at word boundaries, shrinking a title that would overflow at the max size", () => {
    // Counting characters alone says this fits on two lines at 250px, but
    // "Market / Overview / 2026" breaks into three and overflows the box.
    const size = fitText("Market Overview 2026", {
      w: 1768,
      h: 647,
      max: 250,
      min: 80,
      maxLines: 3,
      glyph: "bold",
    });
    expect(size).toBeLessThan(250);
  });

  test("never picks a size that would break a word mid-word", () => {
    const size = fitText("Daily Water Intake Recommendations", {
      w: 880,
      h: 400,
      max: 100,
      min: 48,
      maxLines: 4,
    });
    expect(size).toBeLessThan(100);
    expect(
      fitText("Recommendations", { w: 880, h: 400, max: size, maxLines: 1 })
    ).toBe(size);
  });
});

describe("renderDeck with more text than any layout holds", () => {
  const WORDS =
    "revenue across every region grew faster than planned while operating costs held steady through the year".split(
      " "
    );
  /** Realistic prose of exactly `n` characters or just under. */
  const prose = (n) => {
    let out = "";
    for (let i = 0; out.length < n; i++)
      out += (out ? " " : "") + WORDS[i % WORDS.length];
    return out.slice(0, n).trimEnd();
  };
  // Three times any limit, so every string has to be clipped.
  const long = (limit) => prose(limit * 3);
  const many = (limit, make) => Array.from({ length: limit + 3 }, make);
  const STAT = "+$1,234,567.8M"; // The longest number a stat title may be.

  /** One slide of `layout` with `count` items and every field over its limits. */
  function overfullSlide(layout, count) {
    const max = { ...DEFAULT_LIMITS, ...LAYOUTS[layout].limits };
    const items = Array.from({ length: count }, () => ({
      title: layout === "stats" ? STAT : long(max.itemTitle),
      text: long(max.itemText),
      bullets: many(max.itemBullets, () => long(max.itemBullet)),
    }));
    return {
      layout,
      title: long(max.title),
      subtitle: long(max.subtitle),
      bullets: many(max.bullets, () => long(max.bullet)),
      items,
      chart: layout === "chart" && {
        type: "bar",
        categories: ["a", "b", long(40)],
        values: [1, 2, 3],
      },
      table: layout === "table" && {
        headers: Array(count).fill(long(max.cell)),
        rows: Array(12).fill(Array(count).fill(long(max.cell))),
      },
    };
  }

  /** Every text box that overflows its box or the slide. */
  function overflows() {
    const px = (inches) => inches * 144;
    return boxes.flatMap(({ text, opts }) => {
      const size = opts.fontSize * 2;
      const box = {
        x: px(opts.x),
        y: px(opts.y),
        w: px(opts.w),
        h: px(opts.h),
      };
      const isBullets = Array.isArray(text) && text[0]?.options?.bullet;
      const paragraphs = Array.isArray(text)
        ? isBullets
          ? text.map((run) => run.text)
          : [text.map((run) => run.text).join("")]
        : [String(text)];
      // Caps text is uppercased by the renderer; numbers like "$1.2M" are not caps.
      const caps = paragraphs.every(
        (p) => /[A-Z]{2}/.test(p) && p === p.toUpperCase()
      );
      const height = textHeight(paragraphs, size, {
        w: isBullets ? box.w - size * 1.5 : box.w,
        lineGap: isBullets ? 0.5 : 0,
        glyph: caps ? "caps" : opts.bold ? "bold" : "regular",
      });
      const onSlide =
        box.x >= 0 &&
        box.y >= 0 &&
        box.x + box.w <= 1921 &&
        box.y + box.h <= 1081;
      return height <= box.h + 1 && onSlide
        ? []
        : [
            `"${paragraphs[0].slice(0, 30)}…" needs ${Math.round(height)}px of ${Math.round(box.h)}px at (${Math.round(box.x)}, ${Math.round(box.y)})`,
          ];
    });
  }

  const cases = Object.keys(LAYOUTS).flatMap((layout) => {
    const max = { ...DEFAULT_LIMITS, ...LAYOUTS[layout].limits };
    // Up to one more item than the layout holds; table counts are columns.
    const counts =
      layout === "table"
        ? [1, 2, 4, 6, 8]
        : Array.from({ length: max.items + 1 }, (_, i) => i + 1).filter(
            (n) => layout !== "two-column" || n >= 2
          );
    return counts.map((count) => [layout, count]);
  });

  test.each(cases)(
    "%s with %i items fits every text box",
    async (layout, count) => {
      const [slide] = normalizeSlides([overfullSlide(layout, count)]);
      expect(slide.layout).toBe(layout);
      boxes.length = 0;
      // Rendered twice so layouts with two designs draw both.
      await renderDeck(
        {
          ...normalizeCover({
            title: long(COVER_LIMITS.title),
            subtitle: long(COVER_LIMITS.subtitle),
          }),
          slides: [slide, slide],
        },
        getTheme("blue")
      );
      expect(overflows()).toEqual([]);
    }
  );
});
