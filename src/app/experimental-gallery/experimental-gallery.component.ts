import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { RedditAPIService } from 'app/services';
import { RedditPost } from 'app/types';
import { fromEvent } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';

@Component({
  selector: 'app-experimental-gallery',
  templateUrl: './experimental-gallery.component.html',
  styleUrls: ['./experimental-gallery.component.sass']
})
export class ExperimentalGalleryComponent implements OnInit {
  @Input() posts: RedditPost[] = [];

  constructor(private api: RedditAPIService) {
    this.noDiscussion()
  }

  // todo: move this to api
  arr: RedditPost[] = [];
  count = 0;
  noDiscussion(after = '') {
    console.log('called fn', this.count);
    this.api.get('cats', {}, after).pipe(take(1)).subscribe(v => {
      let found = false;
      const filtered = v.filter(x => {
        const yes = x.is === 'discussion';
        if (yes) found = true;
        return !yes
      });
      this.arr.push(...filtered);
      this.count++;
      console.log(v);
      if (found && this.count < 4) this.noDiscussion(v[v.length-1].uid);
      else { this.posts = this.arr }
    })
  }



  ngOnInit(): void {}

}
