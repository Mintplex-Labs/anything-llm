const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const React = require("react");
const { create, act } = require("react-test-renderer");
const { transformSync } = require("esbuild");

const sourcePath = path.resolve(
  __dirname,
  "../src/components/WorkspaceChat/ChatContainer/DnDWrapper/index.jsx"
);

// Compile the complete production component. Only IO and unrelated leaf UI are
// replaced; React, hooks, effects, reconciliation and cleanup run unchanged.
function loadUploader(stubs) {
  const compiled = new Module(sourcePath, module);
  compiled.filename = sourcePath;
  compiled.require = (name) =>
    Object.hasOwn(stubs, name) ? stubs[name] : require(name);
  compiled._compile(
    transformSync(fs.readFileSync(sourcePath, "utf8"), {
      loader: "jsx",
      format: "cjs",
      jsx: "automatic",
    }).code,
    sourcePath
  );
  return compiled.exports;
}

function deferred() {
  let resolve;
  const promise = new Promise((done) => (resolve = done));
  return { promise, resolve };
}

function documentFile(name = "attachment.txt", type = "text/plain") {
  const file = new Blob(["attachment"], { type });
  file.name = name;
  return file;
}

function parsedFile(id = 1, tokenCountEstimate = 1) {
  return {
    response: { ok: true },
    data: { files: [{ id, tokenCountEstimate }] },
  };
}

async function mount(t, overrides = {}) {
  const saved = {
    window: global.window,
    CustomEvent: global.CustomEvent,
    FileReader: global.FileReader,
  };
  global.window = new EventTarget();
  global.CustomEvent = class extends Event {
    constructor(type, options = {}) {
      super(type);
      this.detail = options.detail;
    }
  };
  const readers = [];
  global.FileReader = class {
    readAsDataURL() {
      readers.push(this);
    }
  };

  const requests = [];
  const workspace = {
    maxContextWindowLimit: 0.8,
    getParsedFiles: async (...args) => {
      requests.push(["metadata", ...args]);
      return { currentContextTokenCount: 0, contextWindow: 1000 };
    },
    parseFile: async (slug, form) => {
      requests.push(["parse", slug, form.get("threadSlug")]);
      return parsedFile();
    },
    ...overrides,
  };
  let nextId = 0;
  let modal;
  const toasts = [];
  const uploader = loadUploader({
    uuid: { v4: () => String(++nextId) },
    "@/models/system": { checkDocumentProcessorOnline: async () => true },
    "@/models/workspace": workspace,
    "react-dropzone": { useDropzone: () => ({}) },
    "./dnd-icon.png": "icon",
    "@/utils/toast": (...args) => toasts.push(args),
    "./FileUploadWarningModal": (props) => {
      modal = props;
      return null;
    },
    pluralize: (word) => word,
  });

  let active;
  let disabled = false;
  const onProcessing = () => (disabled = true);
  const onProcessed = () => (disabled = false);
  window.addEventListener(uploader.ATTACHMENTS_PROCESSING_EVENT, onProcessing);
  window.addEventListener(uploader.ATTACHMENTS_PROCESSED_EVENT, onProcessed);
  function Probe() {
    active = React.useContext(uploader.DndUploaderContext);
    return null;
  }
  function view(slug, threadSlug) {
    return React.createElement(
      uploader.DnDFileUploaderProvider,
      { workspace: { slug }, threadSlug },
      React.createElement(Probe)
    );
  }
  let renderer;
  await act(async () => {
    renderer = create(view("workspace-a", "thread-a"));
  });
  t.after(async () => {
    await act(async () => renderer.unmount());
    Object.assign(global, saved);
  });

  return {
    get active() {
      return active;
    },
    get disabled() {
      return disabled;
    },
    get modal() {
      return modal;
    },
    requests,
    readers,
    toasts,
    uploader,
    drop: (file = documentFile()) =>
      act(async () => {
        await active.onDrop([file], []);
      }),
    switchTo: (slug = "workspace-a", thread = "thread-b") =>
      act(async () => {
        renderer.update(view(slug, thread));
        // The new chat's send button mounts enabled.
        disabled = false;
      }),
    unmount: () => act(async () => renderer.unmount()),
    paste: (file = documentFile()) =>
      act(async () => {
        window.dispatchEvent(
          new CustomEvent(uploader.PASTE_ATTACHMENT_EVENT, {
            detail: { files: [file] },
          })
        );
      }),
  };
}

for (const [slug, thread] of [
  ["workspace-a", "thread-b"],
  ["workspace-b", "thread-a"],
]) {
  test(`attachments and paste routes follow ${slug}/${thread}`, async (t) => {
    const chat = await mount(t);
    await chat.drop();
    assert.equal(chat.active.files[0].status, "added_context");
    await chat.switchTo(slug, thread);
    assert.deepEqual(chat.active.files, []);
    const before = chat.requests.length;
    await chat.paste();
    assert.deepEqual(chat.requests.slice(before), [
      ["metadata", slug, thread],
      ["parse", slug, thread],
    ]);
    assert.equal(chat.active.files.length, 1);
  });
}

test("rerendering the same conversation preserves its attachments", async (t) => {
  const chat = await mount(t);
  await chat.drop();
  await chat.switchTo("workspace-a", "thread-a");
  assert.equal(chat.active.files.length, 1);
});

test("the old thread's parse completion cannot unlock the new thread", async (t) => {
  const oldParse = deferred();
  const newParse = deferred();
  const chat = await mount(t, {
    parseFile: (_slug, form) =>
      form.get("threadSlug") === "thread-a"
        ? oldParse.promise
        : newParse.promise,
  });
  await chat.drop();
  await chat.switchTo();
  await chat.drop();
  assert.equal(chat.disabled, true);
  await act(async () => oldParse.resolve(parsedFile(1)));
  assert.equal(chat.disabled, true);
  assert.equal(chat.active.files[0].status, "in_progress");
  await act(async () => newParse.resolve(parsedFile(2)));
  assert.equal(chat.disabled, false);
  assert.equal(chat.active.files[0].document.id, 2);
});

test("metadata resolved after switching does not start an obsolete parse", async (t) => {
  const metadata = deferred();
  const chat = await mount(t, { getParsedFiles: () => metadata.promise });
  await chat.drop();
  await chat.switchTo();
  await act(async () => {
    metadata.resolve({ currentContextTokenCount: 0, contextWindow: 1000 });
  });
  assert.deepEqual(chat.requests, []);
  assert.deepEqual(chat.active.files, []);
});

test("image conversion finishing after switching cannot lock the next chat", async (t) => {
  const chat = await mount(t);
  let pendingDrop;
  await act(async () => {
    pendingDrop = chat.active.onDrop([documentFile("image.png", "image/png")]);
  });
  await chat.switchTo();
  await act(async () => {
    chat.readers[0].result = "data:image/png;base64,aW1hZ2U=";
    chat.readers[0].onload();
    await pendingDrop;
  });
  assert.equal(chat.disabled, false);
  assert.deepEqual(chat.requests, []);
  assert.deepEqual(chat.active.parseAttachments(), []);
});

test("embedding from an old warning dialog cannot unlock the new chat", async (t) => {
  const embedding = deferred();
  const parsing = deferred();
  const chat = await mount(t, {
    parseFile: (_slug, form) =>
      form.get("threadSlug") === "thread-a"
        ? Promise.resolve(parsedFile(1, 1000))
        : parsing.promise,
    embedParsedFile: () => embedding.promise,
  });
  await chat.drop();
  assert.equal(chat.modal.show, true);
  let pendingEmbed;
  await act(async () => {
    pendingEmbed = chat.modal.onEmbed();
  });
  await chat.switchTo();
  await chat.drop();
  await act(async () => {
    embedding.resolve({
      response: { ok: true },
      data: { document: { id: 1 } },
    });
    await pendingEmbed;
  });
  assert.equal(chat.disabled, true);
  assert.deepEqual(chat.toasts, []);
  assert.equal(chat.modal.show, false);
  await act(async () => parsing.resolve(parsedFile(2)));
});

test("unmount stops attachment events from reaching the provider", async (t) => {
  const chat = await mount(t);
  await chat.unmount();
  await chat.paste();
  await act(async () => {
    window.dispatchEvent(
      new CustomEvent(chat.uploader.REMOVE_ATTACHMENT_EVENT, {
        detail: { uid: "1", document: { location: "old.json" } },
      })
    );
  });
  assert.deepEqual(chat.requests, []);
});
