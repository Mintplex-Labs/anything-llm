/* eslint-env jest */
const {
  LIMITS,
  normalizeSlides,
  assignLayouts,
  sectionSlide,
  normalizeCover,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/slides.js");

const items = (n, extra = {}) =>
  Array.from({ length: n }, (_, i) => ({
    title: `Idea ${i + 1}`,
    text: `What idea ${i + 1} means`,
    ...extra,
  }));

describe("normalizeSlides", () => {
  test("accepts a JSON string, a single slide or a {slides} wrapper", () => {
    const slide = { title: "A", points: ["x"] };
    expect(normalizeSlides(JSON.stringify([slide]))).toHaveLength(1);
    expect(normalizeSlides(slide)).toHaveLength(1);
    expect(normalizeSlides({ intro: "i", slides: [slide] })).toHaveLength(1);
    expect(normalizeSlides(null)).toEqual([]);
    expect(normalizeSlides("not json")).toEqual([]);
  });

  test("ignores layouts and dividers the model writes", () => {
    const slides = normalizeSlides([
      { layout: "section", title: "Divider" },
      { layout: "stats", title: "A", points: ["x"] },
    ]);
    expect(slides).toHaveLength(1);
    expect(slides[0]).not.toHaveProperty("layout");
  });

  test("drops slides with nothing to show and fills a missing title", () => {
    const [slide] = normalizeSlides([{ title: "Empty" }, { points: ["x"] }], {
      fallbackTitle: "Section",
    });
    expect(slide.title).toBe("Section");
    expect(slide.points).toEqual(["x"]);
  });

  test("accepts the old field names small models still use", () => {
    const [slide] = normalizeSlides([
      {
        title: "A",
        bullets: "one string",
        stats: [
          { title: "42%", text: "a" },
          { title: "17%", text: "b" },
        ],
      },
    ]);
    expect(slide.points).toEqual(["one string"]);
    expect(slide.figures).toEqual([
      { value: "42%", label: "a" },
      { value: "17%", label: "b" },
    ]);
  });

  test("turns a lone item or figure into a point", () => {
    const [slide] = normalizeSlides([
      {
        title: "A",
        items: [{ title: "Only", text: "one" }],
        figures: [{ value: "42%", label: "growth" }],
      },
    ]);
    expect(slide.items).toEqual([]);
    expect(slide.figures).toEqual([]);
    expect(slide.points).toEqual(["42% growth", "Only: one"]);
  });

  test("clips text and lists to the limits", () => {
    const [slide] = normalizeSlides([
      {
        title: "word ".repeat(40),
        points: Array(10).fill("word ".repeat(60)),
      },
    ]);
    expect(slide.title.length).toBeLessThanOrEqual(LIMITS.title);
    expect(slide.title.endsWith("…")).toBe(true);
    expect(slide.points).toHaveLength(LIMITS.points);
    for (const point of slide.points)
      expect(point.length).toBeLessThanOrEqual(LIMITS.point);
  });

  test("coerces table rows given as strings or objects, pads columns and drops header-only tables", () => {
    const [slide, empty] = normalizeSlides([
      {
        title: "T",
        table: {
          headers: ["a", "b", "c"],
          rows: ["1 | 2", { a: "3", b: "4", c: "5" }],
        },
      },
      { title: "U", points: ["x"], table: { headers: ["a"], rows: [] } },
    ]);
    expect(slide.table.rows).toEqual([
      ["1", "2", ""],
      ["3", "4", "5"],
    ]);
    expect(empty.table).toBeNull();
  });

  test("keeps each chart value on its own category and rejects placeholder charts", () => {
    const [ok, flat] = normalizeSlides([
      {
        title: "A",
        chart: {
          categories: ["Q1", "Q2", "Q3", "Q4", "Q5"],
          values: ["$10", "20", null, 30, 40],
        },
      },
      { title: "B", points: ["x"], chart: { values: [5, 5, 5] } },
    ]);
    expect(ok.chart).toEqual({
      type: "bar",
      categories: ["Q2", "Q4", "Q5"],
      values: [20, 30, 40],
    });
    expect(flat.chart).toBeNull();
  });
});

describe("normalizeSlides with sources", () => {
  const sources =
    "Revenue grew 23% to $4,200,000. Churn fell to 3.1%. We have 48 staff.";
  const normalize = (slide) => normalizeSlides([slide], { sources })[0];

  test("keeps figures the sources state and drops invented ones", () => {
    const slide = normalize({
      title: "Results",
      figures: [
        { value: "23%", label: "growth" },
        { value: "$4.2M", label: "revenue" },
        { value: "4200000", label: "revenue" },
        { value: "99%", label: "accuracy" },
        { value: "48", label: "staff" },
      ],
    });
    expect(slide.figures.map((f) => f.value)).toEqual(["23%", "4200000", "48"]);
  });

  test("needs a one-digit figure to appear with its unit", () => {
    const withUnits = (sources) =>
      normalizeSlides(
        [
          {
            title: "A",
            figures: [
              { value: "2GB", label: "RAM" },
              { value: "48", label: "staff" },
              { value: "12%", label: "growth" },
            ],
          },
        ],
        { sources }
      )[0].figures.map((f) => f.value);
    expect(withUnits("2 people, 48 staff, 12% growth")).toEqual(["48", "12%"]);
    expect(withUnits("Needs 2 GB of RAM, 48 staff, 12% growth")).toEqual([
      "2GB",
      "48",
      "12%",
    ]);
  });

  test("drops points and items that state quantities the sources do not", () => {
    const slide = normalize({
      title: "A",
      points: [
        "Responses in under 100ms",
        "Revenue grew 23%",
        "Runs Llama 3.1 in 3 steps",
        "Founded in 2019",
      ],
      items: [
        { title: "Fast", text: "Handles 10,000 requests per second" },
        { title: "Lean", text: "Team of 48 people" },
        { title: "Open", text: "MIT licensed" },
      ],
    });
    expect(slide.points).toEqual([
      "Revenue grew 23%",
      "Runs Llama 3.1 in 3 steps",
      "Founded in 2019",
    ]);
    expect(slide.items.map((i) => i.title)).toEqual(["Lean", "Open"]);
  });

  test("checks only the text a slide shows, and stays fast on runaway model output", () => {
    const tail = `${"word ".repeat(30)}and 999% more`;
    expect(normalize({ title: "A", points: [tail] }).points).toHaveLength(1);

    // Repetition loops like these made the quantity and cell regexes
    // backtrack for seconds on the server's only thread.
    const runaway = [
      "1,".repeat(50000),
      " ".repeat(100000),
      "1.".repeat(50000),
    ];
    const many = Array(1000).fill(runaway[0]);
    const started = Date.now();
    for (const s of runaway)
      normalize({
        title: s,
        points: many,
        items: many.map((x) => ({ title: x, text: s })),
        table: { headers: many, rows: [s, many, { a: s }] },
        chart: { values: many, categories: many },
        quote: s,
      });
    expect(Date.now() - started).toBeLessThan(1000);
  });

  test("drops table rows with invented quantities and chart values not in the sources", () => {
    const slide = normalize({
      title: "A",
      table: {
        headers: ["Metric", "Value"],
        rows: [
          ["Growth", "23%"],
          ["Uptime", "99.99%"],
        ],
      },
    });
    expect(slide.table.rows).toEqual([["Growth", "23%"]]);
    const chart = normalize({
      title: "B",
      points: ["x"],
      chart: { values: [23, 48, 3.1, 77] },
    }).chart;
    expect(chart.values).toEqual([23, 48, 3.1]);
    expect(
      normalize({ title: "C", points: ["x"], chart: { values: [23, 77, 88] } })
        .chart
    ).toBeNull();
  });

  test("keeps only quotes that appear word for word in the sources", () => {
    const quoted = "We replaced three tools with one assistant.";
    const [real, invented] = normalizeSlides(
      [
        { title: "A", quote: { text: `“${quoted}”`, by: "— Jane" } },
        {
          title: "B",
          points: ["x"],
          quote: { text: "AI changed everything for us.", by: "CEO" },
        },
      ],
      { sources: `Jane said: "${quoted}"` }
    );
    expect(real.quote).toEqual({ text: quoted, by: "Jane" });
    expect(invented.quote).toBeNull();
  });
});

describe("assignLayouts", () => {
  const layoutsOf = (slides, state = { used: {}, previous: null }) =>
    assignLayouts(normalizeSlides(slides), state).map((s) => s.layout);

  test("picks the natural layout for data", () => {
    expect(
      layoutsOf([
        { title: "A", chart: { values: [1, 2, 3] } },
        { title: "B", table: { rows: [["a", "b"]] } },
        { title: "C", figures: [{ value: "42%" }, { value: "17%" }] },
        { title: "D", quote: { text: "q" } },
        { title: "E", items: items(2) },
        { title: "F", items: items(4), ordered: true },
      ])
    ).toEqual(["chart", "table", "stats", "quote", "comparison", "steps"]);
  });

  test("never repeats a layout on consecutive slides, even across sections", () => {
    const state = { used: {}, previous: null };
    const sections = [0, 1, 2].map(() =>
      layoutsOf(Array(3).fill({ title: "A", items: items(3) }), state)
    );
    const all = sections.flat();
    for (let i = 1; i < all.length; i++) expect(all[i]).not.toBe(all[i - 1]);
    expect(new Set(all)).toEqual(new Set(["cards", "bullets", "split"]));
  });

  test("uses the layout the model asks for when the content fits and it is not a repeat", () => {
    expect(
      layoutsOf([
        { title: "A", layout: "split", points: ["a"] },
        { title: "B", layout: "split", points: ["b"] },
        { title: "C", layout: "chart", points: ["c"] },
        { title: "D", layout: "nope", items: items(3) },
        { title: "E", layout: "bullets", items: items(3) },
      ])
    ).toEqual(["split", "bullets", "split", "cards", "bullets"]);
  });

  test("prefers layouts the deck has used least", () => {
    const state = { used: { cards: 5 }, previous: null };
    expect(layoutsOf([{ title: "A", items: items(3) }], state)).toEqual([
      "bullets",
    ]);
  });

  test("only uses split for lists it can hold", () => {
    expect(
      layoutsOf([
        { title: "A", points: Array(6).fill("p") },
        { title: "B", points: Array(6).fill("p") },
      ])
    ).toEqual(["bullets", "bullets"]);
  });
});

describe("sectionSlide and normalizeCover", () => {
  test("build clipped divider and cover text", () => {
    const divider = sectionSlide("x".repeat(100), " intro ");
    expect(divider.layout).toBe("section");
    expect(divider.title.length).toBeLessThanOrEqual(LIMITS.title);
    expect(divider.subtitle).toBe("intro");
    expect(normalizeCover({ title: null, subtitle: 5 })).toEqual({
      title: "",
      subtitle: "5",
    });
  });
});
