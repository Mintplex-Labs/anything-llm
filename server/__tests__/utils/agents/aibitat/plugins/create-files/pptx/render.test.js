/* eslint-env jest */
const {
  fitText,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/render.js");

describe("fitText", () => {
  test("keeps the largest size when the text fits", () => {
    expect(fitText("Hi", { w: 1000, h: 400, max: 100 })).toBe(100);
  });

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

  test("falls back to the minimum when nothing fits", () => {
    expect(
      fitText("Supercalifragilisticexpialidocious", {
        w: 100,
        h: 20,
        max: 40,
        min: 12,
      })
    ).toBe(12);
  });
});
