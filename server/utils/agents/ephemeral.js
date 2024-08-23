const AIbitat = require("./aibitat");
const AgentPlugins = require("./aibitat/plugins");
const { httpSocket } = require("./aibitat/plugins/http-socket.js");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { safeJsonParse } = require("../http");
const {
  USER_AGENT,
  WORKSPACE_AGENT,
  agentSkillsFromSystemSettings,
} = require("./defaults");
const { AgentHandler } = require(".");
const {
  WorkspaceAgentInvocation,
} = require("../../models/workspaceAgentInvocation");

/**
 * This is an instance and functional Agent handler, but it does not utilize
 * sessions or websocket's and is instead a singular one-off agent run that does
 * not persist between invocations
 */
class EphemeralAgentHandler extends AgentHandler {
  #invocationUUID = null;
  #workspace = null;
  #userId = null;
  #threadId = null;
  #sessionId = null;
  #prompt = null;
  #funcsToLoad = [];

  aibitat = null;
  channel = null;
  provider = null;
  model = null;

  constructor({
    uuid,
    workspace,
    prompt,
    userId = null,
    threadId = null,
    sessionId = null,
  }) {
    super({ uuid });
    this.#invocationUUID = uuid;
    this.#workspace = workspace;
    this.#prompt = prompt;

    this.#userId = userId;
    this.#threadId = threadId;
    this.#sessionId = sessionId;
  }

  log(text, ...args) {
    console.log(`\x1b[36m[EphemeralAgentHandler]\x1b[0m ${text}`, ...args);
  }

  closeAlert() {
    this.log(`End ${this.#invocationUUID}::${this.provider}:${this.model}`);
  }

  async #chatHistory(limit = 10) {
    try {
      const rawHistory = (
        await WorkspaceChats.where(
          {
            workspaceId: this.#workspace.id,
            user_id: this.#userId || null,
            thread_id: this.#threadId || null,
            api_session_id: this.#sessionId,
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

  /**
   * Finds or assumes the model preference value to use for API calls.
   * If multi-model loading is supported, we use their agent model selection of the workspace
   * If not supported, we attempt to fallback to the system provider value for the LLM preference
   * and if that fails - we assume a reasonable base model to exist.
   * @returns {string} the model preference value to use in API calls
   */
  #fetchModel() {
    if (!Object.keys(this.noProviderModelDefault).includes(this.provider))
      return this.#workspace.agentModel || this.providerDefault();

    // Provider has no reliable default (cant load many models) - so we need to look at system
    // for the model param.
    const sysModelKey = this.noProviderModelDefault[this.provider];
    if (!!sysModelKey)
      return process.env[sysModelKey] ?? this.providerDefault();

    // If all else fails - look at the provider default list
    return this.providerDefault();
  }

  #providerSetupAndCheck() {
    this.provider = this.#workspace.agentProvider;
    this.model = this.#fetchModel();
    this.log(`Start ${this.#invocationUUID}::${this.provider}:${this.model}`);
    this.checkSetup();
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
      AgentPlugins.memory.name,
      AgentPlugins.docSummarizer.name,
      AgentPlugins.webScraping.name,
      ...(await agentSkillsFromSystemSettings()),
    ];
  }

  async init() {
    this.#providerSetupAndCheck();
    return this;
  }

  async createAIbitat(
    args = {
      handler,
    }
  ) {
    this.aibitat = new AIbitat({
      provider: this.provider ?? "openai",
      model: this.model ?? "gpt-4o",
      chats: await this.#chatHistory(20),
      handlerProps: {
        invocation: {
          workspace: this.#workspace,
          workspace_id: this.#workspace.id,
        },
        log: this.log,
      },
    });

    // Attach HTTP response object if defined for chunk streaming.
    this.log(`Attached ${httpSocket.name} plugin to Agent cluster`);
    this.aibitat.use(
      httpSocket.plugin({
        handler: args.handler,
        muteUserReply: true,
        introspection: true,
      })
    );

    // Load required agents (Default + custom)
    await this.#loadAgents();

    // Attach all required plugins for functions to operate.
    this.#attachPlugins(args);
  }

  startAgentCluster() {
    return this.aibitat.start({
      from: USER_AGENT.name,
      to: this.channel ?? WORKSPACE_AGENT.name,
      content: this.#prompt,
    });
  }

  /**
   * Determine if the message provided is an agent invocation.
   * @param {{message:string}} parameters
   * @returns {boolean}
   */
  static isAgentInvocation({ message }) {
    const agentHandles = WorkspaceAgentInvocation.parseAgents(message);
    if (agentHandles.length > 0) return true;
    return false;
  }
}

const EventEmitter = require("node:events");
const { writeResponseChunk } = require("../helpers/chat/responses");

/**
 * This is a special EventEmitter specifically used in the Aibitat agent handler
 * that enables us to use HTTP to relay all .introspect and .send events back to an
 * http handler instead of websockets, like we do on the frontend. This interface is meant to
 * mock a websocket interface for the methods used and bind them to an HTTP method so that the developer
 * API can invoke agent calls.
 */
class EphemeralEventListener extends EventEmitter {
  messages = [];
  constructor() {
    super();
  }

  send(jsonData) {
    const data = JSON.parse(jsonData);
    this.messages.push(data);
    this.emit("chunk", data);
  }

  close() {
    this.emit("closed");
  }

  /**
   * Compacts all messages in class and returns them in a condensed format.
   * @returns {{thoughts: string[], textResponse: string}}
   */
  packMessages() {
    const thoughts = [];
    let textResponse = null;
    for (let msg of this.messages) {
      if (msg.type !== "statusResponse") {
        textResponse = msg.content;
      } else {
        thoughts.push(msg.content);
      }
    }
    return { thoughts, textResponse };
  }

  /**
   * Waits on the HTTP plugin to emit the 'closed' event from the agentHandler
   * so that we can compact and return all the messages in the current queue.
   * @returns {Promise<{thoughts: string[], textResponse: string}>}
   */
  async waitForClose() {
    return new Promise((resolve) => {
      this.once("closed", () => resolve(this.packMessages()));
    });
  }

  /**
   * Streams the events with `writeResponseChunk` over HTTP chunked encoding
   * and returns on the close event emission.
   * ----------
   * DevNote: Agents do not stream so in here we are simply
   * emitting the thoughts and text response as soon as we get them.
   * @param {import("express").Response} response
   * @param {string} uuid - Unique identifier that is the same across chunks.
   * @returns {Promise<{thoughts: string[], textResponse: string}>}
   */
  async streamAgentEvents(response, uuid) {
    const onChunkHandler = (data) => {
      if (data.type === "statusResponse") {
        return writeResponseChunk(response, {
          id: uuid,
          type: "agentThought",
          thought: data.content,
          sources: [],
          attachments: [],
          close: false,
          error: null,
        });
      }

      return writeResponseChunk(response, {
        id: uuid,
        type: "textResponse",
        textResponse: data.content,
        sources: [],
        attachments: [],
        close: true,
        error: null,
      });
    };
    this.on("chunk", onChunkHandler);

    // Wait for close and after remove chunk listener
    return this.waitForClose().then((closedResponse) => {
      this.removeListener("chunk", onChunkHandler);
      return closedResponse;
    });
  }
}

module.exports = { EphemeralAgentHandler, EphemeralEventListener };
