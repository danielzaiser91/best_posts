# BestOfReddit
eine Single Page Application, die Daten von der Reddit-API fetched und diese darstellt.

Link zur Webseite: https://best-reddit-post.netlify.app/

kleine Vorwarnung: Ich beschreibe im Nachfolgenden die App in einem Gemisch aus Deutsch und Englisch :D

## <u>Verwendete Technologien:</u>

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
  - Caching großer Daten mit IndexedDB, mithilfe der dexie Library

<u>**Sass:**</u>
  - Mixins
  - imports
  - functions
  - cool Background Animation
  - cool Buttons

<u>**Allgemein:**</u>
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

© Daniel Zaiser - 2021




