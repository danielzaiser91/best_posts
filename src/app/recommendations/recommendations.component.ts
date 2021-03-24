import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RedditAPIService, StorageService } from 'app/services';
import { RedditPost, Subreddit } from 'app/types';
import { first, take } from 'rxjs/operators';


@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.sass']
})
export class RecommendationsComponent implements OnInit {
  @Output() recEv = new EventEmitter();
  popular = [] as RedditPost[];

  constructor(private store: StorageService, private api: RedditAPIService) { }

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations() {
    this.api.get('popular', { exclude: ['text']}).pipe(take(1)).subscribe(v=>this.popular = v);
  }
}
