// `utils/http` reaches the auth stack on require; this suite exercises none of it.
jest.mock("jsonwebtoken", () => ({}));

const { fillSourceWindow } = require("../../../../utils/helpers/chat");

function chatWithSource(id) {
  return {
    response: JSON.stringify({
      sources: [{ id, score: 0.5, text: `text-${id}` }],
    }),
  };
}

// history as `recentChatHistory` produces it: oldest first, newest last.
function chronologicalHistory() {
  return [chatWithSource("oldest"), chatWithSource("middle"), chatWithSource("newest")];
}

describe("fillSourceWindow", () => {
  beforeAll(() => jest.spyOn(console, "log").mockImplementation(() => {}));
  afterAll(() => console.log.mockRestore());

  it("leaves the caller's history array in its original order", () => {
    const history = chronologicalHistory();
    const before = history.map((chat) => chat.response);

    fillSourceWindow({ nDocs: 4, searchResults: [], history });

    expect(history.map((chat) => chat.response)).toEqual(before);
  });

  it("backfills from the most recent chat first", () => {
    const { sources } = fillSourceWindow({
      nDocs: 2,
      searchResults: [],
      history: chronologicalHistory(),
    });

    expect(sources.map((source) => source.id)).toEqual(["newest", "middle"]);
  });
});
