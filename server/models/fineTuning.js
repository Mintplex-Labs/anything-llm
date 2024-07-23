const { default: slugify } = require("slugify");
const { safeJsonParse } = require("../utils/http");
const { Telemetry } = require("./telemetry");
const { Workspace } = require("./workspace");
const { WorkspaceChats } = require("./workspaceChats");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const tmpStorage =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../storage/tmp`)
    : path.resolve(
        process.env.STORAGE_DIR ?? path.resolve(__dirname, `../storage`),
        `tmp`
      );

const FineTuning = {
  API_BASE:
    process.env.NODE_ENV === "development"
      ? process.env.FINE_TUNING_ORDER_API
      : "https://finetuning-wxich7363q-uc.a.run.app",
  recommendedMinDataset: 50,
  standardPrompt:
    "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed.",

  /**
   * Get the information for the Fine-tuning product to display in various frontends
   * @returns {Promise<{
   *  productDetails: {
   *    name: string,
   *    description: string,
   *    icon: string,
   *    active: boolean,
   *  },
   *  pricing: {
   *    usd: number,
   *  },
   *  availableBaseModels: string[]
   * }>}
   */
  getInfo: async function () {
    return fetch(`${this.API_BASE}/info`, {
      method: "GET",
      headers: {
        Accepts: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Could not fetch fine-tuning information endpoint");
        return res.json();
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  },
  /**
   * Get the Dataset size for a training set.
   * @param {string[]} workspaceSlugs
   * @param {boolean|null} feedback
   * @returns {Promise<number>}
   */
  datasetSize: async function (workspaceSlugs = [], feedback = null) {
    const workspaceIds = await Workspace.where({
      slug: {
        in: workspaceSlugs.map((slug) => String(slug)),
      },
    }).then((results) => results.map((res) => res.id));

    const count = await WorkspaceChats.count({
      workspaceId: {
        in: workspaceIds,
      },
      ...(feedback === true ? { feedback: 1 } : {}),
    });
    return count;
  },

  _writeToTempStorage: function (data) {
    const tmpFilepath = path.resolve(tmpStorage, `${uuidv4()}.json`);
    if (!fs.existsSync(tmpStorage))
      fs.mkdirSync(tmpStorage, { recursive: true });
    fs.writeFileSync(tmpFilepath, JSON.stringify(data, null, 4));
    return tmpFilepath;
  },

  _rmTempDatafile: function (datafileLocation) {
    if (!datafileLocation || !fs.existsSync(datafileLocation)) return;
    fs.rmSync(datafileLocation);
  },

  _uploadDatafile: async function (datafileLocation, uploadConfig) {
    try {
      const fileBuffer = fs.readFileSync(datafileLocation);
      const formData = new FormData();
      Object.entries(uploadConfig.fields).forEach(([key, value]) =>
        formData.append(key, value)
      );
      formData.append("file", fileBuffer);
      const response = await fetch(uploadConfig.url, {
        method: "POST",
        body: formData,
      });

      console.log("File upload returned code:", response.status);
      return true;
    } catch (error) {
      console.error("Error uploading file:", error.message);
      return false;
    }
  },

  _buildSystemPrompt: function (chat, prompt = null) {
    const sources = safeJsonParse(chat.response)?.sources || [];
    const contextTexts = sources.map((source) => source.text);
    const context =
      sources.length > 0
        ? "\nContext:\n" +
          contextTexts
            .map((text, i) => {
              return `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`;
            })
            .join("")
        : "";
    return `${prompt ?? this.standardPrompt}${context}`;
  },

  _createTempDataFile: async function ({ slugs, feedback }) {
    const workspacePromptMap = {};
    const workspaces = await Workspace.where({
      slug: {
        in: slugs.map((slug) => String(slug)),
      },
    });
    workspaces.forEach((ws) => {
      workspacePromptMap[ws.id] = ws.openAiPrompt ?? this.standardPrompt;
    });

    const chats = await WorkspaceChats.whereWithData({
      workspaceId: {
        in: workspaces.map((ws) => ws.id),
      },
      ...(feedback === true ? { feedback: 1 } : {}),
    });
    const preparedData = chats.map((chat) => {
      const responseJson = safeJsonParse(chat.response);
      return {
        instruction: this._buildSystemPrompt(
          chat,
          workspacePromptMap[chat.workspaceId]
        ),
        input: chat.prompt,
        output: responseJson.text,
      };
    });

    const tmpFile = this._writeToTempStorage(preparedData);
    return tmpFile;
  },

  /**
   * Generate fine-tune order request
   * @param {object} data
   * @returns {Promise<{jobId:string, uploadParams: object, configReady: boolean, checkoutUrl:string}>}
   */
  _requestOrder: async function (data = {}) {
    return await fetch(`${this.API_BASE}/order/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not create fine-tune order");
        return res.json();
      })
      .catch((e) => {
        console.error(e);
        return {
          jobId: null,
          uploadParams: null,
          configReady: null,
          checkoutUrl: null,
        };
      });
  },

  /**
   * Sanitizes the slugifies the model name to prevent issues during processing.
   * only a-zA-Z0-9 are okay for model names. If name is totally invalid it becomes a uuid.
   * @param {string} modelName - provided model name
   * @returns {string}
   */
  _cleanModelName: function (modelName = "") {
    if (!modelName) return uuidv4();
    const sanitizedName = modelName.replace(/[^a-zA-Z0-9]/g, " ");
    return slugify(sanitizedName);
  },

  newOrder: async function ({ email, baseModel, modelName, trainingData }) {
    const datafileLocation = await this._createTempDataFile(trainingData);
    const order = await this._requestOrder({
      email,
      baseModel,
      modelName: this._cleanModelName(modelName),
      orderExtras: { platform: Telemetry.runtime() },
    });
    const uploadComplete = await this._uploadDatafile(
      datafileLocation,
      order.uploadParams
    );
    if (!uploadComplete)
      throw new Error("Data file upload failed. Order could not be created.");
    this._rmTempDatafile(datafileLocation);
    return { jobId: order.jobId, checkoutUrl: order.checkoutUrl };
  },
};

module.exports = { FineTuning };
