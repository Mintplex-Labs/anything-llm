const AIbitat = require("./aibitat");
const AgentPlugins = require("./aibitat/plugins");
const {
  WorkspaceAgentInvocation,
} = require("../../models/workspaceAgentInvocation");
const { User } = require("../../models/user");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { safeJsonParse } = require("../http");
const { USER_AGENT, WORKSPACE_AGENT } = require("./defaults");
const ImportedPlugin = require("./imported");
const { AgentFlows } = require("../agentFlows");
const MCPCompatibilityLayer = require("../MCP");

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
            thread_id: this.invocation.thread_id || null,
            api_session_id: null,
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

  checkSetup() {
    switch (this.provider) {
      case "openai":
        if (!process.env.OPEN_AI_KEY)
          throw new Error("OpenAI API key must be provided to use agents.");
        break;
      case "anthropic":
        if (!process.env.ANTHROPIC_API_KEY)
          throw new Error("Anthropic API key must be provided to use agents.");
        break;
      case "lmstudio":
        if (!process.env.LMSTUDIO_BASE_PATH)
          throw new Error("LMStudio base path must be provided to use agents.");
        break;
      case "ollama":
        if (!process.env.OLLAMA_BASE_PATH)
          throw new Error("Ollama base path must be provided to use agents.");
        break;
      case "groq":
        if (!process.env.GROQ_API_KEY)
          throw new Error("Groq API key must be provided to use agents.");
        break;
      case "togetherai":
        if (!process.env.TOGETHER_AI_API_KEY)
          throw new Error("TogetherAI API key must be provided to use agents.");
        break;
      case "azure":
        if (!process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_KEY)
          throw new Error(
            "Azure OpenAI API endpoint and key must be provided to use agents."
          );
        break;
      case "koboldcpp":
        if (!process.env.KOBOLD_CPP_BASE_PATH)
          throw new Error(
            "KoboldCPP must have a valid base path to use for the api."
          );
        break;
      case "localai":
        if (!process.env.LOCAL_AI_BASE_PATH)
          throw new Error(
            "LocalAI must have a valid base path to use for the api."
          );
        break;
      case "openrouter":
        if (!process.env.OPENROUTER_API_KEY)
          throw new Error("OpenRouter API key must be provided to use agents.");
        break;
      case "mistral":
        if (!process.env.MISTRAL_API_KEY)
          throw new Error("Mistral API key must be provided to use agents.");
        break;
      case "generic-openai":
        if (!process.env.GENERIC_OPEN_AI_BASE_PATH)
          throw new Error("API base path must be provided to use agents.");
        break;
      case "perplexity":
        if (!process.env.PERPLEXITY_API_KEY)
          throw new Error("Perplexity API key must be provided to use agents.");
        break;
      case "textgenwebui":
        if (!process.env.TEXT_GEN_WEB_UI_BASE_PATH)
          throw new Error(
            "TextWebGenUI API base path must be provided to use agents."
          );
        break;
      case "bedrock":
        if (
          !process.env.AWS_BEDROCK_LLM_ACCESS_KEY_ID ||
          !process.env.AWS_BEDROCK_LLM_ACCESS_KEY ||
          !process.env.AWS_BEDROCK_LLM_REGION
        )
          throw new Error(
            "AWS Bedrock Access Keys and region must be provided to use agents."
          );
        break;
      case "fireworksai":
        if (!process.env.FIREWORKS_AI_LLM_API_KEY)
          throw new Error(
            "FireworksAI API Key must be provided to use agents."
          );
        break;
      case "deepseek":
        if (!process.env.DEEPSEEK_API_KEY)
          throw new Error("DeepSeek API Key must be provided to use agents.");
        break;
      case "litellm":
        if (!process.env.LITE_LLM_BASE_PATH)
          throw new Error(
            "LiteLLM API base path and key must be provided to use agents."
          );
        break;
      case "apipie":
        if (!process.env.APIPIE_LLM_API_KEY)
          throw new Error("ApiPie API Key must be provided to use agents.");
        break;
      case "xai":
        if (!process.env.XAI_LLM_API_KEY)
          throw new Error("xAI API Key must be provided to use agents.");
        break;
      case "novita":
        if (!process.env.NOVITA_LLM_API_KEY)
          throw new Error("Novita API Key must be provided to use agents.");
        break;
      case "nvidia-nim":
        if (!process.env.NVIDIA_NIM_LLM_BASE_PATH)
          throw new Error(
            "NVIDIA NIM base path must be provided to use agents."
          );
        break;
      case "ppio":
        if (!process.env.PPIO_API_KEY)
          throw new Error("PPIO API Key must be provided to use agents.");
        break;
      case "gemini":
        if (!process.env.GEMINI_API_KEY)
          throw new Error("Gemini API key must be provided to use agents.");
        break;
      case "dpais":
        if (!process.env.DPAIS_LLM_BASE_PATH)
          throw new Error(
            "Dell Pro AI Studio base path must be provided to use agents."
          );
        if (!process.env.DPAIS_LLM_MODEL_PREF)
          throw new Error(
            "Dell Pro AI Studio model must be set to use agents."
          );
        break;
      case "moonshotai":
        if (!process.env.MOONSHOT_AI_MODEL_PREF)
          throw new Error("Moonshot AI model must be set to use agents.");
        break;

      case "cometapi":
        if (!process.env.COMETAPI_LLM_API_KEY)
          throw new Error("CometAPI API Key must be provided to use agents.");
        break;

      case "foundry":
        if (!process.env.FOUNDRY_BASE_PATH)
          throw new Error("Foundry base path must be provided to use agents.");
        break;

      default:
        throw new Error(
          "No workspace agent provider set. Please set your agent provider in the workspace's settings"
        );
    }
  }

  /**
   * Finds the default model for a given provider. If no default model is set for it's associated ENV then
   * it will return a reasonable base model for the provider if one exists.
   * @param {string} provider - The provider to find the default model for.
   * @returns {string|null} The default model for the provider.
   */
  providerDefault(provider = this.provider) {
    switch (provider) {
      case "openai":
        return process.env.OPEN_MODEL_PREF ?? "gpt-4o";
      case "anthropic":
        return process.env.ANTHROPIC_MODEL_PREF ?? "claude-3-sonnet-20240229";
      case "lmstudio":
        return process.env.LMSTUDIO_MODEL_PREF ?? "server-default";
      case "ollama":
        return process.env.OLLAMA_MODEL_PREF ?? "llama3:latest";
      case "groq":
        return process.env.GROQ_MODEL_PREF ?? "llama3-70b-8192";
      case "togetherai":
        return (
          process.env.TOGETHER_AI_MODEL_PREF ??
          "mistralai/Mixtral-8x7B-Instruct-v0.1"
        );
      case "azure":
        return process.env.OPEN_MODEL_PREF;
      case "koboldcpp":
        return process.env.KOBOLD_CPP_MODEL_PREF ?? null;
      case "localai":
        return process.env.LOCAL_AI_MODEL_PREF ?? null;
      case "openrouter":
        return process.env.OPENROUTER_MODEL_PREF ?? "openrouter/auto";
      case "mistral":
        return process.env.MISTRAL_MODEL_PREF ?? "mistral-medium";
      case "generic-openai":
        return process.env.GENERIC_OPEN_AI_MODEL_PREF ?? null;
      case "perplexity":
        return process.env.PERPLEXITY_MODEL_PREF ?? "sonar-small-online";
      case "textgenwebui":
        return "text-generation-webui";
      case "bedrock":
        return process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE ?? null;
      case "fireworksai":
        return process.env.FIREWORKS_AI_LLM_MODEL_PREF ?? null;
      case "deepseek":
        return process.env.DEEPSEEK_MODEL_PREF ?? "deepseek-chat";
      case "litellm":
        return process.env.LITE_LLM_MODEL_PREF ?? null;
      case "moonshotai":
        return process.env.MOONSHOT_AI_MODEL_PREF ?? "moonshot-v1-32k";
      case "apipie":
        return process.env.APIPIE_LLM_MODEL_PREF ?? null;
      case "xai":
        return process.env.XAI_LLM_MODEL_PREF ?? "grok-beta";
      case "novita":
        return process.env.NOVITA_LLM_MODEL_PREF ?? "deepseek/deepseek-r1";
      case "nvidia-nim":
        return process.env.NVIDIA_NIM_LLM_MODEL_PREF ?? null;
      case "ppio":
        return process.env.PPIO_MODEL_PREF ?? "qwen/qwen2.5-32b-instruct";
      case "gemini":
        return process.env.GEMINI_LLM_MODEL_PREF ?? "gemini-2.0-flash-lite";
      case "dpais":
        return process.env.DPAIS_LLM_MODEL_PREF;
      case "cometapi":
        return process.env.COMETAPI_LLM_MODEL_PREF ?? "gpt-5-mini";
      case "foundry":
        return process.env.FOUNDRY_MODEL_PREF ?? null;
      default:
        return null;
    }
  }

  /**
   * Attempts to find a fallback provider and model to use if the workspace
   * does not have an explicit `agentProvider` and `agentModel` set.
   * 1. Fallback to the workspace `chatProvider` and `chatModel` if they exist.
   * 2. Fallback to the system `LLM_PROVIDER` and try to load the associated default model via ENV params or a base available model.
   * 3. Otherwise, return null - will likely throw an error the user can act on.
   * @returns {object|null} - An object with provider and model keys.
   */
  #getFallbackProvider() {
    // First, fallback to the workspace chat provider and model if they exist
    if (
      this.invocation.workspace.chatProvider &&
      this.invocation.workspace.chatModel
    ) {
      return {
        provider: this.invocation.workspace.chatProvider,
        model: this.invocation.workspace.chatModel,
      };
    }

    // If workspace does not have chat provider and model fallback
    // to system provider and try to load provider default model
    const systemProvider = process.env.LLM_PROVIDER;
    const systemModel = this.providerDefault(systemProvider);
    if (systemProvider && systemModel) {
      return {
        provider: systemProvider,
        model: systemModel,
      };
    }

    return null;
  }

  /**
   * Finds or assumes the model preference value to use for API calls.
   * If multi-model loading is supported, we use their agent model selection of the workspace
   * If not supported, we attempt to fallback to the system provider value for the LLM preference
   * and if that fails - we assume a reasonable base model to exist.
   * @returns {string|null} the model preference value to use in API calls
   */
  #fetchModel() {
    // Provider was not explicitly set for workspace, so we are going to run our fallback logic
    // that will set a provider and model for us to use.
    if (!this.provider) {
      const fallback = this.#getFallbackProvider();
      if (!fallback) throw new Error("No valid provider found for the agent.");
      this.provider = fallback.provider; // re-set the provider to the fallback provider so it is not null.
      return fallback.model; // set its defined model based on fallback logic.
    }

    // The provider was explicitly set, so check if the workspace has an agent model set.
    if (this.invocation.workspace.agentModel)
      return this.invocation.workspace.agentModel;

    // Otherwise, we have no model to use - so guess a default model to use via the provider
    // and it's system ENV params and if that fails - we return either a base model or null.
    return this.providerDefault();
  }

  #providerSetupAndCheck() {
    this.provider = this.invocation.workspace.agentProvider ?? null; // set provider to workspace agent provider if it exists
    this.model = this.#fetchModel();

    if (!this.provider)
      throw new Error("No valid provider found for the agent.");
    this.log(`Start ${this.#invocationUUID}::${this.provider}:${this.model}`);
    this.checkSetup();
  }

  async #validInvocation() {
    const invocation = await WorkspaceAgentInvocation.getWithWorkspace({
      uuid: String(this.#invocationUUID),
    });
    if (invocation?.closed)
      throw new Error("This agent invocation is already closed");
    this.invocation = invocation ?? null;
  }

  parseCallOptions(args, config = {}, pluginName) {
    const callOpts = {};
    for (const [param, definition] of Object.entries(config)) {
      if (
        definition.required &&
        (!Object.prototype.hasOwnProperty.call(args, param) ||
          args[param] === null)
      ) {
        this.log(
          `'${param}' required parameter for '${pluginName}' plugin is missing. Plugin may not function or crash agent.`
        );
        continue;
      }
      callOpts[param] = Object.prototype.hasOwnProperty.call(args, param)
        ? args[param]
        : definition.default || null;
    }
    return callOpts;
  }

  async #attachPlugins(args) {
    for (const name of this.#funcsToLoad) {
      // Load child plugin
      if (name.includes("#")) {
        const [parent, childPluginName] = name.split("#");
        if (!Object.prototype.hasOwnProperty.call(AgentPlugins, parent)) {
          this.log(
            `${parent} is not a valid plugin. Skipping inclusion to agent cluster.`
          );
          continue;
        }

        const childPlugin = AgentPlugins[parent].plugin.find(
          (child) => child.name === childPluginName
        );
        if (!childPlugin) {
          this.log(
            `${parent} does not have child plugin named ${childPluginName}. Skipping inclusion to agent cluster.`
          );
          continue;
        }

        const callOpts = this.parseCallOptions(
          args,
          childPlugin?.startupConfig?.params,
          name
        );
        this.aibitat.use(childPlugin.plugin(callOpts));
        this.log(
          `Attached ${parent}:${childPluginName} plugin to Agent cluster`
        );
        continue;
      }

      // Load flow plugin. This is marked by `@@flow_` in the array of functions to load.
      if (name.startsWith("@@flow_")) {
        const uuid = name.replace("@@flow_", "");
        const plugin = AgentFlows.loadFlowPlugin(uuid, this.aibitat);
        if (!plugin) {
          this.log(
            `Flow ${uuid} not found in flows directory. Skipping inclusion to agent cluster.`
          );
          continue;
        }

        this.aibitat.use(plugin.plugin());
        this.log(
          `Attached flow ${plugin.name} (${plugin.flowName}) plugin to Agent cluster`
        );
        continue;
      }

      // Load MCP plugin. This is marked by `@@mcp_` in the array of functions to load.
      // All sub-tools are loaded here and are denoted by `pluginName:toolName` as their identifier.
      // This will replace the parent MCP server plugin with the sub-tools as child plugins so they
      // can be called directly by the agent when invoked.
      // Since to get to this point, the `activeMCPServers` method has already been called, we can
      // safely assume that the MCP server is running and the tools are available/loaded.
      if (name.startsWith("@@mcp_")) {
        const mcpPluginName = name.replace("@@mcp_", "");
        const plugins =
          await new MCPCompatibilityLayer().convertServerToolsToPlugins(
            mcpPluginName,
            this.aibitat
          );
        if (!plugins) {
          this.log(
            `MCP ${mcpPluginName} not found in MCP server config. Skipping inclusion to agent cluster.`
          );
          continue;
        }

        // Remove the old function from the agent functions directly
        // and push the new ones onto the end of the array so that they are loaded properly.
        this.aibitat.agents.get("@agent").functions = this.aibitat.agents
          .get("@agent")
          .functions.filter((f) => f.name !== name);
        for (const plugin of plugins)
          this.aibitat.agents.get("@agent").functions.push(plugin.name);

        plugins.forEach((plugin) => {
          this.aibitat.use(plugin.plugin());
          this.log(
            `Attached MCP::${plugin.toolName} MCP tool to Agent cluster`
          );
        });
        continue;
      }

      // Load imported plugin. This is marked by `@@` in the array of functions to load.
      // and is the @@hubID of the plugin.
      if (name.startsWith("@@")) {
        const hubId = name.replace("@@", "");
        const valid = ImportedPlugin.validateImportedPluginHandler(hubId);
        if (!valid) {
          this.log(
            `Imported plugin by hubId ${hubId} not found in plugin directory. Skipping inclusion to agent cluster.`
          );
          continue;
        }

        const plugin = ImportedPlugin.loadPluginByHubId(hubId);
        const callOpts = plugin.parseCallOptions();
        this.aibitat.use(plugin.plugin(callOpts));
        this.log(
          `Attached ${plugin.name} (${hubId}) imported plugin to Agent cluster`
        );
        continue;
      }

      // Load single-stage plugin.
      if (!Object.prototype.hasOwnProperty.call(AgentPlugins, name)) {
        this.log(
          `${name} is not a valid plugin. Skipping inclusion to agent cluster.`
        );
        continue;
      }

      const callOpts = this.parseCallOptions(
        args,
        AgentPlugins[name].startupConfig.params
      );
      const AIbitatPlugin = AgentPlugins[name];
      this.aibitat.use(AIbitatPlugin.plugin(callOpts));
      this.log(`Attached ${name} plugin to Agent cluster`);
    }
  }

  async #loadAgents() {
    // Default User agent and workspace agent
    this.log(`Attaching user and default agent to Agent cluster.`);
    const user = this.invocation.user_id
      ? await User.get({ id: Number(this.invocation.user_id) })
      : null;
    const userAgentDef = await USER_AGENT.getDefinition();
    const workspaceAgentDef = await WORKSPACE_AGENT.getDefinition(
      this.provider,
      this.invocation.workspace,
      user
    );

    this.aibitat.agent(USER_AGENT.name, userAgentDef);
    this.aibitat.agent(WORKSPACE_AGENT.name, workspaceAgentDef);
    this.#funcsToLoad = [
      ...(userAgentDef?.functions || []),
      ...(workspaceAgentDef?.functions || []),
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
      model: this.model ?? "gpt-4o",
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
    await this.#attachPlugins(args);
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
