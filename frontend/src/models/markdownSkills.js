import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const MarkdownSkills = {
  /**
   * List all markdown skills.
   * @returns {Promise<object[]>} array of skill records
   */
  /**
   * List all markdown skills.
   * @returns {Promise<{skills: object[], brokenSkills: {dir: string, error: string}[]}>}
   */
  list: async () => {
    return await fetch(`${API_BASE}/admin/markdown-skills`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => ({
        skills: res?.skills || [],
        brokenSkills: res?.brokenSkills || [],
        detection: res?.detection || null,
      }))
      .catch((e) => {
        console.error(e);
        return { skills: [], brokenSkills: [], detection: null };
      });
  },

  /**
   * Fetch a single markdown skill by name.
   * @param {string} name
   * @returns {Promise<{skill: object|null, error: string|null}>}
   */
  get: async (name) => {
    return await fetch(
      `${API_BASE}/admin/markdown-skills/${encodeURIComponent(name)}`,
      {
        method: "GET",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { skill: null, error: e.message };
      });
  },

  /**
   * Create or overwrite a markdown skill.
   * @param {object} skill - { name, description, license?, compatibility?, metadata?, body }
   * @returns {Promise<{skill: object|null, error: string|null}>}
   */
  save: async (skill) => {
    return await fetch(`${API_BASE}/admin/markdown-skills`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(skill),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { skill: null, error: e.message };
      });
  },

  /**
   * Rename a skill's directory (used to resolve a name/folder mismatch).
   * The frontmatter `name` is rewritten to match the new folder name.
   * @param {string} name current folder name
   * @param {string} newName desired folder name
   * @returns {Promise<{skill: object|null, error: string|null}>}
   */
  rename: async (name, newName) => {
    return await fetch(
      `${API_BASE}/admin/markdown-skills/${encodeURIComponent(name)}/rename`,
      {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ newName }),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { skill: null, error: e.message };
      });
  },

  /**
   * Delete a markdown skill by name.
   * @param {string} name
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  delete: async (name) => {
    return await fetch(
      `${API_BASE}/admin/markdown-skills/${encodeURIComponent(name)}`,
      {
        method: "DELETE",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
};

export default MarkdownSkills;
