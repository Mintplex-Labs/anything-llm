const { Workspace } = require("../../models/workspace");
const { WorkspaceThread } = require("../../models/workspaceThread");
const { WorkspaceChats } = require("../../models/workspaceChats");
const fastLevenshtein = require("fast-levenshtein");

// allow a pretty loose levenshtein distance for the search
// since we would rather show a few more results than less
const FAST_LEVENSHTEIN_DISTANCE = 3;

// Maximum number of characters to show in the content excerpt
const EXCERPT_LENGTH = 120;
// How much of EXCERPT_LENGTH to show before the match vs. after it.
const EXCERPT_LEADING_CHARS = Math.round(EXCERPT_LENGTH / 3);

/**
 * Extract a short excerpt around the matched search term from a text string.
 * @param {string} text - The full text to extract the excerpt from.
 * @param {string} searchTerm - The term to find in the text.
 * @returns {string} - A short excerpt with the search term in context.
 */
function extractExcerpt(text, searchTerm) {
  if (!text) return null;
  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(searchTerm);
  if (index === -1) return null;

  const start = Math.max(0, index - EXCERPT_LEADING_CHARS);
  const end = Math.min(
    text.length,
    index + searchTerm.length + (EXCERPT_LENGTH - EXCERPT_LEADING_CHARS)
  );
  const excerpt = text.slice(start, end);

  return (start > 0 ? "..." : "") + excerpt + (end < text.length ? "..." : "");
}

/**
 * Search for workspaces and threads based on a search term with optional user context.
 * For each type of item we are looking at the `name` field.
 * - If the normalized name, starts with, includes, or ends with the search term => match
 * - If the normalized name is within 2 levenshtein distance of the search term => match
 * Additionally, threads are also matched by conversation content (prompt + response).
 * @param {string} searchTerm - The search term to search for.
 * @param {Object} user - The user to search for.
 * @returns {Promise<{workspaces: Array<{slug: string, name: string}>, threads: Array<{slug: string, name: string, workspace: {slug: string, name: string}, excerpt?: string}>}>} - The search results.
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

    // Step 1 — match by thread name (existing behaviour)
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
            excerpt: null, // title match — no excerpt needed
          })
        );
    }

    // Step 2 — match by conversation content (new behaviour)
    // Query workspace_chats for prompts or responses containing the search term.
    // Uses Prisma's native `contains` filter — no schema migration needed.
    const matchingChats = await WorkspaceChats.where({
      include: true,
      thread_id: { not: null },
      ...(user ? { user_id: user.id } : {}),
      OR: [
        { prompt: { contains: searchTerm } },
        { response: { contains: searchTerm } },
      ],
    });

    // Build a map of thread slugs already matched by title to avoid duplicates
    const alreadyMatched = new Set(
      Array.from(results.threads).map((t) => JSON.parse(t).slug)
    );

    // Map thread_id → thread for fast lookup
    const threadMap = new Map(threads.map((t) => [t.id, t]));

    for (const chat of matchingChats) {
      const thread = threadMap.get(chat.thread_id);
      if (!thread) continue; // thread may have been deleted
      if (alreadyMatched.has(thread.slug)) continue; // already matched by title

      // Extract a short excerpt from the matched field
      const excerpt =
        extractExcerpt(chat.prompt, searchTerm) ||
        extractExcerpt(chat.response, searchTerm);

      results.threads.add(
        JSON.stringify({
          slug: thread.slug,
          name: thread.name,
          workspace: {
            slug: thread.workspace.slug,
            name: thread.workspace.name,
          },
          excerpt: excerpt, // content match — show excerpt in UI
        })
      );

      // Mark as matched so subsequent chats in same thread don't add duplicates
      alreadyMatched.add(thread.slug);
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
