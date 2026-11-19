/* eslint-env jest */
const {
  getTheme,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/themes.js");

describe("getTheme", () => {
  test("uses a named theme whatever the title", () => {
    expect(getTheme("  Emerald ", undefined, "AI Trends").name).toBe("Emerald");
  });

  test("picks a palette from the title when the name is missing or unknown, the same one each time", () => {
    const titles = Array.from({ length: 40 }, (_, i) => `Deck ${i}`);
    const picked = titles.map((title) => getTheme(undefined, "", title).name);
    expect(new Set(picked).size).toBeGreaterThanOrEqual(6);
    expect(titles.map((title) => getTheme("midnight", "", title).name)).toEqual(
      picked
    );
    expect(getTheme(undefined, "", "Q3 Review")).toEqual(
      getTheme(undefined, "", "Q3 Review")
    );
  });

  test("builds the scale around a brand color as its 600 shade", () => {
    for (const accent of ["E11D48", "#e11d48"]) {
      const theme = getTheme("blue", accent);
      expect(theme.name).toBe("Blue");
      expect(theme.scale[600]).toBe("E11D48");
      expect(theme.light).toBe(theme.scale[50]);
    }
  });

  test("ignores malformed, near-black and near-white brand colors", () => {
    const blue = getTheme("blue");
    for (const accent of ["", "red", "E11D4", "000000", "111111", "FAFAFA"])
      expect(getTheme("blue", accent)).toEqual(blue);
  });
});
