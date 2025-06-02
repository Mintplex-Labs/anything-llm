module.exports = {
  web_browsing: {
    api_key_missing: {
      google: "Ich kann die Google-Suche nicht verwenden, da der Benutzer die erforderlichen API-Schlüssel nicht definiert hat.\nBesuchen Sie: https://programmablesearchengine.google.com/controlpanel/create um die API-Schlüssel zu erstellen.",
      searchapi: "Ich kann die SearchApi-Suche nicht verwenden, da der Benutzer den erforderlichen API-Schlüssel nicht definiert hat.\nBesuchen Sie: https://www.searchapi.io/ um den API-Schlüssel kostenlos zu erstellen.",
      serper: "Ich kann die Serper.dev-Suche nicht verwenden, da der Benutzer den erforderlichen API-Schlüssel nicht definiert hat.\nBesuchen Sie: https://serper.dev um den API-Schlüssel kostenlos zu erstellen.",
      bing: "Ich kann die Bing-Websuche nicht verwenden, da der Benutzer den erforderlichen API-Schlüssel nicht definiert hat.\nBesuchen Sie: https://portal.azure.com/ um den API-Schlüssel zu erstellen.",
      serply: "Ich kann die Serply.io-Suche nicht verwenden, da der Benutzer den erforderlichen API-Schlüssel nicht definiert hat.\nBesuchen Sie: https://serply.io um den API-Schlüssel kostenlos zu erstellen.",
      searxng_url: "Ich kann die SearXNG-Suche nicht verwenden, da der Benutzer die erforderliche Basis-URL nicht definiert hat.\nBitte setzen Sie diesen Wert in den Agent-Skill-Einstellungen.",
      searxng_invalid: "Ich kann die SearXNG-Suche nicht verwenden, da die angegebene URL nicht gültig ist.",
      tavily: "Ich kann die Tavily-Suche nicht verwenden, da der Benutzer den erforderlichen API-Schlüssel nicht definiert hat.\nBesuchen Sie: https://tavily.com/ um den API-Schlüssel zu erstellen."
    },
    searching: {
      google: "Suche auf Google nach \"{{query}}\"",
      searchapi: "Verwende SearchApi zur Suche nach \"{{query}}\"",
      serper: "Verwende Serper.dev zur Suche nach \"{{query}}\"",
      bing: "Verwende Bing-Websuche zur Suche nach \"{{query}}\"",
      serply: "Verwende Serply zur Suche nach \"{{query}}\"",
      searxng: "Verwende SearXNG zur Suche nach \"{{query}}\"",
      tavily: "Verwende Tavily zur Suche nach \"{{query}}\"",
      duckduckgo: "Verwende DuckDuckGo zur Suche nach \"{{query}}\""
    },
    results_found: "Ich habe {{count}} Ergebnisse gefunden - überprüfe die Ergebnisse jetzt. (~{{tokens}} Token)"
  },
  
  web_scraping: {
    scraping_content: "Extrahiere den Inhalt von {{url}}",
    scraping_content_as: "Extrahiere den Inhalt von {{url}} als {{captureAs}}",
    scrape_failed: "konnte {{url}} nicht extrahieren. Ich kann den Inhalt dieser Seite nicht verwenden.",
    scrape_failed_generic: "Konnte {{url}} nicht extrahieren. Kann den Inhalt dieser Seite nicht verwenden.",
    content_too_long: "Der Inhalt dieser Seite ist viel zu lang. Ich werde ihn jetzt zusammenfassen.",
    content_too_long_tokens: "Der Inhalt dieser Seite ist viel zu lang ({{tokenCount}} Token). Ich werde ihn jetzt zusammenfassen.",
    successfully_scraped: "Inhalt von {{url}} erfolgreich extrahiert",
    no_content: "Es gab keinen Inhalt zum Sammeln oder Lesen.",
    successfully_summarized: "Inhalt erfolgreich zusammengefasst",
    no_selector: "Kein Selektor angegeben. Gebe das gesamte HTML zurück.",
    elements_found: "{{count}} Elemente gefunden, die dem Selektor entsprechen: {{selector}}"
  },
  
  memory: {
    no_local_content: "Ich habe lokal nichts gefunden, was bei der Beantwortung dieser Frage helfen würde.",
    found_context: "{{count}} zusätzliche Kontextinformationen gefunden, die bei der Beantwortung dieser Frage helfen.",
    saved_to_memory: "Ich habe den Inhalt im Langzeitgedächtnis der Vektordatenbank dieses Arbeitsbereichs gespeichert."
  },
  
  summarize: {
    looking_at_documents: "Schaue mir die verfügbaren Dokumente an.",
    found_documents: "{{count}} Dokumente gefunden",
    grabbing_content: "Hole den gesamten Inhalt für {{filename}}",
    summarizing: "Fasse {{filename}} zusammen..."
  },
  
  rechart: {
    invalid_json: "{{name}} hat ungültige JSON-Daten bereitgestellt - daher können wir kein {{type}}-Diagramm erstellen.",
    rendering: "Erstelle {{type}}-Diagramm."
  },
  
  save_file: {
    saving: "Speichere Datei {{filename}}."
  },
  
  sql: {
    running_query_on: "Ich werde eine Abfrage auf {{database_id}} ausführen, um eine Antwort zu erhalten.",
    running_sql: "Führe SQL aus: {{sql_query}}",
    checking_tables: "Überprüfe, welche Tabellen in der {{database_id}}-Datenbank verfügbar sind.",
    querying_schema: "Frage das Tabellenschema für {{table_name}} in der {{database_id}}-Datenbank ab.",
    checking_databases: "Überprüfe, welche Datenbanken verfügbar sind.",
    error: "Fehler: {{error}}"
  },
  
  flows: {
    executing: "Führe Ablauf aus: {{name}}",
    completed: "{{name}} erfolgreich abgeschlossen",
    failed: "Ablauf fehlgeschlagen: {{error}}",
    processing_llm: "Verarbeite Daten mit LLM-Anweisung...",
    sending_llm: "Sende Anfrage an LLM...",
    llm_response_received: "LLM-Antwort erfolgreich erhalten",
    api_request: "Führe {{method}}-Anfrage an externe API aus...",
    api_body: "Sende Body an {{url}}: {{body}}",
    api_failed: "Anfrage fehlgeschlagen mit Status {{status}}",
    api_completed: "API-Aufruf abgeschlossen"
  },
  
  mcp: {
    executing: "Führe MCP-Server aus: {{name}} mit {{args}}",
    completed: "MCP-Server: {{name}}:{{tool}} erfolgreich abgeschlossen",
    failed: "MCP-Server: {{name}}:{{tool}} fehlgeschlagen mit Fehler:"
  }
};
