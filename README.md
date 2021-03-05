# BestOfReddit
<u>Beschreibung der App:</u> eine einfache Webseite, die Daten von der Reddit-API fetched und diese darstellt.

Verwendete Technologien:

<u>**Angular**</u>

  - Api-Service (Injectable) --> rxjs Observables
  - Pipes ---> custom / selbstentwickelte Pipe
  - Routing
  - custom Typedefinitions
  - arbeiten mit der Reddit API ---> Serializen des Results
  - Angular Directives (ngFor, ngIf, property/event-Binding)
  - lazy loading (replacing src tags of imgs/thumbnails)

<u>**Sass:**</u>
  - Mixins
  - imports
  - functions

<u>Probleme/Bugs:</u>
 - Vorspulen:
 
    von Reddit kann man nur Video und Audio Tracks getrennt fetchen.
    Das parallele pausieren / abspielen der beiden Tracks ist kein Problem, allerdings
    kann man mit der Audio WebAPI nicht vor-/zurückspulen, ich habe das Problem versucht zu lösen, indem ich die ffmpeg.wasm library eingebunden habe und die beiden Mediastreams gemerged habe, das hat allerdings zu einem out of memory bug geführt, woraufhin ich diesen Lösungsweg wieder verworfen habe und den Bug vorerst akzeptiere...

<u>Roadmap / ToDo:</u>
 - Angular FormDirective + Validation

© Daniel Zaiser - 2021