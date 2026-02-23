# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AnythingLLM (Kufer Fork) - Eine erweiterte Version von AnythingLLM mit zusätzlichen Features für deutsche Kunden und Bildungseinrichtungen.

## Coding Standards

### Datumsformatierung
Alle Zeitstempel müssen im deutschen Format angezeigt werden:
- **Format**: `DD.MM.YYYY, HH:MM:SS Uhr` (z.B. "23.04.2025, 12:30:57 Uhr")
- **Zentrale Funktion**: `formatDateTimeDE()` in `frontend/src/utils/directories.js`
- **Verwendung**:
  ```javascript
  import { formatDateTimeDE } from "@/utils/directories";
  // Verwendung: formatDateTimeDE(isoTimestamp)
  ```
- **Wichtig**: Niemals ISO-Zeitstempel (`2025-04-23T12:30:57.634Z`) direkt anzeigen!

### Sprache
- UI-Texte: Deutsch bevorzugt für kundenrelevante Bereiche
- Code-Kommentare: Englisch oder Deutsch
- Bestätigungsdialoge: Deutsch

### Textnachrichten
- TTS-Normalizer für bessere Sprachausgabe beachten
- Deutsche Zahlenformate (Tausender mit Punkt, Dezimal mit Komma)

## Directory Structure

```
/frontend          - React Frontend (Vite)
/server            - Express.js Backend
/docker            - Docker Konfigurationen
/collector         - Dokument-Collector Service
```

## Development Commands

### Frontend
```bash
cd frontend
yarn dev          # Development Server
yarn build        # Production Build
```

### Server
```bash
cd server
yarn dev          # Development mit Nodemon
yarn start        # Production Start
```

## Database

- SQLite mit Prisma ORM
- Migrations: `cd server && npx prisma migrate dev`

## Key Features (Kufer Fork)

- Workspace-basierte Chat-Organisation
- Multi-User Support mit Rollen (Admin, Manager, User)
- TTS/STT Integration mit deutschen Stimmen
- Embed Widget für Website-Integration
- Billing/Usage Tracking pro Workspace
- Deutsche Datumsformate überall

## Coding Standards (beim Schreiben)

### Backend (Node.js/Express/Prisma)

- ✅ JSDoc-Kommentare für öffentliche Funktionen
- ✅ Try-catch mit `console.error()` bei Fehlern
- ✅ `Number()` für ID-Konvertierungen
- ✅ `Prisma.sql` für SQL-Injection-Schutz
- ✅ `validatedRequest` + `flexUserRoleValid` Middleware
- ⚠️ N+1 Queries vermeiden (findMany mit `in`)
- ⚠️ `include: true` Filter für DSGVO

### Frontend (React/Vite/Tailwind)

- ✅ `useTranslation()` - keine hardcoded Strings!
- ✅ `formatDateTimeDE()` - nie ISO-Format direkt!
- ✅ `toLocaleString("de-DE")` für Zahlen
- ✅ `showToast()` für User-Feedback
- ✅ Loading States + Empty States
- ✅ Error-Handling mit Fallbacks (`|| []`)
- ✅ Alle Dependencies in useEffect
- ✅ Theme-Variablen (`bg-theme-*`)
- ✅ Responsive (`md:`, `lg:`)

### Pre-Commit

**Claude ruft automatisch `/review-code` auf vor jedem Commit!**

Details in: `.claude/skills/review-code.md`

## Windows-Pfade (WSL)

Wenn der User Windows-Pfade wie `C:\Users\CA\Pictures\...` einfügt, immer automatisch in WSL-Pfade umwandeln:
- `C:\Users\...` → `/mnt/c/Users/...`
- `D:\Projekte\...` → `/mnt/d/Projekte/...`
- Backslashes `\` → Forward-Slashes `/`

## Screenshot-Referenzen & Skizzen

Wenn der User sagt "siehe g25", ist der Pfad immer:
- `/mnt/c/Users/CA/Pictures/Screenshots/g25.png`

Excalidraw-Exports immer ablegen unter:
- Basispfad: `/mnt/c/Users/CA/Pictures/Skizzen/`
- Unterordner pro Projekt, z.B. `Datumspicker-Konversationen/`
- Beide Formate exportieren: `.excalidraw` (editierbar) + `.png` (Vorschau)
- Benennung: beschreibender Name, z.B. `Kalender-Popover.excalidraw` + `Kalender-Popover.png`

## Related Projects

- `anythingllm-embed/` - Embed Chat Widget (Submodul)
- Deployment via Docker oder direkt auf Server
