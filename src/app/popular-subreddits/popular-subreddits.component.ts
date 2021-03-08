import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popular-subreddits',
  templateUrl: './popular-subreddits.component.html',
  styleUrls: ['./popular-subreddits.component.sass']
})
export class PopularSubredditsComponent implements OnInit {
  @Input() subreddits: any[];
  @Output() choose = new EventEmitter<string>();
  page = 0;

  constructor() { }

  ngOnInit(): void { }
  onChoose(sub: string) {
    this.choose.emit(sub);
  }
}
