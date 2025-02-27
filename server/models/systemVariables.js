const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const moment = require("moment");
const os = require("os");

// Static system variables that are always available
const SYSTEM_VARIABLES = [
  {
    key: "time",
    value: () => moment().format("HH:mm:ss"),
    description: "Current time in HH:MM:SS format",
    type: "dynamic",
  },
  {
    key: "date",
    value: () => moment().format("YYYY-MM-DD"),
    description: "Current date in YYYY-MM-DD format",
    type: "dynamic",
  },
  {
    key: "datetime",
    value: () => moment().format("YYYY-MM-DD HH:mm:ss"),
    description: "Current date and time",
    type: "dynamic",
  },
  {
    key: "os",
    value: () => os.platform(),
    description: "Operating system of the server",
    type: "dynamic",
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
  },
];

// Get all system variables
async function getAll() {
  const dbVariables = await prisma.system_variables.findMany();
  return dbVariables;
}

// Get all variables including dynamic system ones
async function getAllWithDynamic(userId = null) {
  const whereClause = {
    OR: [
      { type: "system" },
      { userId: null },
    ],
  };

  if (userId) {
    whereClause.OR.push({ userId });
  }

  const dbVariables = await prisma.system_variables.findMany({
    where: whereClause,
  });

  // Convert DB variables to a format matching SYSTEM_VARIABLES
  const formattedDbVars = dbVariables.map((v) => ({
    id: v.id,
    key: v.key,
    value: v.value,
    description: v.description,
    type: v.type,
    userId: v.userId,
  }));

  // Combine with dynamic system variables
  return [...formattedDbVars, ...SYSTEM_VARIABLES];
}

// Create a new variable
async function create({ key, value, description, type = "user", userId = null }) {
  return await prisma.system_variables.create({
    data: {
      key,
      value,
      description,
      type,
      userId,
    },
  });
}

// Update a variable
async function update(id, { key, value, description }) {
  return await prisma.system_variables.update({
    where: { id },
    data: {
      key,
      value,
      description,
    },
  });
}

// Delete a variable
async function deleteVariable(id) {
  try {
    await prisma.system_variables.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error("Error deleting variable:", error);
    return false;
  }
}

// Process a string and replace all variables with their values
async function processString(str, userId = null) {
  if (!str) return str;

  try {
    const allVariables = await getAllWithDynamic(userId);

    // Replace all variables in the format {variable.key}
    let result = str;

    // Find all variable patterns in the string
    const matches = str.match(/\{([^}]+)\}/g) || [];
    console.log(`Found ${matches.length} variables to process in string`);

    // Process each match
    for (const match of matches) {
      const key = match.substring(1, match.length - 1); // Remove { and }
      console.log(`Processing variable: ${key}`);

      // Handle user.X variables specially
      if (key.startsWith("user.")) {
        const userProp = key.split(".")[1];
        const variable = allVariables.find(v => v.key === key);

        if (variable && typeof variable.value === "function") {
          try {
            // For async functions, we need to await the result
            const value = await variable.value(userId);
            result = result.replace(match, value);
            console.log(`Replaced user variable ${key} with value: ${value}`);
          } catch (error) {
            console.error(`Error processing user variable ${key}:`, error);
            result = result.replace(match, `[User ${userProp}]`);
          }
        } else {
          // Fallback if variable not found
          console.log(`User variable ${key} not found, using fallback`);
          result = result.replace(match, `[User ${userProp}]`);
        }
        continue;
      }

      // Handle regular variables
      const variable = allVariables.find(v => v.key === key);
      if (!variable) {
        console.log(`Variable ${key} not found, skipping`);
        continue;
      }

      // For dynamic variables, call the function to get the current value
      if (variable.type === "dynamic" && typeof variable.value === "function") {
        try {
          if (variable.value.constructor.name === "AsyncFunction") {
            const value = await variable.value(userId);
            result = result.replace(match, value);
            console.log(`Replaced dynamic async variable ${key} with value: ${value}`);
          } else {
            const value = variable.value();
            result = result.replace(match, value);
            console.log(`Replaced dynamic variable ${key} with value: ${value}`);
          }
        } catch (error) {
          console.error(`Error processing dynamic variable ${key}:`, error);
          result = result.replace(match, match);
        }
      } else {
        result = result.replace(match, variable.value || match);
        console.log(`Replaced static variable ${key} with value: ${variable.value || match}`);
      }
    }

    return result;
  } catch (error) {
    console.error("Error in processString:", error);
    return str; // Return original string on error
  }
}

module.exports = {
  SystemVariables: {
    getAll,
    getAllWithDynamic,
    create,
    update,
    delete: deleteVariable,
    processString,
    SYSTEM_VARIABLES,
  }
};