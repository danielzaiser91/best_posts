import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RedditGallery, RedditPost } from 'app/types';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'media-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.sass']
})
export class ImageComponent implements OnInit {
  @Input() post: RedditPost;
  imgs: string[] = [];

  constructor() {}

  ngOnInit() {
    this.imgs = (this.post.src as string[]) instanceof Array ? (this.post.src as string[]) : [this.post.src as string];
  }
}
