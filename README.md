# BestOfReddit
eine Single Page Application, die Daten von der Reddit-API fetched und diese darstellt.

Link zur Webseite: https://best-reddit-post.netlify.app/ (Always up to date - automagically 🤗)
Link zum Dockerimage: https://hub.docker.com/r/danielzaiser91/best_reddit (Always up to date - automagically 🤗)

kleine Vorwarnung: Ich beschreibe im Nachfolgenden die App in einem Gemisch aus Deutsch und Englisch :D

## <u>Projektbeginn:</u>

Das Projekt habe ich am 03.03.2021 begonnen um zum einen meine Fähigkeiten als Webentwickler zu demonstrieren und zum anderen, weil ich mit dem Projekt etwas erschaffe, was ich vorhabe auch selbst zu nutzen. 😄

## <u>Verwendete Technologien und implementierte Features:</u>

<u>**Angular**</u>
  - Api-Service (Injectable) --> rxjs Observables
  - View-Pipes ---> custom / selbstentwickelte Pipe zur Formatierung der likes (zB: 25345 -> 25k)
  - Routing
  - custom Typedefinitions
  - arbeiten mit der Reddit API ---> Serializen des Results
  - Angular Directives (ngFor, ngIf, property/event-Binding)
  - lazy loading (replacing src tags of imgs/thumbnails)
  - storing fetched requests, to save bandwidth and reduce load times (via session storage, so data doesn't persist)
  - nested ngIf templates (multi case view templating)
  - HostListener -> Escape Key schließt Vollbild-Vorschau
  - Complex Observable handling, with multiple rxjs operators (pipe, map, forkjoin, ...)
    ---> Mehrere gleichzeitige parallele api requests die erst weiterabgearbeitet werden, wenn alle erfüllt sind.
    ---> Fetching 3500 Subreddit Data für die Vorschläge beim Tippen
  - Caching großer Daten mit IndexedDB, mithilfe der dexie.js Library
  - Webpack bundling (minify, optimize, uglify, etc.)

<u>**Typescript**</u>
  - Transpiling
  - Linting
  - Polyfill

<u>**Sass:**</u>
  - Mixins
  - imports
  - functions
  - ~~gallery Library~~ <em>(verworfen und eigene Version gebaut)</em>
  - cool Background Animation (credited)
  - cool custom Buttons
  - Polyfills

<u>**Desweiteren:**</u>
  - Version-Control mit Git & Github
  - Verwenden von Regulären Ausdrücken
  - Keyboard Controls for Gallery (Left/Right Arrow)
  - Responsive Design
  - Automatisches Deployen der Webseite auf Netlify
  - Automatisches Deployen des Docker-Images auf DockerHub

<u>Probleme/Bugs:</u>
 - Vorspulen:
 
    von Reddit kann man nur Video und Audio Tracks getrennt fetchen.
    Das parallele pausieren / abspielen der beiden Tracks ist kein Problem, allerdings
    kann man mit der Audio WebAPI nicht vor-/zurückspulen, ich habe das Problem versucht zu lösen, indem ich die ffmpeg.wasm library eingebunden habe und die beiden Mediastreams gemerged habe, das hat allerdings zu einem out of memory bug geführt, woraufhin ich diesen Lösungsweg wieder verworfen habe und den Bug vorerst akzeptiere...
    ----> Ich konnte den Bug nun lösen, indem ich die currentTime Methode der Audio/Video Web-Api verwende
 - background:
   die Webseite wurde beim Aufruf aus der Sicht geschoben, lag an den CSS Vorgaben des eingebundenen
   Backgrounds, konnte ich beheben.

 - viele verschiedene media-formate, führen dazu, dass sehr viel custom code eingebaut werden muss, der die daten korrekt parsed...
   Beispiel: Reddit image, Reddit gallery, Video, Audio, Youtube, etc.
 - iframe src attribute angular binding bug... erst mit DomSanitizer versucht, dann aber gelöst indem man "lazy loaded"
 - youtube eingebundene iframes lassen sich nur per youtube api pausieren (was notwendig ist nach schließen vom custom fullscreen)... problematisch...
   --> meine Lösung: Nach dem Schließen des custom gallery fullscreens wird der iframe weiterhin angezeigt.
 - deploying with netlify (automated builds on each github master commit)
 - bundling with webpack
 - aus irgendeinem Grund werden manche Metadaten doppelt gespeichert...

<u>Roadmap / ToDo:</u>
 - Angular FormDirective + Validation
 - check audio file exist
 - Animations
 - more Features
 - more Supported Formats
 - Design Rework
 - Bughunting
 - I can't get enough - Feature (add a "more of this" button, which loads the next "page" (pagination api call by id+limit))
 - cinema Mode (Fullscreen which never needs to be left)
 - autoplay next post (chaining videos, bzw. images after timeout)
 - move heavy logic into a webworker? (not currently necessary, because workload is still low, because of highly efficient code)
 - move everything to a seperate Component (multiple small components > one big component)
 - pagination for suggestion and popular subreddit (frontend is already implemented, backend logic missing)
 - feature-rich User Preference Settings (see <a href="#zukunft1">Changelog-Entry</a> from <a href="#09.03.2021">09.03.2021</a>)
 - bigTodo: replace everything with ngrx-store?
 - Users like to scroll, so maybe add a scrollfeature that lets you scroll through all posts vertically one by one
 - better touch device support
 - dont show enlarge button when it wont have an effect

# Changelog:

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
  
  - <u>neue Features:</u>
    - 🐳 Docker Image with automated build on latest release: https://hub.docker.com/r/danielzaiser91/best_reddit
    - Greetings-Component:
      - neue Nutzer werden bei erstem Seitenaufruf mit einem Popup begrüßt der kurz vorstellt was die Seite macht und wie sie funktioniert.
    - show loader when images are being replaced / lazy loaded

  - <u>🐜 Bugfixing:</u>
    - Medieninhalte sind wieder bedienbar
    - Diskussions-Text läuft nicht mehr über den Rand
  
  - <u>🔋 Performance/Optimierungen:</u>
    - centralizing core logic (moving MetadataFetch from component to service)
    - refactoring

  - <u>Vorarbeit für zukünftige Features:</u>
    - Future SVG Support via angular-svg-icon 🤗


© Daniel Zaiser - 2021




