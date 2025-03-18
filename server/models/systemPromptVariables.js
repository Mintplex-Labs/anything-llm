const prisma = require("../utils/prisma");
const moment = require("moment");
const { SystemSettings } = require("./systemSettings");

const SystemPromptVariables = {
  DEFAULT_VARIABLES: [
    {
      key: "time",
      value: () => {
        const currentTime = moment().format("HH:mm:ss");
        return `${currentTime} [Current time in 24-hour HH:mm:ss format]`;
      },
      description: "Current time in HH:MM:SS format",
      type: "dynamic",
      multiUserRequired: false,
    },
    {
      key: "date",
      value: () => {
        const currentDate = moment().format("YYYY-MM-DD");
        return `${currentDate} [Current date in YYYY-MM-DD format]`;
      },
      description: "Current date in YYYY-MM-DD format",
      type: "dynamic",
      multiUserRequired: false,
    },
    {
      key: "datetime",
      value: () => {
        const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
        return `${currentDateTime} [Full timestamp in YYYY-MM-DD HH:mm:ss format]`;
      },
      description: "Current date and time in YYYY-MM-DD HH:mm:ss format",
      type: "dynamic",
      multiUserRequired: false,
    },
    {
      key: "user.name",
      value: async (userId) => {
        if (!userId) return "[User name]";
        try {
          const user = await prisma.users.findUnique({
            where: { id: userId },
            select: { username: true },
          });
          return user?.username || "[User name]";
        } catch (error) {
          console.error("Error fetching user name:", error);
          return "[User name]";
        }
      },
      description: "Current user's username",
      type: "dynamic",
      multiUserRequired: true,
    },
    {
      key: "user.bio",
      value: async (userId) => {
        if (!userId) return "[User bio]";
        try {
          const user = await prisma.users.findUnique({
            where: { id: userId },
            select: { bio: true },
          });
          return user?.bio || "[User bio]";
        } catch (error) {
          console.error("Error fetching user bio:", error);
          return "[User bio]";
        }
      },
      description: "Current user's bio information",
      type: "dynamic",
      multiUserRequired: true,
    },
  ],

  getAll: async function () {
    const dbVariables = await prisma.system_prompt_variables.findMany();
    return dbVariables;
  },

  getAllWithDynamic: async function (userId = null) {
    const multiUserMode = await SystemSettings.isMultiUserMode();
    const whereClause = {
      OR: [{ type: "system" }, { userId: null }],
    };

    if (userId) {
      whereClause.OR.push({ userId });
    }

    const dbVariables = await prisma.system_prompt_variables.findMany({
      where: whereClause,
    });

    // Convert DB variables to a format matching DEFAULT_VARIABLES
    const formattedDbVars = dbVariables.map((v) => ({
      id: v.id,
      key: v.key,
      value: v.value,
      description: v.description,
      type: v.type,
      userId: v.userId,
    }));

    // Filter DEFAULT_VARIABLES based on multiUserMode
    const filteredSystemVars = this.DEFAULT_VARIABLES.filter(
      (v) => !v.multiUserRequired || multiUserMode
    );

    // Combine with dynamic system variables
    return [...formattedDbVars, ...filteredSystemVars];
  },

  create: async function ({
    key,
    value,
    description,
    type = "user",
    userId = null,
  }) {
    return await prisma.system_prompt_variables.create({
      data: {
        key,
        value,
        description,
        type,
        userId,
      },
    });
  },

  update: async function (id, { key, value, description }) {
    return await prisma.system_prompt_variables.update({
      where: { id },
      data: {
        key,
        value,
        description,
      },
    });
  },

  delete: async function (id) {
    try {
      await prisma.system_prompt_variables.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Error deleting variable:", error);
      return false;
    }
  },

  // Process a string and replace all variables with their values
  processString: async function (str, userId = null) {
    if (!str) return str;

    try {
      const allVariables = await this.getAllWithDynamic(userId);

      // Replace all variables in the format {variable.key}
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
            try {
              // For async functions, we need to await the result
              const value = await variable.value(userId);
              result = result.replace(match, value);
            } catch (error) {
              console.error(`Error processing user variable ${key}:`, error);
              result = result.replace(match, `[User ${userProp}]`);
            }
          } else {
            // Fallback if variable not found
            result = result.replace(match, `[User ${userProp}]`);
          }
          continue;
        }

        // Handle regular variables
        const variable = allVariables.find((v) => v.key === key);
        if (!variable) {
          continue;
        }

        // For dynamic variables, call the function to get the current value
        if (
          variable.type === "dynamic" &&
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
      console.error("Error in processString:", error);
      return str; // Return original string on error
    }
  },
};

module.exports = { SystemPromptVariables };
