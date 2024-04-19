const AIbitat = require("./aibitat");
const AgentPlugins = require("./aibitat/plugins");
const {
  WorkspaceAgentInvocation,
} = require("../../models/workspaceAgentInvocation");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { safeJsonParse } = require("../http");
const { USER_AGENT, WORKSPACE_AGENT } = require("./defaults");

class AgentHandler {
  #invocationUUID;
  #funcsToLoad = [];
  invocation = null;
  aibitat = null;
  channel = null;
  provider = null;
  model = null;

  constructor({ uuid }) {
    this.#invocationUUID = uuid;
  }

  log(text, ...args) {
    console.log(`\x1b[36m[AgentHandler]\x1b[0m ${text}`, ...args);
  }

  closeAlert() {
    this.log(`End ${this.#invocationUUID}::${this.provider}:${this.model}`);
  }

  async #chatHistory(limit = 10) {
    try {
      const rawHistory = (
        await WorkspaceChats.where(
          {
            workspaceId: this.invocation.workspace_id,
            user_id: this.invocation.user_id || null,
            thread_id: this.invocation.user_id || null,
            include: true,
          },
          limit,
          { id: "desc" }
        )
      ).reverse();

      const agentHistory = [];
      rawHistory.forEach((chatLog) => {
        agentHistory.push(
          {
            from: USER_AGENT.name,
            to: WORKSPACE_AGENT.name,
            content: chatLog.prompt,
            state: "success",
          },
          {
            from: WORKSPACE_AGENT.name,
            to: USER_AGENT.name,
            content: safeJsonParse(chatLog.response)?.text || "",
            state: "success",
          }
        );
      });
      return agentHistory;
    } catch (e) {
      this.log("Error loading chat history", e.message);
      return [];
    }
  }

  #checkSetup() {
    switch (this.provider) {
      case "openai":
        if (!process.env.OPEN_AI_KEY)
          throw new Error("OpenAI API key must be provided to use agents.");
        break;
      case "anthropic":
        if (!process.env.ANTHROPIC_API_KEY)
          throw new Error("Anthropic API key must be provided to use agents.");
        break;
      default:
        throw new Error("No provider found to power agent cluster.");
    }
  }

  #providerSetupAndCheck() {
    this.provider = this.invocation.workspace.agentProvider || "openai";
    this.model = this.invocation.workspace.agentModel || "gpt-3.5-turbo";
    this.log(`Start ${this.#invocationUUID}::${this.provider}:${this.model}`);
    this.#checkSetup();
  }

  async #validInvocation() {
    const invocation = await WorkspaceAgentInvocation.getWithWorkspace({
      uuid: String(this.#invocationUUID),
    });
    if (invocation?.closed)
      throw new Error("This agent invocation is already closed");
    this.invocation = invocation ?? null;
  }

  #attachPlugins(args) {
    for (const name of this.#funcsToLoad) {
      if (!AgentPlugins.hasOwnProperty(name)) {
        this.log(
          `${name} is not a valid plugin. Skipping inclusion to agent cluster.`
        );
        continue;
      }

      const callOpts = {};
      for (const [param, definition] of Object.entries(
        AgentPlugins[name].startupConfig.params
      )) {
        if (
          definition.required &&
          (!args.hasOwnProperty(param) || args[param] === null)
        ) {
          this.log(
            `'${param}' required parameter for '${name}' plugin is missing. Plugin may not function or crash agent.`
          );
          continue;
        }
        callOpts[param] = args.hasOwnProperty(param)
          ? args[param]
          : definition.default || null;
      }

      const AIbitatPlugin = AgentPlugins[name];
      this.aibitat.use(AIbitatPlugin.plugin(callOpts));
      this.log(`Attached ${name} plugin to Agent cluster`);
    }
  }

  async #loadAgents() {
    // Default User agent and workspace agent
    this.log(`Attaching user and default agent to Agent cluster.`);
    this.aibitat.agent(USER_AGENT.name, await USER_AGENT.getDefinition());
    this.aibitat.agent(
      WORKSPACE_AGENT.name,
      await WORKSPACE_AGENT.getDefinition()
    );

    this.#funcsToLoad = [
      ...((await USER_AGENT.getDefinition())?.functions || []),
      ...((await WORKSPACE_AGENT.getDefinition())?.functions || []),
    ];
  }

  async init() {
    await this.#validInvocation();
    this.#providerSetupAndCheck();
    return this;
  }

  async createAIbitat(
    args = {
      socket,
    }
  ) {
    this.aibitat = new AIbitat({
      provider: this.provider ?? "openai",
      model: this.model ?? "gpt-3.5-turbo",
      chats: await this.#chatHistory(20),
      handlerProps: {
        invocation: this.invocation,
        log: this.log,
      },
    });

    // Attach standard websocket plugin for frontend communication.
    this.log(`Attached ${AgentPlugins.websocket.name} plugin to Agent cluster`);
    this.aibitat.use(
      AgentPlugins.websocket.plugin({
        socket: args.socket,
        muteUserReply: true,
        introspection: true,
      })
    );

    // Attach standard chat-history plugin for message storage.
    this.log(
      `Attached ${AgentPlugins.chatHistory.name} plugin to Agent cluster`
    );
    this.aibitat.use(AgentPlugins.chatHistory.plugin());

    // Load required agents (Default + custom)
    await this.#loadAgents();

    // Attach all required plugins for functions to operate.
    this.#attachPlugins(args);
  }

  startAgentCluster() {
    return this.aibitat.start({
      from: USER_AGENT.name,
      to: this.channel ?? WORKSPACE_AGENT.name,
      content: this.invocation.prompt,
    });
  }
}

module.exports.AgentHandler = AgentHandler;
