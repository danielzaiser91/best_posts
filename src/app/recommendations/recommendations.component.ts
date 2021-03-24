import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RedditAPIService, StorageService } from 'app/services';
import { RedditPost } from 'app/types';
import { first, take } from 'rxjs/operators';
import { Recommendation } from '../../../dist/bestOfReddit/assets/types/myTypes';


@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.sass']
})
export class RecommendationsComponent implements OnInit {
  @Output() recEv = new EventEmitter();
  recommendations: Recommendation[];
  popular: RedditPost[];

  constructor(private store: StorageService, private api: RedditAPIService) { }

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations() {
    this.api.get('popular', { exclude: ['text']}).pipe(take(1)).subscribe(v=>this.popular = v);
  }
}
