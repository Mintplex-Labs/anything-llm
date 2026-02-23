import { useState, useEffect } from "react";
import { CaretDown, CaretUp, ChatCircle, User, Copy } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import Embed from "@/models/embed";
import { formatDateTimeDE } from "@/utils/directories";
import showToast from "@/utils/toast";
import MarkdownRenderer from "../EmbedChats/MarkdownRenderer";
import Pagination from "@/components/Pagination";

function timeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "vor wenigen Sekunden";
  if (minutes < 60) return `vor ${minutes} ${minutes === 1 ? "Minute" : "Minuten"}`;
  if (hours < 24) return `vor ${hours} ${hours === 1 ? "Stunde" : "Stunden"}`;
  if (days < 30) return `vor ${days} ${days === 1 ? "Tag" : "Tagen"}`;

  const months = Math.floor(days / 30);
  if (months < 12) return `vor ${months} ${months === 1 ? "Monat" : "Monaten"}`;

  const years = Math.floor(months / 12);
  return `vor ${years} ${years === 1 ? "Jahr" : "Jahren"}`;
}

export default function ConversationList({ embedId, startDate, endDate }) {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    setOffset(0);
  }, [embedId, startDate, endDate]);

  useEffect(() => {
    if (!embedId) return;

    async function loadConversations() {
      setLoading(true);
      const { success, conversations: data, hasMore: more, totalCount: total } =
        await Embed.getConversations(embedId, offset, ITEMS_PER_PAGE, startDate, endDate);

      if (success) {
        setConversations(data || []);
        setHasMore(more);
        setTotalCount(total || 0);
      } else {
        showToast(t("embed-analytics.load-error"), "error");
      }
      setLoading(false);
    }

    loadConversations();
  }, [embedId, startDate, endDate, offset, t]);

  if (loading) {
    return <div className="text-white">{t("common.loading")}</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="text-white/60 text-center py-8">
        {t("embed-analytics.no-conversations")}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-white text-xl mb-4">
        {t("embed-analytics.conversations-title")} ({totalCount || conversations.length})
      </h3>

      <div className="space-y-4">
        {conversations.map((conv) => (
          <ConversationCard
            key={conv.session_id}
            conversation={conv}
            embedId={embedId}
          />
        ))}
      </div>

      {totalCount > 0 && (
        <Pagination
          currentPage={offset / ITEMS_PER_PAGE}
          totalPages={Math.ceil(totalCount / ITEMS_PER_PAGE)}
          onPageChange={(page) => setOffset(page * ITEMS_PER_PAGE)}
          totalItems={totalCount}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
}

function ConversationCard({ conversation, embedId }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);

  const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
  const isNew = Date.now() - conversation.started_at < FOUR_HOURS_MS;

  const handleToggle = async () => {
    if (!expanded && !messages) {
      setLoading(true);
      const { success, messages: data } = await Embed.getConversationDetails(
        embedId,
        conversation.session_id
      );

      if (success) {
        setMessages(data || []);
      } else {
        showToast(t("embed-analytics.load-error"), "error");
      }
      setLoading(false);
    }
    setExpanded(!expanded);
  };

  const handleCopyConversationId = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(conversation.conversation_id);
    showToast("Konversations-ID kopiert", "success");
  };

  return (
    <div className="border border-white/10 light:border-gray-200 rounded-lg bg-theme-bg-primary hover:border-white/20 light:hover:border-gray-400 transition-all">
      {/* Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {/* Workspace Name */}
              <h3 className="text-sm font-semibold text-white truncate">
                {conversation.workspace || `Embed #${embedId}`}
              </h3>
              {/* NEU Badge */}
              {isNew && (
                <span className="px-2 py-0.5 text-xs font-bold bg-green-500/20 text-green-400 rounded border border-green-500/30">
                  NEU
                </span>
              )}
            </div>

            {/* Preview */}
            <p className="text-xs text-theme-text-secondary mb-3 line-clamp-2">
              {conversation.preview || "Keine Vorschau verfügbar"}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-theme-text-secondary">
              <span>
                Erstellt: {formatDateTimeDE(conversation.started_at)}
              </span>
              <span>•</span>
              <span>
                Letzte Nachricht: {timeAgo(conversation.last_message_at)}
              </span>
              <span>•</span>
              <span>
                {conversation.message_count} {conversation.message_count === 1 ? "Nachricht" : "Nachrichten"}
              </span>
            </div>
          </div>

          {/* Right side: Conversation ID Badge + Expand Icon */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Conversation ID Badge */}
            <div
              className="flex items-center gap-2 bg-theme-settings-input-bg px-2 py-1 rounded border border-white/10 light:border-gray-300"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-theme-text-secondary text-[10px] font-semibold uppercase">
                ID:
              </span>
              <span className="text-theme-text-primary text-[10px] font-mono">
                {conversation.conversation_id}
              </span>
              <button
                onClick={handleCopyConversationId}
                className="text-theme-text-secondary hover:text-theme-text-primary transition-colors p-0.5 hover:bg-white/10 light:hover:bg-gray-200 rounded flex-shrink-0"
                title="Konversations-ID kopieren"
              >
                <Copy size={12} weight="bold" />
              </button>
            </div>

            {/* Expand Icon */}
            {expanded ? (
              <CaretUp size={20} className="text-theme-text-secondary" />
            ) : (
              <CaretDown size={20} className="text-theme-text-secondary" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Messages */}
      {expanded && (
        <div className="border-t border-white/10 light:border-gray-200 p-6 bg-theme-bg-secondary">
          {loading ? (
            <div className="text-center py-4 text-theme-text-secondary text-sm">
              {t("common.loading")}
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="space-y-5">
              {messages.map((msg, idx) => (
                <div key={msg.id}>
                  {/* User Message */}
                  <div className="bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-lg mb-3 light:bg-blue-100 light:border-blue-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User size={18} weight="fill" className="text-blue-400 light:text-blue-600" />
                        <h5 className="text-blue-300 text-sm font-bold uppercase light:text-blue-700">
                          {t("embed-analytics.request")}
                        </h5>
                      </div>
                      <span className="text-blue-300/60 text-xs font-mono light:text-blue-600/70">
                        {formatDateTimeDE(msg.createdAt)}
                      </span>
                    </div>
                    <p className="text-theme-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.prompt}
                    </p>
                  </div>

                  {/* Bot Response */}
                  <div className="bg-gray-800/20 border-l-4 border-gray-500 p-4 rounded-lg light:bg-gray-100 light:border-gray-400">
                    <div className="flex items-center gap-2 mb-2">
                      <ChatCircle size={18} weight="fill" className="text-gray-400 light:text-gray-600" />
                      <h5 className="text-gray-300 text-sm font-bold uppercase light:text-gray-700">
                        {t("embed-analytics.response")}
                      </h5>
                    </div>
                    <div className="text-theme-text-primary text-sm leading-relaxed prose prose-sm max-w-none analytics-bot-response">
                      <MarkdownRenderer
                        content={(() => {
                          try {
                            const parsed = JSON.parse(msg.response);
                            return parsed?.text || msg.response;
                          } catch {
                            return msg.response;
                          }
                        })()}
                      />
                    </div>
                  </div>

                  {idx < messages.length - 1 && (
                    <div className="h-0.5 bg-white/20 my-5 light:bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-theme-text-secondary text-sm">
              Keine Nachrichten gefunden
            </div>
          )}
        </div>
      )}
    </div>
  );
}
