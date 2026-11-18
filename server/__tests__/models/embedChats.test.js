const mockPrisma = {
  embed_chats: {
    update: jest.fn().mockResolvedValue({}),
  },
};
jest.mock("../../utils/prisma", () => mockPrisma);

const { EmbedChats } = require("../../models/embedChats");

describe("EmbedChats.updateFeedbackScore", () => {
  const stored = () =>
    mockPrisma.embed_chats.update.mock.calls[0][0].data.feedbackScore;

  beforeEach(() => mockPrisma.embed_chats.update.mockClear());

  it("stores true for a thumbs up", async () => {
    await EmbedChats.updateFeedbackScore(5, true);
    expect(stored()).toBe(true);
  });

  it.each([null, false, 0, 1, "true", "1", "", {}, undefined])(
    "clears the score for anything other than true (%p)",
    async (value) => {
      await EmbedChats.updateFeedbackScore(5, value);
      expect(stored()).toBeNull();
    }
  );
});
