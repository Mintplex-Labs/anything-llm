import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Globe,
  Trash,
  CheckCircle,
  WarningCircle,
  StopCircle,
  XCircle,
  ClockCounterClockwise,
  UserCircle,
  Detective,
  EyeSlash,
} from "@phosphor-icons/react";
import Toggle from "@/components/lib/Toggle";
import BrowserUse from "@/models/browserUse";
import showToast from "@/utils/toast";
import useUser from "@/hooks/useUser";
import TraceModal, {
  Favicon,
  formatTokens,
} from "@/components/WorkspaceChat/ChatContainer/ChatHistory/BrowserUseSession/TraceModal";

// What browsing from a server can and can't do (bot walls, cloud IPs), and who is responsible.
const DOCS_URL = "https://docs.anythingllm.com/agent/usage/browser-use/docker";

function confirmAction(message) {
  return window.confirm(message);
}

/**
 * Agent skill panel for Browser Use: the toggle, the history of every session the agent ran
 * (every user's, unless DISABLE_VIEW_CHAT_HISTORY hides them) and the users' saved browser profiles.
 */
export default function BrowserUseSkillPanel({
  title,
  description,
  skill,
  toggleSkill,
  enabled = false,
  disabled = false,
}) {
  const { t } = useTranslation();
  return (
    <div className="p-2">
      <div className="flex flex-col gap-y-[18px] max-w-[560px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-x-2">
            <Globe size={24} color="var(--theme-text-primary)" weight="bold" />
            <label className="text-theme-text-primary text-md font-bold">
              {title}
            </label>
          </div>
          <Toggle
            size="lg"
            enabled={enabled}
            disabled={disabled}
            onChange={() => toggleSkill(skill)}
          />
        </div>
        <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium">
          {description}{" "}
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-cta-button"
          >
            {t("browserUse.limitations")}
          </a>
        </p>
        <Tabs />
      </div>
    </div>
  );
}

// Styled like the File System skill panel's tabs in the desktop app, so both platforms match.
const TABS = [
  { name: "sessions", Icon: ClockCounterClockwise },
  { name: "profiles", Icon: UserCircle },
];

function Tabs() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [tab, setTab] = useState("sessions");
  // Single-user mode (no signed-in user) has just the one profile - nothing to manage per user.
  if (!user) return <SessionHistory />;
  return (
    <div className="flex flex-col gap-y-2">
      <div role="tablist" className="flex border-none w-full">
        {TABS.map(({ name, Icon }) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={tab === name}
            onClick={() => setTab(name)}
            className={`w-full hover:bg-sky-500/10 light:hover:bg-sky-400/10 rounded-t-lg border-none flex items-center justify-center gap-x-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === name
                ? "border-sky-400 text-sky-500"
                : "border-transparent text-theme-text-secondary hover:text-theme-text-primary"
            }`}
          >
            <Icon size={16} weight="bold" />
            {t(`browserUse.tabs.${name}`)}
          </button>
        ))}
      </div>
      {tab === "sessions" ? <SessionHistory /> : <Profiles />}
    </div>
  );
}

function Section({ title, description, children, action = null }) {
  return (
    <div className="flex flex-col gap-y-2 pt-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-theme-text-primary">{title}</p>
        {action}
      </div>
      {description && (
        <p className="text-xs text-theme-text-secondary">{description}</p>
      )}
      {children}
    </div>
  );
}

/** A list with nothing in it yet: a centered icon and message in a rounded, shaded box. */
function EmptyState({ Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-2 px-4 py-8 rounded-lg bg-theme-bg-primary light:bg-theme-settings-input-bg text-center">
      <Icon size={28} className="text-theme-text-secondary opacity-60" />
      <p className="text-sm text-theme-text-secondary">{text}</p>
    </div>
  );
}

const STATUS_ICONS = {
  done: [CheckCircle, "text-green-400"],
  incomplete: [WarningCircle, "text-amber-400"],
  stopped: [StopCircle, "text-zinc-400"],
  failed: [XCircle, "text-red-400"],
};

function SessionHistory() {
  const { t } = useTranslation();
  const [traces, setTraces] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [openId, setOpenId] = useState(null);

  const load = useCallback(
    () =>
      BrowserUse.traces().then((result) => {
        setTraces(result.traces);
        setHidden(result.hidden);
      }),
    []
  );
  useEffect(() => {
    load();
  }, [load]);

  const remove = async (e, id) => {
    e.stopPropagation();
    if (!confirmAction(t("browserUse.history.deleteConfirm"))) return;
    if (!(await BrowserUse.deleteTrace(id)))
      showToast(t("browserUse.history.deleteFailed"), "error", {
        clear: true,
      });
    load();
  };

  const clearAll = async () => {
    if (!confirmAction(t("browserUse.history.clearConfirm"))) return;
    if (!(await BrowserUse.clearTraces()))
      showToast(t("browserUse.history.clearFailed"), "error", { clear: true });
    load();
  };

  return (
    <Section
      title={t("browserUse.history.title")}
      description={t("browserUse.history.description")}
      action={
        traces?.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="border-none text-xs text-theme-text-secondary hover:text-red-400"
          >
            {t("browserUse.history.clear")}
          </button>
        )
      }
    >
      {traces?.length === 0 &&
        (hidden ? (
          <EmptyState Icon={EyeSlash} text={t("browserUse.history.hidden")} />
        ) : (
          <EmptyState Icon={Globe} text={t("browserUse.history.empty")} />
        ))}
      <div className="flex flex-col max-h-[360px] overflow-y-auto">
        {(traces || []).map((trace) => {
          const [Icon, color] = STATUS_ICONS[trace.status] || [
            Globe,
            "text-sky-400",
          ];
          return (
            <div
              key={trace.id}
              role="button"
              tabIndex={0}
              onClick={() => setOpenId(trace.id)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                e.target === e.currentTarget &&
                setOpenId(trace.id)
              }
              className="group flex items-center gap-x-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-theme-bg-primary light:hover:bg-theme-settings-input-bg"
            >
              <Icon
                size={18}
                weight="fill"
                className={`${color} flex-shrink-0`}
              />
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-sm text-theme-text-primary truncate">
                  {trace.task}
                </p>
                <div className="flex items-center gap-x-2 text-[11px] text-theme-text-secondary">
                  {trace.userId !== null && trace.userId !== undefined && (
                    <span className="flex items-center gap-x-1 flex-shrink-0">
                      <UserCircle size={12} />
                      {trace.username ||
                        t("browserUse.profiles.deletedUser", {
                          id: trace.userId,
                        })}
                    </span>
                  )}
                  {trace.resume?.profile?.ephemeral && (
                    <span
                      className="flex items-center flex-shrink-0"
                      title={t("browserUse.history.incognito")}
                      aria-label={t("browserUse.history.incognito")}
                    >
                      <Detective size={12} />
                    </span>
                  )}
                  <span>{new Date(trace.startedAt).toLocaleString()}</span>
                  {trace.resumedFrom && (
                    <span
                      className="flex items-center flex-shrink-0"
                      title={t("browserUse.resume.continuedFromPrevious")}
                      aria-label={t("browserUse.resume.continuedFromPrevious")}
                    >
                      <ClockCounterClockwise size={12} />
                    </span>
                  )}
                  <span className="flex items-center gap-x-1">
                    {(trace.sites || []).slice(0, 5).map((site) => (
                      <Favicon
                        key={site.host}
                        src={site.favicon}
                        host={site.host}
                        size={12}
                      />
                    ))}
                  </span>
                  <span>
                    {t("browserUse.card.usage", {
                      steps: trace.stepCount,
                      tokens: formatTokens(trace.tokens?.total),
                    })}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => remove(e, trace.id)}
                aria-label={t("browserUse.history.delete")}
                title={t("browserUse.history.delete")}
                className="border-none opacity-0 group-hover:opacity-100 focus:opacity-100 text-theme-text-secondary hover:text-red-400 flex-shrink-0"
              >
                <Trash size={14} />
              </button>
            </div>
          );
        })}
      </div>
      {openId && (
        <TraceModal traceId={openId} onClose={() => setOpenId(null)} />
      )}
    </Section>
  );
}

/**
 * Every saved browser profile (one per user, or the one shared profile in single-user mode).
 * Deleting one wipes its sign-ins; the user's next session starts a new, empty profile.
 */
function Profiles() {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState(null);

  const load = useCallback(() => BrowserUse.profiles().then(setProfiles), []);
  useEffect(() => {
    load();
  }, [load]);

  const remove = async (profile) => {
    if (!confirmAction(t("browserUse.profiles.deleteConfirm"))) return;
    if (!(await BrowserUse.deleteProfile(profile.key)))
      showToast(t("browserUse.profiles.deleteFailed"), "error", {
        clear: true,
      });
    load();
  };

  const ownerOf = (profile) => {
    if (profile.userId === null) return t("browserUse.profiles.shared");
    return (
      profile.username ||
      t("browserUse.profiles.deletedUser", { id: profile.userId })
    );
  };

  return (
    <Section
      title={t("browserUse.profiles.title")}
      description={t("browserUse.profiles.description")}
    >
      {profiles?.length === 0 && (
        <EmptyState Icon={UserCircle} text={t("browserUse.profiles.empty")} />
      )}
      <div className="flex flex-col max-h-[360px] overflow-y-auto">
        {(profiles || []).map((profile) => (
          <div
            key={profile.key}
            className="group flex items-center gap-x-3 px-2 py-2 rounded-lg hover:bg-theme-bg-primary light:hover:bg-theme-settings-input-bg"
          >
            <UserCircle
              size={18}
              className="text-theme-text-secondary flex-shrink-0"
            />
            <p className="flex-1 min-w-0 text-sm text-theme-text-primary truncate">
              {ownerOf(profile)}
            </p>
            <button
              type="button"
              onClick={() => remove(profile)}
              aria-label={t("browserUse.profiles.delete")}
              title={t("browserUse.profiles.delete")}
              className="border-none opacity-0 group-hover:opacity-100 focus:opacity-100 text-theme-text-secondary hover:text-red-400 flex-shrink-0"
            >
              <Trash size={14} />
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}
