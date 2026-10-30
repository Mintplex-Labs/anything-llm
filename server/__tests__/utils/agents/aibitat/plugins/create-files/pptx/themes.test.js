/* eslint-env jest */
const {
  getTheme,
} = require("../../../../../../../utils/agents/aibitat/plugins/create-files/pptx/themes.js");

describe("getTheme", () => {
  test("falls back to indigo for unknown or missing names", () => {
    expect(getTheme("midnight").name).toBe("Indigo");
    expect(getTheme(undefined).name).toBe("Indigo");
    expect(getTheme("  Emerald ").name).toBe("Emerald");
  });

  test("uses the 700 shade for bright themes and 950 for deep ones", () => {
    expect(getTheme("blue").dark).toBe("1D4ED8");
    expect(getTheme("slate").dark).toBe("020617");
  });

  test("takes indigo's light background and stripes from slate", () => {
    const theme = getTheme("indigo");
    expect(theme.light).toBe("F8FAFC");
    expect(theme.stripe).toBe("E2E8F0");
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
