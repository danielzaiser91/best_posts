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
    this.api.getFiltered('cats', { exclude: ['text'] }).subscribe(v => {
      this.posts = v;
    })
  }




  ngOnInit(): void {}

}
