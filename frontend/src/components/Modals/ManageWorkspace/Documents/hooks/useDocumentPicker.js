import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import System from "@/models/system";
import Workspace from "@/models/workspace";

/** How many files we pull per page when a folder is expanded. */
export const PAGE_SIZE = 100;
/**
 * Opts out of server-side paging when a bulk action needs every file in a
 * folder. A numeric limit would be silently clamped to the server's maximum
 * page size, which would quietly resolve only part of the user's selection.
 */
const NO_LIMIT = "all";

/** Contents record for a folder we have not fetched yet. */
const UNLOADED = Object.freeze({
  status: "idle",
  items: [],
  hasMore: false,
  totalCount: 0,
});

const EMPTY_SET = Object.freeze(new Set());

/**
 * Single source of truth for the "My Documents" file picker.
 *
 * The picker is lazily loaded - `listFolders()` only returns folder shells and
 * a file count, and a folder's documents are fetched the first time it is
 * hovered or expanded. Every piece of that (shells, per-folder pages, which
 * folders are open, what is selected) lives in this one reducer so that no
 * component has to keep a private copy that can drift out of sync.
 *
 * Selection uses an "all + exceptions" model so that selecting a folder also
 * covers the files inside it that have not been fetched yet:
 *   selected(file) = (folderSelected && !deselected(file)) || selected(file)
 */
const initialState = {
  /** @type {'initializing'|'ready'} only `initializing` may blank out the tree */
  status: "initializing",
  /** Message for a non-blocking mutation (delete/move); null when idle. */
  busyMessage: null,
  /** @type {Array<{name: string, fileCount: number}>} ordered folder shells */
  folders: [],
  /** @type {Record<string, typeof UNLOADED>} folder name -> fetched page */
  contents: {},
  /** @type {Set<string>} names of expanded folders */
  expanded: EMPTY_SET,
  /** @type {Set<string>} folder names selected wholesale */
  selectedFolders: EMPTY_SET,
  /** @type {Set<string>} individually selected file ids */
  selectedFiles: EMPTY_SET,
  /** @type {Set<string>} files opted out of an otherwise-selected folder */
  deselectedFiles: EMPTY_SET,
  /** @type {Array<{name, fileCount, items}>|null} null when not searching */
  searchResults: null,
  searching: false,
  /** Right-hand panel: documents already embedded into this workspace. */
  workspaceDocs: { name: "documents", type: "folder", items: [] },
  /** @type {Set<string>} `folder/file.json` paths already embedded here */
  workspaceDocpaths: EMPTY_SET,
};

function withToggled(set, value, on) {
  const next = new Set(set);
  on ? next.add(value) : next.delete(value);
  return next;
}

/**
 * Buckets `folder/file.json` paths into `folder -> Set(filename)`.
 * @param {Iterable<string>} docpaths
 * @returns {Map<string, Set<string>>}
 */
function groupDocpathsByFolder(docpaths) {
  const byFolder = new Map();
  for (const docpath of docpaths) {
    const slash = docpath.indexOf("/");
    const folder = slash === -1 ? "custom-documents" : docpath.slice(0, slash);
    const file = slash === -1 ? docpath : docpath.slice(slash + 1);
    if (!byFolder.has(folder)) byFolder.set(folder, new Set());
    byFolder.get(folder).add(file);
  }
  return byFolder;
}

function sameMembers(a, b) {
  if (a === b) return true;
  if (!a || !b) return (a?.size ?? 0) === (b?.size ?? 0);
  if (a.size !== b.size) return false;
  for (const value of a) if (!b.has(value)) return false;
  return true;
}

function reducer(state, action) {
  switch (action.type) {
    case "hydrate": {
      // Preserve pages we already hold so a background refresh does not blank
      // out open folders, but drop any page that can no longer be correct so
      // it refetches. Two things can invalidate one:
      //   - the folder's on-disk count moved (upload, delete)
      //   - which of its files are embedded changed (embed, un-embed). Pages
      //     have embedded files filtered out of them, so un-embedding has to
      //     invalidate too even though nothing on disk changed.
      const prevEmbedded = groupDocpathsByFolder(state.workspaceDocpaths);
      const nextEmbedded = groupDocpathsByFolder(action.workspaceDocpaths);
      const contents = {};
      for (const folder of action.folders) {
        const prev = state.contents[folder.name];
        if (
          prev?.status === "loaded" &&
          prev.totalCount === folder.fileCount &&
          sameMembers(
            prevEmbedded.get(folder.name),
            nextEmbedded.get(folder.name)
          )
        )
          contents[folder.name] = prev;
      }
      const names = new Set(action.folders.map((f) => f.name));
      return {
        ...state,
        status: "ready",
        folders: action.folders,
        contents,
        expanded: new Set([...state.expanded].filter((n) => names.has(n))),
        workspaceDocs: action.workspaceDocs,
        workspaceDocpaths: action.workspaceDocpaths,
      };
    }

    case "hydrate-failed":
      return { ...state, status: "ready" };

    case "busy":
      return { ...state, busyMessage: action.message ?? null };

    case "folder-loading":
      return {
        ...state,
        contents: {
          ...state.contents,
          [action.name]: {
            ...(state.contents[action.name] ?? UNLOADED),
            status: "loading",
          },
        },
      };

    case "folder-loaded": {
      const prev = state.contents[action.name] ?? UNLOADED;
      return {
        ...state,
        contents: {
          ...state.contents,
          [action.name]: {
            status: "loaded",
            items: action.append
              ? [...prev.items, ...action.items]
              : action.items,
            hasMore: action.hasMore,
            totalCount: action.totalCount,
          },
        },
      };
    }

    // Distinct from `idle` so the self-healing effect does not retry forever.
    case "folder-failed":
      return {
        ...state,
        contents: {
          ...state.contents,
          [action.name]: { ...UNLOADED, status: "error" },
        },
      };

    case "toggle-expanded": {
      const opening = !state.expanded.has(action.name);
      // Re-opening a folder whose fetch failed clears the error so the
      // self-healing effect gives it another try.
      const contents =
        opening && state.contents[action.name]?.status === "error"
          ? { ...state.contents, [action.name]: UNLOADED }
          : state.contents;
      return {
        ...state,
        contents,
        expanded: withToggled(state.expanded, action.name, opening),
      };
    }

    case "set-expanded":
      return {
        ...state,
        expanded: withToggled(state.expanded, action.name, action.value),
      };

    case "toggle-file": {
      const { id, folderName } = action;
      const inSelectedFolder = state.selectedFolders.has(folderName);
      const isOn =
        (inSelectedFolder && !state.deselectedFiles.has(id)) ||
        state.selectedFiles.has(id);
      return {
        ...state,
        selectedFiles: withToggled(state.selectedFiles, id, !isOn),
        // Turning a file off inside a wholesale-selected folder records an
        // exception; turning it back on clears that exception.
        deselectedFiles: withToggled(
          state.deselectedFiles,
          id,
          isOn && inSelectedFolder
        ),
      };
    }

    case "toggle-folder": {
      const { name } = action;
      // `items` is what the user can actually see, which in search mode is the
      // match list rather than the folder's fetched page.
      const items = action.items ?? (state.contents[name] ?? UNLOADED).items;
      // Toggle against what the checkbox is actually showing, not just
      // `selectedFolders` - a folder every one of whose files is individually
      // selected (how a fresh upload arrives) renders as checked, and clicking
      // a checked box has to uncheck it. Anything short of fully checked
      // selects the whole folder, so a partial box fills in on one click.
      const fullySelected = state.selectedFolders.has(name)
        ? !items.some((file) => state.deselectedFiles.has(file.id))
        : items.length > 0 &&
          items.every((file) => state.selectedFiles.has(file.id));
      const turningOn = !fullySelected;
      const selectedFiles = new Set(state.selectedFiles);
      const deselectedFiles = new Set(state.deselectedFiles);
      // Individual entries are redundant once the folder itself carries the
      // selection, so drop them either way to keep the sets canonical.
      for (const file of items) {
        selectedFiles.delete(file.id);
        deselectedFiles.delete(file.id);
      }
      return {
        ...state,
        selectedFolders: withToggled(state.selectedFolders, name, turningOn),
        selectedFiles,
        deselectedFiles,
      };
    }

    case "select-all":
      return {
        ...state,
        selectedFolders: new Set(state.folders.map((f) => f.name)),
        selectedFiles: EMPTY_SET,
        deselectedFiles: EMPTY_SET,
      };

    case "clear-selection":
      return {
        ...state,
        selectedFolders: EMPTY_SET,
        selectedFiles: EMPTY_SET,
        deselectedFiles: EMPTY_SET,
      };

    case "select-files": {
      if (!action.ids.length) return state;
      const selectedFiles = new Set(state.selectedFiles);
      const deselectedFiles = new Set(state.deselectedFiles);
      for (const id of action.ids) {
        selectedFiles.add(id);
        deselectedFiles.delete(id);
      }
      return { ...state, selectedFiles, deselectedFiles };
    }

    // Optimistically drop files from the picker (moved into the workspace or
    // deleted) without a round trip, so the UI never stalls behind a refetch.
    case "remove-files": {
      const removed = new Set(action.ids);
      const contents = {};
      const removedPerFolder = {};
      for (const [name, entry] of Object.entries(state.contents)) {
        const items = entry.items.filter((f) => !removed.has(f.id));
        removedPerFolder[name] = entry.items.length - items.length;
        contents[name] =
          items.length === entry.items.length
            ? entry
            : {
                ...entry,
                items,
                totalCount: Math.max(
                  0,
                  entry.totalCount - removedPerFolder[name]
                ),
              };
      }
      const selectedFiles = new Set(state.selectedFiles);
      const deselectedFiles = new Set(state.deselectedFiles);
      for (const id of removed) {
        selectedFiles.delete(id);
        deselectedFiles.delete(id);
      }
      return {
        ...state,
        contents,
        selectedFiles,
        deselectedFiles,
        folders: state.folders.map((folder) =>
          removedPerFolder[folder.name]
            ? {
                ...folder,
                fileCount: Math.max(
                  0,
                  folder.fileCount - removedPerFolder[folder.name]
                ),
              }
            : folder
        ),
      };
    }

    case "add-folder": {
      if (state.folders.some((f) => f.name === action.name)) return state;
      return {
        ...state,
        folders: [
          ...state.folders,
          { name: action.name, type: "folder", fileCount: 0 },
        ],
      };
    }

    case "search-start":
      return { ...state, searching: true };

    case "search-results":
      return { ...state, searching: false, searchResults: action.results };

    case "search-clear":
      return { ...state, searching: false, searchResults: null };

    default:
      return state;
  }
}

export default function useDocumentPicker({ slug }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Read-only mirror so callbacks can stay referentially stable (and therefore
  // keep memoized rows from re-rendering) without closing over stale state.
  // Declared before every other effect so later effects read the fresh value.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /**
   * Reload folder shells + the workspace's embedded documents. Never touches
   * `status` once ready, so the tree stays on screen while this is in flight.
   * Keyed on `slug` only so a new `workspace` object identity from a parent
   * re-render cannot retrigger a full reload.
   */
  const refresh = useCallback(async () => {
    const [listing, currentWorkspace] = await Promise.all([
      System.localFiles(),
      Workspace.bySlug(slug),
    ]);

    // A failed listing must not wipe the tree the user is looking at.
    if (!listing) {
      dispatch({ type: "hydrate-failed" });
      return { folders: stateRef.current.folders, docpaths: [] };
    }

    const docpaths = (currentWorkspace?.documents ?? []).map(
      (doc) => doc.docpath
    );
    const workspaceDocs = await buildWorkspaceDocs(docpaths);
    const folders = listing.items ?? [];

    dispatch({
      type: "hydrate",
      folders,
      workspaceDocs,
      workspaceDocpaths: new Set(docpaths),
    });
    return { folders, docpaths };
  }, [slug]);

  /** Fetch (or append) a page of files for a folder. Idempotent per status. */
  const loadFolder = useCallback(async ({ name, append = false } = {}) => {
    const entry = stateRef.current.contents[name] ?? UNLOADED;
    if (entry.status === "loading") return;
    if (entry.status === "loaded" && !append) return;

    dispatch({ type: "folder-loading", name });
    const offset = append ? entry.items.length : 0;
    const result = await System.localFiles(name, offset, PAGE_SIZE);
    if (!result) return dispatch({ type: "folder-failed", name });

    const embedded = stateRef.current.workspaceDocpaths;
    const items = (result.documents ?? []).filter(
      (file) => !embedded.has(`${name}/${file.name}`)
    );
    dispatch({
      type: "folder-loaded",
      name,
      items,
      append,
      hasMore: result.hasMore ?? false,
      totalCount: result.totalCount ?? items.length,
    });
  }, []);

  // Initial hydrate.
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Self-healing: anything expanded but unloaded (first expand, or a page we
  // invalidated during a refresh) gets fetched here rather than from the row.
  useEffect(() => {
    for (const name of state.expanded) {
      if ((state.contents[name] ?? UNLOADED).status === "idle")
        loadFolder({ name });
    }
  }, [state.expanded, state.contents, loadFolder]);

  /* -------------------------------- selection ------------------------------ */

  const isFileSelected = useCallback(
    (folderName, id) => {
      const { selectedFolders, deselectedFiles, selectedFiles } = state;
      if (selectedFolders.has(folderName) && !deselectedFiles.has(id))
        return true;
      return selectedFiles.has(id);
    },
    [state]
  );

  /**
   * @param {string} name folder name
   * @param {Array<object>} [visibleFiles] the files actually rendered for this
   * folder. Search mode renders match lists rather than the fetched page, so
   * the caller has to say which set the checkbox should reflect.
   * @returns {'none'|'some'|'all'} tri-state for a folder's own checkbox.
   */
  const folderSelectionState = useCallback(
    (name, visibleFiles) => {
      const { selectedFolders, deselectedFiles, selectedFiles, contents } =
        state;
      const items = visibleFiles ?? (contents[name] ?? UNLOADED).items;
      if (selectedFolders.has(name)) {
        const opted = items.some((f) => deselectedFiles.has(f.id));
        return opted ? "some" : "all";
      }
      if (items.length === 0) return "none";
      const hits = items.filter((f) => selectedFiles.has(f.id)).length;
      if (hits === 0) return "none";
      return hits === items.length ? "all" : "some";
    },
    [state]
  );

  const selectedCount = useMemo(() => {
    const {
      folders,
      selectedFolders,
      deselectedFiles,
      selectedFiles,
      contents,
    } = state;
    let count = 0;
    const counted = new Set();
    for (const folder of folders) {
      if (!selectedFolders.has(folder.name)) continue;
      const entry = contents[folder.name] ?? UNLOADED;
      const opted = entry.items.filter((f) => deselectedFiles.has(f.id)).length;
      // A fully fetched folder knows exactly how many selectable files it has
      // (already-embedded ones are filtered out); otherwise fall back to the
      // server's raw count.
      const total =
        entry.status === "loaded" && !entry.hasMore
          ? entry.items.length
          : folder.fileCount || entry.items.length;
      count += Math.max(0, total - opted);
      entry.items.forEach((f) => counted.add(f.id));
    }
    for (const id of selectedFiles) if (!counted.has(id)) count += 1;
    return count;
  }, [state]);

  /**
   * Whether anything is selected at all.
   *
   * Deliberately not `selectedCount > 0`: an empty folder is a legitimate
   * selection - it is the only way to delete one - but it contributes zero
   * files to the count, so gating the action bar on the count would leave
   * empty folders impossible to act on.
   */
  const hasSelection =
    state.selectedFolders.size > 0 || state.selectedFiles.size > 0;

  const toggleFile = useCallback(
    (file, folderName) =>
      dispatch({ type: "toggle-file", id: file.id, folderName }),
    []
  );
  const toggleFolder = useCallback(
    (folder, visibleFiles) =>
      dispatch({
        type: "toggle-folder",
        name: folder.name,
        items: visibleFiles,
      }),
    []
  );
  const selectAll = useCallback(() => dispatch({ type: "select-all" }), []);
  const clearSelection = useCallback(
    () => dispatch({ type: "clear-selection" }),
    []
  );

  /**
   * Expand the current selection into concrete file records, fetching whole
   * folders on demand. Files already embedded in this workspace are skipped.
   * @returns {Promise<Array<object & {folderName: string}>>}
   */
  const resolveSelection = useCallback(async () => {
    const {
      folders,
      contents,
      selectedFolders,
      selectedFiles,
      deselectedFiles,
      workspaceDocpaths,
    } = stateRef.current;
    const resolved = [];
    const seen = new Set();

    for (const folder of folders) {
      const entry = contents[folder.name] ?? UNLOADED;
      let items = entry.items;

      if (selectedFolders.has(folder.name)) {
        // Need every file, not just the page currently on screen.
        if (entry.status !== "loaded" || entry.hasMore) {
          const result = await System.localFiles(folder.name, 0, NO_LIMIT);
          items = (result?.documents ?? []).filter(
            (file) => !workspaceDocpaths.has(`${folder.name}/${file.name}`)
          );
        }
        for (const file of items) {
          if (deselectedFiles.has(file.id) || seen.has(file.id)) continue;
          seen.add(file.id);
          resolved.push({ ...file, folderName: folder.name });
        }
        continue;
      }

      for (const file of items) {
        if (!selectedFiles.has(file.id) || seen.has(file.id)) continue;
        seen.add(file.id);
        resolved.push({ ...file, folderName: folder.name });
      }
    }
    return resolved;
  }, []);

  /** Folder names selected wholesale (used by delete, which removes folders). */
  const selectedFolderNames = useMemo(
    () => [...state.selectedFolders],
    [state.selectedFolders]
  );

  /* --------------------------------- actions ------------------------------- */

  const toggleExpanded = useCallback(
    (name) => dispatch({ type: "toggle-expanded", name }),
    []
  );
  const prefetchFolder = useCallback(
    (name) => loadFolder({ name }),
    [loadFolder]
  );
  const loadMore = useCallback(
    (name) => loadFolder({ name, append: true }),
    [loadFolder]
  );
  const removeFiles = useCallback(
    (ids) => dispatch({ type: "remove-files", ids }),
    []
  );
  const addFolder = useCallback(
    (name) => dispatch({ type: "add-folder", name }),
    []
  );
  const setBusy = useCallback(
    (message) => dispatch({ type: "busy", message }),
    []
  );

  // Monotonic id for search requests. A slow query must not overwrite the
  // results of one issued after it, and clearing the box must not be undone
  // by a response that was already in flight.
  const searchSeq = useRef(0);
  const search = useCallback(async (term) => {
    const query = term?.trim();
    const seq = ++searchSeq.current;
    if (!query) return dispatch({ type: "search-clear" });

    dispatch({ type: "search-start" });
    const results = await System.searchLocalFiles(query);
    if (seq !== searchSeq.current) return;

    const embedded = stateRef.current.workspaceDocpaths;
    dispatch({
      type: "search-results",
      results: (results ?? []).map((folder) => ({
        ...folder,
        items: (folder.items ?? []).filter(
          (file) => !embedded.has(`${folder.name}/${file.name}`)
        ),
      })),
    });
  }, []);

  /**
   * Reconcile the picker after an upload finishes. Refreshes shells in place,
   * pulls the pages of any folder whose file count grew, and pre-selects the
   * files that are genuinely new so the user can embed them immediately.
   * Never touches `status`, so the tree stays on screen throughout.
   */
  const syncAfterUpload = useCallback(async () => {
    const before = new Map(
      stateRef.current.folders.map((f) => [f.name, f.fileCount])
    );
    const knownIds = new Set();
    for (const entry of Object.values(stateRef.current.contents))
      for (const file of entry.items) knownIds.add(file.id);

    // Use the docpaths refresh() just resolved rather than reading them back
    // off stateRef, which does not pick up the dispatch until React has
    // re-rendered and flushed effects.
    const { folders, docpaths } = await refresh();
    const embedded = new Set(docpaths);

    const changed = folders.filter((folder) => {
      const prev = before.get(folder.name);
      return prev === undefined || folder.fileCount > prev;
    });
    if (changed.length === 0) return;

    const pages = await Promise.all(
      changed.map((folder) => System.localFiles(folder.name, 0, PAGE_SIZE))
    );

    const freshIds = [];
    changed.forEach((folder, i) => {
      const result = pages[i];
      if (!result) return;
      const items = (result.documents ?? []).filter(
        (file) => !embedded.has(`${folder.name}/${file.name}`)
      );
      dispatch({
        type: "folder-loaded",
        name: folder.name,
        items,
        append: false,
        hasMore: result.hasMore ?? false,
        totalCount: result.totalCount ?? items.length,
      });
      dispatch({ type: "set-expanded", name: folder.name, value: true });
      for (const file of items)
        if (!knownIds.has(file.id)) freshIds.push(file.id);
    });

    dispatch({ type: "select-files", ids: freshIds });
  }, [refresh]);

  return {
    ...state,
    selectedCount,
    hasSelection,
    selectedFolderNames,
    isFileSelected,
    folderSelectionState,
    // actions
    refresh,
    search,
    syncAfterUpload,
    toggleExpanded,
    prefetchFolder,
    loadMore,
    toggleFile,
    toggleFolder,
    selectAll,
    clearSelection,
    resolveSelection,
    removeFiles,
    addFolder,
    setBusy,
  };
}

/**
 * Group the workspace's embedded documents by their storage folder for the
 * right-hand panel. Metadata comes from the docpaths on the workspace record
 * so this never has to walk the whole documents directory.
 */
async function buildWorkspaceDocs(docpaths = []) {
  const empty = { name: "documents", type: "folder", items: [] };
  if (docpaths.length === 0) return empty;

  const documents = await System.getDocumentsByDocPaths(docpaths);
  const byFolder = new Map();
  for (const doc of documents) {
    // The server echoes back the docpath it resolved. Deriving the folder from
    // the filename instead would be ambiguous - "a/report.json" and
    // "b/myreport.json" are indistinguishable by suffix. Documents uploaded
    // without a folder live in custom-documents.
    const folderName = doc.docpath?.includes("/")
      ? doc.docpath.split("/")[0]
      : "custom-documents";
    if (!byFolder.has(folderName)) byFolder.set(folderName, []);
    byFolder.get(folderName).push(doc);
  }
  return {
    ...empty,
    items: [...byFolder].map(([name, items]) => ({
      name,
      type: "folder",
      items,
    })),
  };
}
