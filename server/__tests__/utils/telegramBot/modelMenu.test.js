/* eslint-env jest */
jest.mock("../../../models/workspace", () => ({
  Workspace: { get: jest.fn(), update: jest.fn() },
}));
jest.mock("../../../utils/helpers/customModels", () => ({
  getCustomModels: jest.fn(),
  SUPPORT_CUSTOM_MODELS: ["ollama"],
}));
jest.mock("../../../utils/EncryptionManager", () => ({}));

const { Workspace } = require("../../../models/workspace");
const { getCustomModels } = require("../../../utils/helpers/customModels");
const {
  showModelMenu,
} = require("../../../utils/telegramBot/utils/commands/handlers/showModelMenu");
const {
  handleModelSelect,
} = require("../../../utils/telegramBot/utils/navigation/callbacks/handleModelSelect");

// Two quantizations of one Hugging Face repo pulled through Ollama. Their ids
// only differ after the 40th character.
const REPO = "hf.co/bartowski/Meta-Llama-3.1-8B-Instruct-GGUF";
const IDS = [`${REPO}:Q4_K_M`, `${REPO}:Q8_0`, "llama3.2:3b"];
const workspace = { id: 7, slug: "docs", name: "Docs", chatProvider: "ollama" };
const state = { workspaceSlug: workspace.slug };
const ctx = {
  bot: {
    sendMessage: jest.fn(async () => ({})),
    deleteMessage: jest.fn(),
    answerCallbackQuery: jest.fn(),
  },
  getState: () => state,
  setState: (_chatId, updates) => Object.assign(state, updates),
};

// Opens /model and returns the callback_data of the button for `id`.
async function buttonFor(id) {
  ctx.bot.sendMessage.mockClear();
  await showModelMenu(ctx, 1);
  const [, , opts] = ctx.bot.sendMessage.mock.calls[0];
  const buttons = opts.reply_markup.inline_keyboard.flat();
  const data = buttons.find((b) => b.text === id).callback_data;
  expect(Buffer.byteLength(data)).toBeLessThanOrEqual(64);
  return data;
}

const tap = (data) =>
  handleModelSelect({ ctx, chatId: 1, query: { id: "q" }, messageId: 1, data });

beforeEach(() => {
  jest.clearAllMocks();
  workspace.chatModel = IDS[0];
  Workspace.get.mockResolvedValue(workspace);
  getCustomModels.mockResolvedValue({
    models: IDS.map((id) => ({ id, name: id })),
  });
});

describe("Telegram /model menu", () => {
  test("selects the tapped model when ids share their first 40 characters", async () => {
    expect(IDS[1].slice(0, 40)).toBe(IDS[0].slice(0, 40));
    await tap(await buttonFor(IDS[1]));
    expect(Workspace.update).toHaveBeenCalledWith(7, { chatModel: IDS[1] });
  });

  test("a menu opened before the active model changed still selects its own model", async () => {
    const oldButton = await buttonFor(IDS[1]);
    workspace.chatModel = IDS[2]; // another menu changed the model
    await buttonFor(IDS[0]); // a new menu lists the active model first
    await tap(oldButton);
    expect(Workspace.update).toHaveBeenCalledWith(7, { chatModel: IDS[1] });
  });
});
