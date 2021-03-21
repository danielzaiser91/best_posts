import { Component } from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.sass']
})
export class ControlsComponent {
  fnMap: {[key: string]: VoidFunction} = {
    enlarge: this.enlarge,
    search: this.search,
    comment: this.comment
  };
  el: HTMLElement;

  constructor() { }

  onClick(ev: TouchEvent | MouseEvent) {
    const el = ev.target as HTMLElement;
    el.classList.forEach(cl => {
      if (cl in this.fnMap) {
        this.fnMap[cl]();
        return;
      }
    });
  }

  search() {
    console.log('clicked on search icon')
  }
  enlarge() {
    console.log('clicked on enlarge icon')
  }
  comment() {
    console.log('clicked on comment icon')
  }
}
