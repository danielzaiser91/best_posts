# BestOfReddit
eine Single Page Application, die Daten von der Reddit-API fetched und diese darstellt.

Link zur Webseite: https://best-reddit-post.netlify.app/

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

<u>**Sass:**</u>
  - Mixins
  - imports
  - functions
  - ~~gallery Library~~ <em>(verworfen und eigene Version gebaut)</em>
  - cool Background Animation (credited)
  - cool custom Buttons

<u>**Desweiteren:**</u>
  - Version-Control mit Git & Github
  - Verwenden von Regulären Ausdrücken
  - Keyboard Controls for Gallery (Left/Right Arrow)

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
 - show loader when data is being replaced / lazy loaded
 - cinema Mode (Fullscreen which never needs to be left)
 - autoplay next post (chaining videos, bzw. images after timeout)
 - move heavy logic into a webworker? (not currently necessary, because workload is still low, because of highly efficient code)

# Changelog:

hier dokumentiere ich ab dem 08.03.2021 auf, was ich geändert habe:

08.03.2021:

- <u>Optisch:</u>
  - Styling der Gallerie geändert
  - Text im Fullscreen-Modus ist jetzt ein-/ausklappbar
  - Flexbox im View bewirkt jetzt, dass sich die Posts auf ganze Breite ziehen
- <u>Performance:</u>
  - IndexedDB löscht jetzt alte, nicht mehr verwendete Einträge -> Benötigt weniger Speicherplatz
  - Refactoring von Sass-Code -> less & cleaner Code
- <u>neue Features:</u>
  - Suchvorschläge
    - diese auch schön gestyled (schön ist relativ, da ich kein Designer bin 😂)
    - und anzeige der Subscriberzahl (als shortnumber)
  - Erweiterung der shortNumber Pipe --> millionen wird als m abgekürzt (wichtig für Vorschläge)
  - spinner beim fetchen von api daten (nur wenn sie in view sind, nicht wenn async)
  - Support vom Medientyp "Diskussion"
- <u>Bugfixing:</u>
  - better ErrorHandling for file-not-found



© Daniel Zaiser - 2021




