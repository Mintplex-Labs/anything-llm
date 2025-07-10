const { Workspace } = require("../../models/workspace");
const { WorkspaceThread } = require("../../models/workspaceThread");
const fastLevenshtein = require("fast-levenshtein");

// allow a pretty loose levenshtein distance for the search
// since we would rather show a few more results than less
const FAST_LEVENSHTEIN_DISTANCE = 3;

/**
 * Search for workspaces and threads based on a search term with optional user context.
 * For each type of item we are looking at the `name` field.
 * - If the normalized name, starts with, includes, or ends with the search term => match
 * - If the normalized name is within 2 levenshtein distance of the search term => match
 * @param {string} searchTerm - The search term to search for.
 * @param {Object} user - The user to search for.
 * @returns {Promise<{workspaces: Array<{slug: string, name: string}>, threads: Array<{slug: string, name: string, workspace: {slug: string, name: string}}>}>} - The search results.
 */
async function searchWorkspaceAndThreads(searchTerm, user = null) {
  searchTerm = String(searchTerm).trim(); // Ensure searchTerm is a string and trimmed.

  if (!searchTerm || searchTerm.length < 3)
    return { workspaces: [], threads: [] };
  searchTerm = searchTerm.toLowerCase();

  // To prevent duplicates in O(1) time, we use sets which will be
  // STRINGIFIED results of matching workspaces or threads. We then
  // parse them back into objects at the end.
  const results = {
    workspaces: new Set(),
    threads: new Set(),
  };

  async function searchWorkspaces() {
    const workspaces = !!user
      ? await Workspace.whereWithUser(user)
      : await Workspace.where();

    for (const workspace of workspaces) {
      const wsName = workspace.name.toLowerCase();
      if (
        wsName.startsWith(searchTerm) ||
        wsName.includes(searchTerm) ||
        wsName.endsWith(searchTerm) ||
        fastLevenshtein.get(wsName, searchTerm) <= FAST_LEVENSHTEIN_DISTANCE
      )
        results.workspaces.add(
          JSON.stringify({ slug: workspace.slug, name: workspace.name })
        );
    }
  }

  async function searchThreads() {
    const threads = !!user
      ? await WorkspaceThread.where(
          { user_id: user.id },
          undefined,
          undefined,
          { workspace: { select: { slug: true, name: true } } }
        )
      : await WorkspaceThread.where(undefined, undefined, undefined, {
          workspace: { select: { slug: true, name: true } },
        });

    for (const thread of threads) {
      const threadName = thread.name.toLowerCase();
      if (
        threadName.startsWith(searchTerm) ||
        threadName.includes(searchTerm) ||
        threadName.endsWith(searchTerm) ||
        fastLevenshtein.get(threadName, searchTerm) <= FAST_LEVENSHTEIN_DISTANCE
      )
        results.threads.add(
          JSON.stringify({
            slug: thread.slug,
            name: thread.name,
            workspace: {
              slug: thread.workspace.slug,
              name: thread.workspace.name,
            },
          })
        );
    }
  }

  // Run both searches in parallel - this modifies the results set in place.
  await Promise.all([searchWorkspaces(), searchThreads()]);

  // Parse the results back into objects.
  const workspaces = Array.from(results.workspaces).map(JSON.parse);
  const threads = Array.from(results.threads).map(JSON.parse);
  return { workspaces, threads };
}

module.exports = { searchWorkspaceAndThreads };
