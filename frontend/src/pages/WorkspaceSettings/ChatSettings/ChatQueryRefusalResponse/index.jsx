import { chatQueryRefusalResponse } from "@/utils/chat";
import { useTranslation } from "react-i18next";
export default function ChatQueryRefusalResponse({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          {t("chat.refusal.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {t("chat.refusal.desc-start")}{" "}
          <code className="bg-zinc-900 p-0.5 rounded-sm">
            {t("chat.refusal.query")}
          </code>{" "}
          {t("chat.refusal.desc-end")}
        </p>
      </div>
      <textarea
        name="queryRefusalResponse"
        rows={2}
        defaultValue={chatQueryRefusalResponse(workspace)}
        className="border-none bg-zinc-900 placeholder:text-white/20 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-2"
        placeholder="The text returned in query mode when there is no relevant context found for a response."
        required={true}
        wrap="soft"
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
