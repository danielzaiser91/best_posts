import { Component, Input, OnInit } from '@angular/core';
import { RedditPost } from 'app/types';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.sass']
})
export class TextComponent implements OnInit {
  @Input() post: RedditPost;

  constructor() { }

  ngOnInit(): void {
  }

}
