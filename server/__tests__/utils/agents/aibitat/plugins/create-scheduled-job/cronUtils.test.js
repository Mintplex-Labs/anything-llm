/* eslint-env jest */
const later = require("@breejs/later");
const {
  convertCronLocalToUtc,
  catalogIdSet,
  readyToolsCatalog,
  renderCatalog,
  rejectedToolsMessage,
} = require("../../../../../../utils/agents/aibitat/plugins/create-scheduled-job/cronUtils");

// Offsets on this date: New York UTC-4, Tokyo UTC+9, Sydney UTC+10, Kolkata UTC+5:30.
const NOW = new Date("2026-09-30T12:00:00Z");

/** Local weekday names of the next `count` runs of a UTC cron, as the scheduler evaluates it. */
function nextRunWeekdays(utcCron, timeZone, count) {
  later.date.UTC();
  return later
    .schedule(later.parse.cron(utcCron))
    .next(count, new Date("2026-10-05T00:00:00Z"))
    .map((d) => d.toLocaleString("en-US", { timeZone, weekday: "short" }));
}

describe("convertCronLocalToUtc", () => {
  beforeEach(() => jest.useFakeTimers({ now: NOW }));
  afterEach(() => jest.useRealTimers());

  describe("time stays on the same UTC date", () => {
    it.each([
      ["0 9 * * 1", "America/New_York", "0 13 * * 1"],
      ["30 14 15 * *", "Asia/Tokyo", "30 5 15 * *"],
      ["0 9 * * *", "America/New_York", "0 13 * * *"],
      ["0 9 * * 1-5", "UTC", "0 9 * * 1-5"],
      ["0 21 15 * 1", "UTC", "0 21 15 * 1"],
    ])("%s in %s -> %s", (cron, tz, expected) => {
      expect(convertCronLocalToUtc(cron, tz)).toBe(expected);
    });
  });

  describe("weekday moves with the date", () => {
    it.each([
      // Forward into the next UTC day.
      ["0 21 * * 1", "America/New_York", "0 1 * * 2"],
      ["0 21 * * 6", "America/New_York", "0 1 * * 0"],
      // Back into the previous UTC day.
      ["0 8 * * 1", "Asia/Tokyo", "0 23 * * 0"],
      ["0 8 * * 0", "Asia/Tokyo", "0 23 * * 6"],
      ["15 2 * * 1", "Asia/Kolkata", "45 20 * * 0"],
    ])("%s in %s -> %s", (cron, tz, expected) => {
      expect(convertCronLocalToUtc(cron, tz)).toBe(expected);
    });

    it("expands ranges and lists into a sorted, de-duplicated list", () => {
      expect(convertCronLocalToUtc("0 9 * * 1-5", "Australia/Sydney")).toBe(
        "0 23 * * 0,1,2,3,4"
      );
      expect(convertCronLocalToUtc("0 21 * * 0,6", "America/New_York")).toBe(
        "0 1 * * 0,1"
      );
      expect(convertCronLocalToUtc("0 21 * * 1-3,5", "America/New_York")).toBe(
        "0 1 * * 2,3,4,6"
      );
    });

    it("treats 7 as Sunday", () => {
      expect(convertCronLocalToUtc("0 21 * * 1-7", "America/New_York")).toBe(
        "0 1 * * 0,1,2,3,4,5,6"
      );
      expect(convertCronLocalToUtc("0 21 * * 0,7", "America/New_York")).toBe(
        "0 1 * * 1"
      );
    });

    it("converts weekday names, in any case, to the shifted numeric list", () => {
      expect(convertCronLocalToUtc("0 9 * * MON-FRI", "Australia/Sydney")).toBe(
        "0 23 * * 0,1,2,3,4"
      );
      expect(
        convertCronLocalToUtc("0 21 * * sat,Sun", "America/New_York")
      ).toBe("0 1 * * 0,1");
      expect(convertCronLocalToUtc("0 21 * * MON-3", "America/New_York")).toBe(
        "0 1 * * 2,3,4"
      );
    });

    it("keeps weekday names when the date does not move", () => {
      expect(convertCronLocalToUtc("0 9 * * MON-FRI", "America/New_York")).toBe(
        "0 13 * * MON-FRI"
      );
    });

    it.each(["MONDAY", "XYZ", "MON-XYZ", "MON-", "1,,2", "L"])(
      "leaves the unrecognized weekday field %s as it is",
      (dow) => {
        expect(
          convertCronLocalToUtc(`0 21 * * ${dow}`, "America/New_York")
        ).toBe(`0 1 * * ${dow}`);
      }
    );

    it("leaves weekday steps as they are", () => {
      expect(convertCronLocalToUtc("0 9 * * 1-5/2", "Australia/Sydney")).toBe(
        "0 23 * * 1-5/2"
      );
    });
  });

  describe("day of month moves with the date only within 1-28", () => {
    it.each([
      ["0 20 15 * *", "America/New_York", "0 0 16 * *"],
      ["0 8 15 * *", "Asia/Tokyo", "0 23 14 * *"],
      ["0 21 27 * *", "America/New_York", "0 1 28 * *"],
      ["0 8 2 * *", "Asia/Tokyo", "0 23 1 * *"],
      ["0 8 28 * *", "Asia/Tokyo", "0 23 27 * *"],
    ])("shifts %s in %s -> %s", (cron, tz, expected) => {
      expect(convertCronLocalToUtc(cron, tz)).toBe(expected);
    });

    it.each([
      // Moving forward past 28 would skip runs in shorter months.
      ["0 21 28 * *", "America/New_York", "0 1 28 * *"],
      ["0 21 31 * *", "America/New_York", "0 1 31 * *"],
      // Moving back from day 1 has no previous day in the same month.
      ["0 8 1 * *", "Asia/Tokyo", "0 23 1 * *"],
      ["0 8 30 * *", "Asia/Tokyo", "0 23 30 * *"],
    ])("keeps %s in %s at the same day -> %s", (cron, tz, expected) => {
      expect(convertCronLocalToUtc(cron, tz)).toBe(expected);
    });

    it("leaves day-of-month lists and ranges as they are", () => {
      expect(convertCronLocalToUtc("0 21 1,15 * *", "America/New_York")).toBe(
        "0 1 1,15 * *"
      );
      expect(convertCronLocalToUtc("0 21 1-5 * *", "America/New_York")).toBe(
        "0 1 1-5 * *"
      );
    });

    it("shifts day of month and weekday together", () => {
      expect(convertCronLocalToUtc("0 8 15 * 1", "Asia/Tokyo")).toBe(
        "0 23 14 * 0"
      );
    });
  });

  describe("schedules without a specific time", () => {
    it.each(["*/5 * * * *", "0 */2 * * 1", "* 9 * * 1", "0 9-17 * * 1"])(
      "returns %s unchanged",
      (cron) => {
        expect(convertCronLocalToUtc(cron, "America/New_York")).toBe(cron);
      }
    );
  });

  describe("invalid input", () => {
    it.each([null, undefined, "", 42, "0 9 * *", "0 9 * * 1 2026"])(
      "returns %p unchanged",
      (cron) => {
        expect(convertCronLocalToUtc(cron, "America/New_York")).toBe(cron);
      }
    );

    it("trims and collapses whitespace", () => {
      expect(
        convertCronLocalToUtc("  0   21 * *\t1 ", "America/New_York")
      ).toBe("0 1 * * 2");
    });

    it("throws a RangeError for an unknown time zone", () => {
      expect(() => convertCronLocalToUtc("0 9 * * 1", "Not/AZone")).toThrow(
        RangeError
      );
    });
  });

  describe("scheduler runs land on the requested local weekdays", () => {
    it.each([
      ["0 21 * * 1", "America/New_York", 2, ["Mon", "Mon"]],
      ["0 8 * * 1", "Asia/Tokyo", 2, ["Mon", "Mon"]],
      ["0 21 * * SAT", "America/New_York", 2, ["Sat", "Sat"]],
      [
        "0 9 * * 1-5",
        "Australia/Sydney",
        5,
        ["Tue", "Wed", "Thu", "Fri", "Mon"],
      ],
    ])("%s in %s", (cron, tz, count, expected) => {
      const utcCron = convertCronLocalToUtc(cron, tz);
      expect(nextRunWeekdays(utcCron, tz, count)).toEqual(expected);
    });
  });
});

const CATALOG = [
  {
    name: "Web",
    items: [
      { id: "web-browsing", description: "Search the web" },
      { id: "web-scraping" },
    ],
  },
  {
    name: "Email",
    requiresSetup: true,
    items: [{ id: "gmail-send", description: "Send email" }],
  },
  {
    name: "Data",
    items: [
      { id: "sql-agent", requiresSetup: true, description: "Query SQL" },
      { id: "save-file" },
    ],
  },
  { name: "Empty", items: [] },
  { name: "No items" },
];

describe("catalogIdSet", () => {
  it("collects every item id across categories, including ones needing setup", () => {
    expect([...catalogIdSet(CATALOG)].sort()).toEqual([
      "gmail-send",
      "save-file",
      "sql-agent",
      "web-browsing",
      "web-scraping",
    ]);
  });

  it("returns an empty set for an empty catalog", () => {
    expect(catalogIdSet([]).size).toBe(0);
  });

  it("de-duplicates ids that appear in more than one category", () => {
    const ids = catalogIdSet([
      { name: "A", items: [{ id: "x" }] },
      { name: "B", items: [{ id: "x" }, { id: "y" }] },
    ]);
    expect([...ids]).toEqual(["x", "y"]);
  });
});

describe("readyToolsCatalog", () => {
  it("drops items and categories that require setup, then empty categories", () => {
    expect(readyToolsCatalog(CATALOG)).toEqual([
      CATALOG[0],
      { name: "Data", items: [{ id: "save-file" }] },
    ]);
  });

  it("does not mutate the input catalog", () => {
    const before = JSON.parse(JSON.stringify(CATALOG));
    readyToolsCatalog(CATALOG);
    expect(CATALOG).toEqual(before);
  });

  it("returns an empty list when nothing is ready", () => {
    expect(
      readyToolsCatalog([
        { name: "Email", requiresSetup: true, items: [{ id: "gmail-send" }] },
      ])
    ).toEqual([]);
    expect(readyToolsCatalog([])).toEqual([]);
  });
});

describe("renderCatalog", () => {
  it("groups items under their category with setup flags and descriptions", () => {
    expect(renderCatalog(CATALOG.slice(0, 3))).toBe(
      [
        "Web:",
        "  - web-browsing - Search the web",
        "  - web-scraping",
        "",
        "Email:",
        "  - gmail-send - Send email",
        "",
        "Data:",
        "  - sql-agent [requires setup] - Query SQL",
        "  - save-file",
      ].join("\n")
    );
  });

  it("renders a category with no items as just its heading", () => {
    expect(renderCatalog([{ name: "No items" }])).toBe("No items:\n");
  });

  it.each([[[]], [null], [undefined]])(
    "returns the no-tools message for %p",
    (catalog) => {
      expect(renderCatalog(catalog)).toBe(
        "No tools are available for scheduled jobs."
      );
    }
  );
});

describe("rejectedToolsMessage", () => {
  const ready = readyToolsCatalog(CATALOG);

  it("separates tools needing setup from unknown ids and lists ready tools", () => {
    const message = rejectedToolsMessage(
      ["gmail-send", "made-up", "sql-agent", "also-fake"],
      CATALOG,
      ready
    );
    expect(message).toBe(
      "These tools exist but are not configured yet, so they can't be added to a job: gmail-send, sql-agent. The user must set them up first in Settings > Agent Skills.\n" +
        "These tool IDs are not valid: made-up, also-fake.\n\n" +
        "Call this tool with `listTools: true` to see valid IDs, or choose only from these ready-to-use tools:\n\n" +
        renderCatalog(ready)
    );
  });

  it("only mentions unknown ids when none need setup", () => {
    const message = rejectedToolsMessage(["nope"], CATALOG, ready);
    expect(message).toMatch(/^These tool IDs are not valid: nope\.\n\n/);
    expect(message).not.toContain("not configured yet");
  });

  it("only mentions setup when every rejected id exists", () => {
    const message = rejectedToolsMessage(["gmail-send"], CATALOG, ready);
    expect(message).toMatch(/^These tools exist but are not configured yet/);
    expect(message).not.toContain("are not valid");
  });

  it("falls back to the no-tools message when nothing is ready", () => {
    expect(rejectedToolsMessage(["nope"], CATALOG, [])).toMatch(
      /ready-to-use tools:\n\nNo tools are available for scheduled jobs\.$/
    );
  });
});
