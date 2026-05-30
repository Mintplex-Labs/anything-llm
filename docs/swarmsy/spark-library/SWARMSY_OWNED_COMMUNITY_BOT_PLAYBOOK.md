# SWARMSY Owned Community Bot Playbook

**Doctrine:** Bots are staff, not fake fans.

## Allowed Bot Uses

- Telegram group helper bot
- Discord lore bot
- FAQ bot
- Quest/clue bot
- Community Moderator Bot
- Comment Draft Bot
- Campaign Reminder Bot
- Opt-in Newsletter Bot
- Proof Collector Bot
- Community Role Bot
- Customer Support Bot
- Game Leaderboard Bot

## Not Allowed

- fake followers
- fake comments
- fake reviews
- fake engagement
- spam posting
- botnets
- mass unsolicited DMs
- harassment
- impersonation
- platform evasion

## Bot Role Definitions

### Lore Keeper Bot
- **Purpose:** Serve canonical lore snippets and references.
- **Allowed behaviour:** Retrieve approved lore entries and citations.
- **Forbidden behaviour:** Invent lore as facts or claim fake events.
- **Example messages:** “Lore Log 03 is live: [link].”
- **Human review level:** Medium.
- **Data/privacy note:** Store only needed request logs.
- **Platform compliance note:** Respect API limits and disclosure rules.

### Quest Master Bot
- **Purpose:** Run clue paths and unlock logic.
- **Allowed behaviour:** Deliver timed clues and validate submissions.
- **Forbidden behaviour:** Manipulative dark patterns or forced sharing.
- **Example messages:** “Clue #2 unlocked. Solve before 20:00 UTC.”
- **Human review level:** High.
- **Data/privacy note:** Avoid collecting sensitive personal data.
- **Platform compliance note:** Keep quest participation opt-in.

### Drop Alert Bot
- **Purpose:** Notify opt-in users about releases.
- **Allowed behaviour:** Send scheduled release notifications.
- **Forbidden behaviour:** Mass unsolicited DMs.
- **Example messages:** “Drop goes live in 30 minutes. Details: [link].”
- **Human review level:** Low-Medium.
- **Data/privacy note:** Maintain clear consent and unsubscribe controls.
- **Platform compliance note:** Follow anti-spam requirements.

### Proof Collector Bot
- **Purpose:** Gather first-party proof artifacts.
- **Allowed behaviour:** Request screenshots, links, receipts, logs.
- **Forbidden behaviour:** Fabricating proof or editing evidence.
- **Example messages:** “Please upload timestamped proof for today’s campaign.”
- **Human review level:** High.
- **Data/privacy note:** Protect uploaded files and limit retention.
- **Platform compliance note:** Follow data handling and consent policies.

### FAQ Bot
- **Purpose:** Answer frequent community questions.
- **Allowed behaviour:** Reply with approved knowledge base answers.
- **Forbidden behaviour:** Legal/medical/financial advice beyond scope.
- **Example messages:** “Here is the verified policy summary: [link].”
- **Human review level:** Medium.
- **Data/privacy note:** Redact personal details in logs.
- **Platform compliance note:** Disclose automated response status if required.

### Community Moderator Bot
- **Purpose:** Assist moderation and safety enforcement.
- **Allowed behaviour:** Flag abusive content and apply rule-based actions.
- **Forbidden behaviour:** Harassment, bias amplification, stealth bans.
- **Example messages:** “Post removed: violates Rule 3 (harassment).”
- **Human review level:** Very High.
- **Data/privacy note:** Keep moderation audit trail.
- **Platform compliance note:** Follow platform moderation terms.

### Campaign Reminder Bot
- **Purpose:** Keep teams/community on campaign cadence.
- **Allowed behaviour:** Send opt-in reminders and deadlines.
- **Forbidden behaviour:** Nagging spam loops.
- **Example messages:** “Reminder: submit today’s proof before 18:00 UTC.”
- **Human review level:** Low.
- **Data/privacy note:** Store minimal scheduling metadata.
- **Platform compliance note:** Provide mute controls.

### Comment Draft Bot
- **Purpose:** Draft responses for human approval.
- **Allowed behaviour:** Suggest editable drafts only.
- **Forbidden behaviour:** Auto-posting as fake users.
- **Example messages:** “Draft reply ready. Approve/edit before posting.”
- **Human review level:** Very High.
- **Data/privacy note:** Do not store private drafts longer than needed.
- **Platform compliance note:** Human must post final comment.

### Telegram Group Helper Bot
- **Purpose:** Assist community management inside owned Telegram groups.
- **Allowed behaviour:** Deliver announcements, welcome new opt-in members, relay approved updates, and answer FAQs.
- **Forbidden behaviour:** Mass unsolicited DMs, scraping member data, impersonating admins, or sending unapproved content.
- **Example messages:** "Welcome to the group! Read the pinned rules: [link]."
- **Human review level:** Medium.
- **Data/privacy note:** Do not store member lists or private messages beyond operational need.
- **Platform compliance note:** Follow Telegram Bot API terms; disclose bot status in group description.

### Discord Lore Bot
- **Purpose:** Surface world-building and lore content inside owned Discord servers.
- **Allowed behaviour:** Respond to lore commands, post approved lore drops, and link canonical references.
- **Forbidden behaviour:** Inventing lore as facts, posting unvetted content, or acting as a real community member.
- **Example messages:** "Lore unlocked: Chapter 4 is now live — [link]."
- **Human review level:** Medium.
- **Data/privacy note:** Store only command interaction logs required for debugging.
- **Platform compliance note:** Follow Discord Developer Terms of Service and disclosure requirements.

### Quest/Clue Bot
- **Purpose:** Deliver timed clues and validate participant submissions in community quests.
- **Allowed behaviour:** Send unlocked clues on schedule, acknowledge valid submissions, and advance quest state.
- **Forbidden behaviour:** Manipulative dark patterns, forced sharing, collecting sensitive personal data, or faking completion records.
- **Example messages:** "Clue #3 is now live. Submit your answer before 20:00 UTC."
- **Human review level:** High.
- **Data/privacy note:** Collect only the data needed to track quest progress; delete after campaign ends.
- **Platform compliance note:** Keep participation opt-in and disclose automated nature of interactions.

### Opt-in Newsletter Bot
- **Purpose:** Send campaign, release, and content updates to subscribers who have explicitly opted in.
- **Allowed behaviour:** Send scheduled messages to consented subscribers and honour unsubscribe requests immediately.
- **Forbidden behaviour:** Adding non-consenting users, removing unsubscribers, or disguising automated messages as personal outreach.
- **Example messages:** "New drop alert for subscribers: [link]. Unsubscribe anytime: [link]."
- **Human review level:** Low-Medium.
- **Data/privacy note:** Maintain a clean consent log and honour deletion requests promptly.
- **Platform compliance note:** Comply with applicable anti-spam law (CAN-SPAM, GDPR, etc.) and platform messaging policies.

### Community Role Bot
- **Purpose:** Assign and manage community roles based on verified activity or proof.
- **Allowed behaviour:** Grant or update roles when predefined criteria are met and confirmed by a human reviewer or verified data source.
- **Forbidden behaviour:** Assigning roles based on fake proof, purchasing engagement, or bypassing verification.
- **Example messages:** "Role upgraded: you've reached Tier 2 based on verified campaign activity."
- **Human review level:** High.
- **Data/privacy note:** Store only role assignment records; do not log personal messages or private data.
- **Platform compliance note:** Follow platform permission and role management terms.

### Customer Support Bot
- **Purpose:** Handle first-line support queries and route complex issues to human agents.
- **Allowed behaviour:** Answer approved FAQ-level support questions, collect issue details, and escalate to a human when required.
- **Forbidden behaviour:** Legal, medical, or financial advice beyond scope; closing tickets without resolution; deceiving users about bot status.
- **Example messages:** "Thanks for reaching out. Here's the answer: [link]. Need more help? A team member will follow up."
- **Human review level:** High.
- **Data/privacy note:** Collect only the information needed to resolve the query; apply data minimisation.
- **Platform compliance note:** Disclose automated response status; follow consumer protection and platform terms.

### Game Leaderboard Bot
- **Purpose:** Post verified leaderboard updates and game standings in community channels.
- **Allowed behaviour:** Display ranked results from a verified data source and announce milestones on schedule.
- **Forbidden behaviour:** Manipulating scores, posting unverified standings, or shaming or targeting individual community members.
- **Example messages:** "Weekly leaderboard update: Top 5 are now posted — [link]."
- **Human review level:** Medium.
- **Data/privacy note:** Display only usernames or handles that participants have consented to publish publicly.
- **Platform compliance note:** Follow platform rules on automated posting frequency and disclosure.
