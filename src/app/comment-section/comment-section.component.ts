import { Component, Input, OnInit } from '@angular/core';

import { RedditComment } from 'app/types';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.sass']
})
export class CommentSectionComponent implements OnInit {
  @Input() comments: RedditComment[];

  constructor() { }

  ngOnInit(): void {}
  onTouch(ev: TouchEvent) { ev.stopPropagation() }
  showComments(el: HTMLDivElement) {
    el.parentElement!.classList.toggle('show-children');
  }
}
