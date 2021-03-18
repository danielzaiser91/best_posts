import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { take } from 'rxjs/operators';

import { Subreddit } from 'app/types';
import { RedditAPIService } from 'app/services';

@Component({
  selector: 'app-popular-subreddits',
  templateUrl: './popular-subreddits.component.html',
  styleUrls: ['./popular-subreddits.component.sass']
})
export class PopularSubredditsComponent implements OnInit {
  @Output() choose = new EventEmitter<string>();
  subreddits: Subreddit[];
  page = 0;
  perPage = 10;

  constructor(private api: RedditAPIService) {}

  ngOnInit(): void {
    this.api.getPopularSubreddits().pipe(take(1)).subscribe(reddits => this.subreddits = reddits);
  }

  onChoose(sub: string, el: HTMLElement) {
    el.classList.add('hide');
    this.choose.emit(sub);
  }

  numPages(): number {
    return this.subreddits ? Math.floor((this.subreddits.length-1)/this.perPage) : 0;
  }

  paginate(dir: string) {
    const p = this.page, l = this.numPages();
    this.page = ({
      'left': p > 0 ? p-1 : l,
      'right': p < l ? p+1 : 0
    } as {[key: string]: number})[dir] ?? 0
  }
}
