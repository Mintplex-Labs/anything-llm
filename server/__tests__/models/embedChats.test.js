const mockPrisma = {
  embed_chats: {
    create: jest.fn(),
    update: jest.fn(),
  },
};
jest.mock("../../utils/prisma", () => mockPrisma);

const { EmbedChats } = require("../../models/embedChats");

const stored = () => mockPrisma.embed_chats.update.mock.calls[0][0];

describe("EmbedChats.updateFeedbackScore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockPrisma.embed_chats.update.mockResolvedValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("stores true for a thumbs up", async () => {
    expect(await EmbedChats.updateFeedbackScore(5, true)).toBe(true);
    expect(stored()).toEqual({
      where: { id: 5 },
      data: { feedbackScore: true },
    });
  });

  it("clears the score for null", async () => {
    await EmbedChats.updateFeedbackScore(5, null);
    expect(stored().data.feedbackScore).toBeNull();
  });

  it.each([false, 0, 1, "true", "1", "", {}, undefined])(
    "never stores a value other than true or null (%p)",
    async (value) => {
      await EmbedChats.updateFeedbackScore(5, value);
      expect(stored().data.feedbackScore).toBeNull();
    }
  );

  it("casts a string chat id before it reaches the query", async () => {
    await EmbedChats.updateFeedbackScore("7", true);
    expect(stored().where).toEqual({ id: 7 });
  });

  it("skips the update without a chat id", async () => {
    expect(await EmbedChats.updateFeedbackScore(null, true)).toBe(false);
    expect(mockPrisma.embed_chats.update).not.toHaveBeenCalled();
  });

  it("returns false when the update fails", async () => {
    mockPrisma.embed_chats.update.mockRejectedValue(new Error("not found"));
    expect(await EmbedChats.updateFeedbackScore(5, true)).toBe(false);
  });
});

describe("EmbedChats.new", () => {
  const created = () => mockPrisma.embed_chats.create.mock.calls[0][0].data;
  const chat = { embedId: 3, prompt: "hi", sessionId: "session" };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.embed_chats.create.mockResolvedValue({ id: 1 });
  });

  it("includes the chat in session history by default", async () => {
    await EmbedChats.new(chat);
    expect(created().include).toBe(true);
  });

  it("stores a chat as invalidated when its session was reset", async () => {
    await EmbedChats.new({ ...chat, include: false });
    expect(created().include).toBe(false);
  });
});
