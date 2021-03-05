import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { RedditAPIService } from '../reddit-api.service';

const getSaved = (sub: string) => JSON.parse(sessionStorage.getItem(sub) || 'null');

@Component({
  selector: 'app-best-meme',
  templateUrl: './best-meme.component.html',
  styleUrls: ['./best-meme.component.sass']
})
export class BestMemeComponent implements OnInit {
  @ViewChild('el') el: ElementRef;
  posts: any;
  subExists = false;
  subreddits = ['memes','cats']
  sub = this.subreddits[0];
  currentSub = 'cats';
  constructor(private api: RedditAPIService) { }

  ngOnInit(): void {
    this.fetchSub('memes');
    this.fetchSub('cats', true);
  }
  isCurrentSub(sub: string): boolean {
    return this.currentSub === sub;
  }

  fetchSub(sub: string, base = false) {
    const
      saved = getSaved(sub),
      today = new Date().toDateString();
    if(saved?.lastFetch !== today) {
      const a = this.api.get(sub).subscribe(data => {
        a.unsubscribe();
        if(base) this.posts = data;
        sessionStorage.setItem(sub, JSON.stringify({data, lastFetch: today}));
        this.currentSub = sub;
      });
    } else {
      if(!!this.posts && this.isCurrentSub(sub)) return; // prevent load of already loaded data
      if(base) {
        console.log(saved.data);
        this.posts = saved.data;
        this.currentSub = sub;
      }
    }
  }

  onInput() {
    this.api.subExists(this.el.nativeElement.value).subscribe(
      _ => this.subExists = true,
      err => this.subExists = false
    );
  }

  getNextSubreddit() {
    let i = this.subreddits.indexOf(this.sub);
    i = (!!this.subreddits[i+1]) ? 0 : i+1;
    this.sub = this.subreddits[i];
    this.fetchSub(this.sub, true);
  }

  log(e: any) { if(e.target.classList.contains('optionsOverlay')) e.target.classList.add('toggle') }
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    document.querySelector('.fullscreen')?.classList.remove('fullscreen');
  }
}
