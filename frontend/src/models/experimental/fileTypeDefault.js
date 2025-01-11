import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const FileTypeDefault = {
  featureFlag: "experimental_file_type_default",
  toggleFeature: async function (updatedStatus = false) {
    return await fetch(`${API_BASE}/experimental/toggle-file-type-default`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ updatedStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not update status.");
        return true;
      })
      .then((res) => res)
      .catch((e) => {
        console.error(e);
        return false;
      });
  },
};

export default FileTypeDefault;
