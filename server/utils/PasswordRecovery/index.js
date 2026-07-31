const bcrypt = require("bcryptjs");
const { v4, validate } = require("uuid");
const { User } = require("../../models/user");
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
  if (!!error) throw new Error(error);

  const { user: success } = await User._update(userId, {
    seen_recovery_codes: true,
  });
  if (!success) throw new Error("Failed to generate user recovery codes!");

  return plainTextCodes;
}

async function recoverAccount(username = "", recoveryCodes = []) {
  const user = await User.get({ username: String(username) });
  if (!user) return { success: false, error: "Invalid recovery codes." };

  // If hashes do not exist for a user
  // because this is a user who has not logged out and back in since upgrade.
  const allUserHashes = await RecoveryCode.hashesForUser(user.id);
  if (allUserHashes.length < 4)
    return { success: false, error: "Invalid recovery codes." };

  const uniqueRecoveryCodes = [
    ...new Set(
      recoveryCodes
        .map((code) => (typeof code === "string" ? code.trim() : ""))
        .filter((code) => validate(code))
    ),
  ].slice(0, 2);
  if (uniqueRecoveryCodes.length !== 2)
    return { success: false, error: "Invalid recovery codes." };

  const unmatchedHashes = [...allUserHashes];
  const validCodes = uniqueRecoveryCodes.every((code) => {
    const index = unmatchedHashes.findIndex((hash) =>
      bcrypt.compareSync(code, hash)
    );
    if (index === -1) return false;
    unmatchedHashes.splice(index, 1);
    return true;
  });
  if (!validCodes) return { success: false, error: "Invalid recovery codes." };

  const { passwordResetToken, error } = await PasswordResetToken.create(
    user.id
  );
  if (!!error) return { success: false, error };
  return { success: true, resetToken: passwordResetToken.token };
}

async function resetPassword(token, _newPassword = "", confirmPassword = "") {
  const newPassword = String(_newPassword).trim(); // No spaces in passwords
  if (!newPassword) throw new Error("Invalid password.");
  if (newPassword !== String(confirmPassword))
    throw new Error("Passwords do not match");

  const resetToken = await PasswordResetToken.findUnique({
    token: String(token),
  });
  if (!resetToken || resetToken.expiresAt < new Date()) {
    return { success: false, message: "Invalid reset token" };
  }

  // JOI password rules will be enforced inside .update.
  const { error } = await User.update(resetToken.user_id, {
    password: newPassword,
  });

  // seen_recovery_codes is not publicly writable
  // so we have to do direct update here
  await User._update(resetToken.user_id, {
    seen_recovery_codes: false,
  });

  if (error) return { success: false, message: error };
  await PasswordResetToken.deleteMany({ user_id: resetToken.user_id });
  await RecoveryCode.deleteMany({ user_id: resetToken.user_id });

  // New codes are provided on first new login.
  return { success: true, message: "Password reset successful" };
}

module.exports = {
  recoverAccount,
  resetPassword,
  generateRecoveryCodes,
};
