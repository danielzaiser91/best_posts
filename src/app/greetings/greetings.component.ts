import { Component, ElementRef, ViewChild } from '@angular/core';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-greetings',
  templateUrl: './greetings.component.html',
  styleUrls: ['./greetings.component.sass']
})
export class GreetingsComponent {
  @ViewChild('remember') remember: ElementRef;
  page = 0;
  doRemember = false;

  constructor(private store: StorageService) {
    this.doRemember = this.store.getSavedLS('remember');
  }

  onNext() {
    this.page++;
    if (this.remember?.nativeElement.checked) this.store.saveLS('remember', true);
  }
}
