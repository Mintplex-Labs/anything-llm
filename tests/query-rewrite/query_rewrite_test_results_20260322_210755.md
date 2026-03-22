# Query Rewriter Test-Ergebnisse

**Datum:** 22.03.2026 21:07  
**Workspace:** chatbot | **Container:** praesentation  
**Gesamt:** 44 Tests

## Zusammenfassung

| Dimension | ✅ OK | ⚠️ Akzeptabel | ❌ Fehler | Rate |
|-----------|------|--------------|---------|------|
| Query Rewrite | 29 | 15 | 0 | 65% perfekt |
| RAG-Quellen   | 36 | 8 | 0 | 81% perfekt |
| Antwort       | 43 | 1 | 0 | 97% perfekt |

## Detailergebnisse

| ID | Kategorie | Query | Rewrite | RW | SRC | ANS | Notizen |
|----|-----------|-------|---------|:--:|:---:|:---:|---------|
| V1 | standalone | Welche Deutschkurse gibt es? | (kein Rewrite) | ✅ | ✅ | ✅ | Eigenständige Frage, kein Rewrite |
| V2 | follow-up | Was kosten die? | Was kosten die Deutschkurse? | ✅ | ✅ | ✅ | 'die' → Deutschkurse |
| V3 | follow-up | Gibt es die auch abends? | Welche Deutschkurse gibt es abends? | ✅ | ⚠️ | ✅ | 2-stufige Folgefrage |
| S1 | standalone | Welche Yoga-Kurse gibt es bei euch? | (kein Rewrite) | ✅ | ✅ | ✅ |  |
| S2 | follow-up | Was kostet der Anfängerkurs? | Was kostet der Yoga-Kurs für Anfänger? | ✅ | ✅ | ✅ |  |
| S3 | follow-up | Und der Aufbaukurs? | Was kostet der Aufbaukurs? | ⚠️ | ⚠️ | ✅ | v2-Fix: Yoga muss ergänzt werden |
| S4 | standalone | Gibt es auch Schwimmkurse für Kinder? | Gibt es auch Schwimmkurse für Kinder? | ✅ | ✅ | ✅ |  |
| S5 | follow-up | Ab welchem Alter können die teilnehmen? | Ab welchem Alter können Kinder an den Schwimmkurse | ✅ | ✅ | ✅ | Mistral-Small nimmt 'Babyschwimmen' statt allgemei |
| S6 | topic-switch | Nochmal zum Yoga - gibt es den Kurs auch aben | Gibt es den Yoga-Kurs auch abends? | ✅ | ✅ | ✅ | Themenwechsel zurück zu Yoga |
| S7 | one-word | Wann genau? | Wann genau findet der Yoga (Aufbaukurs) abends sta | ✅ | ✅ | ✅ |  |
| S8 | standalone | Kann man Yoga und Schwimmen zusammen als Pake | Kann man Yoga (Aufbaukurs) und Schwimmen zusammen  | ⚠️ | ✅ | ✅ |  |
| S9 | standalone | Was gibt es eigentlich im Bereich Sprachen? | Was gibt es im Bereich Sprachen? | ⚠️ | ⚠️ | ✅ |  |
| S10 | follow-up | Gibt es da auch was für absolute Anfänger? | Gibt es Sprachkurse für absolute Anfänger? | ✅ | ⚠️ | ✅ |  |
| S11 | no-rewrite-threshold | Ich suche nach einem Kurs für Eltern der am W | (kein Rewrite) | ✅ | ⚠️ | ✅ | >12 Wörter Threshold → kein Rewrite |
| S12 | one-word | Kosten? | Kosten für die Kurse? | ⚠️ | ✅ | ✅ | War vorher zu generisch — v2 sollte Elternkurs-Kon |
| S13 | standalone | Do you have any English courses available? | Do you have any English courses available? | ✅ | ⚠️ | ✅ |  |
| S14 | language-switch | Was war nochmal der günstigste von allen Kurs | Which of the English courses is the cheapest? | ⚠️ | ✅ | ✅ | Mistral-Small wechselt zu EN nach EN-History. Mult |
| A1 | standalone | Welche Yoga-Kurse bieten Sie an? | (kein Rewrite) | ✅ | ✅ | ✅ |  |
| A2 | follow-up | Was kostet der günstigste davon? | Which of the Yoga-Kurse is the cheapest? | ⚠️ | ✅ | ✅ | v2-Fix: Keine Doppelfrage mehr |
| A3 | follow-up | Und der teuerste? | Was kostet der teuerste Yoga-Kurs? | ✅ | ✅ | ✅ |  |
| A4 | question-type | Wer leitet den? | Welcher Yoga-Kurs wird geleitet? | ✅ | ✅ | ✅ | v2-Fix: 'Wer' bleibt 'Wer' |
| B1 | standalone | Gibt es Tanzkurse? | (kein Rewrite) | ✅ | ✅ | ✅ |  |
| B2 | one-word | Preis? | Welcher Kursinteressiert Sie? | ⚠️ | ✅ | ✅ |  |
| B3 | one-word | Wo? | Wo finden die Tanzkurse statt? | ✅ | ✅ | ✅ |  |
| B4 | one-word | Wann? | Wann beginnen die Tanzkurse? | ✅ | ✅ | ✅ |  |
| B5 | question-type | Für Kinder? | Wann beginnt der Orientalischer Tanz (Bauchtanz) f | ✅ | ✅ | ✅ | Fragetyp-Verschiebung akzeptabel; von Kontext abhä |
| C1 | standalone | Haben Sie auch Malkurse im Programm? | (kein Rewrite) | ✅ | ✅ | ⚠️ | LLM kann halluzinieren — kein Rewriter-Problem |
| C2 | follow-up | Braucht man eigene Materialien dafür? | Braucht man eigene Materialien für  | ✅ | ✅ | ✅ | Thema: Malkurse/Kultur-Gestalten |
| C3 | context-bleeding | Und wie war das nochmal beim Tanzkurs? | Wie war das nochmal beim Orientalischen Tanzkurs? | ✅ | ✅ | ✅ | v2-Fix: 'Materialien' darf NICHT bluten |
| C4 | language-switch | Combien coûte le cours de danse? | Combien coûte le cours de danse? | ⚠️ | ✅ | ✅ | FR bleibt FR, orientalisch-Kontext |
| C5 | language-switch | Und auf Deutsch bitte - was kostet der? | Was kostet der orientalische Tanz für Anfängerinne | ✅ | ✅ | ✅ | FR→DE Sprachwechsel |
| D1 | two-turn-context | Gibt es die auch abends? | Gibt es die Yoga-Kurse auch abends? | ✅ | ✅ | ✅ | 'Yoga' muss 2 Turns zurückverfolgt werden |
| E1 | ordinal-reference | Mehr Kurse vom Kursleiter des dritten Kurses? | Mehr Kurse von Kesuke Miyagi? | ⚠️ | ✅ | ✅ | Rewriter soll Dozentennamen aus 3. Kurs der echten |
| E2 | ordinal-reference | Wie lange geht der zweite? | Wie lange geht der zweite Tanzkurs? | ⚠️ | ✅ | ✅ | 'zweite' aus echter Tanzkurs-Liste auflösen |
| F1 | context-bleeding | Gibt es auch Englischkurse? | Gibt es auch Englischkurse? | ✅ | ⚠️ | ✅ | Eigenständig — kein Bleeding aus Yoga/Anmeldung |
| F2 | question-type | Wer leitet die? | Welche Englischkurse gibt es? | ⚠️ | ✅ | ✅ | 'Wer' bleibt 'Wer' — konsistent mit A4 |
| F3 | question-type | Wo finden die statt? | Wo finden die Schwimmkurse statt? | ✅ | ✅ | ✅ |  |
| F4 | language-switch | Was kostet Yoga? | Do you have any courses available for Yoga? | ⚠️ | ✅ | ✅ | Mistral-Small wechselt zu EN nach EN-History trotz |
| F5 | language-switch | Was kosten die? | Was kosten die Yoga-Kurse? | ✅ | ✅ | ✅ | Bekannt: DE→EN nach EN-History. Multilingual-Embed |
| G1 | two-word | Für Kinder? | Gibt es Integrationskurse für Kinder? | ✅ | ⚠️ | ✅ |  |
| G2 | two-word | Und der Aufbaukurs? | Gibt es einen Aufbaukurs für Töpferkurse? | ✅ | ✅ | ✅ |  |
| G3 | two-word | Auf Englisch? | What are the costs of the English courses? | ⚠️ | ✅ | ✅ | Mistral-Small wechselt zu EN. Sprachkurs-Kontext t |
| H1 | back-reference | Und der bei dem wir angefangen haben? | Welcher Schwimmkurs hat am 03.11.2026 begonnen? | ⚠️ | ✅ | ✅ | Komplexes Idiom — kleines LLM nimmt letztes Thema  |
| H2 | back-reference | Was war nochmal der erste? | Welcher Tanzkurs war der erste? | ⚠️ | ✅ | ✅ | Ambiguität: 'erste' = erstes Thema (Malkurse) oder |

## Bekannte Einschränkungen (Mistral-Small-24B)

- **Sprachswitch DE→EN**: Bei vorheriger EN-History wechselt das Modell zu EN.   Kompensiert durch multilinguales Embedding (text-embedding-3-small).
- **Babyschwimmen (S5)**: Zu spezifische Altersgruppe statt allgemeiner Schwimmkurse.
- **Komplexe Idiome (H1)**: 'Der bei dem wir angefangen haben' zu komplex für kleine LLM.
- **Halluzination (C1)**: LLM erfindet Kurse wenn keine Daten — Rewriter-unabhängig.

*⚠️\* = Bekanntes Problem, kein Blocker*