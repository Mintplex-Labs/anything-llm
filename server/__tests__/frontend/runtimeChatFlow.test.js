const fs = require("fs");
const path = require("path");

describe("SWARMSY runtime chat flow wiring", () => {
  it("passes pending runtime handoff from chat container into stream execution", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/WorkspaceChat/ChatContainer/index.jsx"
      ),
      "utf8"
    );

    expect(source).toContain("normalizeLocalUserOllamaRuntimeSelection");
    expect(source).toContain("getPendingHomeMessageForDestination");
    expect(source).toContain("runtime: lastUserMessage?.runtime");
    expect(source).toContain("runtime: promptMessage?.runtime");
    expect(source).toContain("const runtime = normalizeLocalUserOllamaRuntimeSelection");
    expect(source).toContain("isLocalUserSessionRef.current");
    expect(source).toContain("activeLocalUserRuntimeRef.current");
    expect(source).toContain("isLocalUserSessionRef.current = false");
    expect(source).toContain("sessionStorage.removeItem(SWARMSY_LOCAL_USER_ACTIVE_RUNTIME)");
    expect(source).toContain("storedRuntime?.workspaceSlug");
    expect(source).toContain("storedRuntimeWorkspaceSlug !== normalizedWorkspaceSlug");
    expect(source).toContain("workspaceSlug: workspace.slug");
    expect(source).toContain("const result = await sendCommand");
    expect(source).toContain("if (result !== false)");
    expect(source).toContain("const timeoutId = setTimeout");
    expect(source).toContain("return () => clearTimeout(timeoutId)");
    expect(source).toContain("const { pending: latestPending } = getPendingHomeMessageForDestination");
    expect(source).toContain("const { pending: pendingHomeMessage } = getPendingHomeMessageForDestination");
    expect(source).toContain("if (shouldClearLegacy)");
    expect(source).toContain("sessionStorage.removeItem(PENDING_HOME_MESSAGE)");
  });

  it("scopes pending handoff payloads to the destination workspace and thread", () => {
    const homeSource = fs.readFileSync(
      path.resolve(__dirname, "../../../frontend/src/pages/Main/Home/index.jsx"),
      "utf8"
    );
    const onboardingSource = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );
    const pendingSource = fs.readFileSync(
      path.resolve(__dirname, "../../../frontend/src/utils/pendingHomeMessage.js"),
      "utf8"
    );

    expect(homeSource).toContain("buildPendingHomeMessage");
    expect(homeSource).toContain("workspaceSlug: targetWorkspace.slug");
    expect(homeSource).toContain("threadSlug: targetThread || null");
    expect(onboardingSource).toContain("buildPendingHomeMessage");
    expect(onboardingSource).toContain("workspaceSlug: activeStatus.workspace.slug");
    expect(onboardingSource).toContain("threadSlug: null");
    expect(pendingSource).toContain(
      'Object.prototype.hasOwnProperty.call(pending, "workspaceSlug")'
    );
    expect(pendingSource).toContain(
      'Object.prototype.hasOwnProperty.call(pending, "threadSlug")'
    );
    expect(pendingSource).toContain("pendingThreadSlug !== normalizedThreadSlug");
  });

  it("sends runtime overrides in workspace and thread chat requests", () => {
    const workspaceSource = fs.readFileSync(
      path.resolve(__dirname, "../../../frontend/src/models/workspace.js"),
      "utf8"
    );
    const threadSource = fs.readFileSync(
      path.resolve(__dirname, "../../../frontend/src/models/workspaceThread.js"),
      "utf8"
    );

    expect(workspaceSource).toContain("body: JSON.stringify({ message, attachments, runtime })");
    expect(threadSource).toContain("body: JSON.stringify({ message, attachments, runtime })");
  });

  it("applies runtime overrides before server chat execution", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "../../../server/endpoints/chat.js"),
      "utf8"
    );

    expect(source).toContain("applyRuntimeSelectionToWorkspace");
    expect(source).toContain("const runtimeWorkspace =");
    expect(source).toContain("workspaceName: workspace?.name");
    expect(source).toContain("runtimeWorkspace?.chatModel || \"System Default\"");
  });
});
