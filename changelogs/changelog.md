
hier dokumentiere ich ab dem 08.03.2021 auf, was ich geändert habe:

08.03.2021:

- <u>👨‍🎨 Optisch:</u>
  - Styling der Gallerie geändert
  - Text im Fullscreen-Modus ist jetzt ein-/ausklappbar
  - Flexbox im View bewirkt jetzt, dass sich die Posts auf ganze Breite ziehen
- <u>🔋 Performance:</u>
  - IndexedDB löscht jetzt alte, nicht mehr verwendete Einträge -> Benötigt weniger Speicherplatz
  - Refactoring von Sass-Code -> less & cleaner Code
- <u>neue Features:</u>
  - Suchvorschläge
    - diese auch schön gestyled (schön ist relativ, da ich kein Designer bin 😂)
    - und anzeige der Subscriberzahl (als shortnumber)
  - Erweiterung der shortNumber Pipe --> millionen wird als m abgekürzt (wichtig für Vorschläge)
  - spinner beim fetchen von api daten (nur wenn sie in view sind, nicht wenn async)
  - Support vom Medientyp "Diskussion"
  - enlarge Button zum Togglen der Maximierung von Inhalten im Vollbildmodus (nur für Bilder und Bilder-Gallerien)
  - new Component: <u>List of Most Popular Subreddits</u>
    - sorted by most popular first
    - displays number of subscribers)
    - click sets chosen subreddit to current subreddit, fetches data from api and displays posts
    - coming soon: pagination
- <u>🦗 Bugfixing:</u>
  - better ErrorHandling for file-not-found

<span id="09.03.2021">09.03.2021:</span>
  - <u>👨‍🎨 Optisch:</u>
    - Subredditliste schließt jetzt nach der Auswahl eines Subreddits
    - Beim öffnen eines Posts in den Vollbild-Modus, werden jetzt die Titel-Texte automatisch ausgeklappt
    - Post-Titel die überlaufen werden jetzt auch im Vollbild-Modus mit Punkten gekennzeichnet
    - jetzt gibt es für das vergrößern-Feature 2 verschiedene Symbole: ➖ und ➕
    - FSK 18 Icon für Subreddits die die over18 flag haben
    - nsfw Posts werden mit dem fsk18 icon markiert
      - in Zukunft: diese Einstellung kann in den User-Preferences aufgehoben werden.
    - padding oben und unten auf der Seite hinzugefügt.
    - Suchbutton entfernt, da er nicht mehr nötig ist.
    - 👍 Thumbsup-Icons für die Upvotes hinzugefügt
    - Upvote Style überarbeitet
    - Styles der Fullscreen-Controls überarbeitet
  - <u>neue Features:</u>
    - 🐳 Docker Support (optimized Dockerfile) 🐳
    - Support neuer Medieninhalte (Links zu Artikeln)
      - --> default Image + Styling
    - nach verlassen des Fullscreens wird das Vergrößern des Bildes (falls vom User gemacht) wieder rückgängig gemacht
    - 💾 Suche speichert jetzt gefundene, nicht indexierte Subreddits für zukünftige Suchen
    - SubredditSuche: Exakte Treffer haben Priorität (werden zuerst vorgeschlagen)
    - Man kann jetzt zwischen Posts mit den ⬆⬇ Pfeiltasten wechseln 🤩
  - <u>🐜 Bugfixing:</u>
    - 🎬 Die Escape-Taste pausiert jetzt laufende Videos korrekt
    - fixing a rare occurence of infinite loading
  - <u>🔋 Performance/Optimierungen:</u>
    - Code Refactoring --> kürzere Ladezeiten
    - Client-Database in einen Service ausgelagert, sodass sie von jedem Component aus zugänglich ist.
    - Code Linting --> bessere Maintainability
    - rxjs Observer bleiben nur solange subscribed zu einem Observable wie unbedingt notwendig (meistens nur 1x)
    - 👾 HUGE Performance increase in data sizes, resulting in 10 times less space needed. By optimizing DataBase Efficiency and Data filtering. 🤩
    - Much less runtime Space requirements, less cpu and less memory footprint 🐱‍💻
  - <u id="zukunft1">Vorarbeit für zukünftige Features:</u>
    - Usersettings (technische Vorraussetzungen)
      - in Zukunft kann man persönliche Einstellungen pflegen, sodass man eine bessere Nutzererfahrung hat, zB bevorzugte Subs,
        preloading von bevorzugten Inhalten, anzeigen/verstecken von nsfw Posts, speichern aller bereits gesehenen Inhalte und 
        Option keine Inhalte angezeigt zu bekommen, die man bereits angesehen hat.


<span>10.03.2021:</span>
  - <u>👨‍🎨 Optisch:</u>
    - control Button Liste ist jetzt auf einer extra Leiste
    - Webseite wurde komplett neu designed um ein einheitliches farbschema zu repräsentieren (Nachthimmelblau)
    - neue icons bzw icons ersetzt für Vollbildmodus (Redditlink, plus, minus, x)
    - no-audio-icon redesign
  
  - <u>neue Features:</u>
    - 🐳 Docker Image with automated build on latest release: https://hub.docker.com/r/danielzaiser91/best_reddit
    - Greetings-Component:
      - neue Nutzer werden bei erstem Seitenaufruf mit einem Popup begrüßt der kurz vorstellt was die Seite macht und wie sie funktioniert.
      - wird nur 1x angezeigt, falls haken gesetzt wird (gespeichert in localstorage)
      - animiertes selbsterstelltes icon (pfeil nach rechts)
    - show loader when images are being replaced / lazy loaded
    - volume slider on videos, finally 😍 (cool, but needs redesign, beecause it looks ugly, and performs clunky on mobile)
    - impressum component, but needs to be linked (accessible via /impressum for now)
    - Player merkt sich Audio Lautstärke und setzt sie beim starten des nächsten Videos. (localstorage)

  - <u>🐜 Bugfixing:</u>
    - Medieninhalte sind wieder bedienbar
    - Diskussions-Text läuft nicht mehr über den Rand
  
  - <u>🔋 Performance/Optimierungen:</u>
    - centralizing core logic (moving MetadataFetch from component to service)
    - refactoring

  - <u>Vorarbeit für zukünftige Features:</u>
    - Future SVG Support via angular-svg-icon 🤗

  - <u>Changes:</u>
    - Removing the gifv-settings button, and always showing gifv controls instead.
