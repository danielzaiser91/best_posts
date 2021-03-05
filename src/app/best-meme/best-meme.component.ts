import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RedditAPIService } from '../reddit-api.service';

@Component({
  selector: 'app-best-meme',
  templateUrl: './best-meme.component.html',
  styleUrls: ['./best-meme.component.sass']
})
export class BestMemeComponent implements OnInit {
  @ViewChild('el') el: ElementRef;
  memes: any;
  posts: any;
  subs: {[key: string]: any} = {
    'memes': { title: 'Memes', data: '' },
    'cats': { title: 'Cats', data: '' }
  };
  sub = this.subs.memes.title;
  i = 0;
  subExists = false;
  subreddit = () => {
    console.log(Object.keys(this.subs), this.sub);
    this.posts = this.subs[this.sub.toLowerCase()].data;
  }
  subData = (data: any, sub: string) => {
    this.subs[sub] = this.subs[sub] || {};
    this.subs[sub].data = data;
    this.subs[sub].title = sub[0].toUpperCase() + sub.slice(1);
  }
  constructor(private api: RedditAPIService) { }

  ngOnInit(): void {
    const $cats = this.api.get('cats').subscribe(data => {this.posts = data; this.subData(data, 'cats'); $cats.unsubscribe()});
    const $memes = this.api.get('memes').subscribe(memes => {this.subData(memes, 'memes'); $memes.unsubscribe()});
  }

  onInput() {
    this.api.exists(this.el.nativeElement.value).subscribe(
      _ => this.subExists = true,
      err => this.subExists = false
    );
  }
  showOptions() {

  }
  log(e: any) { if(e.target.classList.contains('optionsOverlay')) e.target.classList.add('toggle') }
}
