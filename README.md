# BestOfReddit
eine einfache Webseite, die Daten von der Reddit-API fetched und diese darstellt.

Link zur Webseite: tbd...

kleine Vorwarnung: Ich beschreibe im Nachfolgenden die App in einem Gemisch aus Deutsch und Englisch :D

## <u>Verwendete Technologien:</u>

<u>**Angular**</u>

  - Api-Service (Injectable) --> rxjs Observables
  - Pipes ---> custom / selbstentwickelte Pipe
  - Routing
  - custom Typedefinitions
  - arbeiten mit der Reddit API ---> Serializen des Results
  - Angular Directives (ngFor, ngIf, property/event-Binding)
  - lazy loading (replacing src tags of imgs/thumbnails)
  - storing fetched requests, to save bandwidth and reduce load times (via session storage, so data doesn't persist)
  - nested ngIf templates (multi case view templating)
  - HostListener -> Escape Key schließt Vollbild-Vorschau

<u>**Sass:**</u>
  - Mixins
  - imports
  - functions
  - cool Background Animation
  - cool Buttons

<u>Probleme/Bugs:</u>
 - Vorspulen:
 
    von Reddit kann man nur Video und Audio Tracks getrennt fetchen.
    Das parallele pausieren / abspielen der beiden Tracks ist kein Problem, allerdings
    kann man mit der Audio WebAPI nicht vor-/zurückspulen, ich habe das Problem versucht zu lösen, indem ich die ffmpeg.wasm library eingebunden habe und die beiden Mediastreams gemerged habe, das hat allerdings zu einem out of memory bug geführt, woraufhin ich diesen Lösungsweg wieder verworfen habe und den Bug vorerst akzeptiere...
 - background:
   die Webseite wurde beim Aufruf aus der Sicht geschoben, lag an den CSS Vorgaben des eingebundenen
   Backgrounds, konnte ich beheben.

 - viele verschiedene media-formate, führen dazu, dass sehr viel custom code eingebaut werden muss, der die daten korrekt parsed...
   Beispiel: Reddit image, Reddit gallery, Video, Audio, Youtube, etc.

<u>Roadmap / ToDo:</u>
 - Angular FormDirective + Validation
 - check audio file exist
 - Animations
 - more Features
 - more Supported Formats
 - Design Rework
 - Bughunting

© Daniel Zaiser - 2021