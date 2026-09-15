import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Lark from "@/models/lark";

// PairingAccess currently returns requestedAt and uses a ten-minute lifetime.
const PAIRING_TTL_MS = 10 * 60 * 1000;

export default function UsersSection({
  pendingUsers,
  approvedUsers,
  refreshUsers,
  reportError,
  disabled,
}) {
  const { t } = useTranslation();
  const inFlight = useRef(new Set());
  const [busyIds, setBusyIds] = useState([]);
  async function actOnUser(action, id) {
    if (disabled || inFlight.current.has(id)) return;
    inFlight.current.add(id);
    setBusyIds([...inFlight.current]);
    reportError(null);
    try {
      const response = await Lark[`${action}User`](id);
      if (!response.success)
        return reportError(response.error || t("lark.errors.users"));
      await refreshUsers();
    } catch {
      reportError(t("lark.errors.users"));
    } finally {
      inFlight.current.delete(id);
      setBusyIds([...inFlight.current]);
    }
  }

  function renderUser(user, pending) {
    const id = user.open_id || user.userId;
    const expiry = pending
      ? new Date(user.expiresAt ?? Number(user.requestedAt) + PAIRING_TTL_MS)
      : null;
    const validExpiry = expiry && !Number.isNaN(expiry.getTime());
    return (
      <li
        key={id}
        className="flex flex-wrap items-center gap-3 py-3 border-b border-zinc-800 light:border-slate-200"
      >
        <div className="flex-1 min-w-[180px] text-sm">
          <p className="font-medium break-words">
            {user.name || t("lark.users.unknown")}
          </p>
          <p className="text-xs text-zinc-400 light:text-slate-600">
            {user.platform === "feishu" ? "Feishu" : "Lark"} · …
            {String(id).slice(-6)}
          </p>
          {pending && (
            <p className="text-xs mt-1">
              {t("lark.users.pairing-code")}:{" "}
              <span className="font-mono">{user.code}</span>
            </p>
          )}
          {validExpiry && (
            <p className="text-xs text-zinc-400 light:text-slate-600">
              {t("lark.users.expires")}:{" "}
              <time dateTime={expiry.toISOString()}>
                {expiry.toLocaleString()}
              </time>
            </p>
          )}
        </div>
        <div className="flex gap-3">
          {(pending ? ["approve", "deny"] : ["revoke"]).map((action) => (
            <button
              key={action}
              type="button"
              disabled={disabled || busyIds.includes(id)}
              onClick={() => actOnUser(action, id)}
              className="text-sm rounded-lg border border-zinc-700 light:border-slate-300 px-3 py-1.5 hover:bg-zinc-800 light:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t(`lark.users.${action}`)}
            </button>
          ))}
        </div>
      </li>
    );
  }

  return (
    <section className="flex flex-col gap-y-4 mt-8 max-w-[700px]">
      <h2 className="text-base font-semibold">{t("lark.users.title")}</h2>
      <p className="text-xs text-zinc-400 light:text-slate-600">
        {t("lark.users.description")}
      </p>
      <h3 className="text-sm font-medium">{t("lark.users.pending")}</h3>
      {pendingUsers.length ? (
        <ul>{pendingUsers.map((user) => renderUser(user, true))}</ul>
      ) : (
        <p className="text-xs text-zinc-400 light:text-slate-600">
          {t("lark.users.no-pending")}
        </p>
      )}
      <h3 className="text-sm font-medium">{t("lark.users.approved")}</h3>
      {approvedUsers.length ? (
        <ul>{approvedUsers.map((user) => renderUser(user, false))}</ul>
      ) : (
        <p className="text-xs text-zinc-400 light:text-slate-600">
          {t("lark.users.no-approved")}
        </p>
      )}
    </section>
  );
}
