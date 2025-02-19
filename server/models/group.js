const prisma = require("../utils/prisma");
const { EventLogs } = require("./eventLogs");

/**
 * @typedef {Object} Group
 * @property {number} id
 * @property {string} groupname
 */

const Group = {
  groupnameRegex: new RegExp(/^[a-z0-9_-]+$/),
  writable: [
    // Used for generic updates so we can validate keys in request body
    "groupname",
    "uid",
  ],
  validations: {
    groupname: (newValue = "") => {
      try {
        if (String(newValue).length > 100)
          throw new Error("groupname cannot be longer than 100 characters");
        if (String(newValue).length < 2)
          throw new Error("groupname must be at least 2 characters");
        return String(newValue);
      } catch (e) {
        throw new Error(e.message);
      }
    },
    // role: (role = "default") => {
    //   const VALID_ROLES = ["default", "admin", "manager"];
    //   if (!VALID_ROLES.includes(role)) {
    //     throw new Error(
    //       `Invalid role. Allowed roles are: ${VALID_ROLES.join(", ")}`
    //     );
    //   }
    //   return String(role);
    // },
    // dailyMessageLimit: (dailyMessageLimit = null) => {
    //   if (dailyMessageLimit === null) return null;
    //   const limit = Number(dailyMessageLimit);
    //   if (isNaN(limit) || limit < 1) {
    //     throw new Error(
    //       "Daily message limit must be null or a number greater than or equal to 1"
    //     );
    //   }
    //   return limit;
    // },
  },
  // validations for the above writable fields.
  castColumnValue: function (key, value) {
    switch (key) {
      case "suspended":
        return Number(Boolean(value));
      case "dailyMessageLimit":
        return value === null ? null : Number(value);
      default:
        return String(value);
    }
  },

  filterFields: function (group = {}) {
    const { password, ...rest } = group;
    return { ...rest };
  },

  create: async function ({
    groupname,
    uid = null,
    currUser,
  }) {
    try {
      const group = await prisma.groups.create({
        data: {
          groupname: this.validations.groupname(groupname),
          uid: uid,
          createdBy: currUser,  // Required foreign key reference
        },
      });
      
      return { group: this.filterFields(group), error: null };
    } catch (error) {
      console.error("FAILED TO CREATE GROUP.", error.message);
      return { group: null, error: error.message };
    }
  },
  // Log the changes to a group object, but omit sensitive fields
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

  update: async function (groupId, updates = {}) {
    try {
      if (!groupId) throw new Error("No group id provided for update");
      const currentGroup = await prisma.groups.findUnique({
        where: { id: parseInt(groupId) },
      });
      if (!currentGroup) return { success: false, error: "Group not found" };
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

      // // Handle password specific updates
      // if (updates.hasOwnProperty("password")) {
      //   const passwordCheck = this.checkPasswordComplexity(updates.password);
      //   if (!passwordCheck.checkedOK) {
      //     return { success: false, error: passwordCheck.error };
      //   }
      //   const bcrypt = require("bcrypt");
      //   updates.password = bcrypt.hashSync(updates.password, 10);
      // }

      // if (
      //   updates.hasOwnProperty("groupname") &&
      //   currentGroup.groupname !== updates.groupname 
      //   // &&
      //   // !this.groupnameRegex.test(updates.groupname)
      // )
      //   return {
      //     success: false,
      //     error:
      //       "groupname must only contain lowercase letters, numbers, underscores, and hyphens with no spaces",
      //   };

      const group = await prisma.groups.update({
        where: { id: parseInt(groupId) },
        data: updates,
      });

      await EventLogs.logEvent(
        "group_updated",
        {
          groupname: group.groupname,
          changes: this.loggedChanges(updates, currentGroup),
        },
        groupId
      );
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },

  // Explicit direct update of group object.
  // Only use this method when directly setting a key value
  // that takes no group input for the keys being modified.
  _update: async function (id = null, data = {}) {
    if (!id) throw new Error("No group id provided for update");

    try {
      const group = await prisma.groups.update({
        where: { id },
        data,
      });
      return { group, message: null };
    } catch (error) {
      console.error(error.message);
      return { group: null, message: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const group = await prisma.groups.findFirst({ where: clause });
      return group ? this.filterFields({ ...group }) : null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },
  // Returns group object with all fields
  _get: async function (clause = {}) {
    try {
      const group = await prisma.groups.findFirst({ where: clause });
      return group ? { ...group } : null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  count: async function (clause = {}) {
    try {
      const count = await prisma.groups.count({ where: clause });
      return count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.groups.deleteMany({ where: clause });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  where: async function (clause = {}, limit = null) {
    try {
      const groups = await prisma.groups.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
      });
      return groups.map((usr) => this.filterFields(usr));
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  // checkPasswordComplexity: function (passwordInput = "") {
  //   const passwordComplexity = require("joi-password-complexity");
  //   // Can be set via ENV variable on boot. No frontend config at this time.
  //   // Docs: https://www.npmjs.com/package/joi-password-complexity
  //   const complexityOptions = {
  //     min: process.env.PASSWORDMINCHAR || 8,
  //     max: process.env.PASSWORDMAXCHAR || 250,
  //     lowerCase: process.env.PASSWORDLOWERCASE || 0,
  //     upperCase: process.env.PASSWORDUPPERCASE || 0,
  //     numeric: process.env.PASSWORDNUMERIC || 0,
  //     symbol: process.env.PASSWORDSYMBOL || 0,
  //     // reqCount should be equal to how many conditions you are testing for (1-4)
  //     requirementCount: process.env.PASSWORDREQUIREMENTS || 0,
  //   };

  //   const complexityCheck = passwordComplexity(
  //     complexityOptions,
  //     "password"
  //   ).validate(passwordInput);
  //   if (complexityCheck.hasOwnProperty("error")) {
  //     let myError = "";
  //     let prepend = "";
  //     for (let i = 0; i < complexityCheck.error.details.length; i++) {
  //       myError += prepend + complexityCheck.error.details[i].message;
  //       prepend = ", ";
  //     }
  //     return { checkedOK: false, error: myError };
  //   }

  //   return { checkedOK: true, error: "No error." };
  // },

  // /**
  //  * Check if a group can send a chat based on their daily message limit.
  //  * This limit is system wide and not per workspace and only applies to
  //  * multi-group mode AND non-admin groups.
  //  * @param {Group} group The group object record.
  //  * @returns {Promise<boolean>} True if the group can send a chat, false otherwise.
  //  */
  // canSendChat: async function (group) {
  //   const { ROLES } = require("../utils/middleware/multiGroupProtected");
  //   if (!group || group.dailyMessageLimit === null || group.role === ROLES.admin)
  //     return true;

  //   const { WorkspaceChats } = require("./workspaceChats");
  //   const currentChatCount = await WorkspaceChats.count({
  //     group_id: group.id,
  //     createdAt: {
  //       gte: new Date(new Date() - 24 * 60 * 60 * 1000), // 24 hours
  //     },
  //   });

  //   return currentChatCount < group.dailyMessageLimit;
  // },
};

module.exports = { Group };
