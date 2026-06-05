const fs = require("fs");
const path = require("path");

describe("SWARMSY Use API chat toggle frontend wiring", () => {
  function read(relativePath) {
    return fs.readFileSync(
      path.resolve(__dirname, "../../..", relativePath),
      "utf8"
    );
  }

  it("renders a visible, accessible Use API toggle that defaults off", () => {
    const source = read(
      "frontend/src/components/WorkspaceChat/ChatContainer/PromptInput/index.jsx"
    );

    expect(source).toContain("const [useApi, setUseApi] = useState(false)");
    expect(source).toContain(
      "<UseApiToggle useApi={useApi} setUseApi={setUseApi} />"
    );
    expect(source).toContain('type="checkbox"');
    expect(source).toContain('name="useApi"');
    expect(source).toContain("checked={useApi}");
    expect(source).toContain("Use API");
    expect(source).toContain(
      "Use your connected online provider for this message"
    );
    expect(source).toContain("API usage may cost money");
    expect(source).toContain(
      'aria-label="Use API: Use your connected online provider for this message. API usage may cost money."'
    );
  });

  it("sends Use API metadata only from explicit toggle state and resets after send", () => {
    const promptSource = read(
      "frontend/src/components/WorkspaceChat/ChatContainer/PromptInput/index.jsx"
    );
    const containerSource = read(
      "frontend/src/components/WorkspaceChat/ChatContainer/index.jsx"
    );

    expect(promptSource).toContain("await submit(e, { useApi })");
    expect(promptSource).toContain("if (result !== false) setUseApi(false)");
    expect(containerSource).toContain(
      "const useApi = metadata?.useApi === true"
    );
    expect(containerSource).toContain("useApi: promptMessage?.useApi === true");
  });

  it("sends a boolean useApi flag in workspace and thread stream requests", () => {
    const workspaceSource = read("frontend/src/models/workspace.js");
    const threadSource = read("frontend/src/models/workspaceThread.js");

    expect(workspaceSource).toContain("useApi = false");
    expect(threadSource).toContain("useApi = false");
    expect(workspaceSource).toContain("useApi: useApi === true");
    expect(threadSource).toContain("useApi: useApi === true");
  });

  it("keeps existing chat send flow wired when Use API is off", () => {
    const containerSource = read(
      "frontend/src/components/WorkspaceChat/ChatContainer/index.jsx"
    );

    expect(containerSource).toContain("Workspace.multiplexStream");
    expect(containerSource).toContain("runtime: promptMessage?.runtime");
    expect(containerSource).toContain("attachments,");
  });
});
