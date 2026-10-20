/**
 * Tools, prompts and human-readable step labels for the browser sub-agent.
 * Descriptions are intentionally short - this has to work for small local models.
 */

// Schemas are re-sent on every step, so they stay lean - every keyword costs tokens each call.
const schema = (properties = {}, required = []) => ({
  type: "object",
  properties,
  required,
});

const id = (what) => ({
  type: "number",
  description: `[n] id of the ${what}.`,
});

/** Actions run in the browser (see bridge.js). */
const BROWSER_TOOLS = [
  {
    name: "navigate",
    description:
      "Open a URL. Never guess the address of a specific product, listing or post - click its link.",
    parameters: schema({ url: { type: "string" } }, ["url"]),
  },
  {
    name: "click",
    description: "Click an element by its [n] id.",
    parameters: schema({ id: id("element") }, ["id"]),
  },
  {
    name: "type",
    description: "Type into an input by its [n] id, replacing its text.",
    parameters: schema(
      {
        id: id("input"),
        text: { type: "string" },
        submit: {
          type: "boolean",
          description: "Press Enter afterwards.",
        },
      },
      ["id", "text"]
    ),
  },
  {
    name: "select_option",
    description: "Choose an option in a dropdown (select) by its [n] id.",
    parameters: schema(
      {
        id: id("dropdown"),
        option: { type: "string" },
      },
      ["id", "option"]
    ),
  },
  {
    name: "press_key",
    description:
      "Press a key or combination (Enter, Escape, Tab, ArrowDown, Control+A...).",
    parameters: schema({ key: { type: "string" } }, ["key"]),
  },
  {
    name: "scroll",
    description: "Scroll the page, or inside the panel holding element id.",
    parameters: schema(
      {
        direction: { type: "string", enum: ["down", "up"] },
        id: { type: "number" },
      },
      ["direction"]
    ),
  },
  {
    name: "go_back",
    description: "Go back to the previous page.",
    parameters: schema(),
  },
  {
    name: "read_page",
    description:
      "Read [Tn] text blocks in full, or the whole page without ids.",
    parameters: schema({
      text_ids: {
        type: "array",
        items: { type: "number" },
        description: "e.g. [3, 4] for T3, T4",
      },
    }),
  },
  {
    name: "find_text",
    description:
      "Find words on the page, like Ctrl+F: shows the text around each match and scrolls to the first.",
    parameters: schema({ text: { type: "string" } }, ["text"]),
  },
  {
    name: "wait",
    description: "Wait for the page to load or update.",
    parameters: schema({
      seconds: { type: "number", description: "1-10" },
    }),
  },
];

// Only the latest page stays in context, so every browser action can carry a note: facts the agent
// must not lose (prices, names, links). Notes are shown on every turn for the rest of the task.
const NOTE_PARAM = {
  type: "string",
  description: "Facts to remember for the answer.",
};
for (const tool of BROWSER_TOOLS) tool.parameters.properties.note = NOTE_PARAM;

/** Tools handled by the agent loop itself. */
const CONTROL_TOOLS = [
  {
    name: "ask_user",
    description:
      "Ask the user and wait for the reply: for a sign-in, captcha or code (they handle it in the browser - never ask for passwords or codes), or a decision only they can make.",
    parameters: schema(
      {
        question: {
          type: "string",
          description: "Short and specific.",
        },
      },
      ["question"]
    ),
  },
  {
    name: "done",
    description: "Finish: the task is complete or cannot be completed.",
    parameters: schema(
      {
        success: {
          type: "boolean",
          description: "Whether the task was completed.",
        },
        result: {
          type: "string",
          description:
            "The full answer with the facts, prices, names and links found, or why it could not be done.",
        },
      },
      ["success", "result"]
    ),
  },
];

/**
 * Only offered to models that accept images, and rationed by the agent loop (see agent.js):
 * a small jpeg, a few per session, never twice in a row, and only the latest stays in context.
 */
const SCREENSHOT_TOOL = {
  name: "screenshot",
  description:
    "Small picture of the screen. LAST RESORT: to confirm what the page state cannot (a post really published), or when stuck.",
  parameters: schema(),
};

const BROWSER_TOOL_NAMES = new Set([
  ...BROWSER_TOOLS.map((t) => t.name),
  SCREENSHOT_TOOL.name,
]);

/**
 * Other agent skills the browser agent may use when they are enabled for the
 * parent agent. Read-only on purpose - the browser agent runs autonomously.
 */
const BORROWABLE_SKILLS = [
  "filesystem-read-text-file",
  "filesystem-read-multiple-files",
  "filesystem-list-directory",
  "filesystem-search-files",
  "filesystem-get-file-info",
  "rag-memory",
];

function systemPrompt({ maxSteps, borrowed = [], screenshots = 0 }) {
  return `You are a browser agent. You control a real web browser to complete ONE task for the user, then call done.

After every action you get the current page state:
- [n] lines are interactive elements. Use n with click, type and select_option.
- [Tn] lines are text on the page. Use read_page to read long text in full.
- On a long page (docs, articles, long lists), use find_text to jump to what you need instead of scrolling through it.
Only the latest page state is shown and ids change after every action, so always use ids from the latest state.
The "Page header" line lists the site's top bar (cart, menu, search) when it is scrolled out of view - its ids work from anywhere.

Rules:
- One action at a time. Use as few steps as possible. Navigate straight to a URL when you can, e.g. https://www.google.com/search?q=your+query
- If a cookie banner or popup is in the way, dismiss it.
- Do not buy, book, pay, send messages, post, or submit anything with real-world effects unless the task explicitly asks for it. When in doubt, ask_user first.
- Do not invent search values the task did not give you (like a departure city). Leave optional fields empty, or ask_user if one is required.
- If you need a decision only the user can make, call ask_user.
- Never make up information. Only report what you saw on pages.
- Pages you leave disappear from view. When you see something you need for the answer (a price, a name, a link), save it in the note field of your next action. Your notes are always shown.
- Check your work. If an action's result says "Failed" or "nothing on the page changed", it did not happen - try another way. Before saying something was posted, sent, saved or submitted, confirm it in the page state.
- Results tell you what the page sent to the site ("Sent to the site: ... -> 200 OK"). After you submit something, that line means it went through - NEVER post or send it again; call done. "Nothing was sent to the site" or "(failed)" means it did not go through.

Sign-in pages, captchas and verification codes are a HARD STOP:
- If the content you need is behind a sign-in, a captcha / "are you human" check, or a verification code, call ask_user immediately and do nothing else on that page. Ask the user to handle it themselves in the browser - they will take over, do it, and reply.
- NEVER ask the user to send you a password, username or code in the chat.
- Never guess usernames, passwords or codes. Never try to solve a captcha. Never look for a way around it (other sites, guest links, different URLs, retrying).
- Only type credentials or codes the user gave you for this task.
- A page can show a sign-in form or button and still have the content you need. If the content is there, use it and ignore the form.

Other rules:
- Files cannot be downloaded or uploaded.
- You have at most ${maxSteps} steps.${borrowed.length ? `\n- You can also use these tools: ${borrowed.join(", ")}.` : ""}
- When finished, call done with the complete answer: the concrete facts, prices, names and links the user asked for.${
    screenshots
      ? `\n- screenshot: at most ${screenshots} per session, never twice in a row. Use the page state first.`
      : ""
  }`;
}

/** Instructions for models without native tool calling: one JSON action per reply. */
function jsonProtocolPrompt(tools) {
  const lines = tools.map((tool) => {
    const props = tool.parameters?.properties || {};
    const required = new Set(tool.parameters?.required || []);
    const args = Object.entries(props)
      .map(
        ([key, p]) =>
          `${key}${required.has(key) ? "" : "?"}: ${p.enum ? p.enum.join("|") : p.type}`
      )
      .join(", ");
    return `- ${tool.name}(${args}): ${tool.description}`;
  });
  return `\n\nAvailable tools:\n${lines.join("\n")}

Reply with ONLY a JSON object for the next tool call and nothing else, for example:
{"tool": "click", "args": {"id": 3}}`;
}

/** What the user sees for a step - no ids, no jargon. */
function stepLabel(tool, args = {}, result = {}) {
  const target = result.target ? `“${clip(result.target, 50)}”` : "";
  switch (tool) {
    case "navigate":
      return `Opening ${hostOf(args.url) || args.url}`;
    case "resume": {
      const host = args.url ? hostOf(args.url) : null;
      return `Reopening the saved session${host ? ` on ${host}` : ""}`;
    }
    case "click":
      return target ? `Clicking ${target}` : "Clicking on the page";
    case "type":
      return result.sensitive
        ? `Entering a password${target ? ` into ${target}` : ""}`
        : `Typing “${clip(args.text, 40)}”${target ? ` into ${target}` : ""}`;
    case "select_option":
      return `Choosing ${target || `“${clip(args.option, 40)}”`}`;
    case "press_key":
      return `Pressing ${args.key}`;
    case "scroll":
      return `Scrolling ${args.direction === "up" ? "up" : "down"}`;
    case "go_back":
      return "Going back";
    case "read_page":
      return "Reading the page";
    case "find_text":
      return `Looking for “${clip(args.text, 40)}” on the page`;
    case "screenshot":
      return "Double-checking the screen";
    case "wait":
      return "Waiting for the page";
    case "ask_user":
      return "Asking you for help";
    case "checkpoint":
      return (
        {
          FINISH: "Checking progress - it has what it needs",
          BACK: `Checking progress - going back to “${clip(args.title, 40)}”`,
          GIVE_UP: "Checking progress - no way forward",
        }[args.verdict] || "Checking progress - on track"
      );
    case "done":
      return "Finished";
    default:
      if (tool.startsWith("filesystem-"))
        return "Looking at files on your computer";
      if (tool === "rag-memory") return "Checking saved memories";
      return `Using ${tool}`;
  }
}

// Words too common to tell pages (or sessions) apart.
const DIGEST_STOPWORDS = new Set(
  "the and for with from that this what which when where find show tell list give get compare check look search price prices cost about into onto over under than then there their them they you your mine have has had are was were will would could should can on in of to a an is my me our its including any options current special store stores site website online all some more most best report how many open using through shown not click page go".split(
    " "
  )
);

/** Task words worth matching on pages, cut to a 6-letter stem so "refurbished" matches "Refurb". */
function taskTerms(task = "") {
  const words =
    String(task)
      .toLowerCase()
      .match(/[\p{L}\p{N}][\p{L}\p{N}.-]{2,}/gu) || [];
  return [
    ...new Set(
      words
        .map((word) => word.replace(/[.-]+$/, ""))
        .filter(
          (word) =>
            word.length >= 3 &&
            !DIGEST_STOPWORDS.has(word) &&
            !/^[\d.,-]+$/.test(word) &&
            // A domain ("books.toscrape.com") is the site, not something to look for on it.
            !/^[a-z0-9-]+(\.[a-z0-9-]+)*\.(com|org|net|io|co|ai|app|dev|edu|gov|uk|de|fr|ca|au|in|jp|us|eu)$/.test(
              word
            )
        )
        .map((word) => (word.length > 7 ? word.slice(0, 6) : word))
    ),
  ];
}

function clip(text = "", max = 40) {
  text = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function hostOf(url) {
  try {
    return new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).host;
  } catch {
    return null;
  }
}

module.exports = {
  BROWSER_TOOLS,
  SCREENSHOT_TOOL,
  CONTROL_TOOLS,
  BROWSER_TOOL_NAMES,
  BORROWABLE_SKILLS,
  systemPrompt,
  jsonProtocolPrompt,
  stepLabel,
  clip,
  taskTerms,
};
