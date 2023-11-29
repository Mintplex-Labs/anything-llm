const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

function checkPasswordComplexity(password) {
  // Set defaults for password complexity or use user defined settings.
  const complexityOptions = {
    min: process.env.PASSWORDMINCHAR || 8,
    max: process.env.PASSWORDMAXCHAR || 250,
    lowerCase: process.env.PASSWORDLOWERCASE || 1,
    upperCase: process.env.PASSWORDUPPERCASE || 0,
    numeric: process.env.PASSWORDNUMERIC || 0,
    symbol: process.env.PASSWORDSYMBOL || 0,
    requirementCount: process.env.PASSWORDREQUIREMENTS || 1,
  };

  let complexityCheck = passwordComplexity(complexityOptions, 'password').validate(password);

  // Check if password passed complexity check, if it did not
  // gather all of the missed checks into one error string.
  if (complexityCheck.hasOwnProperty('error')) {
    let myError = "";
    let prepend = "";
    for (let i = 0; i < complexityCheck.error.details.length; i++) {
      myError += prepend + complexityCheck.error.details[i].message;
      prepend = ", ";
    }
    return { 'checkedOK': false, 'error': myError };
  }
  return { 'checkedOK': true, 'error': 'No error.' };
}

const User = {
  create: async function ({ username, password, role = "default" }) {
    // Ensure password meets complexity requirements.
    passwordCheck = checkPasswordComplexity(password);
    if (!passwordCheck.checkedOK) {
      return { success: false, error: passwordCheck.error };
    }

    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await prisma.users.create({
        data: {
          username,
          password: hashedPassword,
          role,
        },
      });
      return { user, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE USER.", error.message);
      return { user: null, error: error.message };
    }
  },

  update: async function (userId, updates = {}) {
    // Ensure password meets complexity requirements.
    passwordCheck = checkPasswordComplexity(updates["password"]);
    if (!passwordCheck.checkedOK) {
      return { success: false, error: passwordCheck.error };
    }

    try {
      // Rehash new password if it exists as update
      // will be given to us as plaintext.
      if (updates.hasOwnProperty("password") && updates.password.length >= 8) {
        updates.password = bcrypt.hashSync(updates.password, 10);
      } else {
        delete updates.password;
      }

      await prisma.users.update({
        where: { id: parseInt(userId) },
        data: updates,
      });
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },

  get: async function (clause = {}) {
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
      return users;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },
};

module.exports = { User };
