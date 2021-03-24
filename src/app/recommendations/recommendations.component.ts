import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RedditAPIService, StorageService } from 'app/services';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.sass']
})
export class RecommendationsComponent implements OnInit {
  @Output() recEv = new EventEmitter();

  constructor(private store: StorageService, private api: RedditAPIService) { }

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations() {
    this.api.getFiltered('popular', ['text'])
  }
}
