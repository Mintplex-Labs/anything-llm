# Browser-Test: DateRange-Picker im Analytics Dashboard

## Voraussetzungen

- Frontend läuft auf `http://localhost:3000`
- Backend läuft auf `http://localhost:3001`
- Eingeloggt als Admin
- Mindestens ein Embed mit vielen Konversationen vorhanden

## Navigation

1. Öffne `http://localhost:3000/settings/embed-chat-widgets`
2. Klicke links auf **"Konversationen (neu)"** (dritter Eintrag in der Liste)
3. Das Analytics Dashboard sollte laden

---

## Testfall 1: Trigger-Button Erscheinungsbild

**Aktion:** Dashboard ist geladen, schaue auf den Header-Bereich oben rechts.

**Erwartung:**
- Neben dem Embed-Selector (`Embed #X (Workspace)`) ist ein Button mit Kalender-Icon
- Der Button zeigt das aktuelle Datum im Format `📅 01.02.2026 - 23.02.2026` (1. des Monats bis heute)
- Standard-Preset ist "Dieser Monat"
- Mache einen Screenshot

---

## Testfall 2: Popover öffnen

**Aktion:** Klicke auf den DateRange-Button.

**Erwartung:**
- Ein Popover öffnet sich unterhalb des Buttons, rechts ausgerichtet
- Oben im Popover: ein Dropdown-Button mit Text "Dieser Monat"
- Darunter: ein Dual-Kalender mit 2 Monaten nebeneinander (vorheriger Monat + aktueller Monat)
- Unten rechts: ein "Anwenden"-Button
- Der aktuelle Zeitraum (1. bis heute) ist im Kalender blau markiert
- Mache einen Screenshot

---

## Testfall 3: Preset-Dropdown öffnen

**Aktion:** Klicke im geöffneten Popover auf den Dropdown-Button "Dieser Monat".

**Erwartung:**
- Eine Liste erscheint mit 6 Optionen:
  - Heute
  - Gestern
  - Diese Woche
  - Dieser Monat (mit Häkchen markiert, da aktiv)
  - Letzter Monat
  - Gesamt
- Mache einen Screenshot

---

## Testfall 4: Preset "Heute" auswählen

**Aktion:** Klicke auf "Heute" im Preset-Dropdown.

**Erwartung:**
- Popover schließt sofort
- Trigger-Button zeigt: `📅 23.02.2026 - 23.02.2026` (heutiges Datum zweimal)
- Die Konversationsliste und Statistiken aktualisieren sich
- Nur Konversationen von heute werden angezeigt
- Mache einen Screenshot

---

## Testfall 5: Preset "Letzter Monat" auswählen

**Aktion:** Öffne den Picker erneut → Preset-Dropdown → "Letzter Monat"

**Erwartung:**
- Popover schließt sofort
- Trigger-Button zeigt: `📅 01.01.2026 - 31.01.2026`
- Konversationsliste zeigt nur Januar-Konversationen
- Mache einen Screenshot

---

## Testfall 6: Preset "Gesamt" auswählen

**Aktion:** Öffne den Picker erneut → Preset-Dropdown → "Gesamt"

**Erwartung:**
- Popover schließt sofort
- Trigger-Button zeigt: `Gesamt`
- Alle Konversationen werden angezeigt (keine Datumsfilterung)
- Statistiken zeigen die Gesamtzahlen
- Mache einen Screenshot

---

## Testfall 7: Kalender-Range manuell auswählen (18. - 23. Februar)

**Aktion:**
1. Öffne den Picker (Klick auf Button)
2. Im Kalender: Klicke auf den **18. Februar**
3. Klicke auf den **23. Februar**
4. Klicke auf den **"Anwenden"**-Button

**Erwartung:**
- Nach Klick auf 18.: Der Tag wird blau markiert als Start
- Nach Klick auf 23.: Die Range 18.-23. wird blau markiert (Start + Ende + Mitte)
- Der Preset-Dropdown zeigt "Zeitraum wählen" (kein Preset aktiv)
- Nach "Anwenden": Popover schließt, Button zeigt `📅 18.02.2026 - 23.02.2026`
- Nur Konversationen aus diesem Zeitraum werden geladen
- Mache einen Screenshot nach jedem Schritt

---

## Testfall 8: Kalender-Navigation (Monat vor/zurück)

**Aktion:** Öffne den Picker, klicke im Kalender auf den Pfeil nach links (vorheriger Monat).

**Erwartung:**
- Die beiden Kalendermonate verschieben sich um einen Monat zurück
- Navigation funktioniert flüssig
- Mache einen Screenshot

---

## Testfall 9: Zukunft ist deaktiviert

**Aktion:** Öffne den Picker und versuche, einen Tag in der Zukunft zu klicken (z.B. 28. Februar oder März).

**Erwartung:**
- Zukünftige Tage sind ausgegraut und nicht klickbar
- Nur Tage bis einschließlich heute sind wählbar

---

## Testfall 10: Klick außerhalb schließt Popover

**Aktion:** Öffne den Picker, wähle im Kalender einen Tag aus (aber klicke NICHT auf "Anwenden"). Klicke dann irgendwo außerhalb des Popovers.

**Erwartung:**
- Popover schließt sich
- Der vorherige Zeitraum bleibt unverändert (die Kalender-Auswahl wird verworfen)
- Der Trigger-Button zeigt weiterhin den alten Zeitraum

---

## Testfall 11: Pagination reset bei Datumswechsel

**Aktion:**
1. Wähle "Gesamt" (alle Konversationen)
2. Scrolle nach unten zur Pagination
3. Navigiere zu Seite 2 oder 3
4. Öffne den Picker und wähle "Dieser Monat"

**Erwartung:**
- Nach Datumswechsel: Pagination springt zurück auf Seite 1
- Die Konversationsliste zeigt die ersten Ergebnisse des neuen Zeitraums

---

## Testfall 12: Embed-Wechsel behält Datum

**Aktion:**
1. Wähle einen bestimmten Zeitraum (z.B. "Letzter Monat")
2. Wechsle den Embed über den Embed-Selector

**Erwartung:**
- Der Zeitraum bleibt erhalten
- Statistiken und Konversationen laden für den neuen Embed mit dem gleichen Zeitraum
- Pagination resettet auf Seite 1

---

## Testfall 13: Dark Mode Darstellung

**Aktion:** Stelle sicher, dass der Dark Mode aktiv ist. Öffne den Picker.

**Erwartung:**
- Popover-Hintergrund ist dunkel (theme-bg-secondary)
- Text ist hell/weiß
- Kalender-Tage sind gut lesbar
- Ausgewählte Range ist blau hervorgehoben
- Mache einen Screenshot

---

## Testfall 14: Light Mode Darstellung

**Aktion:** Wechsle in den Light Mode (Einstellungen → UI-Einstellungen → Farbschema). Öffne den Picker.

**Erwartung:**
- Popover-Hintergrund ist hell
- Text ist dunkel
- Kalender-Tage sind gut lesbar
- Ausgewählte Range ist blau hervorgehoben
- Kein "weißer Text auf weißem Hintergrund" Problem
- Mache einen Screenshot

---

## Testfall 15: Preset "Diese Woche" - Deutsche Konvention

**Aktion:** Öffne den Picker → "Diese Woche"

**Erwartung:**
- Der Start ist der **Montag** dieser Woche (NICHT Sonntag!)
- Trigger-Button zeigt: `📅 [Montag-Datum] - [Heute-Datum]`
- Konversationen ab Montag bis heute werden angezeigt

---

## Zusammenfassung der Screenshots

Bitte mache Screenshots bei folgenden Testfällen und benenne sie:
1. `test01-trigger-button.png` - Button im Header
2. `test02-popover-open.png` - Geöffnetes Popover mit Kalender
3. `test03-preset-dropdown.png` - Preset-Dropdown offen
4. `test04-preset-today.png` - Nach "Heute" Auswahl
5. `test05-preset-last-month.png` - Nach "Letzter Monat" Auswahl
6. `test06-preset-all.png` - Nach "Gesamt" Auswahl
7. `test07-manual-range.png` - Manuell gewählter Zeitraum 18.-23.
8. `test13-dark-mode.png` - Picker im Dark Mode
9. `test14-light-mode.png` - Picker im Light Mode

Speichere alle Screenshots nach: `C:\Users\CA\Pictures\Screenshots\datepicker-tests\`
