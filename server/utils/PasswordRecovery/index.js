const bcrypt = require("bcrypt");
const { v4 } = require("uuid");

const { User } = require("../../models/user");
const { SystemSettings } = require("../../models/systemSettings");
const {
  RecoveryCode,
  PasswordResetToken,
} = require("../../models/passwordRecovery");

async function generateRecoveryCodes(userId) {
  const newRecoveryCodes = [];
  const plainTextCodes = [];
  for (let i = 0; i < 4; i++) {
    const code = v4();
    const hashedCode = bcrypt.hashSync(code, 10);
    newRecoveryCodes.push({
      user_id: userId,
      code_hash: hashedCode,
    });
    plainTextCodes.push(code);
  }

  const { error } = await RecoveryCode.createMany(newRecoveryCodes);
  if (error) {
    throw new Error(error);
  }

  const { success } = await User.update(userId, {
    seen_recovery_codes: true,
  });
  if (!success) {
    throw new Error("Failed to update user seen_recovery_codes flag");
  }

  return plainTextCodes;
}
async function recoverAccount(username, recoveryCodes) {
  if (!(await SystemSettings.isMultiUserMode())) {
    throw new Error("Invalid request");
  }

  const user = await User.get({ username: String(username) });
  if (!user) {
    throw new Error("User not found");
  }

  const allUserHashes = (await RecoveryCode.findMany({ user_id: user.id })).map(
    (hash) => hash.code_hash
  );

  if (allUserHashes.length < 4) {
    throw new Error("Invalid recovery codes");
  }

  const uniqueRecoveryCodes = [...new Set(recoveryCodes)];
  const validCodes = uniqueRecoveryCodes.every((code) => {
    let valid = false;
    allUserHashes.forEach((hash) => {
      if (bcrypt.compareSync(code, hash)) valid = true;
    });
    return valid;
  });

  if (!validCodes || uniqueRecoveryCodes.length < 2) {
    return { success: false, error: "Invalid recovery codes" };
  }

  const token = v4();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const { passwordResetToken, error } = await PasswordResetToken.create(
    user.id,
    token,
    expiresAt
  );
  if (error) {
    return { success: false, error };
  }

  return { success: true, resetToken: passwordResetToken.token };
}

async function resetPassword(token, newPassword, confirmPassword) {
  if (!(await SystemSettings.isMultiUserMode())) {
    return { success: false, message: "Invalid request" };
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const resetToken = await PasswordResetToken.findUnique({ token });
  if (!resetToken || resetToken.expiresAt < new Date()) {
    return { success: false, message: "Invalid reset token" };
  }

  const { error } = await User.update(resetToken.user_id, {
    password: newPassword,
    seen_recovery_codes: false,
  });
  if (error) {
    return { success: false, message: error };
  }

  await PasswordResetToken.deleteMany({ user_id: resetToken.user_id });
  await RecoveryCode.deleteMany({ user_id: resetToken.user_id });

  return { success: true, message: "Password reset successful" };
}

module.exports = {
  recoverAccount,
  resetPassword,
  generateRecoveryCodes,
};
