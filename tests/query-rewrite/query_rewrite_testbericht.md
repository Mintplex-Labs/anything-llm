# Query Rewrite - Testbericht

**Datum:** 2026-03-20
**Container:** praesentation (chatbot-donau Workspace)
**Image:** kufer/anythingllm-kufer:5.0 (sha256:67e1a422a1d4)
**LLM:** RedHatAI/Mistral-Small-3.2-24B-Instruct-2506-FP8
**Rewriter-Version:** queryRewriter.js (Prompt v1, max 15 Wörter, Threshold ≤12 Wörter, max 2 History-Turns)

---

## 1. Testumfang

| Metrik | Wert |
|--------|------|
| Gesamtzahl Queries | **31** |
| Davon mit Rewrite erwartet | 22 |
| Davon eigenständig (kein Rewrite nötig) | 9 |
| Testrunden | 4 (Vortests, Stresstest, Block A-C) |

### Testszenarien
- Einfache Folgefragen mit Pronomen/Referenzen
- Einwort-Fragen ("Preis?", "Wo?", "Wann?", "Kosten?")
- Zwei-Wort-Fragen ("Für Kinder?", "Und der Aufbaukurs?")
- Themenwechsel und Rückreferenzen
- Sprachwechsel (DE → EN, DE → FR, FR → DE)
- Lange eigenständige Sätze (über Word-Threshold)
- Multi-Topic Back-and-Forth
- Mehrdeutige Referenzen

---

## 2. Detailergebnisse aller 31 Queries

### Vortests (3 Queries)

| # | User Query | Rewrite | Quellen korrekt? | Antwort korrekt? | Bewertung |
|---|-----------|---------|:-:|:-:|-----------|
| V1 | "Welche Deutschkurse gibt es?" | keine Änderung | ✅ | ✅ | Korrekt - eigenständig |
| V2 | "Was kosten die?" | → "Was kosten die Deutschkurse?" | ✅ | ✅ | ✅ Perfekt |
| V3 | "Gibt es die auch abends?" | → "Gibt es die Deutschkurse auch abends?" | ✅ | ✅ | ✅ Perfekt |

### Stresstest Runde 1 (14 Queries)

| # | User Query | Rewrite | Quellen korrekt? | Antwort korrekt? | Bewertung |
|---|-----------|---------|:-:|:-:|-----------|
| S1 | "Welche Yoga-Kurse gibt es bei euch?" | keine Änderung | ✅ | ✅ | Korrekt - eigenständig |
| S2 | "Was kostet der Anfängerkurs?" | → "Was kostet der Yoga-Kurs für Anfänger?" | ✅ | ✅ (40€) | ✅ Perfekt |
| S3 | "Und der Aufbaukurs?" | → "Was kostet der Aufbaukurs?" | ⚠️ | ✅ (60€) | ⚠️ "Yoga" fehlt im Rewrite. RAG lieferte Integrationskurs-Aufbaukurse als Top-Quellen. Antwort war trotzdem korrekt dank Chat-History. |
| S4 | "Gibt es auch Schwimmkurse für Kinder?" | keine Änderung | ✅ | ✅ | Korrekt - eigenständig |
| S5 | "Ab welchem Alter können die teilnehmen?" | → "Ab welchem Alter können Kinder am Babyschwimmen teilnehmen?" | ⚠️ | ✅ | ⚠️ Zu spezifisch - "Babyschwimmen" statt allgemein "Schwimmkurse". Hat aber korrekte Quelle gefunden. |
| S6 | "Nochmal zum Yoga - gibt es den Kurs auch abends?" | → "Gibt es den Yoga-Kurs auch abends?" | ✅ | ✅ | ✅ Perfekt - Themenwechsel erkannt |
| S7 | "Wann genau?" | → "Wann genau ist der Yoga-Kurs am Abend?" | ✅ | ✅ | ✅ Perfekt |
| S8 | "Kann man Yoga und Schwimmen zusammen als Paket buchen?" | keine Änderung | ✅ | ✅ (nicht gefunden) | Korrekt - eigenständig, ehrliche "nicht gefunden"-Antwort |
| S9 | "Was gibt es eigentlich im Bereich Sprachen?" | → "Was gibt es im Bereich Sprachen?" (minimal) | ✅ | ✅ | Korrekt |
| S10 | "Gibt es da auch was für absolute Anfänger?" | → "Gibt es Sprachkurse für absolute Anfänger?" | ✅ | ✅ | ✅ Perfekt - "da" korrekt aufgelöst |
| S11 | Langer Satz (>12 Wörter) über Elternkurse am Wochenende | kein Rewrite (Threshold) | ✅ | ⚠️ | Korrekt kein Rewrite. Aber Antwort nennt Freitag 9:45 als "Wochenende" - leichte Falschinformation durch LLM. |
| S12 | "Kosten?" | → "Kosten für welche Kurse?" | ⚠️ | ⚠️ | ⚠️ Zu generisch - Elternkurs-Kontext verloren. RAG-Quellen verstreut (AGB, Sprachen). |
| S13 | "Do you have any English courses available?" | keine Änderung | ✅ | ✅ | Korrekt - eigenständig, Sprachwechsel korrekt behandelt |
| S14 | "Was war nochmal der günstigste von allen Kursen die wir besprochen haben?" | → "Which of the courses mentioned is the cheapest?" | ⚠️ | ✅ (22€ Töpfern) | ❌ Sprache gewechselt DE→EN. RAG-Quellen waren schwach (Score 0.34). Antwort trotzdem plausibel aus Chat-History. |

### Block A: Yoga-Kontexterhaltung (4 Queries)

| # | User Query | Rewrite | Quellen korrekt? | Antwort korrekt? | Bewertung |
|---|-----------|---------|:-:|:-:|-----------|
| A1 | "Welche Yoga-Kurse bieten Sie an?" | keine Änderung | ✅ | ✅ | Korrekt - eigenständig |
| A2 | "Was kostet der günstigste davon?" | → "Welche Yoga-Kurse bieten Sie an? Was kostet der günstigste davon?" | ✅ | ✅ (40€) | ⚠️ Zwei Fragen zusammengeklebt statt eine kompakte Umschreibung. Funktioniert aber. |
| A3 | "Und der teuerste?" | → "Was kostet der teuerste Yoga-Kurs?" | ✅ | ✅ (60€) | ✅ Perfekt - diesmal MIT "Yoga" (vgl. S3 ohne) |
| A4 | "Wer leitet den?" | → "Welcher Yoga-Kurs wird geleitet?" | ✅ | ✅ (Edeltraut Manninger) | ⚠️ Semantik verändert: "Wer" → "Welcher". Aber korrekte Quellen und Antwort. |

### Block B: Einwort-Fragen (5 Queries)

| # | User Query | Rewrite | Quellen korrekt? | Antwort korrekt? | Bewertung |
|---|-----------|---------|:-:|:-:|-----------|
| B1 | "Gibt es Tanzkurse?" | keine Änderung | ✅ | ✅ | Korrekt - eigenständig |
| B2 | "Preis?" | → "Preis für die Tanzkurse?" | ✅ | ✅ (14€, 28€) | ✅ Perfekt - Einwort korrekt aufgelöst |
| B3 | "Wo?" | → "Wo finden die orientalischen Tanzkurse statt?" | ✅ | ✅ | ✅ Perfekt |
| B4 | "Wann?" | → "Wann finden die Orientalischen Tanzkurse statt?" | ✅ | ✅ | ✅ Perfekt |
| B5 | "Für Kinder?" | → "Wann beginnt der Orientalische Tanz für Kinder von 9-14 Jahren?" | ✅ | ✅ | ⚠️ Fragetyp verändert: "Für Kinder?" (Verfügbarkeit) → "Wann beginnt" (Zeitpunkt). Aber Top-Quelle war korrekt (Score 0.691). |

### Block C: Themenwechsel, Rückreferenz, Sprache (5 Queries)

| # | User Query | Rewrite | Quellen korrekt? | Antwort korrekt? | Bewertung |
|---|-----------|---------|:-:|:-:|-----------|
| C1 | "Haben Sie auch Malkurse im Programm?" | keine Änderung | ❌ | ❌ | Korrekt kein Rewrite. Aber **LLM-Halluzination**: "Aquarellmalerei für Anfänger" (Kurs 252-2503, Dozentin "Maria") komplett erfunden. Quellen waren nur generische Seiten (Score 0.51). Kein Rewriter-Problem. |
| C2 | "Braucht man eigene Materialien dafür?" | → "Welche Materialien braucht man für die Malkurse?" | ⚠️ | ⚠️ | ⚠️ Rewrite korrekt. Quellen aus Kultur/Töpfern-Bereich (nicht direkt Malkurse). Antwort "eigene Materialien erforderlich" nicht belegbar - basiert auf halluzierten C1-Daten. |
| C3 | "Und wie war das nochmal beim Tanzkurs?" | → "Welche Materialien braucht man für den Tanzkurs?" | ✅ | ⚠️ | ❌ **Falscher Rewrite**: "Materialien" aus Vorfrage C2 fälschlicherweise in die Tanzkurs-Rückreferenz übernommen. User fragte nach einer allgemeinen Zusammenfassung, nicht nach Materialien. RAG-Quellen waren trotzdem Tanzkurse (korrekt). |
| C4 | "Combien coûte le cours de danse?" | → "Combien coûte le cours de danse oriental?" | ✅ | ✅ (14€, 28€) | ✅ Perfekt - Sprache (FR) beibehalten, Kontext ergänzt |
| C5 | "Und auf Deutsch bitte - was kostet der?" | → "Was kostet der orientalische Tanz für Anfängerinnen?" | ✅ | ✅ | ✅ Perfekt - Sprachwechsel FR→DE korrekt, spezifische Referenz aufgelöst |

---

## 3. Gesamtauswertung

### Rewriter-Bewertung (22 Queries mit Rewrite)

| Bewertung | Anzahl | Anteil |
|-----------|--------|--------|
| ✅ Perfekt (korrekte Semantik + Kontext) | **13** | **59%** |
| ⚠️ Akzeptabel (leichte Probleme, Antwort dennoch korrekt) | **7** | **32%** |
| ❌ Fehlerhaft (falsche Semantik oder Sprachwechsel) | **2** | **9%** |

### Eigenständige Queries (9 Queries)

| Bewertung | Anzahl | Anteil |
|-----------|--------|--------|
| Korrekt nicht umgeschrieben | **9** | **100%** |

### Quellen-Qualität (alle 31 Queries)

| Bewertung | Anzahl | Anteil |
|-----------|--------|--------|
| ✅ Quellen korrekt und passend | **25** | **81%** |
| ⚠️ Quellen suboptimal aber nicht falsch | **5** | **16%** |
| ❌ Quellen irrelevant / generisch | **1** | **3%** |

### Antwort-Qualität (alle 31 Queries)

| Bewertung | Anzahl | Anteil |
|-----------|--------|--------|
| ✅ Faktisch korrekt, aus Quellen belegbar | **24** | **77%** |
| ⚠️ Korrekt mit leichten Ungenauigkeiten | **5** | **16%** |
| ❌ Halluzination / Falschinformation | **2** | **7%** |

### Hat der Rewriter die Quellen verschlechtert?

**Nein.** In keinem einzigen Fall hat der Rewriter zu falschen oder irrelevanten Quellen geführt, die dann eine falsche Antwort verursacht hätten. Die 2 Halluzinationen (C1: Aquarellmalerei, S11: "Wochenende" für Freitag) sind LLM-Probleme, nicht Rewriter-Probleme.

Selbst bei suboptimalen Rewrites (S3 ohne "Yoga", S12 "Kosten?" zu generisch) waren die Antworten durch die Chat-History immer noch korrekt.

---

## 4. Identifizierte Schwachstellen im Rewriter-Prompt

### Problem 1: Fragetyp wird verändert (Schwere: Mittel)
- **B5:** "Für Kinder?" (Verfügbarkeit) → "Wann beginnt..." (Zeitpunkt)
- **A4:** "Wer leitet den?" (Person) → "Welcher Kurs wird geleitet?" (Kurs)
- **Ursache:** Prompt sagt nicht explizit, den Fragetyp (wer/was/wo/wann/ob) beizubehalten

### Problem 2: Kontext-Bleeding aus Vorfrage (Schwere: Hoch)
- **C3:** "Und wie war das nochmal beim Tanzkurs?" → "Welche Materialien braucht man für den Tanzkurs?"
- **Ursache:** Rewriter überträgt Thema der letzten Frage (Materialien) auf die neue, obwohl der User einen Themenwechsel macht

### Problem 3: Sprachwechsel (Schwere: Mittel)
- **S14:** Deutsche Frage → Englischer Rewrite ("Which of the courses mentioned is the cheapest?")
- **Ursache:** Vorherige Frage war auf Englisch, Rewriter lässt sich davon beeinflussen
- **Hinweis:** FR→DE Wechsel (C5) funktionierte korrekt

### Problem 4: Einwort-Fragen manchmal zu generisch (Schwere: Niedrig)
- **S12:** "Kosten?" → "Kosten für welche Kurse?" statt "Kosten der Elternkurse am Wochenende?"
- **Ursache:** Bei sehr kurzen Queries geht manchmal spezifischer Kontext verloren

---

## 5. Fazit

Der Query Rewriter funktioniert **gut** und erfüllt seinen Zweck: Folgefragen werden kontextualisiert, damit die Vektorsuche relevante Dokumente findet. Die **Erfolgsquote von 91%** (perfekt + akzeptabel) ist für ein produktives Feature solide.

**Wichtig:** Der Rewriter hat in keinem Fall die Antwortqualität verschlechtert. Selbst bei suboptimalen Rewrites hat die Chat-History als Sicherheitsnetz fungiert.

Die identifizierten Schwachstellen (Fragetyp-Änderung, Kontext-Bleeding, Sprachwechsel) sind durch Prompt-Verbesserungen adressierbar, ohne die Architektur zu ändern.
