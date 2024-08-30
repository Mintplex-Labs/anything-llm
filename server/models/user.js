const prisma = require("../utils/prisma");
const { EventLogs } = require("./eventLogs");

const User = {
  usernameRegex: new RegExp(/^[a-z0-9_-]+$/),
  writable: [
    // Used for generic updates so we can validate keys in request body
    "username",
    "password",
    "pfpFilename",
    "role",
    "suspended",
  ],
  validations: {
    username: (newValue = "") => {
      try {
        if (String(newValue).length > 100)
          throw new Error("Username cannot be longer than 100 characters");
        if (String(newValue).length < 2)
          throw new Error("Username must be at least 2 characters");
        return String(newValue);
      } catch (e) {
        throw new Error(e.message);
      }
    },
    role: (role = "default") => {
      const VALID_ROLES = ["default", "admin", "manager"];
      if (!VALID_ROLES.includes(role)) {
        throw new Error(
          `Invalid role. Allowed roles are: ${VALID_ROLES.join(", ")}`
        );
      }
      return String(role);
    },
  },
  // validations for the above writable fields.
  castColumnValue: function (key, value) {
    switch (key) {
      case "suspended":
        return Number(Boolean(value));
      default:
        return String(value);
    }
  },

  filterFields: function (user = {}) {
    const { password, ...rest } = user;
    return { ...rest };
  },

  create: async function ({ username, password, role = "default" }) {
    const passwordCheck = this.checkPasswordComplexity(password);
    if (!passwordCheck.checkedOK) {
      return { user: null, error: passwordCheck.error };
    }

    try {
      // Do not allow new users to bypass validation
      if (!this.usernameRegex.test(username))
        throw new Error(
          "Username must be only contain lowercase letters, numbers, underscores, and hyphens with no spaces"
        );

      const bcrypt = require("bcrypt");
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await prisma.users.create({
        data: {
          username: this.validations.username(username),
          password: hashedPassword,
          role: this.validations.role(role),
        },
      });
      return { user: this.filterFields(user), error: null };
    } catch (error) {
      console.error("FAILED TO CREATE USER.", error.message);
      return { user: null, error: error.message };
    }
  },
  // Log the changes to a user object, but omit sensitive fields
  // that are not meant to be logged.
  loggedChanges: function (updates, prev = {}) {
    const changes = {};
    const sensitiveFields = ["password"];

    Object.keys(updates).forEach((key) => {
      if (!sensitiveFields.includes(key) && updates[key] !== prev[key]) {
        changes[key] = `${prev[key]} => ${updates[key]}`;
      }
    });

    return changes;
  },

  update: async function (userId, updates = {}) {
    try {
      if (!userId) throw new Error("No user id provided for update");
      const currentUser = await prisma.users.findUnique({
        where: { id: parseInt(userId) },
      });
      if (!currentUser) return { success: false, error: "User not found" };
      // Removes non-writable fields for generic updates
      // and force-casts to the proper type;
      Object.entries(updates).forEach(([key, value]) => {
        if (this.writable.includes(key)) {
          if (this.validations.hasOwnProperty(key)) {
            updates[key] = this.validations[key](
              this.castColumnValue(key, value)
            );
          } else {
            updates[key] = this.castColumnValue(key, value);
          }
          return;
        }
        delete updates[key];
      });

      if (Object.keys(updates).length === 0)
        return { success: false, error: "No valid updates applied." };

      // Handle password specific updates
      if (updates.hasOwnProperty("password")) {
        const passwordCheck = this.checkPasswordComplexity(updates.password);
        if (!passwordCheck.checkedOK) {
          return { success: false, error: passwordCheck.error };
        }
        const bcrypt = require("bcrypt");
        updates.password = bcrypt.hashSync(updates.password, 10);
      }

      if (
        updates.hasOwnProperty("username") &&
        currentUser.username !== updates.username &&
        !this.usernameRegex.test(updates.username)
      )
        return {
          success: false,
          error:
            "Username must be only contain lowercase letters, numbers, underscores, and hyphens with no spaces",
        };

      const user = await prisma.users.update({
        where: { id: parseInt(userId) },
        data: updates,
      });

      await EventLogs.logEvent(
        "user_updated",
        {
          username: user.username,
          changes: this.loggedChanges(updates, currentUser),
        },
        userId
      );
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },

  // Explicit direct update of user object.
  // Only use this method when directly setting a key value
  // that takes no user input for the keys being modified.
  _update: async function (id = null, data = {}) {
    if (!id) throw new Error("No user id provided for update");

    try {
      const user = await prisma.users.update({
        where: { id },
        data,
      });
      return { user, message: null };
    } catch (error) {
      console.error(error.message);
      return { user: null, message: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const user = await prisma.users.findFirst({ where: clause });
      return user ? this.filterFields({ ...user }) : null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },
  // Returns user object with all fields
  _get: async function (clause = {}) {
    try {
      const user = await prisma.users.findFirst({ where: clause });
      return user ? { ...user } : null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  count: async function (clause = {}) {
    try {
      const count = await prisma.users.count({ where: clause });
      return count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.users.deleteMany({ where: clause });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  where: async function (clause = {}, limit = null) {
    try {
      const users = await prisma.users.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
      });
      return users.map((usr) => this.filterFields(usr));
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  checkPasswordComplexity: function (passwordInput = "") {
    const passwordComplexity = require("joi-password-complexity");
    // Can be set via ENV variable on boot. No frontend config at this time.
    // Docs: https://www.npmjs.com/package/joi-password-complexity
    const complexityOptions = {
      min: process.env.PASSWORDMINCHAR || 8,
      max: process.env.PASSWORDMAXCHAR || 250,
      lowerCase: process.env.PASSWORDLOWERCASE || 0,
      upperCase: process.env.PASSWORDUPPERCASE || 0,
      numeric: process.env.PASSWORDNUMERIC || 0,
      symbol: process.env.PASSWORDSYMBOL || 0,
      // reqCount should be equal to how many conditions you are testing for (1-4)
      requirementCount: process.env.PASSWORDREQUIREMENTS || 0,
    };

    const complexityCheck = passwordComplexity(
      complexityOptions,
      "password"
    ).validate(passwordInput);
    if (complexityCheck.hasOwnProperty("error")) {
      let myError = "";
      let prepend = "";
      for (let i = 0; i < complexityCheck.error.details.length; i++) {
        myError += prepend + complexityCheck.error.details[i].message;
        prepend = ", ";
      }
      return { checkedOK: false, error: myError };
    }

    return { checkedOK: true, error: "No error." };
  },
};

module.exports = { User };
