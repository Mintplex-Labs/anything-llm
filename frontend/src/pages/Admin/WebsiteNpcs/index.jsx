import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import WebsiteNpcs from "@/models/websiteNpcs";
import CTAButton from "@/components/lib/CTAButton";

function Pill({ children, ok = false }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        ok
          ? "bg-green-500/15 text-green-300 border border-green-500/20"
          : "bg-yellow-500/15 text-yellow-200 border border-yellow-500/20"
      }`}
    >
      {children}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-y-1 text-sm text-theme-text-primary">
      <span className="text-xs uppercase tracking-wide text-theme-text-secondary">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="rounded-lg border border-white/10 bg-theme-bg-container px-3 py-2 text-sm text-theme-text-primary outline-none focus:border-blue-400"
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className="min-h-[90px] rounded-lg border border-white/10 bg-theme-bg-container px-3 py-2 text-sm text-theme-text-primary outline-none focus:border-blue-400"
    />
  );
}

export default function WebsiteNpcsAdmin() {
  const [status, setStatus] = useState(null);
  const [selectedNpcId, setSelectedNpcId] = useState("sparky");
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  async function refresh() {
    setLoading(true);
    const data = await WebsiteNpcs.status();
    setStatus(data);
    const selected =
      data?.npcs?.find((npc) => npc.npcId === selectedNpcId) || data?.npcs?.[0];
    setSelectedNpcId(selected?.npcId || "sparky");
    setDraft(selected || null);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  const selectedNpc = useMemo(
    () => status?.npcs?.find((npc) => npc.npcId === selectedNpcId),
    [status, selectedNpcId]
  );

  useEffect(() => {
    if (selectedNpc) setDraft(selectedNpc);
  }, [selectedNpc]);

  async function saveDraft() {
    setMessage(null);
    const result = await WebsiteNpcs.save(draft);
    setMessage(result.success ? "NPC saved." : result.message || result.error);
    await refresh();
  }

  async function repairWorkspaces() {
    setMessage(null);
    const result = await WebsiteNpcs.repairWorkspaces();
    setMessage(
      result.success
        ? "Default Sparky website workspaces were checked and missing ones were created."
        : result.message || result.error
    );
    await refresh();
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16 gap-y-6">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <p className="text-lg leading-6 font-bold text-theme-text-primary">
              SWARMSY Website NPC Control Panel
            </p>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary max-w-4xl">
              Private admin controls for the public Crypto Moonboys Sparky NPC.
              The website only talks to the public bridge; live answers are
              routed to the Website Sparky workspace and this page never reveals
              bridge tokens.
            </p>
          </div>

          {loading || !status ? (
            <div className="text-theme-text-secondary">Loading NPC status…</div>
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                <div className="rounded-xl border border-white/10 bg-theme-bg-container p-4 xl:col-span-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                    <h2 className="text-theme-text-primary font-bold">
                      Bridge endpoint status
                    </h2>
                    <CTAButton onClick={repairWorkspaces}>
                      Create / repair Sparky defaults
                    </CTAButton>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="text-theme-text-secondary">
                      Private endpoint:{" "}
                      <code>{status.bridge?.swarmsyEndpoint}</code>
                    </div>
                    <div className="text-theme-text-secondary">
                      Public bridge:{" "}
                      <code>{status.bridge?.publicBridgeEndpoint}</code>
                    </div>
                    <div>
                      <Pill ok={status.bridge?.bridgeTokenConfigured}>
                        {status.bridge?.bridgeTokenConfigured
                          ? "Bridge token configured"
                          : "Bridge token missing"}
                      </Pill>
                    </div>
                    <div className="text-theme-text-secondary">
                      Allowed public NPCs:{" "}
                      {status.bridge?.allowedNpcIds?.join(", ")}
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-theme-text-secondary">
                    Allowed origins: {status.bridge?.allowedOrigins?.join(", ")}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-theme-bg-container p-4">
                  <h2 className="text-theme-text-primary font-bold mb-3">
                    Subject workspace structure
                  </h2>
                  <div className="flex flex-col gap-2">
                    {status.subjectWorkspaces?.map((workspace) => (
                      <div
                        key={workspace.slug}
                        className="text-xs text-theme-text-secondary"
                      >
                        <span className="text-theme-text-primary">
                          {workspace.name}
                        </span>{" "}
                        — {workspace.slug}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-theme-bg-container p-4">
                <h2 className="text-theme-text-primary font-bold mb-3">
                  Required website workspaces
                </h2>
                <div className="grid md:grid-cols-3 gap-3">
                  {status.requiredWorkspaces?.map((workspace) => {
                    const summary = status.workspaces?.[workspace.slug];
                    return (
                      <div
                        key={workspace.slug}
                        className="rounded-lg border border-white/10 p-3"
                      >
                        <div className="flex justify-between gap-2 mb-2">
                          <strong className="text-theme-text-primary text-sm">
                            {workspace.name}
                          </strong>
                          <Pill ok={summary?.exists}>
                            {summary?.exists ? "ready" : "missing"}
                          </Pill>
                        </div>
                        <p className="text-xs text-theme-text-secondary">
                          {workspace.purpose}
                        </p>
                        <p className="text-xs text-theme-text-secondary mt-2">
                          Slug: <code>{workspace.slug}</code>
                        </p>
                        <p className="text-xs text-theme-text-secondary">
                          Documents: {summary?.documentCount || 0}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-4">
                <div className="rounded-xl border border-white/10 bg-theme-bg-container p-4">
                  <h2 className="text-theme-text-primary font-bold mb-3">
                    Public NPC
                  </h2>
                  <div className="flex flex-col gap-2">
                    {status.npcs?.map((npc) => {
                      const workspace = status.workspaces?.[npc.workspaceSlug];
                      return (
                        <button
                          type="button"
                          key={npc.npcId}
                          onClick={() => setSelectedNpcId(npc.npcId)}
                          className={`text-left rounded-lg border p-3 ${
                            selectedNpcId === npc.npcId
                              ? "border-blue-400 bg-blue-500/10"
                              : "border-white/10"
                          }`}
                        >
                          <div className="flex justify-between gap-2">
                            <strong className="text-theme-text-primary">
                              {npc.displayName}
                            </strong>
                            <Pill ok={npc.enabled}>
                              {npc.enabled ? "enabled" : "disabled"}
                            </Pill>
                          </div>
                          <p className="text-xs text-theme-text-secondary mt-1">
                            {npc.npcId} → {npc.workspaceSlug}
                          </p>
                          <p className="text-xs text-theme-text-secondary">
                            Workspace {workspace?.exists ? "ready" : "missing"}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-theme-bg-container p-4 lg:col-span-2">
                  <div className="flex justify-between items-center mb-4 gap-3">
                    <h2 className="text-theme-text-primary font-bold">
                      Edit Sparky routing and persona
                    </h2>
                    <CTAButton onClick={saveDraft} disabled={!draft}>
                      Save NPC
                    </CTAButton>
                  </div>
                  {message && (
                    <p className="text-sm text-theme-text-secondary mb-3">
                      {message}
                    </p>
                  )}
                  {draft && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="NPC ID">
                        <TextInput
                          value={draft.npcId}
                          onChange={(e) =>
                            setDraft({ ...draft, npcId: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Display name">
                        <TextInput
                          value={draft.displayName}
                          onChange={(e) =>
                            setDraft({ ...draft, displayName: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Assigned workspace slug">
                        <TextInput
                          value={draft.workspaceSlug}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              workspaceSlug: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Fallback workspace slug">
                        <TextInput
                          value={draft.fallbackWorkspaceSlug || ""}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              fallbackWorkspaceSlug: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Max response length">
                        <TextInput
                          type="number"
                          value={draft.maxResponseLength}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              maxResponseLength: Number(e.target.value),
                            })
                          }
                        />
                      </Field>
                      <label className="flex items-center gap-2 text-sm text-theme-text-primary mt-6">
                        <input
                          type="checkbox"
                          checked={draft.enabled}
                          onChange={(e) =>
                            setDraft({ ...draft, enabled: e.target.checked })
                          }
                        />{" "}
                        Enabled
                      </label>
                      <Field label="Public description">
                        <TextArea
                          value={draft.publicDescription}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              publicDescription: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Greeting message">
                        <TextArea
                          value={draft.greetingMessage}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              greetingMessage: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Subject/category routing (comma separated)">
                        <TextArea
                          value={(draft.subjectRouting || []).join(", ")}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              subjectRouting: e.target.value
                                .split(",")
                                .map((item) => item.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      </Field>
                      <Field label="Allowed public page paths (comma separated)">
                        <TextArea
                          value={(draft.allowedPublicPagePaths || []).join(
                            ", "
                          )}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              allowedPublicPagePaths: e.target.value
                                .split(",")
                                .map((item) => item.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      </Field>
                      <div className="md:col-span-2">
                        <Field label="System prompt / persona">
                          <TextArea
                            value={draft.systemPrompt}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                systemPrompt: e.target.value,
                              })
                            }
                          />
                        </Field>
                      </div>
                      <div className="md:col-span-2">
                        <Field label="Public safety instructions">
                          <TextArea
                            value={draft.publicSafetyInstructions}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                publicSafetyInstructions: e.target.value,
                              })
                            }
                          />
                        </Field>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-theme-bg-container p-4">
                <h2 className="text-theme-text-primary font-bold mb-3">
                  Recent public messages and responses
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-theme-text-secondary text-left">
                      <tr>
                        <th className="p-2">Time</th>
                        <th className="p-2">NPC</th>
                        <th className="p-2">Workspace</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Prompt</th>
                        <th className="p-2">Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {status.recentLogs?.map((log) => (
                        <tr
                          key={log.id}
                          className="border-t border-white/10 text-theme-text-secondary"
                        >
                          <td className="p-2 whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="p-2">
                            {log.displayName || log.npcId}
                          </td>
                          <td className="p-2">{log.workspaceSlug}</td>
                          <td className="p-2">{log.status}</td>
                          <td className="p-2 max-w-[260px] truncate">
                            {log.prompt}
                          </td>
                          <td className="p-2 max-w-[320px] truncate">
                            {log.response}
                          </td>
                        </tr>
                      ))}
                      {status.recentLogs?.length === 0 && (
                        <tr>
                          <td
                            className="p-2 text-theme-text-secondary"
                            colSpan="6"
                          >
                            No public messages logged yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
