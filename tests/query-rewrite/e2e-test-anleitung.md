# E2E Test: Search & Retrieval (Query Rewrite)

## Was wird getestet
Das dreistufige Query-Rewrite-Konfigurationssystem:
- **System-Setting** (Admin GUI): "Search & Retrieval" Seite
- **Workspace-Override** (pro Workspace): Dropdown mit 3 Optionen
- **Fallback-Chain**: Workspace > System-Setting > ENV > "off"

## Voraussetzungen
- Container mit neuem Image laeuft (z.B. `praesentation`)
- Chrome Extension installiert + Chrome offen (fuer GUI-Tests)
- API-Key und JWT-Token (siehe Setup unten)

---

## Setup: Zugangsdaten ermitteln

```bash
# Container und Port finden
docker ps --filter "name=praesentation" --format "{{.Names}} {{.Ports}}"

# JWT-Token holen (Login als admin)
PORT=XXXXX  # Port aus obigem Befehl
curl -s -X POST "http://localhost:$PORT/api/request-token" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | python3 -m json.tool
# → token-Feld kopieren

# API-Key holen
docker exec -w /app/server praesentation node -e "
const{PrismaClient}=require('./node_modules/@prisma/client');const p=new PrismaClient();
p.api_keys.findFirst().then(k=>{console.log(k?.secret);p.\$disconnect()});"

# Workspace-Slug pruefen
docker exec -w /app/server praesentation node -e "
const{PrismaClient}=require('./node_modules/@prisma/client');const p=new PrismaClient();
p.workspaces.findMany({select:{slug:true,name:true}}).then(w=>{console.log(JSON.stringify(w,null,2));p.\$disconnect()});"
```

Variablen fuer alle Tests:
```
PORT=XXXXX
JWT=eyJ...
KEY=XXXXX-XXXXX-XXXXX-XXXXX
SLUG=chatbot
URL=https://praesentation.ki.kufer.de
```

---

## TEIL 1: API-Tests (ohne Browser)

### Test 1.1: System-Setting CRUD

```bash
# Lesen (Default)
curl -s "http://localhost:$PORT/api/admin/system-preferences-for?labels=query_rewrite_default" \
  -H "Authorization: Bearer $JWT"
# Erwartung: {"settings":{"query_rewrite_default":"off"}}

# Schreiben: ON
curl -s -X POST "http://localhost:$PORT/api/admin/system-preferences" \
  -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"query_rewrite_default":"on"}'
# Erwartung: {"success":true}

# Verifizieren
curl -s "http://localhost:$PORT/api/admin/system-preferences-for?labels=query_rewrite_default" \
  -H "Authorization: Bearer $JWT"
# Erwartung: "on"

# Schreiben: OFF
curl -s -X POST "http://localhost:$PORT/api/admin/system-preferences" \
  -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"query_rewrite_default":"off"}'

# Validation: ungueltiger Wert → "off"
curl -s -X POST "http://localhost:$PORT/api/admin/system-preferences" \
  -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"query_rewrite_default":"garbage"}'
# Lesen → Erwartung: "off"
```

### Test 1.2: Workspace queryRewriteMode + queryRewriteModeRaw

```bash
# Workspace lesen (internes API mit aufgeloestem Wert)
curl -s "http://localhost:$PORT/api/workspace/$SLUG" -H "Authorization: Bearer $JWT"
# Erwartung: queryRewriteMode (aufgeloest) + queryRewriteModeRaw (DB-Wert)

# Workspace auf "systemDefault" setzen → null in DB
curl -s -X POST "http://localhost:$PORT/api/workspace/$SLUG/update" \
  -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"queryRewriteMode":"systemDefault"}'
# Erwartung: queryRewriteModeRaw = null

# Workspace auf "on"
curl -s -X POST "http://localhost:$PORT/api/workspace/$SLUG/update" \
  -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"queryRewriteMode":"on"}'

# Workspace auf "off"
curl -s -X POST "http://localhost:$PORT/api/workspace/$SLUG/update" \
  -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"queryRewriteMode":"off"}'
```

### Test 1.3: Funktionstest — 7 Kombinationen

Fuer jeden Fall:
1. System-Setting und Workspace-Wert setzen (per API)
2. Anzahl QueryRewrite-Logs zaehlen VORHER
3. Chat-Request mit Folgefrage senden
4. Anzahl QueryRewrite-Logs zaehlen NACHHER
5. Differenz = Rewrite aktiv (ja/nein)

Chat-History (Kontext):
```json
[
  {"role":"user","content":"Gibt es Yoga-Kurse?"},
  {"role":"assistant","content":"Ja, Yoga fuer Anfaenger und Yoga Aufbaukurs."}
]
```

Folgefrage: `"Wann finden die statt?"`

| Fall | System-Setting | Workspace | Erwarte | Begruendung |
|------|---------------|-----------|---------|-------------|
| 1 | NULL (nie gesetzt) | NULL | AUS | Kein Setting → Default "off" |
| 2 | off | NULL | AUS | System sagt off |
| 3 | on | NULL | AN | System sagt on, Workspace folgt |
| 4 | off | off | AUS | Beide off |
| 5 | off | on | AN | Workspace Override |
| 6 | on | on | AN | Beide on |
| 7 | on | off | AUS | Workspace Override |

Automatisiertes Skript:
```bash
HISTORY='[{"role":"user","content":"Gibt es Yoga-Kurse?"},{"role":"assistant","content":"Ja, Yoga fuer Anfaenger und Yoga Aufbaukurs."}]'

# System-Setting setzen
set_sys() {
  if [ "$1" = "NULL" ]; then
    docker exec -w /app/server praesentation node -e "
    const{PrismaClient}=require('./node_modules/@prisma/client');const p=new PrismaClient();
    p.system_settings.deleteMany({where:{label:'query_rewrite_default'}}).then(()=>p.\$disconnect());"
  else
    curl -s -X POST "http://localhost:$PORT/api/admin/system-preferences" \
      -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
      -d "{\"query_rewrite_default\":\"$1\"}" > /dev/null
  fi
}

# Workspace setzen
set_ws() {
  if [ "$1" = "NULL" ]; then
    curl -s -X POST "http://localhost:$PORT/api/workspace/$SLUG/update" \
      -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
      -d '{"queryRewriteMode":"systemDefault"}' > /dev/null
  else
    curl -s -X POST "http://localhost:$PORT/api/workspace/$SLUG/update" \
      -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
      -d "{\"queryRewriteMode\":\"$1\"}" > /dev/null
  fi
}

# Test ausfuehren
test_case() {
  local nr="$1" sys="$2" ws="$3" expect="$4"
  set_sys "$sys"; set_ws "$ws"; sleep 1
  local before=$(docker logs praesentation 2>&1 | grep -c "\[QueryRewrite\]")
  curl -s --max-time 30 -X POST "http://localhost:$PORT/api/v1/workspace/$SLUG/chat" \
    -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
    -d "{\"message\":\"Wann finden die statt?\",\"mode\":\"query\",\"chatHistory\":$HISTORY}" > /dev/null
  sleep 2
  local after=$(docker logs praesentation 2>&1 | grep -c "\[QueryRewrite\]")
  local result="AUS"; [ "$after" -gt "$before" ] && result="AN"
  if [ "$result" = "$expect" ]; then
    printf "Fall %s: System=%-4s Workspace=%-4s → %-3s  PASS\n" "$nr" "$sys" "$ws" "$expect"
  else
    printf "Fall %s: System=%-4s Workspace=%-4s → %-3s  FAIL (war %s)\n" "$nr" "$sys" "$ws" "$expect" "$result"
  fi
}

# Alle 7 Faelle
test_case 1 "NULL" "NULL" "AUS"
test_case 2 "off"  "NULL" "AUS"
test_case 3 "on"   "NULL" "AN"
test_case 4 "off"  "off"  "AUS"
test_case 5 "off"  "on"   "AN"
test_case 6 "on"   "on"   "AN"
test_case 7 "on"   "off"  "AUS"
```

---

## TEIL 2: GUI-Tests (mit @browser Chrome Extension)

### Voraussetzung
- Chrome Extension "Claude in Chrome" installiert (v1.0.36+)
- Chrome offen
- In VS Code Claude Code: `@browser` verwenden

### Test 2.1: Admin-Seite "Search & Retrieval"

```
@browser Oeffne $URL/settings/search-retrieval
Pruefe:
- Titel "Suche & Retrieval" (oder "Search & Retrieval" auf EN) sichtbar?
- Dropdown fuer Query Rewriting vorhanden mit Optionen "On" und "Off"?
- Aktueller Wert wird korrekt angezeigt?
```

```
@browser Auf der Search & Retrieval Seite:
- Waehle "On" im Dropdown
- Klicke den Save-Button
- Lade die Seite neu (F5)
- Steht immer noch "On"?
```

```
@browser Auf der Search & Retrieval Seite:
- Waehle "Off" im Dropdown
- Klicke Save
- Lade die Seite neu
- Steht "Off"?
```

### Test 2.2: Workspace-Dropdown (3 Optionen)

```
@browser Oeffne $URL/workspace/$SLUG/settings/vector-database
Pruefe:
- Query Rewriting Dropdown vorhanden?
- Hat genau 3 Optionen: "System default (...)", "On", "Off"?
- Was steht in den Klammern bei "System default"? (On oder Off)
```

### Test 2.3: System-Default-Label aktualisiert sich

```
@browser
1. Oeffne $URL/settings/search-retrieval
2. Setze auf "On", klicke Save
3. Oeffne $URL/workspace/$SLUG/settings/vector-database
4. Pruefe: Steht jetzt "System default (On)"?
5. Gehe zurueck zu $URL/settings/search-retrieval
6. Setze auf "Off", klicke Save
7. Oeffne $URL/workspace/$SLUG/settings/vector-database
8. Pruefe: Steht jetzt "System default (Off)"?
```

### Test 2.4: Sidebar-Navigation

```
@browser Oeffne $URL/settings/llm-preference
Pruefe im Settings-Sidebar links:
- "Search & Retrieval" (oder "Suche & Retrieval") als Menuepunkt sichtbar?
- Liegt zwischen "Text Splitting" und "Voice & Speech"?
- Klicke drauf → landet auf /settings/search-retrieval?
```

---

## TEIL 3: GUI + Funktionalitaet kombiniert (6 Runden)

Fuer jeden Fall:
1. Einstellung in der GUI aendern (per @browser)
2. Chat-Request per API senden (per curl)
3. Pruefen ob QueryRewrite-Log erscheint

### Vorbereitung
Workspace auf "System default" setzen:
```
@browser Oeffne $URL/workspace/$SLUG/settings/vector-database
Setze Query Rewriting auf "System default", klicke Save
```

### Runde 1: System=ON, Workspace=System default → AN
```
@browser Oeffne $URL/settings/search-retrieval, setze auf "On", klicke Save
```
Dann API-Test:
```bash
BEFORE=$(docker logs praesentation 2>&1 | grep -c "\[QueryRewrite\]")
curl -s --max-time 30 -X POST "http://localhost:$PORT/api/v1/workspace/$SLUG/chat" \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d "{\"message\":\"Wann finden die statt?\",\"mode\":\"query\",\"chatHistory\":$HISTORY}" > /dev/null
sleep 2
AFTER=$(docker logs praesentation 2>&1 | grep -c "\[QueryRewrite\]")
[ "$AFTER" -gt "$BEFORE" ] && echo "PASS" || echo "FAIL"
```

### Runde 2: System=OFF, Workspace=System default → AUS
```
@browser Oeffne $URL/settings/search-retrieval, setze auf "Off", klicke Save
```
Dann gleicher API-Test → erwarte KEIN neuer Rewrite-Log

### Runde 3: System=OFF, Workspace=ON → AN
```
@browser Oeffne $URL/workspace/$SLUG/settings/vector-database, setze Query Rewriting auf "On", klicke Save
```
API-Test → erwarte Rewrite

### Runde 4: System=ON, Workspace=OFF → AUS
```
@browser
1. Oeffne $URL/settings/search-retrieval, setze auf "On", klicke Save
2. Oeffne $URL/workspace/$SLUG/settings/vector-database, setze auf "Off", klicke Save
```
API-Test → erwarte KEIN Rewrite

### Runde 5: System=ON, Workspace=ON → AN
```
@browser Oeffne $URL/workspace/$SLUG/settings/vector-database, setze auf "On", klicke Save
```
API-Test → erwarte Rewrite

### Runde 6: System=OFF, Workspace=OFF → AUS
```
@browser
1. Oeffne $URL/settings/search-retrieval, setze auf "Off", klicke Save
2. Oeffne $URL/workspace/$SLUG/settings/vector-database, setze auf "Off", klicke Save
```
API-Test → erwarte KEIN Rewrite

---

## Zusammenfassung Erwartungen

| Test | System | Workspace | Rewrite |
|------|--------|-----------|---------|
| 1 | ON | System default | AN |
| 2 | OFF | System default | AUS |
| 3 | OFF | ON | AN |
| 4 | ON | OFF | AUS |
| 5 | ON | ON | AN |
| 6 | OFF | OFF | AUS |
| 7* | NULL | NULL | AUS |

*Fall 7 nur per API testbar (System-Setting nie gesetzt)

## Hinweise
- Container-Name und Port koennen variieren → immer vorher mit `docker ps` pruefen
- JWT-Token hat Ablaufzeit → bei Bedarf neuen holen via `/api/request-token`
- Admin-Endpoints nutzen JWT (`/api/admin/...`), v1-Endpoints nutzen API-Key (`/api/v1/...`)
- QueryRewrite-Logs pruefen via: `docker logs CONTAINER 2>&1 | grep "\[QueryRewrite\]"`
- Die Rewrite-Qualitaet haengt vom LLM ab — der Test prueft nur ob Rewrite stattfindet, nicht die Qualitaet
