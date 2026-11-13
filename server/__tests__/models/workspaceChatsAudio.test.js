/* eslint-env jest */
const mockChats = [
  { id: 1, workspaceId: 1, thread_id: null, api_session_id: null },
  { id: 2, workspaceId: 1, thread_id: 7, api_session_id: null },
  { id: 3, workspaceId: 2, thread_id: null, api_session_id: null },
];

jest.mock("../../utils/prisma", () => {
  // Prisma ignores filters that are undefined.
  const matching = ({ where = {} } = {}) =>
    mockChats.filter((chat) =>
      Object.entries(where).every(
        ([field, value]) => value === undefined || chat[field] === value
      )
    );
  return {
    workspace_chats: {
      findMany: jest.fn(async (args) => matching(args)),
      updateMany: jest.fn(async () => ({})),
      deleteMany: jest.fn(async () => ({})),
      update: jest.fn(async () => ({})),
    },
  };
});

jest.mock("../../utils/TextToSpeech/audioCache", () => ({
  TTSAudioCache: { purge: jest.fn(async () => {}) },
}));

const prisma = require("../../utils/prisma");
const { TTSAudioCache } = require("../../utils/TextToSpeech/audioCache");
const { WorkspaceChats } = require("../../models/workspaceChats");

describe("WorkspaceChats cached TTS audio cleanup", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("deleting chats purges audio of the matching chats only", async () => {
    await WorkspaceChats.delete({ workspaceId: 1 });
    expect(TTSAudioCache.purge).toHaveBeenCalledWith([1, 2]);
    expect(prisma.workspace_chats.deleteMany).toHaveBeenCalledTimes(1);
  });

  test("resetting the default thread purges its audio but not thread audio", async () => {
    await WorkspaceChats.markHistoryInvalid(1);
    expect(TTSAudioCache.purge).toHaveBeenCalledWith([1]);
  });

  test("resetting a thread purges only that thread's audio", async () => {
    await WorkspaceChats.markThreadHistoryInvalid(1, null, 7);
    expect(TTSAudioCache.purge).toHaveBeenCalledWith([2]);
  });

  test("hiding chats by clause purges their audio", async () => {
    await WorkspaceChats.markThreadHistoryInvalidV2({ thread_id: 7 });
    expect(TTSAudioCache.purge).toHaveBeenCalledWith([2]);
  });

  test("updating a chat purges its audio", async () => {
    await WorkspaceChats._update(3, { include: false });
    expect(TTSAudioCache.purge).toHaveBeenCalledWith([3]);
  });

  test("audio is purged before the chats stop matching the clause", async () => {
    await WorkspaceChats.delete({ workspaceId: 2 });
    expect(TTSAudioCache.purge.mock.invocationCallOrder[0]).toBeLessThan(
      prisma.workspace_chats.deleteMany.mock.invocationCallOrder[0]
    );
  });

  test("failed audio cleanup does not block deleting the chats", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    TTSAudioCache.purge.mockRejectedValueOnce(new Error("disk unavailable"));
    expect(await WorkspaceChats.delete({ workspaceId: 1 })).toBe(true);
    expect(prisma.workspace_chats.deleteMany).toHaveBeenCalledTimes(1);
    consoleError.mockRestore();
  });
});
