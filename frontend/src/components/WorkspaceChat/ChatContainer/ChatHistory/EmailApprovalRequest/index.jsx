import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CaretDown,
  CaretUp,
  Check,
  EnvelopeSimple,
  FloppyDisk,
  PaperPlaneTilt,
  PencilSimple,
  X,
} from "@phosphor-icons/react";
import useTimeoutProgress from "@/hooks/useTimeoutProgress";
import RecipientRow, { splitRecipients } from "./RecipientRow";

const EMAIL_SKILLS = {
  "gmail-send-email": { provider: "Gmail", action: "send" },
  "gmail-reply-to-thread": { provider: "Gmail", action: "reply" },
  "gmail-create-draft": { provider: "Gmail", action: "draft" },
  "gmail-create-draft-reply": { provider: "Gmail", action: "draft_reply" },
  "gmail-update-draft": { provider: "Gmail", action: "update_draft" },
  "gmail-send-draft": { provider: "Gmail", action: "send_draft" },
  "outlook-send-email": { provider: "Outlook", action: "send" },
  "outlook-create-draft": { provider: "Outlook", action: "draft" },
  // Outlook draft updates have no Bcc field, so the card must not offer one.
  "outlook-update-draft": {
    provider: "Outlook",
    action: "update_draft",
    noBcc: true,
  },
  "outlook-send-draft": { provider: "Outlook", action: "send_draft" },
};

// Outlook's send/draft tools double as reply tools when given a message to reply to.
const REPLY_ACTIONS = { send: "reply", draft: "draft_reply" };
const DRAFT_ACTIONS = ["draft", "draft_reply", "update_draft"];

// Cc and Bcc are the standard header abbreviations in every locale, so they are
// not translated. "To" and "Subject" are localized by mail clients and stay in i18n.
const CC_LABEL = "Cc";
const BCC_LABEL = "Bcc";

function recipientLabel(t, field) {
  if (field === "cc") return `${CC_LABEL}:`;
  if (field === "bcc") return `${BCC_LABEL}:`;
  return t("chat_window.agent_invocation.email.to");
}

/**
 * Whether a tool approval request is for composing, replying, drafting or
 * sending an email and should render as the email card instead of the generic
 * tool approval card. The same skills also ask approval for individual file
 * attachments; those payloads carry neither a body nor a draft id.
 * @param {{skillName: string, payload?: object}} request
 * @returns {boolean}
 */
export function isEmailApprovalRequest({ skillName, payload }) {
  if (!(skillName in EMAIL_SKILLS) || !payload || typeof payload !== "object")
    return false;
  return "body" in payload || "draftId" in payload;
}

function emailAction(skillName, payload) {
  const { action } = EMAIL_SKILLS[skillName];
  if (payload.replyToMessageId) return REPLY_ACTIONS[action] || action;
  return action;
}

function toDraft(payload) {
  return {
    to: splitRecipients(payload.to),
    cc: splitRecipients(payload.cc),
    bcc: splitRecipients(payload.bcc),
    subject: payload.subject || "",
    body: payload.body || "",
  };
}

function serializeDraft(draft) {
  return {
    to: draft.to.join(", "),
    cc: draft.cc.join(", "),
    bcc: draft.bcc.join(", "),
    subject: draft.subject,
    body: draft.body,
  };
}

/**
 * Fields the user changed on the card, keyed the same way the email tools
 * expect them. Empty when the email is approved as the agent drafted it.
 */
function changedFields(draft, payload) {
  const original = serializeDraft(toDraft(payload));
  const current = serializeDraft(draft);
  return Object.fromEntries(
    Object.entries(current).filter(([key, value]) => value !== original[key])
  );
}

/**
 * Approval card for the gmail/outlook email tools (send, reply, drafts).
 * Shows the drafted email, lets the user adjust recipients, subject and body
 * before approving where the tool allows it, then collapses into a one-line
 * summary once resolved. Replies keep the thread's recipients and subject, and
 * sending an existing draft is shown read-only.
 * @param {string} props.requestId
 * @param {string} props.skillName
 * @param {object} props.payload - Tool call fields (to, cc, bcc, subject, body, attachmentCount, ...)
 * @param {number|null} [props.timeoutMs]
 * @param {WebSocket} props.websocket
 */
export default function EmailApprovalRequest({
  requestId,
  skillName,
  payload = {},
  timeoutMs = null,
  websocket,
}) {
  const { t } = useTranslation();
  const [status, setStatus] = useState("pending");
  const [editing, setEditing] = useState(false);
  const [held, setHeld] = useState(false);
  const [draft, setDraft] = useState(() => toDraft(payload));
  const [revealed, setRevealed] = useState({ cc: false, bcc: false });
  const responded = status !== "pending";

  const { provider, noBcc = false } = EMAIL_SKILLS[skillName];
  const action = emailAction(skillName, payload);
  const isDraft = DRAFT_ACTIONS.includes(action);
  const canEditBody = action !== "send_draft";
  const canEditHeader =
    canEditBody && action !== "reply" && action !== "draft_reply";
  const requiresTo = action === "send" || action === "draft";

  const progressPercent = useTimeoutProgress(timeoutMs, {
    active: !responded && !held,
    intervalMs: 50,
    onTimeout: () => respond(false, "timeout"),
  });

  // Once the user touches the email, the server stops racing them against the
  // approval clock, so the countdown bar goes away for the rest of the card.
  function hold() {
    if (held || responded) return;
    setHeld(true);
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({ type: "toolApprovalHold", requestId }));
    }
  }

  function startEditing() {
    setEditing(true);
    hold();
  }

  function respond(approved, nextStatus = approved ? "approved" : "denied") {
    if (responded) return;
    setStatus(nextStatus);
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      const edits = approved ? changedFields(draft, payload) : {};
      websocket.send(
        JSON.stringify({
          type: "toolApprovalResponse",
          requestId,
          approved,
          ...(Object.keys(edits).length ? { payload: edits } : {}),
        })
      );
    }
  }

  function updateDraft(patch) {
    setDraft((prev) => ({ ...prev, ...patch }));
    hold();
  }

  function reveal(field) {
    setRevealed((prev) => ({ ...prev, [field]: true }));
    startEditing();
  }

  const showTo = canEditHeader || draft.to.length > 0;
  const showCc = revealed.cc || draft.cc.length > 0;
  const showBcc = !noBcc && (revealed.bcc || draft.bcc.length > 0);
  const showSubject = canEditHeader || !!draft.subject;
  const ApproveIcon = isDraft ? FloppyDisk : PaperPlaneTilt;

  if (responded)
    return (
      <ResolvedCard
        status={status}
        action={action}
        draft={draft}
        attachmentCount={payload.attachmentCount}
      />
    );

  return (
    <div className="flex justify-center w-full mt-3 mb-1 pr-4">
      <div className="relative w-full flex flex-col rounded-lg overflow-hidden font-normal">
        <CardHeader
          title={t(`chat_window.agent_invocation.email.${action}_title`)}
          subtitle={t("chat_window.agent_invocation.email.via_provider", {
            provider,
          })}
          className="rounded-t-lg"
        />
        <div className="w-full flex flex-col gap-6 p-4 rounded-b-lg bg-zinc-800 light:bg-transparent light:border light:border-t-0 light:border-slate-300">
          <div className="flex flex-col gap-2 w-full">
            {showTo && (
              <RecipientRow
                label={t("chat_window.agent_invocation.email.to")}
                recipients={draft.to}
                onChange={(to) => updateDraft({ to })}
                editing={editing && canEditHeader}
                readOnly={!canEditHeader}
                trailing={
                  canEditHeader && (
                    <RevealLinks
                      showCc={showCc}
                      showBcc={showBcc || noBcc}
                      onReveal={reveal}
                    />
                  )
                }
              />
            )}
            {showCc && (
              <RecipientRow
                label={recipientLabel(t, "cc")}
                recipients={draft.cc}
                onChange={(cc) => updateDraft({ cc })}
                editing={editing && canEditHeader}
                readOnly={!canEditHeader}
              />
            )}
            {showBcc && (
              <RecipientRow
                label={recipientLabel(t, "bcc")}
                recipients={draft.bcc}
                onChange={(bcc) => updateDraft({ bcc })}
                editing={editing && canEditHeader}
                readOnly={!canEditHeader}
              />
            )}
            {showSubject && (
              <SubjectRow
                editing={editing && canEditHeader}
                value={draft.subject}
                onChange={(subject) => updateDraft({ subject })}
              />
            )}
          </div>
          <BodyField
            editing={editing && canEditBody}
            value={draft.body}
            onChange={(body) => updateDraft({ body })}
          />
          <div className="flex items-center justify-between w-full">
            {canEditBody ? (
              <EditToggle
                editing={editing}
                onToggle={editing ? () => setEditing(false) : startEditing}
              />
            ) : (
              <span />
            )}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => respond(false)}
                className="border-none bg-transparent p-0 flex items-center gap-2 text-sm leading-5 text-zinc-300 light:text-slate-600 hover:text-white light:hover:text-slate-900"
              >
                <X size={16} />
                {t("chat_window.agent_invocation.email.deny")}
              </button>
              <button
                type="button"
                onClick={() => respond(true)}
                disabled={requiresTo && draft.to.length === 0}
                className="border-none h-8 px-3 rounded-lg flex items-center gap-2 text-sm leading-5 font-medium bg-white text-zinc-950 light:bg-slate-950 light:text-white hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ApproveIcon size={16} />
                {t("chat_window.agent_invocation.approve")}
              </button>
            </div>
          </div>
        </div>
        {timeoutMs && !held && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700 light:bg-slate-300">
            <div
              className="h-full bg-sky-500 light:bg-sky-600 transition-none"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function CardHeader({
  title,
  subtitle,
  titleClassName = "",
  className = "",
  trailing = null,
}) {
  return (
    <div
      className={`w-full flex items-center gap-2.5 p-3 bg-zinc-900 border border-zinc-800 light:bg-slate-200 light:border-slate-200 ${className}`}
    >
      <div className="size-8 shrink-0 rounded flex items-center justify-center bg-zinc-800 text-white light:bg-slate-100 light:text-slate-950">
        <EnvelopeSimple size={16} />
      </div>
      <div className="flex flex-col min-w-0 text-sm leading-5">
        <span
          className={`font-semibold text-white light:text-slate-950 truncate ${titleClassName}`}
        >
          {title}
        </span>
        <span className="text-zinc-300 light:text-slate-600 truncate">
          {subtitle}
        </span>
      </div>
      {trailing}
    </div>
  );
}

function RevealLinks({ showCc, showBcc, onReveal }) {
  if (showCc && showBcc) return null;
  return (
    <div className="flex items-center gap-2.5 shrink-0 text-sm leading-5 text-zinc-400 light:text-slate-600">
      {!showCc && (
        <button
          type="button"
          onClick={() => onReveal("cc")}
          className="border-none bg-transparent p-0 hover:text-white light:hover:text-slate-900"
        >
          {CC_LABEL}
        </button>
      )}
      {!showBcc && (
        <button
          type="button"
          onClick={() => onReveal("bcc")}
          className="border-none bg-transparent p-0 hover:text-white light:hover:text-slate-900"
        >
          {BCC_LABEL}
        </button>
      )}
    </div>
  );
}

function SubjectRow({ editing, value, onChange }) {
  const { t } = useTranslation();
  const label = (
    <span className="text-zinc-400 light:text-slate-600 shrink-0">
      {t("chat_window.agent_invocation.email.subject")}
    </span>
  );

  if (editing)
    return (
      <label className="flex items-center gap-2.5 w-full pb-2 text-sm leading-5 border-b border-zinc-700 light:border-slate-200">
        {label}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent border-none outline-none p-0 text-sm leading-5 font-medium text-white light:text-slate-950"
        />
      </label>
    );

  return (
    <div className="flex items-center gap-2.5 w-full pb-2 text-sm leading-5 border-b border-zinc-700 light:border-slate-200">
      {label}
      <span className="font-medium text-white light:text-slate-950 truncate">
        {value}
      </span>
    </div>
  );
}

function BodyField({ editing, value, onChange }) {
  if (editing)
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.max(4, value.split("\n").length + 1)}
        className="w-full bg-transparent border-none outline-none resize-y p-0 text-sm leading-5 text-white light:text-slate-950"
      />
    );

  return (
    <p className="!m-0 w-full text-sm leading-5 text-white light:text-slate-950 whitespace-pre-wrap break-words">
      {value}
    </p>
  );
}

function EditToggle({ editing, onToggle }) {
  const { t } = useTranslation();
  const className =
    "border-none bg-transparent p-0 flex items-center gap-2 text-sm leading-5 text-zinc-300 light:text-slate-600 hover:text-white light:hover:text-slate-900";

  if (editing)
    return (
      <button type="button" onClick={onToggle} className={className}>
        <Check size={16} />
        {t("chat_window.agent_invocation.email.done")}
      </button>
    );

  return (
    <button type="button" onClick={onToggle} className={className}>
      <PencilSimple size={16} />
      {t("chat_window.agent_invocation.email.edit")}
    </button>
  );
}

function ResolvedCard({ status, action, draft, attachmentCount = 0 }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const titleClassName = status === "approved" ? "" : "line-through";
  const CaretIcon = expanded ? CaretUp : CaretDown;

  return (
    <div className="flex justify-center w-full mt-3 mb-1 pr-4">
      <div className="w-full flex flex-col rounded-lg overflow-hidden font-normal">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={t(
            `chat_window.agent_invocation.email.${expanded ? "hide" : "show"}_preview`
          )}
          className="border-none bg-transparent p-0 w-full text-left"
        >
          <CardHeader
            title={
              draft.subject ||
              t(`chat_window.agent_invocation.email.${action}_title`)
            }
            subtitle={
              <ResolvedSubtitle
                status={status}
                action={action}
                recipients={draft.to}
                attachmentCount={attachmentCount}
              />
            }
            titleClassName={titleClassName}
            className={expanded ? "rounded-t-lg" : "rounded-lg"}
            trailing={
              <CaretIcon
                size={16}
                className="ml-auto shrink-0 text-zinc-400 light:text-slate-600"
              />
            }
          />
        </button>
        {expanded && <EmailPreview draft={draft} />}
      </div>
    </div>
  );
}

function EmailPreview({ draft }) {
  const { t } = useTranslation();
  const rows = ["to", "cc", "bcc"].filter((field) => draft[field].length > 0);

  return (
    <div className="w-full flex flex-col gap-6 p-4 rounded-b-lg bg-zinc-800 light:bg-transparent light:border light:border-t-0 light:border-slate-300">
      <div className="flex flex-col gap-2 w-full">
        {rows.map((field) => (
          <RecipientRow
            key={field}
            label={recipientLabel(t, field)}
            recipients={draft[field]}
            onChange={() => {}}
            editing={false}
            readOnly
          />
        ))}
        {draft.subject && (
          <SubjectRow
            editing={false}
            value={draft.subject}
            onChange={() => {}}
          />
        )}
      </div>
      <BodyField editing={false} value={draft.body} onChange={() => {}} />
    </div>
  );
}

function ResolvedSubtitle({ status, action, recipients, attachmentCount }) {
  const { t } = useTranslation();
  const outcome = DRAFT_ACTIONS.includes(action) ? "saved" : "sent";
  if (status === "denied")
    return t(`chat_window.agent_invocation.email.not_${outcome}_denied`);
  if (status === "timeout")
    return t(`chat_window.agent_invocation.email.not_${outcome}_timeout`);

  const summary = recipients.length
    ? t(`chat_window.agent_invocation.email.${outcome}_to`, {
        recipients: recipients.join(", "),
      })
    : t(`chat_window.agent_invocation.email.${outcome}`);
  if (!attachmentCount) return summary;
  return `${summary} · ${t("chat_window.agent_invocation.email.attachment", { count: attachmentCount })}`;
}
