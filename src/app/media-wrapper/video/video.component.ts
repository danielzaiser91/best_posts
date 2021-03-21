import { Component, Input, OnInit } from '@angular/core';
import { RedditPost } from 'app/types';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.sass']
})
export class VideoComponent implements OnInit {
  @Input() post: RedditPost;

  constructor() { }

  ngOnInit(): void {
  }

}
