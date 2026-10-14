/* eslint-env jest */
const {
  normalizeSlides,
  pruneDividers,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/slides.js");

describe("normalizeSlides", () => {
  test("accepts a JSON string, a single slide or a {slides} wrapper", () => {
    const slide = { layout: "bullets", title: "A", bullets: ["x"] };
    expect(normalizeSlides(JSON.stringify([slide]))).toHaveLength(1);
    expect(normalizeSlides(slide)).toHaveLength(1);
    expect(normalizeSlides({ slides: [slide] })).toHaveLength(1);
    expect(normalizeSlides(null)).toEqual([]);
    expect(normalizeSlides("not json")).toEqual([]);
  });

  test("drops slides with no content and fills a missing title", () => {
    const [slide] = normalizeSlides(
      [{ layout: "bullets" }, { layout: "bullets", bullets: ["x"] }],
      "Section"
    );
    expect(slide.title).toBe("Section");
    expect(slide.layout).toBe("bullets");
  });

  test("falls back to a layout the data supports", () => {
    const [chart, cards, bullets] = normalizeSlides([
      { layout: "bullets", title: "A", chart: { values: [1, 2] } },
      { layout: "stats", title: "B", items: [{ title: "Prose, not a number" }] },
      { layout: "table", title: "C", bullets: "one string" },
    ]);
    expect(chart.layout).toBe("chart");
    expect(cards.layout).toBe("cards");
    expect(bullets.layout).toBe("bullets");
    expect(bullets.bullets).toEqual(["one string"]);
  });

  test("keeps stats only for short numeric titles", () => {
    const [ok, wordplay] = normalizeSlides([
      { layout: "stats", title: "A", items: [{ title: "42%", text: "l" }] },
      { layout: "stats", title: "B", items: [{ title: "0", text: "l" }] },
    ]);
    expect(ok.layout).toBe("stats");
    expect(wordplay.layout).toBe("cards");
  });

  test("coerces table rows given as strings or objects and pads columns", () => {
    const [slide] = normalizeSlides([
      {
        layout: "table",
        title: "T",
        table: { headers: ["a", "b", "c"], rows: ["1 | 2", { a: "3", b: "4", c: "5" }] },
      },
    ]);
    expect(slide.table.rows).toEqual([
      ["1", "2", ""],
      ["3", "4", "5"],
    ]);
  });

  test("rejects placeholder charts and fills missing categories", () => {
    const [flat, ok] = normalizeSlides([
      { layout: "chart", title: "A", bullets: ["x"], chart: { values: [5, 5, 5] } },
      { layout: "chart", title: "B", chart: { type: "nope", values: ["1", "2"] } },
    ]);
    expect(flat.layout).toBe("bullets");
    expect(flat.chart).toBeNull();
    expect(ok.chart).toEqual({ type: "bar", categories: ["1", "2"], values: [1, 2] });
  });
});

describe("pruneDividers", () => {
  test("drops dividers with no content after them", () => {
    const section = (title) => ({ layout: "section", title });
    const content = { layout: "bullets", title: "c" };
    expect(pruneDividers([section("a"), section("b"), content, section("c")])).toEqual([
      section("b"),
      content,
    ]);
  });
});
