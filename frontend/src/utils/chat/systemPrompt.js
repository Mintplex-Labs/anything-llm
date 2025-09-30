import i18next from "i18next";
import Admin from "@/models/admin.js";

const syncDefaultSystemPromptWithServer = async function () {
  const default_system_prompt = i18next.t(
    "customization.items.system-prompt.default"
  );

  const { success, error } = await Admin.updateSystemPreferences({
    default_system_prompt,
  });
  if (!success) {
    console.error(
      "error updating default_system_prompt on language change, err:" + error
    );
  } else {
    console.info(
      "successfully updated default_system_prompt on language change"
    );
  }
};

export { syncDefaultSystemPromptWithServer };
