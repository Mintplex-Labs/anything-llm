# Changelog - AnythingLLM (Kufer Fork)

Alle wichtigen Änderungen am AnythingLLM Server werden hier dokumentiert.

## [4.1.0] - 2026-02-23

### 📅 DateRange-Picker für Analytics Dashboard

**Problem gelöst:** Die bisherigen Zeitfilter ("Letzte Woche", "Letzter Monat", "Gesamt") waren **rollende Zeitfenster** - "Letzter Monat" änderte sich buchstäblich jede Stunde. Systematisches Abarbeiten (z.B. alle Konversationen vom Januar) war damit unmöglich.

#### Hinzugefügt

- **📅 DateRangePicker-Komponente** (`frontend/src/components/DateRangePicker/index.jsx`)
  - Chatbase-inspiriertes Design: Trigger-Button mit Kalender-Icon + Datumsbereich-Text
  - Popover mit Preset-Dropdown + Dual-Kalender (2 Monate nebeneinander)
  - "Anwenden"-Button für manuelle Kalenderauswahl
  - Click-outside schließt Popover ohne Änderung
  - Library: `react-day-picker` v9 mit deutscher Locale

- **🗓️ Feste Kalender-Presets** (keine rollenden Fenster mehr!):
  - Heute, Gestern, Diese Woche (ab Montag!), Dieser Monat, Letzter Monat, Gesamt
  - "Dieser Monat" = 1. bis heute, "Letzter Monat" = voller Vormonat

- **🎨 Theme-Overrides** für react-day-picker (Dark + Light Mode)
  - CSS-Variablen nutzen bestehende `--theme-*` Farben
  - Ausgewählte Range in Theme-Akzentfarbe

- **🌍 Translations**: Neue `date-picker.*` Keys (DE + EN)

- **📋 Browser-Testanweisung** (`BROWSER-TEST-DATEPICKER.md`): 15 GUI-Testfälle

#### Geändert

- **EmbedAnalyticsView**: State von `dateRange: "week"|"month"|"all"` auf `startDate/endDate` (Date-Objekte) umgebaut
  - `getDateRange()` Funktion entfernt
  - ISO-Strings als stabile useEffect-Dependencies
  - Default: "Dieser Monat" statt "Letzte Woche"

- **ConversationList**: Props von `dateRange`/`getDateRange` auf `startDate`/`endDate` (ISO-Strings) umgestellt
  - Pagination resettet auf Seite 1 bei Datumswechsel

- **CLAUDE.md**: Screenshot-Referenz-Pfade und Excalidraw-Export-Konventionen hinzugefügt

#### Entfernt

- Alte Translation-Keys `embed-analytics.last-week` und `embed-analytics.last-month`
- `getDateRange()` Funktion (ersetzt durch DateRangePicker-Presets)

#### Geänderte Dateien

| Datei | Aktion |
|-------|--------|
| `frontend/src/components/DateRangePicker/index.jsx` | **NEU** |
| `frontend/src/pages/.../EmbedAnalytics/index.jsx` | State-Umbau |
| `frontend/src/pages/.../EmbedAnalytics/ConversationList.jsx` | Props-Anpassung |
| `frontend/src/locales/de/common.js` | Translations |
| `frontend/src/locales/en/common.js` | Translations |
| `frontend/src/index.css` | CSS-Overrides |
| `frontend/package.json` | react-day-picker |
| `CLAUDE.md` | Konventionen |

---

## [4.0.0] - 2026-02-22

### 📊 Analytics Edition - Enhanced Metrics & Pagination

---

## [2.9.0] - 2026-02-22

### 🎯 Conversation ID Tracking & RAG Context Fix (Major Feature)

**Problem gelöst:** RAG Context enthielt vorher ALLE Nachrichten einer Session (auch aus alten Besuchen). Jetzt enthält der Context nur noch Nachrichten der AKTUELLEN Konversation.

#### Hinzugefügt

**Backend:**
- **📊 Conversation ID System**: Neues Feld `conversation_id` in `embed_chats` (UUID v4)
  - Database Migration: Automatische Backfill aller 27 bestehenden Chats mit `conversation_id = session_id`
  - Index auf `conversation_id` für Performance
  - Backwards kompatibel: Alte Chats ohne `conversation_id` funktionieren weiter

- **🎯 RAG Context Fix**: Backend nutzt jetzt `conversation_id` statt `session_id` für History-Retrieval
  - `recentEmbedChatHistory()` filtert nach Konversation statt Session
  - `forEmbedByUser()` unterstützt beide Identifier-Typen ('session_id' / 'conversation_id')
  - **Resultat:** Alte, irrelevante Nachrichten erscheinen nicht mehr im RAG Context!

- **🔌 Neue API-Endpunkte**:
  - `POST /embed/chats/conversations` - Globale Konversations-Liste (gruppiert nach conversation_id)
  - Workspace-Filtering für Rollen-basierte Zugriffskontrolle
  - Pagination Support (offset, limit)

**Frontend (Admin-UI):**
- **🗂️ Konversations-Gruppierung**: Neue Karten-Ansicht statt Flat-Liste
  - Jede Konversation als eigene Karte mit Preview-Text (erste Nachricht, 100 Zeichen)
  - Workspace-Name prominent angezeigt
  - Nachrichtenanzahl pro Konversation

- **🆕 "NEU" Badge**: Grüner Badge für Konversationen mit letzter Nachricht <1 Stunde
  - Badge-Style: `🆕 NEU` mit grünem Hintergrund & Border
  - Automatische Anzeige basierend auf `last_message_at` Timestamp

- **📅 Beide Zeitstempel**:
  - "Erstellt: DD.MM.YYYY, HH:MM:SS Uhr" (absolutes Datum)
  - "Letzte Nachricht: vor X Minuten/Stunden/Tagen" (relative Zeit)
  - Deutsche Formatierung: `formatDateTimeDE()` + `timeAgo()` Funktion

- **🔽 Expandable Details**: Klick auf Karte lädt alle Nachrichten der Konversation
  - User-Prompts & AI-Antworten chronologisch
  - Zeitstempel pro Nachricht
  - Collapse beim 2. Klick

**Widget (Embed):**
- **🎲 UUID v4 Generation**: Widget generiert conversation_id client-seitig
  - Hook: `useConversationId()` mit LocalStorage-Persistenz
  - Format: RFC 4122 UUID v4 (z.B. `f47ac10b-58cc-4372-a567-0e02b2c3d479`)
  - Nicht mehr: `Date.now() + Math.random()` (collision-unsafe)

- **🔄 Reset-Funktionalität**: "Clear Chat" generiert neue conversation_id
  - `resetConversationId()` löscht alte ID aus LocalStorage
  - Neue UUID wird generiert und gespeichert
  - Nächste Nachricht startet neue Konversation (eigener RAG Context!)

- **📤 Backend-Integration**: conversation_id wird an Backend gesendet
  - `ChatService.streamChat()` sendet `conversationId` Parameter
  - `ChatService.resetEmbedChatSession()` nutzt `conversationId` Query-Param
  - Fallback: Wenn Widget keine `conversationId` sendet → `conversationId = sessionId`

#### Geändert

- **Admin-UI**: Tab "Verlauf" zeigt jetzt gruppierte Konversationen (vorher: Flat-Liste aller Chats)
- **Database Query**: RAG Context Query nutzt `WHERE conversation_id = ?` statt `WHERE session_id = ?`
- **Widget Build**: Neu gebaut mit conversation_id Support (70% rewrite des minified JS)

#### Behoben

- **🐛 JSON-Parse-Fehler**: `safeJsonParse()` statt `JSON.parse()` in Konversations-Details
  - Problem: Alte Test-Daten hatten Plain-Text statt JSON im `response` Feld
  - Lösung: Fallback zu Plain-Text wenn JSON-Parse fehlschlägt

- **RAG Context Pollution**: Alte Nachrichten aus früheren Besuchen erscheinen nicht mehr im Context
  - Beispiel vorher: User besucht Seite am 01.01. ("Kontoeröffnung", 3 Nachrichten) + am 01.06. ("Öffnungszeiten", 2 Nachrichten) → RAG Context für 2. Frage enthielt ALLE 5 Nachrichten
  - Beispiel nachher: RAG Context für 2. Frage enthält nur 2 relevante Nachrichten

#### Technische Details

**Geänderte/Neue Dateien:**
- Backend: 4 Dateien (`schema.prisma`, `embedChats.js`, `embedManagement.js`, `embed.js`)
- Frontend: 4 Dateien (`embed.js`, `EmbedChats/index.jsx`, Translations)
- Widget: 8 Dateien (`useConversationId.js`, `chatService.js`, `App.jsx`, Header, ChatContainer, etc.)

**Database Migration:**
```sql
-- 20260222024816_add_conversation_id_to_embed_chats
ALTER TABLE embed_chats ADD COLUMN conversation_id TEXT;
UPDATE embed_chats SET conversation_id = session_id WHERE conversation_id IS NULL;
CREATE INDEX idx_embed_chats_conversation_id ON embed_chats(conversation_id);
```

**Tests:**
- ✅ E2E-Test: Widget → Backend → Database → Admin-UI
- ✅ RAG Context verifiziert: Konversationen getrennt (nur aktuelle Nachrichten im Context)
- ✅ UI-Tests: Karten, Badge, Expand, Zeitstempel (19/19 Features funktionieren)
- ✅ Browser-Test mit Claude Browser Tool (alle Checks bestanden)

#### Roadmap

- **Phase 1** (✅ ABGESCHLOSSEN): Conversation ID Tracking & RAG Context Fix
- **Phase 2** (📋 GEPLANT Q2 2026): LLM-basierte Analytics
  - Häufigste Fragen (Embeddings + Clustering)
  - Sentiment-Analyse pro Konversation
  - Problematische Nachrichten (Moderation API)
- **Phase 3** (🔮 ZUKUNFT Q3 2026): Advanced Features
  - Automatische FAQ-Generierung
  - Response-Quality-Scoring
  - Predictive Analytics (Lead Scoring, Churn-Risk)

Siehe `ROADMAP.md` für Details.

---

## [2.8.2] - 2025-01-30

### Verbessert
- **📅 Einheitliche deutsche Datumsformatierung**: Alle Zeitstempel werden jetzt im Format "DD.MM.YYYY, HH:MM:SS Uhr" angezeigt
  - Neue zentrale Funktion `formatDateTimeDE()` in `utils/directories.js`
  - Angewendet auf: Instance Workspaces, Users, Invitations, API Keys, Chats, Embed Chat History
  - Vorher: `2025-04-23T12:30:57.634Z` → Nachher: `23.04.2025, 12:30:57 Uhr`

---

## [2.8.1] - 2025-12-13

### Verbessert
- **🔒 Passwort-Bestätigung im Admin-Panel**: EditUserModal verlangt jetzt Bestätigung des neuen Passworts
  - Neues "Confirm Password" Feld verhindert Tippfehler beim Setzen von Kundenpasswörtern
  - Fehlermeldung "Passwords do not match" bei unterschiedlichen Eingaben
  - Submit wird blockiert bis beide Passwörter übereinstimmen

---

## [2.8.0] - 2024-12-11

### Hinzugefügt
- **🌍 Unicode-Spracherkennung**: Erkennt Arabisch, Hebräisch, Chinesisch, Japanisch, Koreanisch, Russisch, Griechisch, Thai, Hindi, Bengali direkt via Unicode-Ranges
  - `franc-min` versagt bei nicht-lateinischen Schriften
  - Unicode-Erkennung ist deterministisch und schneller
  - Fallback zu `franc-min` nur für lateinische Sprachen

- **🎵 Audio-Format Auto-Detection**: TTS-Endpoint erkennt Format via Magic Bytes
  - RIFF → WAV, OggS → OGG, fLaC → FLAC, sonst MP3
  - Korrekter Content-Type Header für alle Formate

### Geändert
- **STT Native FormData**: `form-data` Package durch native `FormData + Blob` ersetzt
  - `form-data` funktionierte nicht mit native `fetch()`
  - Behebt "multipart: NextPart: EOF" Fehler bei Groq

### Behoben
- **STT Endpoint**: Korrekte Filename-Ableitung aus Mimetype für Groq Whisper

---

## [2.7.0] - 2024-12-10

### Hinzugefügt
- **🎤 Embed Audio Endpoints**: Neue Server-Endpoints für Embed Widget STT/TTS
  - `GET /embed/:embedId/audio/status` - Prüft ob STT/TTS konfiguriert
  - `POST /embed/:embedId/audio/tts` - Text-to-Speech für Embed
  - Validiert embedId, keine User-Auth nötig

- **Frontend STT Verbesserungen**:
  - Server-STT Provider-Erkennung
  - Tooltip zeigt `[Server]` statt `[Groq]` an

### Geändert
- **TTS Normalizer**: Jetzt für ALLE TTS-Provider aktiv (OpenAI, ElevenLabs, Generic)
- **Kursnummern-Erkennung**: Universelles Pattern `[A-Z]{1,2}\d{4,5}[A-Z]?` für alle Sprachen

### Behoben
- **isTTSConfigured()**: Fehlende Funktion für Embed Audio Status Endpoint hinzugefügt

---

## [2.6.0] - 2024-12-09

### Hinzugefügt
- **TTS Text Normalizer**: Multilingualer Normalizer für bessere Sprachausgabe
  - Deutsche Zahlen (Tausender, Dezimal, Uhrzeiten)
  - Englische AM/PM Zeiten
  - Abkürzungen, Währungen, Einheiten
  - URL-Cleaning und Whitespace-Normalisierung

- **Stimmen für openedai-speech/Piper**:
  - 30+ Sprachen mit hochwertigen ONNX-Voices
  - Absolute Pfade in voice_to_speaker.yaml

### Behoben
- Ukrainische Stimme funktioniert jetzt korrekt (Pfad-Problem)
- Broken Voice Downloads (nl, pl, pt, kk, ml, sw, ne)

---

## [2.5.0] - 2024-12-XX

### Bestehende Features
- AnythingLLM Server mit Workspace-Chat
- RAG (Retrieval Augmented Generation)
- Multi-User Support
- Embed Widget Support
- TTS/STT Provider Integration
