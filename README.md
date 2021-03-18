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
 - autoplay next post (chaining videos, bzw. images after timeout)
 - move heavy logic into a webworker? (not currently necessary)
 - move everything to a seperate Component (multiple small components > one big component)
 - bigTodo: replace everything with ngrx-store?
 - dont show enlarge button when it wont have an effect
 - localization (translate to en, and possible more languages)
 - Datenschutzanpassungen für youtube cookies, und mehr
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

<span>18.03.2021:</span>
  - <u>👨‍🎨 Optisch:</u>
    - Postnummer wird oben rechts im Vollbild angezeigt
    - Anpassung der loading-Grafik (für Vollbildmodus, wenn höhere Qualität geladen wird)
  
  - <u>🤩 neue Features:</u>
    - 👏 unendlich weiterladen:
      - ein Button mit dem man weitere Posts mit selben Suchoptionen laden und hinzufügen kann
        - Button wird einmal unten auf der Seite angezeigt
        - und einmal im Vollbildmodus auf dem letzten Post der aktuellen Liste (zB auf Post 25/25)
      - Cache angepasst um dieses neue Feature zu unterstützen
      - Anzeige des aktuellen Posts als Nummer oben rechts im Vollbild-Modus
    - 👏📲 Touch Support für Vollbildmodus zum Wechseln zwischen Posts und zum Wechseln zwischen Galleriebildern


  - <u>	🛠 Änderung:</u>
  
  - <u>🐜 Bugfixing:</u>
    - Videos sind jetzt pausierbar im Vollbildmodus durch klick auf video
      - und nicht nur pausierbar, sondern auch weiterspielbar
    - Pfeil Navigation war invertiert, ist jetzt wie zu erwarten: Pfeil nach unten = nächster Post, Pfeil nach oben = vorheriger Post
    - Bug behoben: Bild lädt nicht höchste Qualität
      - war eigentlich kein Bug, sondern eine Reddit unerwartete JSON-Namenskonvention...
      - --> Bilder werden jetzt wie zu erwarten in Original-Qualität geladen beim Wechsel in Vollbildmodus
  
  - <u>🔋 Performance/Optimierungen:</u>
    - schnelleres Laden von Videos, durch Preloading
  
  - <u>👨‍💻 Dev-Changes:</u>
    - Auslagerung von CSS Code um ihn global Verfügbar zu machen (Button Styles)

  
Ältere Changelog findet man unter "changelogs/changelog.md"



© Daniel Zaiser - 2021




