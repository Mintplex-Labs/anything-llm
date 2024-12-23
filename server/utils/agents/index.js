const AIbitat = require("./aibitat");
const AgentPlugins = require("./aibitat/plugins");
const {
  WorkspaceAgentInvocation,
} = require("../../models/workspaceAgentInvocation");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { safeJsonParse } = require("../http");
const { USER_AGENT, WORKSPACE_AGENT } = require("./defaults");
const ImportedPlugin = require("./imported");

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
      case "gemini":
        if (!process.env.GEMINI_API_KEY)
          throw new Error("Gemini API key must be provided to use agents.");
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
            "Nvidia NIM base path must be provided to use agents."
          );
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
        return null;
      case "koboldcpp":
        return process.env.KOBOLD_CPP_MODEL_PREF ?? null;
      case "gemini":
        return process.env.GEMINI_MODEL_PREF ?? "gemini-pro";
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
        return null;
      case "bedrock":
        return process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE ?? null;
      case "fireworksai":
        return process.env.FIREWORKS_AI_LLM_MODEL_PREF ?? null;
      case "deepseek":
        return process.env.DEEPSEEK_MODEL_PREF ?? "deepseek-chat";
      case "litellm":
        return process.env.LITE_LLM_MODEL_PREF ?? null;
      case "apipie":
        return process.env.APIPIE_LLM_MODEL_PREF ?? null;
      case "xai":
        return process.env.XAI_LLM_MODEL_PREF ?? "grok-beta";
      case "novita":
        return process.env.NOVITA_LLM_MODEL_PREF ?? "gryphe/mythomax-l2-13b";
      case "nvidia-nim":
        return process.env.NVIDIA_NIM_LLM_MODEL_PREF ?? null;
      default:
        return null;
    }
  }

  /**
   * Attempts to find a fallback provider and model to use if the workspace
   * does not have an explicit `agentProvider` and `agentModel` set.
   * 1. Fallback to the workspace `chatProvider` and `chatModel` if they exist.
   * 2. Fallback to the system `LLM_PROVIDER` and try to load the the associated default model via ENV params or a base available model.
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
        (!args.hasOwnProperty(param) || args[param] === null)
      ) {
        this.log(
          `'${param}' required parameter for '${pluginName}' plugin is missing. Plugin may not function or crash agent.`
        );
        continue;
      }
      callOpts[param] = args.hasOwnProperty(param)
        ? args[param]
        : definition.default || null;
    }
    return callOpts;
  }

  #attachPlugins(args) {
    for (const name of this.#funcsToLoad) {
      // Load child plugin
      if (name.includes("#")) {
        const [parent, childPluginName] = name.split("#");
        if (!AgentPlugins.hasOwnProperty(parent)) {
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
      if (!AgentPlugins.hasOwnProperty(name)) {
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
    this.aibitat.agent(USER_AGENT.name, await USER_AGENT.getDefinition());
    this.aibitat.agent(
      WORKSPACE_AGENT.name,
      await WORKSPACE_AGENT.getDefinition(this.provider)
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
