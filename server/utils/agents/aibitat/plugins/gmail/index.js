// Get Inbox & Search
const { GmailGetInbox } = require("./search/gmail-get-inbox.js");
const { GmailSearch } = require("./search/gmail-search.js");
const { GmailReadThread } = require("./search/gmail-read-thread.js");

// Drafts
const { GmailCreateDraft } = require("./drafts/gmail-create-draft.js");
const {
  GmailCreateDraftReply,
} = require("./drafts/gmail-create-draft-reply.js");
const { GmailUpdateDraft } = require("./drafts/gmail-update-draft.js");
const { GmailGetDraft } = require("./drafts/gmail-get-draft.js");
const { GmailListDrafts } = require("./drafts/gmail-list-drafts.js");
const { GmailDeleteDraft } = require("./drafts/gmail-delete-draft.js");
const { GmailSendDraft } = require("./drafts/gmail-send-draft.js");

// Send & Reply
const { GmailSendEmail } = require("./send/gmail-send-email.js");
const { GmailReplyToThread } = require("./send/gmail-reply-to-thread.js");

// Thread Management
const { GmailMarkRead } = require("./threads/gmail-mark-read.js");
const { GmailMarkUnread } = require("./threads/gmail-mark-unread.js");
const { GmailMoveToTrash } = require("./threads/gmail-move-to-trash.js");
const { GmailMoveToArchive } = require("./threads/gmail-move-to-archive.js");
const { GmailMoveToInbox } = require("./threads/gmail-move-to-inbox.js");

// Account
const {
  GmailGetMailboxStats,
} = require("./account/gmail-get-mailbox-stats.js");

const gmailAgent = {
  name: "gmail-agent",
  startupConfig: {
    params: {},
  },
  plugin: [
    // Alias for easy access to the inbox
    GmailGetInbox,

    // Search & Read (read-only)
    GmailSearch,
    GmailReadThread,

    // Drafts (modifying)
    GmailCreateDraft,
    GmailCreateDraftReply,
    GmailUpdateDraft,
    GmailGetDraft,
    GmailListDrafts,
    GmailDeleteDraft,
    GmailSendDraft,

    // Send & Reply (modifying)
    GmailSendEmail,
    GmailReplyToThread,

    // Thread Management (modifying)
    GmailMarkRead,
    GmailMarkUnread,
    GmailMoveToTrash,
    GmailMoveToArchive,
    GmailMoveToInbox,

    // Account (read-only)
    GmailGetMailboxStats,
  ],
};

module.exports = {
  gmailAgent,
};
