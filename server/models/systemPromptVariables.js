const prisma = require("../utils/prisma");
const moment = require("moment");

const SystemPromptVariables = {
  VALID_TYPES: ["user", "system", "static"],
  DEFAULT_VARIABLES: [
    {
      key: "time",
      value: () => {
        const currentTime = moment().format("LTS");
        return `${currentTime}`;
      },
      description: "Current time",
      type: "system",
      multiUserRequired: false,
    },
    {
      key: "date",
      value: () => {
        const currentDate = moment().format("LL");
        return `${currentDate}`;
      },
      description: "Current date",
      type: "system",
      multiUserRequired: false,
    },
    {
      key: "datetime",
      value: () => {
        const currentDateTime = moment().format("LLLL");
        return `${currentDateTime}`;
      },
      description: "Current date and time",
      type: "system",
      multiUserRequired: false,
    },
    {
      key: "user.name",
      value: async (userId) => {
        if (!userId) return "[User name]";
        try {
          const user = await prisma.users.findUnique({
            where: { id: Number(userId) },
            select: { username: true },
          });
          return user?.username || "[User name is empty or unknown]";
        } catch (error) {
          console.error("Error fetching user name:", error);
          return "[User name is empty or unknown]";
        }
      },
      description: "Current user's username",
      type: "user",
      multiUserRequired: true,
    },
    {
      key: "user.bio",
      value: async (userId) => {
        if (!userId) return "[User bio]";
        try {
          const user = await prisma.users.findUnique({
            where: { id: Number(userId) },
            select: { bio: true },
          });
          return user?.bio || "[User bio is empty]";
        } catch (error) {
          console.error("Error fetching user bio:", error);
          return "[User bio is empty]";
        }
      },
      description: "Current user's bio information",
      type: "user",
      multiUserRequired: true,
    },
  ],

  /**
   * Gets a system prompt variable by its key
   * @param {string} key
   * @returns {Promise<object>}
   */
  get: async function (key = null) {
    if (!key) return null;
    const variable = await prisma.system_prompt_variables.findUnique({
      where: { key: String(key) },
    });
    return variable;
  },

  /**
   * Gets all system prompt variables with dynamic variables
   * @param {number} userId
   * @returns {Promise<object[]>}
   */
  getAllWithDynamic: async function (userId = null) {
    const dbVariables = await prisma.system_prompt_variables.findMany({
      where: userId ? { userId: Number(userId) } : {},
    });

    const formattedDbVars = dbVariables.map((v) => ({
      id: v.id,
      key: v.key,
      value: v.value,
      description: v.description,
      type: v.type,
      userId: v.userId,
    }));

    // If userId is not provided, filter the default variables to only include non-multiUserRequired ones
    const filteredSystemVars = !userId
      ? this.DEFAULT_VARIABLES.filter((v) => !v.multiUserRequired)
      : this.DEFAULT_VARIABLES;

    return [...filteredSystemVars, ...formattedDbVars];
  },

  /**
   * Creates a new system prompt variable
   * @param {{ key: string, value: string, description: string, type: string, userId: number }} data
   * @returns {Promise<object>}
   */
  create: async function ({
    key,
    value,
    description = null,
    type = "static",
    userId = null,
  }) {
    await this._checkVariableKey(key, true);
    return await prisma.system_prompt_variables.create({
      data: {
        key: String(key),
        value: String(value),
        description: description ? String(description) : null,
        type: type ? String(type) : "static",
        userId: userId ? Number(userId) : null,
      },
    });
  },

  /**
   * Updates a system prompt variable by its DB ID
   * @param {number} id
   * @param {{ key: string, value: string, description: string }} data
   * @returns {Promise<object>}
   */
  update: async function (id, { key, value, description = null }) {
    if (!id || !key || !value) return null;
    const existingRecord = await prisma.system_prompt_variables.findFirst({
      where: { id: Number(id) },
    });
    if (!existingRecord) throw new Error("System prompt variable not found");
    await this._checkVariableKey(key, false);

    return await prisma.system_prompt_variables.update({
      where: { id: existingRecord.id },
      data: {
        key: String(key),
        value: String(value),
        description: description ? String(description) : null,
      },
    });
  },

  /**
   * Deletes a system prompt variable by its DB ID
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  delete: async function (id = null) {
    try {
      await prisma.system_prompt_variables.delete({
        where: { id: Number(id) },
      });
      return true;
    } catch (error) {
      console.error("Error deleting variable:", error);
      return false;
    }
  },

  /**
   * Injects variables into a string based on the user ID and the variables available
   * @param {string} str
   * @param {number} userId
   * @returns {Promise<string>}
   */
  expandSystemPromptVariables: async function (str, userId = null) {
    if (!str) return str;

    try {
      const allVariables = await this.getAllWithDynamic(userId);
      let result = str;

      // Find all variable patterns in the string
      const matches = str.match(/\{([^}]+)\}/g) || [];

      // Process each match
      for (const match of matches) {
        const key = match.substring(1, match.length - 1); // Remove { and }

        // Handle user.X variables specially
        if (key.startsWith("user.")) {
          const userProp = key.split(".")[1];
          const variable = allVariables.find((v) => v.key === key);

          if (variable && typeof variable.value === "function") {
            if (variable.value.constructor.name === "AsyncFunction") {
              try {
                const value = await variable.value(userId);
                result = result.replace(match, value);
              } catch (error) {
                console.error(`Error processing user variable ${key}:`, error);
                result = result.replace(match, `[User ${userProp}]`);
              }
            } else {
              const value = variable.value();
              result = result.replace(match, value);
            }
          } else {
            result = result.replace(match, `[User ${userProp}]`);
          }
          continue;
        }

        // Handle regular variables (static types)
        const variable = allVariables.find((v) => v.key === key);
        if (!variable) continue;

        // For dynamic and system variables, call the function to get the current value
        if (
          ["dynamic", "system"].includes(variable.type) &&
          typeof variable.value === "function"
        ) {
          try {
            if (variable.value.constructor.name === "AsyncFunction") {
              const value = await variable.value(userId);
              result = result.replace(match, value);
            } else {
              const value = variable.value();
              result = result.replace(match, value);
            }
          } catch (error) {
            console.error(`Error processing dynamic variable ${key}:`, error);
            result = result.replace(match, match);
          }
        } else {
          result = result.replace(match, variable.value || match);
        }
      }
      return result;
    } catch (error) {
      console.error("Error in expandSystemPromptVariables:", error);
      return str;
    }
  },

  _checkVariableKey: async function (key = null, checkExisting = true) {
    if (!key) throw new Error("Key is required");
    if (typeof key !== "string") throw new Error("Key must be a string");
    if (!/^[a-zA-Z0-9_]+$/.test(key))
      throw new Error("Key must contain only letters, numbers and underscores");
    if (key.length > 255)
      throw new Error("Key must be less than 255 characters");
    if (key.length < 3) throw new Error("Key must be at least 3 characters");
    if (key.startsWith("user."))
      throw new Error("Key cannot start with 'user.'");
    if (key.startsWith("system."))
      throw new Error("Key cannot start with 'system.'");
    if (checkExisting && (await this.get(key)) !== null)
      throw new Error("System prompt variable with this key already exists");

    return true;
  },
};

module.exports = { SystemPromptVariables };
