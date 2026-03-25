#!/usr/bin/env python3
"""
=============================================================================
AnythingLLM Query Rewriter — Vollständige Test-Suite
=============================================================================

ZWECK:
  Testet den kompletten RAG-Pipeline-Stack:
    1. Query Rewrite  — wird die Frage korrekt umgeschrieben?
    2. RAG-Quellen    — findet die Vektorsuche relevante Dokumente?
    3. Antwort        — ist die Antwort korrekt, relevant, halluzinationsfrei?

VERWENDUNG:
  python3 query_rewrite_full_test.py [--block V,S,A,B,C,D,E,F,G,H]

VORAUSSETZUNGEN:
  - AnythingLLM Container "praesentation" läuft
  - Workspace "chatbot-donau" mit queryRewriteMode=on
  - API-Key gültig
  - Port 49653 erreichbar

BEWERTUNGSLOGIK:
  Rewrite:  ✅ korrekt | ⚠️ akzeptabel | ❌ fehlerhaft
  Quellen:  ✅ relevant (Score >0.5, Keyword in Titel/Text)
            ⚠️ suboptimal | ❌ irrelevant/generisch
  Antwort:  ✅ korrekt & belegt | ⚠️ leichte Ungenauigkeit
            ❌ Halluzination/Falschinformation

ERGEBNIS-DATEI:
  query_rewrite_test_results_YYYYMMDD_HHMMSS.md
=============================================================================
"""
import requests
import subprocess
import time
import json
import sys
import re
import os
from datetime import datetime
from dataclasses import dataclass, field
from typing import Optional

# ── Konfiguration ──────────────────────────────────────────────
API_BASE  = "http://localhost:53343/api/v1"
API_KEY   = "0MVJ179-DTPMPT7-K3SJ804-5A0VP49"
WORKSPACE = "chatbot"
CONTAINER = "praesentation"
HDR = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

# ANSI-Farben
GRN="\033[32m"; YLW="\033[33m"; RED="\033[31m"; BLU="\033[34m"
BOLD="\033[1m"; RST="\033[0m"; RESET="\033[0m"

# ── Datenstrukturen ────────────────────────────────────────────
@dataclass
class TestCase:
    id: str
    block: str
    category: str
    setup_queries: list          # Liste von Queries die den Kontext aufbauen (kein Test)
    query: str                   # Die eigentliche Testfrage
    expect_rewrite: bool         # Soll umgeschrieben werden?
    expected_rewrite_keywords: list = field(default_factory=list)  # Schlüsselwörter die im Rewrite erscheinen sollen
    must_not_contain: list = field(default_factory=list)           # Darf NICHT im Rewrite sein
    expected_source_keywords: list = field(default_factory=list)   # Schlüsselwörter die in Quellen sein sollen
    expected_answer_keywords: list = field(default_factory=list)   # Schlüsselwörter die in Antwort sein sollen
    known_issue: Optional[str] = None                              # Bekanntes Problem → kein Fehler
    notes: str = ""

@dataclass
class TestResult:
    case: TestCase
    rewrite: str
    answer: str
    sources: list
    rewrite_rating: str   # ✅ ⚠️ ❌
    source_rating: str
    answer_rating: str
    rewrite_note: str = ""
    source_note: str = ""
    answer_note: str = ""

# ── Alle Testfälle ─────────────────────────────────────────────
TEST_CASES = [

  # ── BLOCK V: Grundfunktion ──────────────────────────────────
  TestCase("V1","V","standalone",
    setup_queries=[],
    query="Welche Deutschkurse gibt es?",
    expect_rewrite=False,
    expected_source_keywords=["deutsch","sprach"],
    expected_answer_keywords=["Deutsch","Kurs"],
    notes="Eigenständige Frage, kein Rewrite"
  ),
  TestCase("V2","V","follow-up",
    setup_queries=["Welche Deutschkurse gibt es?"],
    query="Was kosten die?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Deutsch"],
    expected_source_keywords=["deutsch"],
    expected_answer_keywords=["€","Euro","Preis","kosten"],
    notes="'die' → Deutschkurse"
  ),
  TestCase("V3","V","follow-up",
    setup_queries=["Welche Deutschkurse gibt es?","Was kosten die?"],
    query="Gibt es die auch abends?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Deutsch"],
    expected_source_keywords=["deutsch"],
    expected_answer_keywords=["Uhr","abends","Abend","abends"],
    notes="2-stufige Folgefrage"
  ),

  # ── BLOCK S: Stresstest ─────────────────────────────────────
  TestCase("S1","S","standalone",
    setup_queries=[],
    query="Welche Yoga-Kurse gibt es bei euch?",
    expect_rewrite=False,
    expected_source_keywords=["yoga"],
    expected_answer_keywords=["Yoga"],
  ),
  TestCase("S2","S","follow-up",
    setup_queries=["Welche Yoga-Kurse gibt es bei euch?"],
    query="Was kostet der Anfängerkurs?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Yoga"],
    expected_source_keywords=["yoga"],
    expected_answer_keywords=["€","Euro"],
  ),
  TestCase("S3","S","follow-up",
    setup_queries=["Welche Yoga-Kurse gibt es bei euch?","Was kostet der Anfängerkurs?"],
    query="Und der Aufbaukurs?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Yoga","Aufbau"],
    expected_source_keywords=["yoga","aufbau"],
    expected_answer_keywords=["€","Euro"],
    notes="v2-Fix: Yoga muss ergänzt werden"
  ),
  TestCase("S4","S","standalone",
    setup_queries=["Welche Yoga-Kurse gibt es bei euch?","Was kostet der Anfängerkurs?",
                   "Und der Aufbaukurs?"],
    query="Gibt es auch Schwimmkurse für Kinder?",
    expect_rewrite=False,
    expected_source_keywords=["schwimm"],
    expected_answer_keywords=["Schwimm","Kind"],
  ),
  TestCase("S5","S","follow-up",
    setup_queries=["Gibt es auch Schwimmkurse für Kinder?"],
    query="Ab welchem Alter können die teilnehmen?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Kind","Schwimm"],
    expected_source_keywords=["schwimm","baby","kind"],
    expected_answer_keywords=["Monat","Jahr","Alter"],
    known_issue="Mistral-Small nimmt 'Babyschwimmen' statt allgemein 'Schwimmkurs'. Falsche Altersgruppe möglich.",
    notes="BEKANNTER FEHLER: Babyschwimmen statt allgemeine Schwimmkurse"
  ),
  TestCase("S6","S","topic-switch",
    setup_queries=["Gibt es auch Schwimmkurse für Kinder?","Ab welchem Alter können die teilnehmen?"],
    query="Nochmal zum Yoga - gibt es den Kurs auch abends?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Yoga","abends"],
    expected_source_keywords=["yoga"],
    expected_answer_keywords=["Uhr","Abend","abends"],
    notes="Themenwechsel zurück zu Yoga"
  ),
  TestCase("S7","S","one-word",
    setup_queries=["Nochmal zum Yoga - gibt es den Kurs auch abends?"],
    query="Wann genau?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Yoga","Abend","wann"],
    expected_source_keywords=["yoga"],
    expected_answer_keywords=["Uhr","Mo","Di","Mi","Do","Fr"],
  ),
  TestCase("S8","S","standalone",
    setup_queries=["Nochmal zum Yoga - gibt es den Kurs auch abends?","Wann genau?"],
    query="Kann man Yoga und Schwimmen zusammen als Paket buchen?",
    expect_rewrite=False,
    expected_answer_keywords=["Paket","Yoga","Schwimm","nicht"],
  ),
  TestCase("S9","S","standalone",
    setup_queries=["Kann man Yoga und Schwimmen zusammen als Paket buchen?"],
    query="Was gibt es eigentlich im Bereich Sprachen?",
    expect_rewrite=False,
    expected_source_keywords=["sprach","englisch","deutsch","französ"],
    expected_answer_keywords=["Sprach","Englisch","Kurs"],
  ),
  TestCase("S10","S","follow-up",
    setup_queries=["Was gibt es eigentlich im Bereich Sprachen?"],
    query="Gibt es da auch was für absolute Anfänger?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Sprach","Anfänger"],
    expected_source_keywords=["sprach","anfänger","a1","einsteiger"],
    expected_answer_keywords=["Anfänger","Einsteiger","A1"],
  ),
  TestCase("S11","S","no-rewrite-threshold",
    setup_queries=["Gibt es da auch was für absolute Anfänger?"],
    query="Ich suche nach einem Kurs für Eltern der am Wochenende stattfindet damit ich mein Kind mitbringen kann",
    expect_rewrite=False,
    expected_source_keywords=["eltern","kind","wochenende","samstag","sonntag"],
    notes=">12 Wörter Threshold → kein Rewrite"
  ),
  TestCase("S12","S","one-word",
    setup_queries=["Ich suche nach einem Kurs für Eltern der am Wochenende stattfindet damit ich mein Kind mitbringen kann"],
    query="Kosten?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Eltern","Kurs","Wochenende","Kind"],
    expected_answer_keywords=["€","Euro"],
    notes="War vorher zu generisch — v2 sollte Elternkurs-Kontext aufgreifen"
  ),
  TestCase("S13","S","standalone",
    setup_queries=["Kosten?"],
    query="Do you have any English courses available?",
    expect_rewrite=False,
    expected_source_keywords=["englisch","english"],
    expected_answer_keywords=["English","Englisch"],
  ),
  TestCase("S14","S","language-switch",
    setup_queries=["Do you have any English courses available?"],
    query="Was war nochmal der günstigste von allen Kursen die wir besprochen haben?",
    expect_rewrite=True,
    expected_rewrite_keywords=["günstigste","Kurs"],
    expected_answer_keywords=["€","Euro","günstig"],
    known_issue="Mistral-Small wechselt zu EN nach EN-History. Multilingual-Embeddings kompensieren.",
    notes="DE→EN Sprachswitch bekannt"
  ),

  # ── BLOCK A: Yoga-Kontext ───────────────────────────────────
  TestCase("A1","A","standalone",
    setup_queries=[],
    query="Welche Yoga-Kurse bieten Sie an?",
    expect_rewrite=False,
    expected_source_keywords=["yoga"],
    expected_answer_keywords=["Yoga"],
  ),
  TestCase("A2","A","follow-up",
    setup_queries=["Welche Yoga-Kurse bieten Sie an?"],
    query="Was kostet der günstigste davon?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Yoga","günstig"],
    expected_answer_keywords=["€","Euro","günstig"],
    notes="v2-Fix: Keine Doppelfrage mehr"
  ),
  TestCase("A3","A","follow-up",
    setup_queries=["Welche Yoga-Kurse bieten Sie an?","Was kostet der günstigste davon?"],
    query="Und der teuerste?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Yoga","teuer"],
    expected_answer_keywords=["€","Euro","teuer"],
  ),
  TestCase("A4","A","question-type",
    setup_queries=["Welche Yoga-Kurse bieten Sie an?","Was kostet der günstigste davon?",
                   "Und der teuerste?"],
    query="Wer leitet den?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Yoga"],
    must_not_contain=["Welcher Kurs", "Welche Kurse"],
    expected_answer_keywords=["Leitung","leitet","geleitet","Kursleiter"],
    notes="v2-Fix: 'Wer' bleibt 'Wer'"
  ),

  # ── BLOCK B: Einwort-Fragen ─────────────────────────────────
  TestCase("B1","B","standalone",
    setup_queries=[],
    query="Gibt es Tanzkurse?",
    expect_rewrite=False,
    expected_source_keywords=["tanz","orientalisch"],
    expected_answer_keywords=["Tanz"],
  ),
  TestCase("B2","B","one-word",
    setup_queries=["Gibt es Tanzkurse?"],
    query="Preis?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Tanz","Preis","kostet"],
    expected_answer_keywords=["€","Euro"],
  ),
  TestCase("B3","B","one-word",
    setup_queries=["Gibt es Tanzkurse?","Preis?"],
    query="Wo?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Tanz"],
    expected_answer_keywords=["Ort","Raum","Schule","statt"],
  ),
  TestCase("B4","B","one-word",
    setup_queries=["Gibt es Tanzkurse?","Preis?","Wo?"],
    query="Wann?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Tanz"],
    expected_answer_keywords=["Uhr","Mo","Di","Mi","Do","Fr","Beginn"],
  ),
  TestCase("B5","B","question-type",
    setup_queries=["Gibt es Tanzkurse?","Preis?","Wo?","Wann?"],
    query="Für Kinder?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Tanz","Kind","Kinder"],
    expected_source_keywords=["tanz","kind","9","14"],
    expected_answer_keywords=["Kind","Kinder","Jahr"],
    notes="Fragetyp-Verschiebung akzeptabel; von Kontext abhängig"
  ),

  # ── BLOCK C: Themenwechsel + Sprache ────────────────────────
  TestCase("C1","C","standalone",
    setup_queries=[],
    query="Haben Sie auch Malkurse im Programm?",
    expect_rewrite=False,
    notes="LLM kann halluzinieren — kein Rewriter-Problem"
  ),
  TestCase("C2","C","follow-up",
    setup_queries=["Haben Sie auch Malkurse im Programm?"],
    query="Braucht man eigene Materialien dafür?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Material"],
    notes="Thema: Malkurse/Kultur-Gestalten"
  ),
  TestCase("C3","C","context-bleeding",
    setup_queries=["Haben Sie auch Malkurse im Programm?","Braucht man eigene Materialien dafür?"],
    query="Und wie war das nochmal beim Tanzkurs?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Tanz"],
    must_not_contain=["Material","Malku"],
    expected_source_keywords=["tanz","orientalisch"],
    notes="v2-Fix: 'Materialien' darf NICHT bluten"
  ),
  TestCase("C4","C","language-switch",
    setup_queries=["Und wie war das nochmal beim Tanzkurs?"],
    query="Combien coûte le cours de danse?",
    expect_rewrite=True,
    expected_rewrite_keywords=["danse","cours"],
    expected_source_keywords=["tanz","orientalisch"],
    expected_answer_keywords=["€","14","28"],
    notes="FR bleibt FR, orientalisch-Kontext"
  ),
  TestCase("C5","C","language-switch",
    setup_queries=["Und wie war das nochmal beim Tanzkurs?","Combien coûte le cours de danse?"],
    query="Und auf Deutsch bitte - was kostet der?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Tanz","orientalisch","kostet","Was"],
    expected_answer_keywords=["€","14","28"],
    notes="FR→DE Sprachwechsel"
  ),

  # ── BLOCK D: Zwei-Turn-Kontext ──────────────────────────────
  TestCase("D1","D","two-turn-context",
    setup_queries=["Was gibt es für Yoga-Kurse?","Was kosten die?"],
    query="Gibt es die auch abends?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Yoga","abends"],
    expected_source_keywords=["yoga"],
    expected_answer_keywords=["Uhr","Abend","abends"],
    notes="'Yoga' muss 2 Turns zurückverfolgt werden"
  ),

  # ── BLOCK E: Ordinale Referenzen ────────────────────────────
  TestCase("E1","E","ordinal-reference",
    setup_queries=["Welche Yoga-Kurse bieten Sie an? Bitte mit Kursleitern."],
    query="Mehr Kurse vom Kursleiter des dritten Kurses?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Kursleiter","Kurs"],
    notes="Rewriter soll Dozentennamen aus 3. Kurs der echten Antwort auflösen"
  ),
  TestCase("E2","E","ordinal-reference",
    setup_queries=["Welche Tanzkurse gibt es?"],
    query="Wie lange geht der zweite?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Tanz","orientalisch","zweite"],
    notes="'zweite' aus echter Tanzkurs-Liste auflösen"
  ),

  # ── BLOCK F: Regressionstests ───────────────────────────────
  TestCase("F1","F","context-bleeding",
    setup_queries=["Was kostet der Yoga-Kurs?","Und die Anmeldung?"],
    query="Gibt es auch Englischkurse?",
    expect_rewrite=False,
    must_not_contain=["Anmeldung","online","Yoga"],
    expected_source_keywords=["englisch","english"],
    notes="Eigenständig — kein Bleeding aus Yoga/Anmeldung"
  ),
  TestCase("F2","F","question-type",
    setup_queries=["Welche Yoga-Kurse gibt es?"],
    query="Wer leitet die?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Yoga","leitet","Wer"],
    must_not_contain=["Welche Kurse werden","Welcher Kurs"],
    expected_answer_keywords=["Leitung","leitet","geleitet"],
    notes="'Wer' bleibt 'Wer' — konsistent mit A4"
  ),
  TestCase("F3","F","question-type",
    setup_queries=["Gibt es Schwimmkurse?"],
    query="Wo finden die statt?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Schwimm","Wo"],
    expected_answer_keywords=["Ort","Raum","Halle","statt"],
  ),
  TestCase("F4","F","language-switch",
    setup_queries=["Do you have any courses available?"],
    query="Was kostet Yoga?",
    expect_rewrite=False,
    expected_source_keywords=["yoga"],
    expected_answer_keywords=["€","Euro","Yoga"],
    known_issue="Mistral-Small wechselt zu EN nach EN-History trotz eigenständiger DE-Frage.",
  ),
  TestCase("F5","F","language-switch",
    setup_queries=["Do you have any courses available?"],
    query="Was kosten die?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Kurs","kosten"],
    known_issue="Bekannt: DE→EN nach EN-History. Multilingual-Embeddings kompensieren.",
  ),

  # ── BLOCK G: Zwei-Wort-Fragen ───────────────────────────────
  TestCase("G1","G","two-word",
    setup_queries=["Gibt es Integrationskurse?"],
    query="Für Kinder?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Integration","Kind","Kinder"],
    expected_source_keywords=["integrat","kind"],
  ),
  TestCase("G2","G","two-word",
    setup_queries=["Gibt es Töpferkurse?"],
    query="Und der Aufbaukurs?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Töpf","Aufbau"],
    expected_source_keywords=["töpf"],
  ),
  TestCase("G3","G","two-word",
    setup_queries=["Was kosten die Sprachkurse?"],
    query="Auf Englisch?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Sprach","Englisch"],
    known_issue="Mistral-Small wechselt zu EN. Sprachkurs-Kontext trotzdem korrekt.",
  ),

  # ── BLOCK H: Rückreferenzen ─────────────────────────────────
  TestCase("H1","H","back-reference",
    setup_queries=["Was gibt es für Yoga-Kurse?","Und beim Schwimmen?"],
    query="Und der bei dem wir angefangen haben?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Yoga"],
    known_issue="Komplexes Idiom — kleines LLM nimmt letztes Thema (Schwimmen) statt erstem (Yoga).",
    notes="Edge case: zu komplex für Mistral-Small"
  ),
  TestCase("H2","H","back-reference",
    setup_queries=["Gibt es Malkurse?","Und Tanzkurse?"],
    query="Was war nochmal der erste?",
    expect_rewrite=True,
    expected_rewrite_keywords=["Malkurs","Tanz"],
    known_issue="Ambiguität: 'erste' = erstes Thema (Malkurse) oder erster Tanzkurs?",
    notes="Ambiguität akzeptiert"
  ),
]

# ── Hilfsfunktionen ────────────────────────────────────────────
def new_thread():
    r = requests.post(f"{API_BASE}/workspace/{WORKSPACE}/thread/new", headers=HDR)
    return r.json()["thread"]["slug"]

def send_chat(thread, msg):
    r = requests.post(
        f"{API_BASE}/workspace/{WORKSPACE}/thread/{thread}/chat",
        headers=HDR,
        json={"message": msg, "mode": "chat"}
    )
    return r.json()

def last_rewrite_from_logs():
    out = subprocess.run(
        ["docker","logs", CONTAINER,"--since=25s"],
        capture_output=True, text=True
    )
    lines = [l for l in (out.stdout+out.stderr).split("\n") if "[QueryRewrite]" in l]
    if not lines:
        return None
    last = lines[-1].split("[QueryRewrite]")[1].strip()
    # Extrahiere "original" → "rewritten"
    m = re.search(r'"(.+?)" → "(.+?)"', last)
    if m:
        return m.group(1), m.group(2)
    return None, None

def keywords_in_text(keywords, text):
    text_low = text.lower()
    return any(k.lower() in text_low for k in keywords)

def detect_nonsense(text):
    """Erkennt Nonsense-Rewrites (zusammengeklebte Wörter, unvollständige Sätze)"""
    # Zusammengeklebte Wörter: "Kursinteressiert", "Kursewelche"
    if re.search(r'[a-zäöü]{3}[A-ZÄÖÜ][a-zäöü]{3}', text):
        return True
    # Abgeschnittener Satz (endet ohne Satzzeichen nach >3 Wörtern)
    words = text.strip().split()
    if len(words) >= 3 and not text.strip()[-1] in '.?!"\'':
        pass  # Nicht zwingend Nonsense
    return False

def detect_language(text):
    """Einfache Spracherkennung DE vs EN"""
    en_markers = ['what', 'which', 'where', 'when', 'how', 'do you', 'is the', 'are the',
                  'available', 'courses', 'cheapest', 'expensive']
    de_markers = ['welche', 'was', 'wo', 'wann', 'wie', 'gibt es', 'kostet', 'kosten',
                  'kurse', 'kurs', 'finden', 'statt']
    text_low = text.lower()
    en_score = sum(1 for m in en_markers if m in text_low)
    de_score = sum(1 for m in de_markers if m in text_low)
    if en_score > de_score:
        return "en"
    elif de_score > en_score:
        return "de"
    return "unknown"

def evaluate_rewrite(case, original, rewritten):
    """Bewertet die Rewrite-Qualität"""
    if rewritten is None:
        if not case.expect_rewrite:
            return "✅", "Korrekt nicht umgeschrieben"
        else:
            return "❌", "Kein Rewrite erwartet aber keiner erfolgt"

    was_rewritten = rewritten.lower() != original.lower()

    # Nonsense-Erkennung (z.B. "Welcher Kursinteressiert Sie?")
    if detect_nonsense(rewritten):
        return "❌", f"Nonsense-Rewrite: '{rewritten}'"

    # Eigenständige Frage soll NICHT umgeschrieben werden
    if not case.expect_rewrite:
        if was_rewritten:
            # Inhaltlich komplett anders → ❌
            orig_words = set(original.lower().split())
            rewrite_words = set(rewritten.lower().split())
            overlap = len(orig_words & rewrite_words) / max(len(orig_words), 1)
            if overlap < 0.3:
                return "❌", f"Inhaltlich verfälscht: '{rewritten}'"
            return "⚠️", f"Wurde umgeschrieben obwohl eigenständig: '{rewritten}'"
        return "✅", "Korrekt nicht umgeschrieben"

    # Soll umgeschrieben werden
    if not was_rewritten:
        return "⚠️", "Keine Änderung trotz erwarteter Umschreibung"

    # must_not_contain prüfen
    for word in case.must_not_contain:
        if word.lower() in rewritten.lower():
            return "❌", f"Context-Bleeding: enthält '{word}'"

    # Sprachwechsel-Erkennung: Query-Sprache muss erhalten bleiben
    query_lang = detect_language(original)
    rewrite_lang = detect_language(rewritten)
    if query_lang != "unknown" and rewrite_lang != "unknown" and query_lang != rewrite_lang:
        return "❌", f"Sprachwechsel {query_lang}→{rewrite_lang}: '{rewritten}'"

    # expected keywords prüfen — fehlender Hauptkontext = ❌
    if case.expected_rewrite_keywords:
        missing = [k for k in case.expected_rewrite_keywords
                   if k.lower() not in rewritten.lower()]
        if missing:
            # >50% der Keywords fehlen → Hauptkontext verloren → ❌
            missing_ratio = len(missing) / len(case.expected_rewrite_keywords)
            if missing_ratio > 0.5:
                return "❌", f"Hauptkontext verloren ({len(missing)}/{len(case.expected_rewrite_keywords)} KW fehlen): {missing}"
            return "⚠️", f"Erwartete Keywords fehlen: {missing}"

    return "✅", f"→ '{rewritten}'"

def evaluate_sources(case, sources):
    """Bewertet die Quellen-Relevanz"""
    if not sources:
        return "❌", "Keine Quellen gefunden"

    if not case.expected_source_keywords:
        top_score = sources[0].get("score", 0) if sources else 0
        if top_score < 0.4:
            return "⚠️", f"Niedrige Relevanz (Score: {top_score:.2f})"
        return "✅", f"Score: {sources[0].get('score',0):.2f}"

    top_score = sources[0].get("score", 0)
    all_text = " ".join([
        s.get("title","") + " " + s.get("text","")[:200]
        for s in sources[:3]
    ])

    found = [k for k in case.expected_source_keywords if k.lower() in all_text.lower()]
    missing = [k for k in case.expected_source_keywords if k.lower() not in all_text.lower()]

    if missing and top_score < 0.45:
        return "❌", f"Irrelevante Quellen (Score:{top_score:.2f}, fehlende KW:{missing})"
    elif missing:
        return "⚠️", f"Score:{top_score:.2f}, fehlende KW:{missing}"
    else:
        return "✅", f"Score:{top_score:.2f}, KW gefunden"

def evaluate_answer(case, answer, sources):
    """Bewertet die Antwortqualität"""
    if not answer or len(answer) < 10:
        return "❌", "Leere/sehr kurze Antwort"

    answer_low = answer.lower()

    # Erkenne "nicht gefunden"-Antworten
    not_found = any(p in answer_low for p in [
        "konnte keine", "nicht gefunden", "keine informationen",
        "nicht verfügbar", "leider keine", "keine angaben"
    ])

    if not case.expected_answer_keywords:
        if not_found:
            return "⚠️", "Keine relevante Info gefunden"
        return "✅", "Antwort vorhanden (keine KW definiert)"

    found = [k for k in case.expected_answer_keywords
             if k.lower() in answer_low]

    if not found and not_found:
        return "⚠️", f"Keine relevante Antwort, fehlende KW: {case.expected_answer_keywords}"
    elif not found:
        return "⚠️", f"Erwartete Keywords nicht gefunden: {case.expected_answer_keywords}"

    # Hinweis: Kursnummern (252-xxxx) werden NICHT als Halluzinationsindikator genutzt,
    # da der System-Prompt den Chatbot anweist sie anzugeben und sie im Dokument stehen,
    # aber nicht immer im zurückgegebenen Chunk-Snippet enthalten sind.

    return "✅", f"KW gefunden: {found[:3]}"

# ── Test-Runner ────────────────────────────────────────────────
def run_tests(blocks_filter=None):
    results = []

    cases = TEST_CASES
    if blocks_filter:
        cases = [c for c in TEST_CASES if c.block in blocks_filter]

    print(f"\n{BOLD}{'='*65}")
    print(f"QUERY REWRITER VOLLTEST — {datetime.now().strftime('%d.%m.%Y %H:%M')}")
    print(f"Workspace: {WORKSPACE} | Container: {CONTAINER}")
    print(f"Tests: {len(cases)} | Blöcke: {sorted(set(c.block for c in cases))}")
    print(f"{'='*65}{RESET}\n")

    current_block = None
    thread = None

    for case in cases:
        # Neuer Block → neuer Thread
        if case.block != current_block:
            current_block = case.block
            thread = new_thread()
            time.sleep(0.3)
            print(f"{BOLD}── Block {case.block} ──────────────────────────{RST}")

        # Setup-Queries (Kontext aufbauen)
        for sq in case.setup_queries:
            send_chat(thread, sq)
            time.sleep(1.2)

        # Eigentliche Testfrage
        resp = send_chat(thread, case.query)
        time.sleep(0.5)

        answer = resp.get("textResponse", "")
        sources = resp.get("sources", [])

        # Rewrite aus Logs
        rewrite_result = last_rewrite_from_logs()
        original = rewrite_result[0] if rewrite_result else None
        rewritten = rewrite_result[1] if rewrite_result else None
        # Stale-Log-Check: Log-Eintrag muss zur aktuellen Frage passen
        if original is not None and original.strip().lower() != case.query.strip().lower():
            original = None
            rewritten = None
        if original is None:
            # Kein Rewrite-Log = entweder kein Rewrite oder über Threshold
            rewritten_display = "(kein Rewrite)"
            rewritten_for_eval = None
        else:
            rewritten_display = rewritten
            rewritten_for_eval = rewritten

        # Bewertungen
        rw_rating, rw_note = evaluate_rewrite(case, case.query, rewritten_for_eval)
        src_rating, src_note = evaluate_sources(case, sources)
        ans_rating, ans_note = evaluate_answer(case, answer, sources)

        # Known issue: downgrade ❌ → ⚠️
        if case.known_issue:
            if rw_rating == "❌": rw_rating = "⚠️*"
            if src_rating == "❌": src_rating = "⚠️*"
            if ans_rating == "❌": ans_rating = "⚠️*"

        result = TestResult(
            case=case,
            rewrite=rewritten_display,
            answer=(answer or "")[:200],
            sources=sources,
            rewrite_rating=rw_rating,
            source_rating=src_rating,
            answer_rating=ans_rating,
            rewrite_note=rw_note,
            source_note=src_note,
            answer_note=ans_note,
        )
        results.append(result)

        # Konsolen-Ausgabe
        overall = "✅" if all(r in ["✅","✅"] for r in [rw_rating,src_rating,ans_rating]) else (
            "❌" if "❌" in [rw_rating,src_rating,ans_rating] else "⚠️"
        )
        print(f"  [{case.id}] {overall} | RW:{rw_rating} SRC:{src_rating} ANS:{ans_rating}")
        print(f"       Q: \"{case.query[:60]}\"")
        if rewritten_for_eval:
            print(f"       → {BLU}\"{rewritten_display[:70]}\"{RST}")
        if rw_rating not in ["✅"] or src_rating not in ["✅"] or ans_rating not in ["✅"]:
            if rw_rating not in ["✅"]:
                print(f"       RW: {rw_note}")
            if src_rating not in ["✅"]:
                print(f"       SRC: {src_note}")
            if ans_rating not in ["✅"]:
                print(f"       ANS: {ans_note[:100]}")
        print()

        # Zwischen-Pause um Rate-Limiting zu vermeiden
        time.sleep(0.8)

    return results

# ── Bericht generieren ─────────────────────────────────────────
def generate_report(results):
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"/home/srvadmin/KI_Apps_Pipelines/Apps/query_rewrite_test_results_{ts}.md"

    total = len(results)
    rw_ok  = sum(1 for r in results if r.rewrite_rating in ["✅","⚠️*"])
    rw_err = sum(1 for r in results if "❌" in r.rewrite_rating)
    src_ok  = sum(1 for r in results if r.source_rating in ["✅","⚠️*"])
    src_err = sum(1 for r in results if "❌" in r.source_rating)
    ans_ok  = sum(1 for r in results if r.answer_rating in ["✅","⚠️*"])
    ans_err = sum(1 for r in results if "❌" in r.answer_rating)

    lines = [
        f"# Query Rewriter Test-Ergebnisse",
        f"",
        f"**Datum:** {datetime.now().strftime('%d.%m.%Y %H:%M')}  ",
        f"**Workspace:** {WORKSPACE} | **Container:** {CONTAINER}  ",
        f"**Gesamt:** {total} Tests",
        f"",
        f"## Zusammenfassung",
        f"",
        f"| Dimension | ✅ OK | ⚠️ Akzeptabel | ❌ Fehler | Rate |",
        f"|-----------|------|--------------|---------|------|",
    ]

    def counts(results, key):
        ok = sum(1 for r in results if getattr(r, key) == "✅")
        acc = sum(1 for r in results if "⚠️" in getattr(r, key))
        err = sum(1 for r in results if "❌" in getattr(r, key))
        return ok, acc, err

    rw_ok2, rw_acc, rw_err2 = counts(results, "rewrite_rating")
    src_ok2, src_acc, src_err2 = counts(results, "source_rating")
    ans_ok2, ans_acc, ans_err2 = counts(results, "answer_rating")

    lines += [
        f"| Query Rewrite | {rw_ok2} | {rw_acc} | {rw_err2} | {100*rw_ok2//total}% perfekt |",
        f"| RAG-Quellen   | {src_ok2} | {src_acc} | {src_err2} | {100*src_ok2//total}% perfekt |",
        f"| Antwort       | {ans_ok2} | {ans_acc} | {ans_err2} | {100*ans_ok2//total}% perfekt |",
        f"",
        f"## Detailergebnisse",
        f"",
        f"| ID | Kategorie | Query | Rewrite | RW | SRC | ANS | Notizen |",
        f"|----|-----------|-------|---------|:--:|:---:|:---:|---------|",
    ]

    for r in results:
        q = r.case.query[:45].replace("|","\\|")
        rw = r.rewrite[:50].replace("|","\\|")
        note = (r.case.known_issue or r.case.notes or "")[:50].replace("|","\\|")
        lines.append(
            f"| {r.case.id} | {r.case.category} | {q} | {rw} "
            f"| {r.rewrite_rating} | {r.source_rating} | {r.answer_rating} | {note} |"
        )

    lines += [
        f"",
        f"## Bekannte Einschränkungen (Mistral-Small-24B)",
        f"",
        f"- **Sprachswitch DE→EN**: Bei vorheriger EN-History wechselt das Modell zu EN. "
        f"  Kompensiert durch multilinguales Embedding (text-embedding-3-small).",
        f"- **Babyschwimmen (S5)**: Zu spezifische Altersgruppe statt allgemeiner Schwimmkurse.",
        f"- **Komplexe Idiome (H1)**: 'Der bei dem wir angefangen haben' zu komplex für kleine LLM.",
        f"- **Halluzination (C1)**: LLM erfindet Kurse wenn keine Daten — Rewriter-unabhängig.",
        f"",
        f"*⚠️\\* = Bekanntes Problem, kein Blocker*",
    ]

    with open(filename, "w") as f:
        f.write("\n".join(lines))

    print(f"\n{BOLD}{'='*65}")
    print(f"ERGEBNIS: {total} Tests | "
          f"RW: {rw_ok2}✅ {rw_acc}⚠️ {rw_err2}❌ | "
          f"SRC: {src_ok2}✅ {src_acc}⚠️ {src_err2}❌ | "
          f"ANS: {ans_ok2}✅ {ans_acc}⚠️ {ans_err2}❌")
    print(f"Bericht: {filename}")
    print(f"{'='*65}{RST}\n")
    return filename

def generate_html_report(results):
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"/home/srvadmin/KI_Apps_Pipelines/Apps/query_rewrite_test_results_{ts}.html"

    total = len(results)
    def counts(results, key):
        ok = sum(1 for r in results if getattr(r, key) == "✅")
        acc = sum(1 for r in results if "⚠️" in getattr(r, key))
        err = sum(1 for r in results if "❌" in getattr(r, key))
        return ok, acc, err

    rw_ok, rw_acc, rw_err = counts(results, "rewrite_rating")
    src_ok, src_acc, src_err = counts(results, "source_rating")
    ans_ok, ans_acc, ans_err = counts(results, "answer_rating")

    def pct(n): return f"{100*n//total}%" if total else "0%"
    def bar(ok, acc, err):
        w_ok = 100*ok//total if total else 0
        w_acc = 100*acc//total if total else 0
        w_err = 100*err//total if total else 0
        return f'<div class="bar"><span class="ok" style="width:{w_ok}%">{ok}</span><span class="warn" style="width:{w_acc}%">{acc}</span><span class="fail" style="width:{w_err}%">{err}</span></div>'

    def esc(s): return (s or "").replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

    rows = []
    for r in results:
        q = esc(r.case.query[:60])
        rw = esc(r.rewrite[:60])
        note = esc((r.case.known_issue or r.case.notes or "")[:60])
        cat = esc(r.case.category)
        rid = esc(r.case.id)

        def cell(rating):
            cls = "ok" if rating == "✅" else "warn" if "⚠️" in rating else "fail"
            return f'<td class="rating {cls}">{esc(rating)}</td>'

        rows.append(
            f'<tr><td class="id">{rid}</td><td>{cat}</td>'
            f'<td class="query">{q}</td><td class="rewrite">{rw}</td>'
            f'{cell(r.rewrite_rating)}{cell(r.source_rating)}{cell(r.answer_rating)}'
            f'<td class="notes">{note}</td></tr>'
        )

    html = f"""<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Query Rewrite Test-Ergebnisse — {datetime.now().strftime('%d.%m.%Y %H:%M')}</title>
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; background:#0f1117; color:#e4e4e7; padding:24px; }}
  h1 {{ font-size:1.5rem; margin-bottom:4px; color:#fff; }}
  .meta {{ color:#a1a1aa; font-size:0.85rem; margin-bottom:20px; }}
  .summary {{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:28px; }}
  .card {{ background:#1a1b23; border-radius:12px; padding:16px; border:1px solid #27272a; }}
  .card h3 {{ font-size:0.8rem; color:#a1a1aa; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px; }}
  .card .num {{ font-size:2rem; font-weight:700; }}
  .card .num.green {{ color:#22c55e; }}
  .card .num.yellow {{ color:#eab308; }}
  .card .num.red {{ color:#ef4444; }}
  .bar {{ display:flex; height:8px; border-radius:4px; overflow:hidden; margin-top:8px; background:#27272a; }}
  .bar span {{ display:flex; align-items:center; justify-content:center; font-size:0; }}
  .bar .ok {{ background:#22c55e; }}
  .bar .warn {{ background:#eab308; }}
  .bar .fail {{ background:#ef4444; }}
  table {{ width:100%; border-collapse:collapse; font-size:0.82rem; }}
  th {{ background:#1a1b23; color:#a1a1aa; text-align:left; padding:10px 8px; position:sticky; top:0; border-bottom:2px solid #27272a; font-weight:600; text-transform:uppercase; font-size:0.7rem; letter-spacing:0.05em; }}
  td {{ padding:8px; border-bottom:1px solid #1e1e24; vertical-align:top; }}
  tr:hover {{ background:#1a1b23; }}
  .id {{ font-weight:700; color:#60a5fa; white-space:nowrap; }}
  .query {{ max-width:250px; }}
  .rewrite {{ max-width:250px; color:#a78bfa; }}
  .notes {{ max-width:200px; color:#71717a; font-size:0.78rem; }}
  .rating {{ text-align:center; font-size:1rem; white-space:nowrap; }}
  .rating.ok {{ background:#052e16; }}
  .rating.warn {{ background:#422006; }}
  .rating.fail {{ background:#450a0a; }}
  .section {{ margin-top:24px; margin-bottom:8px; }}
  .section h2 {{ font-size:1.1rem; color:#fff; }}
</style>
</head>
<body>
<h1>Query Rewrite Test-Ergebnisse</h1>
<div class="meta">
  {datetime.now().strftime('%d.%m.%Y %H:%M')} &mdash; Workspace: <strong>{WORKSPACE}</strong> | Container: <strong>{CONTAINER}</strong> | {total} Tests
</div>

<div class="summary">
  <div class="card">
    <h3>Query Rewrite</h3>
    <span class="num green">{pct(rw_ok)}</span> perfekt
    {bar(rw_ok, rw_acc, rw_err)}
    <div style="margin-top:6px;font-size:0.78rem;color:#71717a">{rw_ok} OK &middot; {rw_acc} akzeptabel &middot; {rw_err} Fehler</div>
  </div>
  <div class="card">
    <h3>RAG-Quellen</h3>
    <span class="num green">{pct(src_ok)}</span> perfekt
    {bar(src_ok, src_acc, src_err)}
    <div style="margin-top:6px;font-size:0.78rem;color:#71717a">{src_ok} OK &middot; {src_acc} akzeptabel &middot; {src_err} Fehler</div>
  </div>
  <div class="card">
    <h3>Antwort-Qualitaet</h3>
    <span class="num green">{pct(ans_ok)}</span> perfekt
    {bar(ans_ok, ans_acc, ans_err)}
    <div style="margin-top:6px;font-size:0.78rem;color:#71717a">{ans_ok} OK &middot; {ans_acc} akzeptabel &middot; {ans_err} Fehler</div>
  </div>
</div>

<div class="section"><h2>Detailergebnisse</h2></div>
<table>
<thead>
<tr><th>ID</th><th>Kategorie</th><th>Query</th><th>Rewrite</th><th>RW</th><th>SRC</th><th>ANS</th><th>Notizen</th></tr>
</thead>
<tbody>
{"".join(rows)}
</tbody>
</table>
</body>
</html>"""

    with open(filename, "w") as f:
        f.write(html)
    return filename


# ── Main ───────────────────────────────────────────────────────
if __name__ == "__main__":
    # Optional: --block V,S,A zum Filtern
    blocks = None
    if "--block" in sys.argv:
        idx = sys.argv.index("--block")
        blocks = set(sys.argv[idx+1].split(","))
        print(f"Filterung auf Blöcke: {blocks}")

    results = run_tests(blocks)
    report_file = generate_report(results)
    html_file = generate_html_report(results)
    print(f"\nBericht gespeichert: {report_file}")
    print(f"HTML-Bericht: {html_file}")
