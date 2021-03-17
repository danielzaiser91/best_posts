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


<u>Roadmap / ToDo:</u>
 - Animations
 - I can't get enough - Feature (add a "more of this" button, which loads the next "page" (pagination api call by id+limit))
 - cinema Mode for mobile version (desktop has this with arrow down/up)
 - autoplay next post (chaining videos, bzw. images after timeout)
 - move heavy logic into a webworker? (not currently necessary)
 - move everything to a seperate Component (multiple small components > one big component)
 - bigTodo: replace everything with ngrx-store?
 - better touch device support
 - dont show enlarge button when it wont have an effect
 - localization (translate to en, and possible more languages)
 - Datenschutzanpassungen für youtube cookies
 - option to autoplay gifs on thumbnail
 - add Unittests for evertything and connect repository to an automated ci tool (like travis for example)
 - img.gif optimizations...
 - Trending Subreddits
 - Offline Usability
 - PWA
 - show comments

(viele Punkte auf der Roadmap habe ich bereits gelöscht, da ich sie umgesetzt habe 😉)

# Changelog:

## Aktueller Changelog:

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

Ältere Changelog findet man unter "changelogs/changelog.md"



© Daniel Zaiser - 2021




