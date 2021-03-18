
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


<span>17.03.2021:</span>
  - <u>👨‍🎨 Optisch:</u>
    - Volume Control überarbeitet
      - wird jetzt mobil nicht mehr angezeigt und auf desktop nur noch bei hover
      - mute icon bei Lautstärke 0
  
  - <u>neue Features:</u>
    - <h1>OPTIONEN!!</h1> 🙌 endlich gibt es die Optionen 👏

      - damit ist es jetzt möglich Suchen zu filtern, sortieren und zu verfeinern.
      - Optionen sind:
        - Posts Filtern nach Zeit (Stunde, Tag, Woche, ...)
        - Posts sortieren nach Kriterien: Top, Hot, New, Rising
        - Posts limitieren auf 25,50,75,100 pro Seite (Seitenfunktion kommt in Zukunft)
        - Suchbegriff: Einschränkung der Ergebnisse auf eingegebenen Suchbegriff
      - ---> Das Coole: Ein Preferencing System wurde direkt mit implementiert, es werden also viele Optionen vom Nutzer gespeichert, zB Suchoptionen, Lautstärke, etc.
    - <h2>Routing</h2>
      - 👏 jetzt wird in der URL der aktive Subreddit angezeigt und ist auch über die URL erreichbar!
    - Suchvorschläge sind nach Relevanz sortiert (neuer reddit-API-Suchalgorithmus)
    - Suchvorschläge können private Subreddits enthalten, diese werden besonders angezeigt (subCount NULL und alert on click)
    - Caching von geladenen Inhalten (sehr schnelles Neuladen)
      - für jede gewählte Optionen-Kombination wird existiert ein eigener, seperater Cache
      - Löschung von gecachedten Inhalten manuell möglich (nicht empfohlen, da schon automatisch sehr gut)
    - Fehlermeldung, wenn ein Subreddit nicht geladen werden konnte (Hauptgrund: Privat)
    - neue unterstützte Medieninhalte: 
      - Crosspost
        - Anzeigen von Crosspost-Daten (von wo und wieviele Likes hat das Original)
      - Vimeo
        - wird ähnlich wie youtube behandelt und dargestellt
    - Volume Control überarbeitet
      - klick auf unteren Lautsprecher -> Mute / Unmute (vorherige Lautstärke)
      - klick auf oberen Lautsprecher -> Max Lautstärke / vorherige Lautstärke
      - Lautstärkeanpassungen werden nach schließen des Vollbildmodusses als preference gespeichert und für zukünftige Videos übernommen.
    - pagination für empfohlene Subreddit-Liste (most popular subreddits / Button oben links)
      - zeigt jetzt 100 Vorschläge (10 pro Seite)
    

  - <u>Änderung:</u>
    - der Button oben rechts wurde entfernt, mit dem man zwischen bereits besuchten Subreddits wechseln konnte, Grund: man soll lieber neue Subreddits suchen statt zwischen den selben hin und herzuwechseln, das ist zwar immer noch möglich, dieses Verhalten soll aber nicht gefördert werden.
    - durch die neue Suche ist das vorherige fetchen von 3500 subreddits für meine eigene implementierung der Suche inklusive der dazugehörigen IndexedDB Datenbank (mit Dexie) nicht mehr notwendig geworden.
      - --> entfernt
    

  - <u>🐜 Bugfixing:</u>
    - Diskussionen ohne Inhalt (die ihren kompletten Inhalt im Titel haben), bekommen jetzt den Titel als Text
    - bessere Lesbarkeit / Darstellung von Diskussionstexten (Text läuft nicht mehr über Bildschirmrand)

  - <u>🔋 Performance/Optimierungen:</u>
    - viel refactoring, siehe Dev-Changes

  - <u>Vorarbeit für zukünftige Features:</u>
    - Seitenfunktion: In zukunft gibt es unendlich viele anzeigbare Seiten
      - evtl automatisches Laden neuer Seiten, beim erreichen des unterren Bildschirmrandes
    - User Preferencing: Eröffnet viele neue Möglichkeiten

  - <u>👨‍💻 Dev-Changes:</u>
    - customWebpackConfig - customizing Angular Webpacker Config for dev and prod
      - circularDependency Detection
      - aggregateTimeout -- only recompile after a set timeout value (1.5s), to be able to save multiple files without bundler recompiling every single file
      - webpack-bundle-analyzer
    - clean filestructur, big re-organization of files, preparing for scalability & Cleaner Code
      - one file for all subfiles that are used accross the app, specifically:
        - functions
        - components
        - services
        - pipes
        - types
      - -> resulting in clean imports (one import call instead of many)
    - using ReactiveFormsModule for all forms now = better validation & stream of formData
      - clean up html-form code
    - gallery Component refactored, von ngIfElse zu ngSwitch
