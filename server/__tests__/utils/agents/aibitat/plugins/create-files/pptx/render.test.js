/* eslint-env jest */

// Records every text box and table instead of writing a file, so the test
// can check what was drawn and where.
const mockDrawn = { texts: [], tables: [] };
jest.mock("pptxgenjs", () =>
  jest.fn().mockImplementation(() => ({
    ShapeType: { rect: "rect", roundRect: "roundRect", ellipse: "ellipse" },
    ChartType: {
      bar: "bar",
      line: "line",
      pie: "pie",
      doughnut: "doughnut",
      area: "area",
    },
    addSlide: () => ({
      addText: (text, opts) => mockDrawn.texts.push({ text, opts }),
      addTable: (rows, opts) => mockDrawn.tables.push({ rows, opts }),
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
  createPreviewer,
  textHeight,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/render.js");
const {
  LAYOUTS,
  LIMITS,
  COVER_LIMITS,
  normalizeSlides,
  sectionSlide,
  normalizeCover,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/slides.js");
const {
  getTheme,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/themes.js");

describe("fitText", () => {
  test("wraps at word boundaries, shrinking a title that would overflow at the max size", () => {
    const size = fitText("Market Overview 2026", {
      w: 1768,
      h: 647,
      max: 250,
      min: 80,
      maxLines: 1,
      glyph: "bold",
    });
    expect(size).toBeLessThan(250);
  });

  test("never picks a size that would break a word mid-word", () => {
    const size = fitText("Daily Water Intake Recommendations", {
      w: 700,
      h: 400,
      max: 100,
      min: 48,
      maxLines: 4,
    });
    expect(size).toBeLessThan(100);
    expect(
      fitText("Recommendations", { w: 700, h: 400, max: size, maxLines: 1 })
    ).toBe(size);
  });
});

describe("renderDeck with more text than any layout holds", () => {
  const WORDS =
    "revenue across every region grew faster than planned while operating costs held steady through the year".split(
      " "
    );
  /** Realistic prose of `n` characters or just under. */
  const prose = (n) => {
    let out = "";
    for (let i = 0; out.length < n; i++)
      out += (out ? " " : "") + WORDS[i % WORDS.length];
    return out.slice(0, n).trimEnd();
  };
  // Three times any limit, so every string has to be clipped.
  const long = (limit) => prose(limit * 3);
  const many = (n, make) => Array.from({ length: n }, make);
  const FIGURE = "+$1,234,567M"; // The longest value a figure may have.

  /** Content with `count` entries of the kind `kind`, every string over its limit. */
  function overfull(kind, count) {
    const slide = { title: long(LIMITS.title) };
    if (kind === "points") slide.points = many(count, () => long(LIMITS.point));
    if (kind === "items" || kind === "ordered")
      slide.items = many(count, () => ({
        title: long(LIMITS.itemTitle),
        text: long(LIMITS.itemText),
      }));
    if (kind === "ordered") slide.ordered = true;
    if (kind === "figures")
      slide.figures = many(count, () => ({
        value: FIGURE,
        label: long(LIMITS.figureLabel),
      }));
    if (kind === "chart") {
      slide.chart = {
        values: [1, 2, 3],
        categories: many(3, () => long(LIMITS.category)),
      };
      slide.points = many(count, () => long(LIMITS.point));
    }
    if (kind === "table")
      slide.table = {
        headers: many(count, () => long(LIMITS.cell)),
        rows: many(LIMITS.tableRows + 3, () =>
          many(count, () => long(LIMITS.cell))
        ),
      };
    if (kind === "quote")
      slide.quote = { text: long(LIMITS.quote), by: long(LIMITS.quoteBy) };
    return normalizeSlides([slide])[0];
  }

  // Each layout with every amount of content it can be given.
  const range = (from, to) => many(to - from + 1, (_, i) => from + i);
  const CASES = [
    ...range(1, LIMITS.points + 2).map((n) => ["bullets", "points", n]),
    ...range(2, LIMITS.items + 2).map((n) => ["bullets", "items", n]),
    ...range(1, 5).map((n) => ["split", "points", n]),
    ...range(2, 5).map((n) => ["split", "items", n]),
    ...range(2, LIMITS.items + 2).map((n) => ["cards", "items", n]),
    ...range(3, LIMITS.items + 2).map((n) => ["steps", "ordered", n]),
    ["comparison", "items", 2],
    ...range(2, LIMITS.figures + 2).map((n) => ["stats", "figures", n]),
    ...range(0, LIMITS.points).map((n) => ["chart", "chart", n]),
    ...range(1, LIMITS.tableCols + 2).map((n) => ["table", "table", n]),
    ["quote", "quote", 0],
  ];

  test("every layout has cases", () => {
    expect(new Set(CASES.map(([layout]) => layout))).toEqual(
      new Set(Object.keys(LAYOUTS))
    );
  });

  /** Every text box or table cell that overflows its box or the slide. */
  function overflows() {
    const px = (inches) => inches * 144;
    const problems = [];
    const check = (label, box, height) => {
      const onSlide =
        box.x >= 0 &&
        box.y >= 0 &&
        box.x + box.w <= 1921 &&
        box.y + box.h <= 1081;
      if (height > box.h + 1 || !onSlide)
        problems.push(
          `"${String(label).slice(0, 30)}…" needs ${Math.round(height)}px of ${Math.round(box.h)}px at (${Math.round(box.x)}, ${Math.round(box.y)})`
        );
    };

    for (const { text, opts } of mockDrawn.texts) {
      const size = opts.fontSize * 2;
      const box = {
        x: px(opts.x),
        y: px(opts.y),
        w: px(opts.w),
        h: px(opts.h),
      };
      // Runs form paragraphs that end at a run with breakLine.
      const paragraphs = [];
      let first = null;
      for (const run of Array.isArray(text) ? text : [{ text, options: {} }]) {
        if (!first) {
          first = run.options;
          paragraphs.push("");
        }
        paragraphs[paragraphs.length - 1] += run.text;
        if (run.options.breakLine) first = null;
      }
      const head = Array.isArray(text) ? text[0].options : {};
      const indent = head.bullet ? head.bullet.indent * 2 : 0;
      const lineGap = head.paraSpaceAfter
        ? (head.paraSpaceAfter * 2) / size
        : 0;
      const glyph =
        opts.bold && opts.fontFace === "Aptos Display"
          ? "heading"
          : opts.bold
            ? "bold"
            : "regular";
      check(
        paragraphs[0],
        box,
        textHeight(paragraphs, size, { w: box.w - indent, lineGap, glyph })
      );
    }

    for (const { rows, opts } of mockDrawn.tables) {
      const size = opts.fontSize * 2;
      const [padY, padX] = opts.margin.map(px);
      let y = px(opts.y);
      rows.forEach((row, r) => {
        const h = px(opts.rowH[r]);
        row.forEach((cell, c) => {
          const w = px(opts.colW[c]);
          const height = textHeight(cell.text || " ", size, {
            w: w - 2 * padX,
            glyph: cell.options.bold ? "bold" : "regular",
          });
          check(cell.text, { x: px(opts.x), y, w, h: h - 2 * padY }, height);
        });
        y += h;
      });
      check(
        "table",
        { x: px(opts.x), y: px(opts.y), w: px(opts.w), h: y - px(opts.y) },
        0
      );
    }
    return problems;
  }

  test.each(CASES)(
    "%s with %s × %i fits every text box",
    async (layout, kind, count) => {
      const content = overfull(kind, count);
      expect(LAYOUTS[layout](content)).toBe(true);
      const slide = { layout, subtitle: "", ...content };
      mockDrawn.texts.length = 0;
      mockDrawn.tables.length = 0;
      await renderDeck(
        {
          ...normalizeCover({
            title: long(COVER_LIMITS.title),
            subtitle: long(COVER_LIMITS.subtitle),
          }),
          slides: [
            sectionSlide(long(LIMITS.title), long(LIMITS.subtitle)),
            slide,
          ],
        },
        getTheme("blue")
      );
      expect(overflows()).toEqual([]);
    }
  );

  test("previews every layout as plain shapes and text the chat UI can draw", () => {
    const theme = getTheme("blue");
    const preview = createPreviewer({ title: "Deck", subtitle: "Sub" }, theme);
    const textOf = (shown) =>
      shown.items
        .filter((item) => item.kind === "text")
        .map((item) => item.runs.map((run) => run.text).join(""));

    const cover = preview(null);
    expect(cover.background).toBe(theme.dark);
    expect(textOf(cover)).toEqual(["Deck", "Sub"]);
    expect(textOf(preview(sectionSlide("Intro", "Why")))).toEqual([
      "01",
      "Intro",
      "Why",
      "Deck",
    ]);
    for (const [layout, kind, count] of CASES) {
      const shown = preview({ layout, subtitle: "", ...overfull(kind, count) });
      expect(JSON.parse(JSON.stringify(shown))).toEqual(shown);
      expect(shown.items.length).toBeGreaterThan(0);
      for (const item of shown.items)
        for (const key of ["x", "y", "w"])
          expect(Number.isFinite(item[key])).toBe(true);
      // The brand mark is left out of previews.
      expect(textOf(shown)).not.toContain("Created with");
    }
  });
});
