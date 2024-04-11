const AIbitat = require("./abitat");
const AgentPlugins = require("./abitat/plugins");
const {
  WorkspaceAgentInvocation,
} = require("../../models/workspaceAgentInvocation");

class AgentHandler {
  #invocationUUID;
  invocation = null;
  abitat = null;
  channel = null;

  constructor({ uuid }) {
    this.#invocationUUID = uuid;
    this.log(`Starting agent handler for invocation`, this.#invocationUUID);
    this.defaultUserAgent = {
      interrupt: "ALWAYS",
      role: "I am the human monitor and oversee this chat. Any questions on action or decision making should be directed to me.",
    };

    this.config = {
      provider: "openai",
      model: "gpt-3.5-turbo",
      plugins: {
        websocket: {
          params: {
            socket: {
              required: true,
            },
            introspection: {
              required: false,
              default: true,
            },
          },
        },
        experimental_webBrowsing: { params: {} },
        docSummarizer: { params: {} },
        saveFileInBrowser: { params: {} },
      },
    };
  }

  log(text, ...args) {
    console.log(`\x1b[36m[AgentHandler]\x1b[0m ${text}`, ...args);
  }

  async #validInvocation() {
    const invocation = await WorkspaceAgentInvocation.get({
      uuid: String(this.#invocationUUID),
    });
    this.invocation = invocation ?? null;
  }

  #defaultWorkspaceAgent() {
    return {
      role: "You are a helpful ai assistant who can assist the user and use tools available to help answer the users prompts and questions.",
      // functions: ["web-browsing"],
      functions: ["save-file"],
    };
  }

  #attachPlugins(args) {
    for (const [pluginKey, pluginConfig] of Object.entries(
      this.config.plugins
    )) {
      if (!AgentPlugins.hasOwnProperty(pluginKey)) {
        this.log(`${pluginKey} is not a valid plugin. Skipping plugin.`);
        continue;
      }

      const callOpts = {};
      for (const [param, definition] of Object.entries(pluginConfig.params)) {
        if (
          definition.required &&
          (!args.hasOwnProperty(param) || args[param] === null)
        ) {
          this.log(
            `'${param}' required parameter for '${pluginKey}' plugin is missing. Plugin may not function or crash agent.`
          );
          continue;
        }
        callOpts[param] = args.hasOwnProperty(param)
          ? args[param]
          : definition.default || null;
      }

      const plugin = AgentPlugins[pluginKey];
      this.abitat.use(plugin(callOpts));
      this.log(`Attached ${pluginKey} plugin to Agent cluster`);
    }
  }

  async #loadAgents() {
    // Default User agent and workspace agent
    this.log(`Attaching user and default agent to Agent cluster.`);
    this.abitat.agent("USER", this.defaultUserAgent);
    this.abitat.agent("@workspace", this.#defaultWorkspaceAgent());

    // const agentHandles = [
    //   'USER',
    //   '@workspace',
    //   ...WorkspaceAgentInvocation.parseAgents(
    //     this.invocation.prompt
    //   )
    // ];

    // if (agentHandles.length > 1) {
    //   this.log(`Creating channel for agents ${this.invocation.uuid}`);
    //   this.channel = this.invocation.uuid;
    //   console.log(`${agentHandles.length} loaded`);
    //   this.abitat.channel(this.channel, agentHandles)
    // }

    // TODO: Add defined agent support.
    // console.log(
    //   `Would also load in ${agentHandles.join(
    //     ","
    //   )} when that feature is available.`
    // );
  }

  async init() {
    await this.#validInvocation();
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
      handlerProps: {
        invocation: this.invocation,
        log: this.log,
      },
    });

    this.#attachPlugins(args);
    await this.#loadAgents();
  }

  startAgentCluster() {
    return this.abitat.start({
      from: "USER",
      to: this.channel ?? "@workspace",
      content: this.invocation.prompt,
    });
  }
}

module.exports.AgentHandler = AgentHandler;
