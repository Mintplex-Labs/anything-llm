const state = { tab: "memories", memories: [], user: [], stats: null };

async function fetchEntries(type) {
  const res = await fetch(`/api/${type}`);
  const data = await res.json();
  return data.entries || [];
}

async function fetchStats() {
  const res = await fetch("/api/stats");
  return await res.json();
}

async function addEntry(type, text) {
  const res = await fetch(`/api/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entry: text }),
  });
  if (!res.ok) {
    const err = await res.json();
    showToast(err.error || "Failed to add");
    return false;
  }
  return true;
}

async function deleteEntry(type, index) {
  const res = await fetch(`/api/${type}/${index}`, { method: "DELETE" });
  return res.ok;
}

async function triggerReview() {
  await fetch("/api/review", { method: "POST" });
  showToast("Review triggered");
}

function parseEntry(raw) {
  const metaMatch = raw.match(/<!--\s*(.*?)\s*-->/);
  let text = raw.replace(/<!--.*?-->/g, "").trim();
  let meta = null;
  if (metaMatch) {
    meta = metaMatch[1].trim();
  }
  return { text, meta };
}

function renderEntries(type) {
  const list = document.getElementById(`${type}-list`);
  const entries = state[type === "memories" ? "memories" : "user"];

  if (entries.length === 0) {
    list.innerHTML = `<div class="py-10 text-center text-gray-400 italic">No ${type === "memories" ? "memories" : "profile entries"} yet</div>`;
    return;
  }

  list.innerHTML = entries
    .map((raw, i) => {
      const { text, meta } = parseEntry(raw);
      return `
    <div class="group flex items-start gap-3 px-3.5 py-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div class="flex-1 min-w-0">
        <p class="text-[13px] leading-relaxed text-gray-800 break-words">${escapeHtml(text)}</p>
        ${meta ? `<p class="mt-1 text-[11px] text-gray-400">${escapeHtml(meta)}</p>` : ""}
      </div>
      <button class="entry-delete shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 w-6 h-6 flex items-center justify-center rounded transition-all" data-type="${type}" data-index="${i}" title="Delete">&#x2715;</button>
    </div>
    ${i < entries.length - 1 ? '<div class="border-b border-gray-100 mx-3"></div>' : ""}
  `;
    })
    .join("");
}

function renderStats() {
  const el = document.getElementById("stats");
  if (!state.stats) {
    el.innerHTML = "";
    return;
  }
  const { memory, user } = state.stats;
  const memPct = Math.min(100, Math.round((memory.chars / memory.limit) * 100));
  const userPct = Math.min(100, Math.round((user.chars / user.limit) * 100));

  el.innerHTML = `
    <div class="flex items-center gap-1.5">
      Mem: ${memory.entries}
      <div class="w-14 h-1 bg-gray-200 rounded-full overflow-hidden"><div class="h-full rounded-full transition-all ${memPct > 80 ? "bg-orange-500" : "bg-accent"}" style="width:${memPct}%"></div></div>
      ${memPct}%
    </div>
    <div class="flex items-center gap-1.5">
      User: ${user.entries}
      <div class="w-14 h-1 bg-gray-200 rounded-full overflow-hidden"><div class="h-full rounded-full transition-all ${userPct > 80 ? "bg-orange-500" : "bg-accent"}" style="width:${userPct}%"></div></div>
      ${userPct}%
    </div>
  `;
}

async function refresh() {
  state.memories = await fetchEntries("memories");
  state.user = await fetchEntries("user");
  state.stats = await fetchStats();
  renderEntries("memories");
  renderEntries("user");
  renderStats();
}

function switchTab(tab) {
  state.tab = tab;
  document.querySelectorAll(".tab").forEach((t) => {
    const isActive = t.dataset.tab === tab;
    t.classList.toggle("text-accent", isActive);
    t.classList.toggle("border-accent", isActive);
    t.classList.toggle("text-gray-500", !isActive);
    t.classList.toggle("border-transparent", !isActive);
  });
  document.querySelectorAll(".panel").forEach((p) => {
    const isActive = p.id === `${tab}-panel`;
    p.classList.toggle("hidden", !isActive);
    p.classList.toggle("flex", isActive);
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("opacity-100");
  toast.classList.remove("opacity-0");
  setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
  }, 2000);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("tab")) {
    switchTab(e.target.dataset.tab);
    return;
  }

  if (e.target.classList.contains("entry-delete")) {
    const type = e.target.dataset.type;
    const index = parseInt(e.target.dataset.index, 10);
    const apiType = type === "memories" ? "memories" : "user";
    if (await deleteEntry(apiType, index)) {
      await refresh();
    }
    return;
  }

  if (e.target.id === "memory-add-btn") {
    const input = document.getElementById("memory-input");
    if (input.value.trim() && (await addEntry("memories", input.value.trim()))) {
      input.value = "";
      await refresh();
    }
    return;
  }

  if (e.target.id === "user-add-btn") {
    const input = document.getElementById("user-input");
    if (input.value.trim() && (await addEntry("user", input.value.trim()))) {
      input.value = "";
      await refresh();
    }
    return;
  }

  if (e.target.id === "refresh-btn") {
    await refresh();
    showToast("Refreshed");
    return;
  }

  if (e.target.id === "review-btn") {
    await triggerReview();
    return;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (e.target.id === "memory-input") {
      document.getElementById("memory-add-btn").click();
    } else if (e.target.id === "user-input") {
      document.getElementById("user-add-btn").click();
    }
  }
});

switchTab("memories");
refresh();
setInterval(refresh, 10000);
