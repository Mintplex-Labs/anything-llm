import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash, UserCircle } from "@phosphor-icons/react";
import BrowserUse from "@/models/browserUse";
import showToast from "@/utils/toast";
import Section, { EmptyState } from "./Section";

/**
 * Every saved browser profile (one per user, or the one shared profile in single-user mode).
 * Deleting one wipes its sign-ins; the user's next session starts a new, empty profile.
 */
export default function Profiles() {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState(null);

  const load = useCallback(() => BrowserUse.profiles().then(setProfiles), []);
  useEffect(() => {
    load();
  }, [load]);

  const remove = async (profile) => {
    if (!window.confirm(t("browserUse.profiles.deleteConfirm"))) return;
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
