const AIbitat = require("./abitat");
const AgentPlugins = require("./abitat/plugins");
const {
  WorkspaceAgentInvocation,
} = require("../../models/workspaceAgentInvocation");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { safeJSON } = require("openai:latest/core");

const DEFAULT_USER_AGENT = {
  name: "USER",
  definition: {
    interrupt: "ALWAYS",
    role: "I am the human monitor and oversee this chat. Any questions on action or decision making should be directed to me.",
  },
};

const DEFAULT_WORKSPACE_AGENT = {
  name: "@workspace",
  definition: {
    role: "You are a helpful ai assistant who can assist the user and use tools available to help answer the users prompts and questions.",
    functions: [
      AgentPlugins.rechart.name,
      AgentPlugins.memory.name,
      AgentPlugins.saveFileInBrowser.name,
      AgentPlugins.experimental_webBrowsing.name,
      AgentPlugins.docSummarizer.name,
    ],
  },
};

class AgentHandler {
  #invocationUUID;
  #funcsToLoad = [];
  invocation = null;
  abitat = null;
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
            from: DEFAULT_USER_AGENT.name,
            to: DEFAULT_WORKSPACE_AGENT.name,
            content: chatLog.prompt,
          },
          {
            from: DEFAULT_WORKSPACE_AGENT.name,
            to: DEFAULT_USER_AGENT.name,
            content: safeJSON(chatLog.response)?.text || "",
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

      const AbitatPlugin = AgentPlugins[name];
      this.abitat.use(AbitatPlugin.plugin(callOpts));
      this.log(`Attached ${name} plugin to Agent cluster`);
    }
  }

  async #loadAgents() {
    this.#funcsToLoad = [
      ...(DEFAULT_USER_AGENT.definition?.functions || []),
      ...(DEFAULT_WORKSPACE_AGENT.definition?.functions || []),
    ];
    // Default User agent and workspace agent
    this.log(`Attaching user and default agent to Agent cluster.`);
    this.abitat.agent(DEFAULT_USER_AGENT.name, DEFAULT_USER_AGENT.definition);
    this.abitat.agent(
      DEFAULT_WORKSPACE_AGENT.name,
      DEFAULT_WORKSPACE_AGENT.definition
    );

    // Load other specially invoked agents (custom agents)
    // Push function requirements to the #funcsToLoad;
    // TODO: implement
  }

  async init() {
    await this.#validInvocation();
    this.#providerSetupAndCheck();
    return this;
  }

  async createAbitat(
    args = {
      socket,
    }
  ) {
    this.abitat = new AIbitat({
      provider: "openai",
      model: "gpt-3.5-turbo",
      chats: await this.#chatHistory(20),
      handlerProps: {
        invocation: this.invocation,
        log: this.log,
      },
    });

    // Attach standard websocket plugin for frontend communication.
    this.log(`Attached ${AgentPlugins.websocket.name} plugin to Agent cluster`);
    this.abitat.use(
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
    this.abitat.use(AgentPlugins.chatHistory.plugin());

    // Load required agents (Default + custom)
    await this.#loadAgents();

    // Attach all required plugins for functions to operate.
    this.#attachPlugins(args);
  }

  startAgentCluster() {
    return this.abitat.start({
      from: DEFAULT_USER_AGENT.name,
      to: this.channel ?? DEFAULT_WORKSPACE_AGENT.name,
      content: this.invocation.prompt,
    });
  }
}

module.exports.AgentHandler = AgentHandler;
