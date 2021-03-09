import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Subreddit } from '../redditTypes';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-popular-subreddits',
  templateUrl: './popular-subreddits.component.html',
  styleUrls: ['./popular-subreddits.component.sass']
})
export class PopularSubredditsComponent implements OnInit {
  @Output() choose = new EventEmitter<string>();
  subreddits: Subreddit[];
  page = 0;

  constructor(private store: StorageService) {}

  ngOnInit(): void {
    this.store.metaDataState.pipe(filter(val => !!val)).subscribe(() => {
      this.store.reddit.meta.toArray().then(meta => this.subreddits = meta as Subreddit[]);
    });
  }

  onChoose(sub: string, el: HTMLElement) {
    el.classList.add('hide');
    this.choose.emit(sub);
  }
}
