import { Component, Input, OnInit } from '@angular/core';
import { RedditPost } from 'app/types';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.sass']
})
export class IframeComponent implements OnInit {
  @Input() post: RedditPost;

  constructor() { }

  ngOnInit(): void {
  }

}
