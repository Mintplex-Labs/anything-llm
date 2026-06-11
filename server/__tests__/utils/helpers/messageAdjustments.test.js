/* eslint-env jest, node */
const { WorkspaceChats } = require("../../../models/workspaceChats");
const { EmbedChats } = require("../../../models/embedChats");
const {
  WorkspaceMessageAdjustments,
} = require("../../../models/workspaceMessageAdjustments");
const {
  countMessagesInDateRange,
  countMessagesForCurrentMonth,
  getMessageLimitInfo,
} = require("../../../utils/helpers");
const {
  countMessagesForCurrentCycle,
  isCycleLimitReached,
  getCycleInfoWithMessageCount,
} = require("../../../utils/helpers/cycleHelpers");

jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: { count: jest.fn() },
}));
jest.mock("../../../models/embedChats", () => ({
  EmbedChats: { countForWorkspaceInDateRange: jest.fn() },
}));
jest.mock("../../../models/workspaceMessageAdjustments", () => ({
  WorkspaceMessageAdjustments: { sumForWorkspaceInDateRange: jest.fn() },
}));

const workspace = { id: 5, slug: "test-ws", messagesLimit: 600 };
const start = new Date("2026-06-01T00:00:00");
const end = new Date("2026-06-30T00:00:00");

function mockCounts({ chats = 0, embeds = 0, adjustments = 0 } = {}) {
  WorkspaceChats.count.mockResolvedValue(chats);
  EmbedChats.countForWorkspaceInDateRange.mockResolvedValue(embeds);
  WorkspaceMessageAdjustments.sumForWorkspaceInDateRange.mockResolvedValue(
    adjustments
  );
}

beforeEach(() => jest.clearAllMocks());

describe("countMessagesInDateRange - adjustment breakdown", () => {
  test("deductions increase the billable total", async () => {
    mockCounts({ chats: 10, embeds: 2, adjustments: 250 });
    const result = await countMessagesInDateRange(workspace, start, end);
    expect(result).toEqual({
      total: 262,
      workspaceChatCount: 10,
      embedChatCount: 2,
      adjustmentsTotal: 250,
    });
  });

  test("credits decrease the billable total", async () => {
    mockCounts({ chats: 100, embeds: 0, adjustments: -40 });
    const { total } = await countMessagesInDateRange(workspace, start, end);
    expect(total).toBe(60);
  });

  test("credits cannot push the total below zero", async () => {
    mockCounts({ chats: 10, embeds: 0, adjustments: -500 });
    const { total, adjustmentsTotal } = await countMessagesInDateRange(
      workspace,
      start,
      end
    );
    expect(total).toBe(0);
    expect(adjustmentsTotal).toBe(-500);
  });

  test("no adjustments behaves exactly like before (chats + embeds)", async () => {
    mockCounts({ chats: 7, embeds: 3, adjustments: 0 });
    const { total } = await countMessagesInDateRange(workspace, start, end);
    expect(total).toBe(10);
  });

  test("queries the adjustment sum with the same end-of-day clamped window as the chat counts", async () => {
    mockCounts();
    await countMessagesInDateRange(workspace, start, end);
    const [wsId, sumStart, sumEnd] =
      WorkspaceMessageAdjustments.sumForWorkspaceInDateRange.mock.calls[0];
    expect(wsId).toBe(workspace.id);
    expect(sumStart).toEqual(start);
    expect(sumEnd.getHours()).toBe(23);
    expect(sumEnd.getMinutes()).toBe(59);
    expect(sumEnd.getSeconds()).toBe(59);
    expect(sumEnd.getMilliseconds()).toBe(999);
    // Same window the workspace chat count uses
    const chatClause = WorkspaceChats.count.mock.calls[0][0];
    expect(chatClause.createdAt.lte).toEqual(sumEnd);
  });
});

describe("countMessagesForCurrentMonth", () => {
  test("returns the breakdown shape", async () => {
    mockCounts({ chats: 1, embeds: 1, adjustments: 8 });
    const result = await countMessagesForCurrentMonth(workspace);
    expect(result.total).toBe(10);
    expect(result.adjustmentsTotal).toBe(8);
  });
});

describe("getMessageLimitInfo - adjustment awareness", () => {
  test("monthly fallback: messageCount includes adjustments, contingent reflects it", async () => {
    mockCounts({ chats: 12, embeds: 0, adjustments: 250 });
    const info = await getMessageLimitInfo(workspace);
    expect(info.messageCount).toBe(262);
    expect(info.adjustmentsTotal).toBe(250);
    expect(info.contingent).toBe("262/600");
    expect(info.cycleInfo).toBeNull();
  });

  test("unlimited workspace still reports adjustments", async () => {
    mockCounts({ chats: 5, embeds: 0, adjustments: 100 });
    const info = await getMessageLimitInfo({ id: 5, messagesLimit: null });
    expect(info.messageCount).toBe(105);
    expect(info.contingent).toBe("105/Unlimited");
    expect(info.adjustmentsTotal).toBe(100);
  });

  test("cycle-based workspace: messageCount includes adjustments and cycleInfo is set", async () => {
    mockCounts({ chats: 50, embeds: 0, adjustments: 200 });
    const cycleWorkspace = {
      ...workspace,
      cycleStartDate: "2026-01-15",
      cycleDurationMonths: 1,
    };
    const info = await getMessageLimitInfo(cycleWorkspace);
    expect(info.messageCount).toBe(250);
    expect(info.adjustmentsTotal).toBe(200);
    expect(info.cycleInfo).not.toBeNull();
  });
});

describe("cycleHelpers - adjustment awareness", () => {
  const cycleWorkspace = {
    id: 5,
    messagesLimit: 100,
    cycleStartDate: "2026-01-01",
    cycleDurationMonths: 1,
  };
  const simulatedToday = new Date("2026-06-15");

  test("countMessagesForCurrentCycle returns the breakdown", async () => {
    mockCounts({ chats: 20, embeds: 0, adjustments: 30 });
    const result = await countMessagesForCurrentCycle(
      cycleWorkspace,
      simulatedToday
    );
    expect(result.total).toBe(50);
    expect(result.adjustmentsTotal).toBe(30);
  });

  test("isCycleLimitReached: adjustments can exhaust the quota", async () => {
    mockCounts({ chats: 10, embeds: 0, adjustments: 90 });
    expect(await isCycleLimitReached(cycleWorkspace, simulatedToday)).toBe(
      true
    );
  });

  test("isCycleLimitReached: credits can free up the quota again", async () => {
    mockCounts({ chats: 110, embeds: 0, adjustments: -20 });
    expect(await isCycleLimitReached(cycleWorkspace, simulatedToday)).toBe(
      false
    );
  });

  test("getCycleInfoWithMessageCount reports count, remaining and adjustmentsTotal", async () => {
    mockCounts({ chats: 10, embeds: 5, adjustments: 25 });
    const info = await getCycleInfoWithMessageCount(
      cycleWorkspace,
      simulatedToday
    );
    expect(info.messageCount).toBe(40);
    expect(info.adjustmentsTotal).toBe(25);
    expect(info.messagesRemaining).toBe(60);
    expect(info.contingent).toBe("40/100");
  });
});
