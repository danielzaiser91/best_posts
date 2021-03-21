import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[mediaHost]',
})
export class MediaDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
